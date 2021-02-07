import GameServerClient from './GameServerClient';


export interface GameRoomInfo {
  gameRoomId: string;
}

/*
 * Class to work with matchmaking service to negotiate connections with 
 * game-servers. Can only be used to connect to one game server at a time
 */
class MatchmakerClient {


  connectionPromise: Promise<void> | null = null;
  connectionRetryDelayMillis: number = 1000;
  socketEndpoint: string;
  socket: WebSocket | null = null;
  token: String | undefined;

  gameListListeners: Function[] = [];
  gameConnectionListeners: Function[] = [];
  gameConnectRejectionListeners: Function[] = [];
  gameDisconnectListener: Function | undefined;

  private onGameRoomCreateResponse: Function | null = null;

  // TODO - types
  private rtcConnection?: RTCPeerConnection;
  private rtcRoomControlChannel?: RTCDataChannel;
  private rtcReliableChannel?: RTCDataChannel;
  private rtcUnreliableChannel?: RTCDataChannel;

  activeGameServerClient?: GameServerClient;
  requestCount: number = 0;

  constructor(matchmakingServiceEndpoint: string) {

    const location = window.location;

    // TODO - local connection
    //this.socketEndpoint = "wss://yqet5adtzg.execute-api.us-west-2.amazonaws.com/dev";
    this.socketEndpoint = matchmakingServiceEndpoint;
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
          console.log("Matchmaker RequestCount increased: ", this.requestCount);

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
              this._connectAsync().then(() => resolve());
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
          }

          this._handleMessage(message);
        };
      });
    }

    return this.connectionPromise;
  }

  _handleMessage(message: any) {

    this.requestCount++;
    console.log("Matchmaker RequestCount increased: ", this.requestCount);

    switch (message.type) {

      case 'room-create-response':

        const gameRoomInfo = {
          gameRoomId: message.payload.gameRoomId
        }

        if (this.onGameRoomCreateResponse) {
          this.onGameRoomCreateResponse(gameRoomInfo);
        } else {
          console.error("Received GameRoomCreateResponse we don't know how to handle!");
        }
        break;

      case 'game-join-request-rejected': {
        const gameRoomId = message.payload.gameRoomId;
        const reason = message.payload.reason;
        //console.log("Unable to join game-room [%s]: %s", gameRoomId, reason);

        this.gameConnectRejectionListeners.forEach((cb) => {
          cb(`Unable to join game-room [${gameRoomId}]: ${reason}`);
        });

        if (this.rtcConnection) {
          this.rtcConnection.close();
        }

        delete this.rtcConnection;
        break;
      }

      case 'ice-candidate':
        console.log('Received ice candidate from server: %o', message.payload);
        const c = message.payload.candidate;
        const iceCandidate: RTCIceCandidateInit = {
          candidate: c.candidate,
          sdpMLineIndex: c.sdpMLineIndex,
          sdpMid: c.sdpMid,
          usernameFragment: c.usernameFragment
        };
        if (this.rtcConnection) {
          this.rtcConnection.addIceCandidate(
            new RTCIceCandidate(iceCandidate)
          ).then(() => {
            console.log('ice candidate successfully added');
          }).catch(this._errorHandler('AddIceCandidate'));
        }
        break;

      case 'wrtc-answer':
        if (this.rtcConnection) {
          console.log('wrtc-answer');
          this.rtcConnection.setRemoteDescription(message.payload.sdpAnswer);
        }
        break;

      default:
        console.log(`Unidentified message: ${JSON.stringify(message)}`);
        break;
    }
  }

  _errorHandler(context: unknown) {
    return (message: unknown) => {
      console.log(`${context}: ${message}`);
    };
  }


  async createGameRoom(romSimpleName: string,
    serverRegion: string): Promise<GameRoomInfo> {

    return new Promise<GameRoomInfo>((resolve, reject) => {
      this._connectAsync().then(() => {
        if (this.socket === null) {
          throw 'createGame: this.websocket must be created';
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

        this.onGameRoomCreateResponse = resolve;

        setTimeout(() => {
          reject("Timed out waiting for game server creation");
        }, 90000);
      });
    });

  }

  async joinGame(alias: string, gameId: string): Promise<GameServerClient> {

    if (this.rtcConnection) {
      throw 'Attempted to join multiple games at once';
    }

    const gameJoinConnectionPromise = new Promise<GameServerClient>((resolve, reject) => {
      this.gameConnectionListeners.push(resolve);
      this.gameConnectRejectionListeners.push(reject);
    });

    this._connectAsync().then(() => {

      if (this.socket === undefined) {
        throw 'StartRTCConnection: this.websocket must be created';
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
          console.error("Invalid channel created: %s", channel.label);
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


      setTimeout(() => {
        console.log(serverRTCConnection);
        console.log(serverRTCConnection.connectionState);
      }, 4000);

      serverRTCConnection.onicecandidate = (event) => {
        if (!this.socket) {
          throw "Lost connection to matchmaking service";
        }

        console.log(event);
        if (event.candidate) {

          this.requestCount++;
          console.log("Matchmaker RequestCount increased: ", this.requestCount);

          this.socket.send(JSON.stringify({
            action: 'sendmessage',
            data: {
              type: 'wrtc-ice-candidate',
              payload: {
                token: this.token,
                game_id: gameId,
                candidate: event.candidate,
              },
            }
          }));
        }
      };

      console.log('creating local description');
      serverRTCConnection.createOffer((desc) => {
        serverRTCConnection.setLocalDescription(desc);

        this._sendJoinRequest(gameId, alias, desc);
      }, this._errorHandler('PeerConnection.CreateOffer'));

      serverRTCConnection.oniceconnectionstatechange = () => {
        console.log('connection state has changed %s', serverRTCConnection.iceConnectionState);
        switch (serverRTCConnection.iceConnectionState) {
          case 'connected':
            break;
          case 'disconnected':
          case 'failed':
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
    });

    return gameJoinConnectionPromise;
  }

  private allChannelsAreConnected(): boolean {
    if (!this.rtcReliableChannel
      || !this.rtcUnreliableChannel
      || !this.rtcRoomControlChannel) {

      throw "invalid state: expected all channels to at least be present";
    }

    return this.rtcReliableChannel.readyState === 'open'
      && this.rtcUnreliableChannel.readyState === 'open'
      && this.rtcRoomControlChannel.readyState === 'open';
  }

  private _waitForChannelsToBeReady(): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      if (!this.rtcReliableChannel
        || !this.rtcUnreliableChannel
        || !this.rtcRoomControlChannel) {

        throw "invalid state: expected all channels to at least be present";
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
      }

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
      throw 'FATAL: _onGameServerClientConnected called before data channels are ready';
    }

    const gameServerClient = new GameServerClient(gameRoomId,
      rtcRoomControlChannel,
      rtcReliableChannel,
      rtcUnreliableChannel);

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

  _sendJoinRequest(gameId: string, alias: string, desc: any) {
    if (!this.socket) {
      throw "Tried to join game before we were connected to the matchmaker";
    }

    this.requestCount++;
    console.log("Matchmaker RequestCount increased: ", this.requestCount);


    this.socket.send(JSON.stringify({
      action: 'sendmessage',
      data: {
        type: 'join-game',
        payload: {
          sdp_offer: desc,
          game_id: gameId,
          playerInfo: {
            name: alias,
            token: this.token,
          },
        },
      }
    }));
  }
}

export default MatchmakerClient;
