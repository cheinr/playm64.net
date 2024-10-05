import pako from 'pako';
import {
  setNetplayClientLag, setNetplayPauseCounts, setNetplayRegistrationId, setPing, setUiState
} from '../redux/actions';
import { UI_STATE } from '../redux/reducers';

export interface BinaryRTCDataChannel {

  send(data: ArrayBuffer): void;

  onclose: ((this: RTCDataChannel, ev: Event) => any) | null;
  onerror: ((this: RTCDataChannel, ev: RTCErrorEvent) => any) | null;
  onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null;
  onopen: ((this: RTCDataChannel, ev: Event) => any) | null;
}

class CompressedBinaryRTCChannelWrapper implements BinaryRTCDataChannel {

  private readonly delegate: RTCDataChannel;

  onclose: ((ev: Event) => any) | null = null;
  onerror: ((ev: Event) => any) | null = null;
  onmessage: ((ev: MessageEvent) => any) | null = null;
  onopen: ((ev: Event) => any) | null = null;

  constructor(rtcDataChannel: RTCDataChannel) {

    this.delegate = rtcDataChannel;

    this.delegate.onmessage = this._handleMessage.bind(this);

    this.delegate.onclose = (event: Event) => {
      if (this.onclose) this.onclose(event);
    };

    this.delegate.onerror = (event: Event) => {
      if (this.onerror) this.onerror(event);
    };

    this.delegate.onopen = (event: Event) => {
      if (this.onopen) this.onopen(event);
    };
  }


  private _handleMessage(event: MessageEvent): void {

    if (!(event.data instanceof ArrayBuffer)) {
      throw new Error('CompressedRTCDataChannel is only compatible with binary data');
    }

    const data: ArrayBuffer = event.data;

    if (this.onmessage && this.delegate !== null) {

      const inflated = pako.inflate(new Uint8Array(data)).buffer;

      const inflatedEvent = new MessageEvent(event.type, {
        data: inflated,
        lastEventId: event.lastEventId,
        origin: event.origin,
        //ports: event.ports,
        source: event.source
      });

      this.onmessage(inflatedEvent);
    }

  }

  send(data: ArrayBuffer): void {
    this.delegate.send(data);
  }
}

const NUMBER_OF_PINGS_PER_CHECK = 5;
const PING_CHECK_INTERVAL_MILLIS = 60000;

class GameServerClient {

  public gameRoomId: string;

  private readonly rtcRoomControlChannel: RTCDataChannel;
  private readonly uiStore: any; // TODO
  public rtcReliableChannel: BinaryRTCDataChannel;
  public rtcUnreliableChannel: BinaryRTCDataChannel;

  private gameStarted = false;
  private connectionClosed = false;

  private readonly roomPlayerInfoUpdateListeners: Function[] = [];
  private readonly gameRoomDisconnectListeners: Function[] = [];
  private readonly pingDataPoints: number[] = [];

  private checkPingInterval: any;

  constructor(gameRoomId: string, rtcRoomControlChannel: any, rtcReliableChannel: any, rtcUnreliableChannel: any, uiStore: any) {
    this.gameRoomId = gameRoomId;

    this.rtcRoomControlChannel = rtcRoomControlChannel;
    this.rtcReliableChannel = new CompressedBinaryRTCChannelWrapper(rtcReliableChannel);
    this.rtcUnreliableChannel = new CompressedBinaryRTCChannelWrapper(rtcUnreliableChannel);

    this.uiStore = uiStore;

    this.rtcRoomControlChannel.onmessage = this.handleRoomControlMessage.bind(this);

    this.checkPing();
    this.checkPingInterval = setInterval(() => {
      this.checkPing();
    }, PING_CHECK_INTERVAL_MILLIS);

    //TODO - should this be handled by the matchmaker client?
    this.rtcReliableChannel.onclose = () => {
      console.log('Reliable channel closed');
      if (!this.connectionClosed) {
        this.connectionClosed = true;
        this.gameRoomDisconnectListeners.forEach((cb) => cb());
      }
    };

    this.rtcUnreliableChannel.onclose = () => {
      console.log('Unreliable channel closed');
      if (!this.connectionClosed) {
        this.connectionClosed = true;

        this.gameRoomDisconnectListeners.forEach((cb) => cb());
      }
    };

    this.rtcRoomControlChannel.onclose = () => {
      clearInterval(this.checkPingInterval);
    };

    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'init'
    }));
  }

  public onRoomPlayerInfoUpdate(cb: Function): void {
    this.roomPlayerInfoUpdateListeners.push(cb);
  }

  public onDisconnect(cb: Function): void {
    this.gameRoomDisconnectListeners.push(cb);
  }

  public requestGameStart(): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'request-game-start'
    }));
  }

  public requestGamePause(): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'request-game-pause'
    }));
  }

  public requestGameResume(): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'request-game-resume'
    }));
  }

  public requestClientControllerReassign(clientId: number, controllerNumber: number): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'reassign-client-controller',
      payload: {
        clientId,
        desiredControllerIndex: controllerNumber
      }
    }));
  }

  public confirmGamePaused(pauseCounts: number[]): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'confirm-game-paused',
      payload: {
        pauseCounts
      }
    }));
  }

  public setIsGamepadConnected(isGamepadConnected: boolean) {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'set-is-local-gamepad-connected',
      payload: {
        isGamepadConnected
      }
    }));
  }

  private checkPing(): void {
    for (let i = 0; i < NUMBER_OF_PINGS_PER_CHECK; i++) {
      setTimeout(() => this.sendPing(), i * 1000);
    }
  }

  private sendPing(): void {
    try {
      this.rtcRoomControlChannel.send(JSON.stringify({
        type: 'ping',
        payload: {
          sendTime: Date.now()
        }
      }));
    } catch (err) {
      console.error(err);
    }
  }

  private handlePong(pingSendTime: number): void {
    const ping = Date.now() - pingSendTime;
    this.pingDataPoints.push(ping);

    while (this.pingDataPoints.length > NUMBER_OF_PINGS_PER_CHECK) {
      this.pingDataPoints.splice(0, 1);
    }

    const pingSum = this.pingDataPoints.reduce((previousValue: number, currentValue: number) => {
      return previousValue + currentValue;
    });

    const pingAverage = Math.round(pingSum / this.pingDataPoints.length);

    this.uiStore.dispatch(setPing(pingAverage));
  }

  private handleRoomControlMessage(event: any): void {

    console.log('Received Room Control message: %o', event);

    const message = JSON.parse(event.data);

    switch (message.type) {

      case 'pong':
        this.handlePong(message.payload.t);
        break;

      case 'room-player-info':

        const roomPlayerInfo = message.payload;

        this.roomPlayerInfoUpdateListeners.forEach((listener) => {
          listener(roomPlayerInfo);
        });

        break;

      case 'client-lag': {
        const clientId = message.payload.clientId;
        const lag = message.payload.lag;
        this.uiStore.dispatch(setNetplayClientLag(clientId, lag));
        break;
      }

      case 'start-game':

        if (this.gameStarted) {
          return;
        }

        const registrationId = message.payload.registrationId;

        const uiState = this.uiStore.getState();
        console.log('Starting game: %o', uiState.roomPlayerInfo);
        this.uiStore.dispatch(setNetplayRegistrationId(registrationId));

        this.gameStarted = true;
        this.uiStore.dispatch(setUiState(UI_STATE.PLAYING_IN_NETPLAY_SESSION));

        break;

      case 'pause-game':
        const pauseTarget = message.payload.pauseTargetCounts;
        this.uiStore.dispatch(setNetplayPauseCounts(pauseTarget));
        break;

      case 'resume-game':
        this.uiStore.dispatch(setNetplayPauseCounts(null));
        this.uiStore.dispatch(setUiState(UI_STATE.PLAYING_IN_NETPLAY_SESSION));
        break;


      default:
        console.error('Unrecognized room control message: %o', message);
        break;

    }
  }
}

export default GameServerClient;
