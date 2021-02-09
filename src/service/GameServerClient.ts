import { setUiState } from "../redux/actions";
import { UI_STATE } from "../redux/reducers";

import createMupen64PlusWeb from 'mupen64plus-web';
//import { Store } from "redux";

class GameServerClient {

  public gameRoomId: string;

  private readonly rtcRoomControlChannel: RTCDataChannel;
  private readonly uiStore: any; // TODO
  public rtcReliableChannel: RTCDataChannel;
  public rtcUnreliableChannel: RTCDataChannel;

  private gameStarted = false;

  private readonly roomPlayerInfoUpdateListeners: Function[] = [];

  constructor(gameRoomId: string, rtcRoomControlChannel: any, rtcReliableChannel: any, rtcUnreliableChannel: any, uiStore: any) {
    this.gameRoomId = gameRoomId;

    this.rtcRoomControlChannel = rtcRoomControlChannel;
    this.rtcReliableChannel = rtcReliableChannel;
    this.rtcUnreliableChannel = rtcUnreliableChannel;

    this.uiStore = uiStore;

    this.rtcRoomControlChannel.onmessage = this.handleRoomControlMessage.bind(this);

    //TODO - should this be handled by the matchmaker client?
    this.rtcReliableChannel.onclose = () => {
      console.log('Reliable channel closed');
      //if (onDisconnect) onDisconnect();
    };

    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'init'
    }));
  }

  public onRoomPlayerInfoUpdate(cb: Function): void {
    this.roomPlayerInfoUpdateListeners.push(cb);
  }

  public requestGameStart(): void {
    this.rtcRoomControlChannel.send(JSON.stringify({
      type: 'request-game-start'
    }));
  }

  private handleRoomControlMessage(event: any): void {

    console.log("Received Room Control message: %o", event);

    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'room-player-info':

        const roomPlayerInfo = message.payload;

        this.roomPlayerInfoUpdateListeners.forEach((listener) => {
          listener(roomPlayerInfo);
        });

        break;

      case 'start-game':

        if (this.gameStarted) {
          return;
        }

        this.gameStarted = true;

        this.uiStore.dispatch(setUiState(UI_STATE.PLAYING_IN_NETPLAY_SESSION));

        const uiState = this.uiStore.getState();



        createMupen64PlusWeb({
          canvas: document.getElementById('canvas'),
          romData: uiState.selectedRomData,
          romPath: '/roms/tmp_rom_path',
          coreConfig: {
            emuMode: 1
          },
          netplayConfig: {
            player: uiState.roomPlayerInfo.clientPlayerId + 1,
            reliableChannel: uiState.gameServerConnection.rtcReliableChannel,
            unreliableChannel: uiState.gameServerConnection.rtcUnreliableChannel
          },
          locateFile: (path: string, prefix: string) => {

            console.log("path: %o", path);
            console.log("env: %o", process.env.PUBLIC_URL);

            const publicURL = process.env.PUBLIC_URL;

            if (path.endsWith('.wasm') || path.endsWith('.data')) {
              return publicURL + "/dist/" + path;
            }

            return prefix + path;
          }
        });
        break;

      default:
        console.error("Unrecognized room control message: %o", message);
        break;

    }
  }
}

export default GameServerClient;
