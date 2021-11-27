import {
  setConnectionStateMessage, setHostRegionOptions
} from '../redux/actions';

import { Store } from 'redux';
import GameServerClient from './GameServerClient';


export interface GameRoomInfo {
  gameRoomId: string;
}

interface GameRoomParameters {
  romSimpleName: string,
  serverRegion: string
}


/*
 * Class to work with matchmaking service to negotiate connections with 
 * game-servers. Can only be used to connect to one game server at a time
 */
class MatchmakerClient {

  connectionPromise: Promise<void> | null = null;
  connectionRetryDelayMillis = 1000;
  socketEndpoint: string;
  socket: WebSocket | null = null;
  token: string | undefined;

  gameListListeners: Function[] = [];
  gameConnectionListeners: Function[] = [];
  gameConnectRejectionListeners: Function[] = [];
  gameDisconnectListener: Function | undefined;

  private onGameRoomCreateResponse: Function | null = null;
  private onUnexpectedExceptionMessage: Function | null = null;
  private onGetGameRoomParametersResponse: Function | null = null;

  // TODO - types
  private rtcConnection?: RTCPeerConnection;
  private rtcRoomControlChannel?: RTCDataChannel;
  private rtcReliableChannel?: RTCDataChannel;
  private rtcUnreliableChannel?: RTCDataChannel;

  private uiStore?: Store;

  activeGameServerClient?: GameServerClient;
  requestCount = 0;

  private remoteDescriptionSet = false;
  private pendingIceCandidates: RTCIceCandidate[] = [];

  private iceCandidatesPendingSend: { gameId: string, candidate: RTCIceCandidate }[] = [];
  private wrtcAnswerReceived = false;

  constructor(matchmakingServiceEndpoint: string) {

    // TODO - local connection
    //this.socketEndpoint = "wss://yqet5adtzg.execute-api.us-west-2.amazonaws.com/dev";
    this.socketEndpoint = matchmakingServiceEndpoint;
  }

  public setUiStore(uiStore: Store): void {
    this.uiStore = uiStore;
  }

  addGameConnectionListener(cb: Function) {
    this.gameConnectionListeners.push(cb);
  }

  setGameDisconnectListener(cb: Function) {
    this.gameDisconnectListener = cb;
  }

  _shouldBeConnected() {
    return this.activeGameServerClient === null;
  }

  async _connectAsync() {
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        this.socket = new WebSocket(this.socketEndpoint);

        this.socket.addEventListener('open', () => {
          if (!this.socket) return;

          this.connectionRetryDelayMillis = 1000;

          this.requestCount++;
          console.log('Matchmaker RequestCount increased: ', this.requestCount);

          this.socket.send(JSON.stringify({
            action: 'sendmessage',
            data: {
              type: 'identify-self',
              payload: {
                identity: 'PLAYER',
                //TODO - Support sending token
              },
            }
          }));
        });


        this.socket.onclose = () => {
          if (this._shouldBeConnected()) {
            console.log('Connection to matchmaker closed unexpectedly. Retrying in %s milliseconds', this.connectionRetryDelayMillis);
            setTimeout(() => {
              this.connectionPromise = null;
              this._connectAsync()
                .then(() => resolve())
                .catch((err) => reject(err));
            }, this.connectionRetryDelayMillis);

            this.connectionRetryDelayMillis *= 2;
          }
        };

        this.socket.onerror = (error) => {
          console.error(error);
          if (!this.socket) return;
          this.socket.close();
        };

        this.socket.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.type === 'identity-confirm') {
            this.token = message.payload.token;
            resolve();
            return;
          }

          this._handleMessage(message);
        };
      });
    }

    return this.connectionPromise;
  }

  _handleMessage(message: any) {

    this.requestCount++;
    console.log('Matchmaker RequestCount increased: ', this.requestCount);

    switch (message.type) {

      case 'hosting-region-options':
        this.uiStore?.dispatch(setHostRegionOptions(message.payload.hostingRegionOptions));
        break;

      case 'game-room-parameters':
        if (this.onGetGameRoomParametersResponse) {
          this.onGetGameRoomParametersResponse(message.payload.gameRoomParameters);
        }
        break;
      case 'room-create-response':

        const gameRoomInfo = {
          gameRoomId: message.payload.gameRoomId
        };

        if (this.onGameRoomCreateResponse) {
          this.onGameRoomCreateResponse(gameRoomInfo);
        } else {
          console.error('Received GameRoomCreateResponse we don\'t know how to handle!');
        }
        break;

      case 'game-join-request-rejected': {
        const reason = message.payload.reason;

        this.gameConnectRejectionListeners.forEach((cb) => {
          cb(reason);
        });

        if (this.rtcConnection) {
          this.rtcConnection.close();
        }

        delete this.rtcConnection;
        break;
      }

      case 'ice-candidate':
        console.log('Received ice candidate from server: %o', message.payload.candidate.candidate);
        const c = message.payload.candidate;
        const iceCandidate: RTCIceCandidateInit = {
          candidate: c.candidate,
          sdpMLineIndex: c.sdpMLineIndex,
          sdpMid: c.sdpMid,
          usernameFragment: c.usernameFragment
        };
        if (this.rtcConnection) {

          if (!this.remoteDescriptionSet) {
            this.pendingIceCandidates.push(new RTCIceCandidate(iceCandidate));
            return;
          }

          this.rtcConnection.addIceCandidate(
            new RTCIceCandidate(iceCandidate)
          ).then(() => {
            console.log('ice candidate successfully added');
          }).catch(this._errorHandler('AddIceCandidate'));
        }
        break;

      case 'wrtc-answer':

        console.log('wrtc-answer');
        if (this.rtcConnection) {
          this.wrtcAnswerReceived = true;
          this.drainIceCandidatesToSend();

          this.rtcConnection.setRemoteDescription(message.payload.sdpAnswer)
            .then(() => {

              this.remoteDescriptionSet = true;

              this.pendingIceCandidates.forEach((iceCandidate) => {
                if (!this.rtcConnection) {
                  return;
                }

                this.rtcConnection.addIceCandidate(
                  iceCandidate
                ).then(() => {
                  console.log('ice candidate successfully added');
                }).catch(this._errorHandler('AddIceCandidate'));

              });
            }).catch((err) => {
              console.error('Exception while setting remote description: %o', err);
            });
        }
        break;

      case 'unexpected-exception':
        console.log('Received unexpected exception message: %o', message);

        if (this.onUnexpectedExceptionMessage)
          this.onUnexpectedExceptionMessage(message.payload.exceptionMessage);

        break;
      default:
        console.log(`Unidentified message: ${JSON.stringify(message)}`);
        break;
    }
  }

  private drainIceCandidatesToSend(): void {

    const candidatesByGameId: Map<string, RTCIceCandidate[]> = new Map();

    this.iceCandidatesPendingSend.forEach((candidatePair) => {
      if (!(candidatesByGameId.has(candidatePair.gameId))) {
        candidatesByGameId.set(candidatePair.gameId, []);
      }

      candidatesByGameId.get(candidatePair.gameId)!.push(
        candidatePair.candidate);
    });

    candidatesByGameId.forEach((candidates, gameId) => {
      this.requestCount++;
      console.log('Matchmaker RequestCount increased: ', this.requestCount);

      if (!this.socket) {
        throw new Error('No socket for sending wrtc-ice-candidates is available!');
      }

      this.socket.send(JSON.stringify({
        action: 'sendmessage',
        data: {
          type: 'wrtc-ice-candidates',
          payload: {
            token: this.token,
            gameId: gameId,
            candidates: candidates,
          },
        }
      }));
    });

    this.iceCandidatesPendingSend = [];
  }

  _errorHandler(context: unknown) {
    return (message: unknown) => {
      console.log(`${context}: ${message}`);
    };
  }

  async createGameRoom(romSimpleName: string,
    serverRegion: string): Promise<GameRoomInfo> {

    this.uiStore?.dispatch(setConnectionStateMessage('Creating a new Game Room', false));

    return new Promise<GameRoomInfo>((resolve, reject) => {
      this._connectAsync().then(() => {
        if (this.socket === null) {
          throw new Error('createGame: this.websocket must be created');
        }

        this.socket.send(JSON.stringify({
          action: 'sendmessage',
          data: {
            type: 'create-game-room',
            payload: {
              romSimpleName,
              serverRegion
            }
          }
        }));

        const createTimeout = setTimeout(() => {
          this.onUnexpectedExceptionMessage = null;
          this.uiStore?.dispatch(setConnectionStateMessage(
            'Timed out waiting for a new game room to be created. Please refresh the page and try again', true));
          reject('Timed out waiting for game server creation');
        }, 90000);

        this.onGameRoomCreateResponse = (gameRoomInfo: GameRoomInfo) => {
          this.onUnexpectedExceptionMessage = null;
          clearTimeout(createTimeout);

          this.uiStore?.dispatch(setConnectionStateMessage(`Created game room '${gameRoomInfo.gameRoomId}'`, false));
          resolve(gameRoomInfo);
        };

        this.onUnexpectedExceptionMessage = (exceptionMessage: string) => {
          clearTimeout(createTimeout);
          reject(`Unexpected exception while creating game room: ${exceptionMessage} `);
        };

      }).catch((err) => {
        reject(err);
      });
    });

  }

  async getGameRoomParameters(gameRoomId: string): Promise<GameRoomParameters> {
    return new Promise<GameRoomParameters>((resolve, reject) => {
      this._connectAsync().then(() => {
        if (this.socket === null) {
          throw new Error('createGame: this.websocket must be created');
        }

        this.socket.send(JSON.stringify({
          action: 'sendmessage',
          data: {
            type: 'request-game-room-parameters',
            payload: {
              gameRoomId
            }
          }
        }));

        const createTimeout = setTimeout(() => {
          this.onUnexpectedExceptionMessage = null;
          this.uiStore?.dispatch(setConnectionStateMessage(
            'Timed out while fetching game room info. Please try again', true));
          reject('Timed out fetching game room info');
        }, 90000);

        this.onGetGameRoomParametersResponse = (gameRoomParameters: GameRoomParameters) => {
          this.onUnexpectedExceptionMessage = null;
          clearTimeout(createTimeout);

          this.uiStore?.dispatch(setConnectionStateMessage(`Fetched game room info for ${gameRoomId}`, false));
          resolve(gameRoomParameters);
        };

        this.onUnexpectedExceptionMessage = (exceptionMessage: string) => {
          clearTimeout(createTimeout);
          reject(`Unexpected exception while fetching creating game room: ${exceptionMessage}`);
        };

      }).catch((err) => {
        reject(err);
      });
    });
  }

  async joinGame(alias: string, gameId: string, romSimpleName: string): Promise<GameServerClient> {

    if (this.rtcConnection) {
      throw new Error('Attempted to join multiple games at once');
    }

    this.uiStore?.dispatch(setConnectionStateMessage(`Attempting to join game room '${gameId}'`, false));


    const gameJoinConnectionPromise = new Promise<GameServerClient>((resolve, reject) => {

      this.onUnexpectedExceptionMessage = (exceptionMessage: string) => {
        this.uiStore?.dispatch(setConnectionStateMessage('Unexpected exception while creating game room. Please try again',
          true));

        reject(`Unexpected exception while creating game room: ${exceptionMessage} `);
      };

      const onConnect = (gameServerClient: GameServerClient) => {
        this.uiStore?.dispatch(setConnectionStateMessage(
          `Successfully joined game room ${gameId} `, false));

        this.onUnexpectedExceptionMessage = null;
        resolve(gameServerClient);
      };

      const onError = (err: any) => {
        this.uiStore?.dispatch(setConnectionStateMessage(
          `Failed to join game: ${gameId}. ${err} `, true));
        this.onUnexpectedExceptionMessage = null;
        reject();
      };

      this.gameConnectionListeners.push(onConnect);
      this.gameConnectRejectionListeners.push(onError);
    });

    this._connectAsync().then(() => {

      if (this.socket === undefined) {
        throw new Error('StartRTCConnection: this.websocket must be created');
      }

      const iceServers: RTCIceServer[] = [{ urls: ['stun:stun.l.google.com:19302'] }];
      const serverRTCConnection = new RTCPeerConnection({
        iceServers
      });

      const serverReliableChannel = serverRTCConnection.createDataChannel('reliable');
      serverReliableChannel.binaryType = 'arraybuffer';

      this.rtcReliableChannel = serverReliableChannel;

      serverRTCConnection.ondatachannel = (event) => {

        const channel = event.channel;

        if (channel.label === 'room-control') {

          console.log('room control channel assigned!');
          this.rtcRoomControlChannel = channel;

        } else if (channel.label === 'unreliable') {

          console.log('unreliable data channel assigned!');
          this.rtcUnreliableChannel = channel;
          this.rtcUnreliableChannel.binaryType = 'arraybuffer';

        } else {
          console.error('Invalid channel created: %s', channel.label);
        }

        if (this.rtcReliableChannel
          && this.rtcUnreliableChannel
          && this.rtcRoomControlChannel) {

          console.log('Waiting for data channels to connect');
          this._waitForChannelsToBeReady().then(() => {
            console.log('Channels ready; connection is complete');
            this._onGameServerClientConnected(gameId);
          }).catch((err) => {
            console.error('Something went wrong while waiting for rtc channels to become ready: ', err);
          });
        }
      };

      serverRTCConnection.onicecandidate = (event) => {
        if (!this.socket) {
          throw new Error('Lost connection to matchmaking service');
        }

        if (event.candidate && event.candidate.candidate) {


          // We wait for this to ensure the server is ready for ice candidates
          if (this.wrtcAnswerReceived) {
            this.requestCount++;
            console.log('Matchmaker RequestCount increased: ', this.requestCount);

            this.socket.send(JSON.stringify({
              action: 'sendmessage',
              data: {
                type: 'wrtc-ice-candidates',
                payload: {
                  token: this.token,
                  gameId,
                  candidates: [event.candidate],
                },
              }
            }));

          } else {

            this.iceCandidatesPendingSend.push({
              gameId,
              candidate: event.candidate
            });
          }
        }
      };

      console.log('creating local description');
      serverRTCConnection.createOffer((desc) => {
        serverRTCConnection.setLocalDescription(desc).catch((err) => {
          console.error('Exception while setting localDescription for serverRTCConnection: %o', err);
        });

        this._sendJoinRequest(gameId, alias, romSimpleName, desc);
      }, this._errorHandler('PeerConnection.CreateOffer')).catch((err) => {
        console.error('Exception while creating offer for serverRTCConnection: %o', err);
      });

      serverRTCConnection.oniceconnectionstatechange = () => {
        console.log('connection state has changed %s', serverRTCConnection.iceConnectionState);
        switch (serverRTCConnection.iceConnectionState) {
          case 'connected':
            break;
          case 'disconnected':
          case 'failed':

            this.uiStore?.dispatch(setConnectionStateMessage(
              `Failed to connect to game room ${gameId}.Please refresh the page and try again`, true));

            // One or more transports has terminated unexpectedly or in an error
            console.log('We\'ve been disconnected from the game server');
            serverRTCConnection.close();
            break;
          case 'closed':
            // The connection has been closed
            this._onGameServerClientDisconnect();
            break;
        }
      };
      this.rtcConnection = serverRTCConnection;
    }).catch((err) => {
      this._errorHandler(err);
    });

    return gameJoinConnectionPromise;
  }

  private allChannelsAreConnected(): boolean {
    if (!this.rtcReliableChannel
      || !this.rtcUnreliableChannel
      || !this.rtcRoomControlChannel) {

      throw new Error('invalid state: expected all channels to at least be present');
    }

    return this.rtcReliableChannel.readyState === 'open'
      && this.rtcUnreliableChannel.readyState === 'open'
      && this.rtcRoomControlChannel.readyState === 'open';
  }

  private async _waitForChannelsToBeReady(): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      if (!this.rtcReliableChannel
        || !this.rtcUnreliableChannel
        || !this.rtcRoomControlChannel) {

        throw new Error('invalid state: expected all channels to at least be present');
      }


      if (this.rtcReliableChannel.readyState === 'closed'
        || this.rtcUnreliableChannel.readyState === 'closed'
        || this.rtcRoomControlChannel.readyState === 'closed') {

        reject('Failed while waiting for data channels to open, as at least on of them is closed');
      }

      if (this.rtcReliableChannel.readyState === 'open'
        && this.rtcUnreliableChannel.readyState === 'open'
        && this.rtcRoomControlChannel.readyState === 'open') {

        resolve();
      }

      const onChannelOpen = () => {
        if (this.allChannelsAreConnected()) {
          resolve();
        }
      };

      this.rtcReliableChannel.onopen = onChannelOpen;
      this.rtcUnreliableChannel.onopen = onChannelOpen;
      this.rtcRoomControlChannel.onopen = onChannelOpen;

      const onChannelClose = () => {
        reject('A channel closed while we were waiting for them to become ready');
      };

      this.rtcReliableChannel.onclose = onChannelClose;
      this.rtcUnreliableChannel.onclose = onChannelClose;
      this.rtcRoomControlChannel.onclose = onChannelClose;

    });
  }

  _onGameServerClientConnected(gameRoomId: string) {

    const rtcRoomControlChannel = this.rtcRoomControlChannel;
    const rtcReliableChannel = this.rtcReliableChannel;
    const rtcUnreliableChannel = this.rtcUnreliableChannel;

    if (!rtcReliableChannel || rtcReliableChannel.readyState !== 'open'
      || !rtcUnreliableChannel || rtcUnreliableChannel.readyState !== 'open') {
      throw new Error('FATAL: _onGameServerClientConnected called before data channels are ready');
    }

    if (!this.uiStore) {
      throw new Error('FATAL: uiStore should be set before any connection are being made');
    }

    const gameServerClient = new GameServerClient(gameRoomId,
      rtcRoomControlChannel,
      rtcReliableChannel,
      rtcUnreliableChannel,
      this.uiStore);

    this.gameConnectionListeners.forEach((cb) => cb(gameServerClient));


    this.activeGameServerClient = gameServerClient;
  }

  _onGameServerClientDisconnect() {
    // this.rtcConnection.close();

    delete this.rtcConnection;
    delete this.activeGameServerClient;

    alert('Disconnected From Game Server...');

    if (this.gameDisconnectListener) {
      this.gameDisconnectListener();
    }
  }

  _sendJoinRequest(gameId: string, alias: string, romSimpleName: string, desc: any) {
    if (!this.socket) {
      throw new Error('Tried to join game before we were connected to the matchmaker');
    }

    this.requestCount++;
    console.log('Matchmaker RequestCount increased: ', this.requestCount);

    this.socket.send(JSON.stringify({
      action: 'sendmessage',
      data: {
        type: 'join-game',
        payload: {
          sdp_offer: desc,
          game_id: gameId,
          romSimpleName,
          playerInfo: {
            name: alias,
            token: this.token,
          },
        },
      }
    }));
  }

  public requestHostingRegionOptions(): void {
    this._connectAsync().then(() => {
      this.socket?.send(JSON.stringify({
        action: 'sendmessage',
        data: {
          type: 'request-hosting-region-options'
        }
      }));
    }).catch((err) => {
      console.log('Exception while requesting hosting region options: %o', err);
    });
  }
}

export default MatchmakerClient;
