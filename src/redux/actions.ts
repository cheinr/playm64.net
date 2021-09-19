import { Action, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import createMupen64PlusWeb from 'mupen64plus-web';

import stats from '../Stats';
import GameServerClient from "../service/GameServerClient";
import MatchmakerClient from "../service/MatchmakerClient";

import MatchmakerService, { GameRoomInfo } from '../service/MatchmakerClient';
import { RootState, UI_STATE } from "./reducers";


// TODO move somewhere common
type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;


export const SET_ALIAS = 'SET_ALIAS';
export const SET_ALIAS_INPUT = 'SET_ALIAS_INPUT';
export const SET_CONNECTED_GAMEPAD = 'SET_CONNECTED_GAMEPAD';
export const SET_CONNECTION_STATE_MESSAGE = 'SET_CONNECTION_STATE_MESSAGE';
export const SET_DISPLAY_WELCOME_MODAL = 'SET_DISPLAY_WELCOME_MODAL';
export const SET_EMULATOR_ERROR_MESSAGE = 'SET_EMULATOR_ERROR_MESSAGE';
export const SET_HOSTING_REGION = 'SET_HOSTING_REGION';
export const SET_SELECTED_ROM_DATA = 'SET_SELECTED_ROM_DATA';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_GAME_ROOM_ID = 'SET_GAME_ROOM_ID';
export const SET_JOIN_GAME_ROOM_INPUT = 'SET_JOIN_GAME_ROOM_INPUT';
export const SET_HOST_REGION_OPTIONS = 'SET_HOST_REGION_OPTIONS';
export const SET_ROOM_PLAYER_INFO = 'SET_ROOM_PLAYER_INFO';
export const SET_GAME_SERVER_CONNECTION = 'SET_GAME_SERVER_CONNECTION';
export const SET_PING = 'SET_PING';
export const START_GAME = 'START_GAME';
export const TOGGLE_HOST_NEW_GAME_MENU = 'TOGGLE_HOST_NEW_GAME_MENU';

export function setConnectedGamepad(maybeGamepad: any) {
  return { type: SET_CONNECTED_GAMEPAD, connectedGamepad: maybeGamepad };
}

export function setHostRegionOptions(regionOptions: any) {
  return { type: SET_HOST_REGION_OPTIONS, regionOptions };
}

export function setHostingRegion(region: string) {
  return { type: SET_HOSTING_REGION, region };
}

export function requestHostingRegionOptionsIfNotLoaded() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    if (!getState().hostRegionOptions) {
      matchmakerService.requestHostingRegionOptions();
    }
  }
}

export function setConnectionStateMessage(message: string, isError: boolean) {
  return {
    type: SET_CONNECTION_STATE_MESSAGE, connectionStateMessage: {
      message,
      isError
    }
  };
}

export function setEmulatorErrorMessage(message: string) {
  return { type: SET_EMULATOR_ERROR_MESSAGE, message };
}

export function setDisplayWelcomeModal(displayWelcomeModal: boolean) {
  return { type: SET_DISPLAY_WELCOME_MODAL, displayWelcomeModal };
}

export function setUiState(uiState: UI_STATE) {
  return { type: 'SET_UI_STATE', state: uiState };
}

export function setSelectedROMData(romData: ArrayBuffer) {
  return { type: 'SET_SELECTED_ROM_DATA', data: romData };
}

export function requestGameStart() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const gameServerConnection: GameServerClient = getState()
      .gameServerConnection;

    if (gameServerConnection) {
      gameServerConnection.requestGameStart();
    } else {
      console.error("requestGameStart called but no gameServerClient is present");
    }
  }
}

export function toggleHostNewGameMenu() {
  return { type: TOGGLE_HOST_NEW_GAME_MENU };
}

export function createGameRoom() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const state = getState();
    const romSimpleName = state.selectedRomShortName;
    const region = state.hostingRegion;

    console.log("Creating game room for region: '%s'", region);

    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    // creating game room
    matchmakerService.createGameRoom(romSimpleName, region).then((gameRoomInfo: GameRoomInfo) => {

      console.log("Created game room: %o", gameRoomInfo);

      //establishing connection

      setTimeout(() => {
        dispatch(joinGameRoom(gameRoomInfo.gameRoomId));
      }, 100);
    }).catch((exceptionMessage) => {
      dispatch(setUiState(UI_STATE.PENDING_MODE_SELECT));
      dispatch(setConnectionStateMessage(exceptionMessage, true));
    });
  };
}

export function joinGameRoom(gameRoomId: string) {
  return (dispatch: Dispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    dispatch(setGameRoomId(gameRoomId));
    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    const state = getState();
    const alias = state.alias;
    const romSimpleName = state.selectedRomShortName;

    //establishing connection
    matchmakerService.joinGame(alias, gameRoomId, romSimpleName).then((gameServerClient: GameServerClient) => {

      console.log("Finished joining game room: %o", gameServerClient);

      dispatch(setUiState(UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION));
      dispatch(setGameServerConnection(gameServerClient));

      gameServerClient.onDisconnect(() => {
        dispatch(setUiState(UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION));
        alert("Lost connection to the game room, you will not be able to rejoin."
          + " Please refresh the page to start a new session.");
      });

      gameServerClient.onRoomPlayerInfoUpdate((roomPlayerInfo: any) => {
        dispatch(setRoomPlayerInfo(roomPlayerInfo));
      });
    }).catch((err) => {

      dispatch(setUiState(UI_STATE.PENDING_MODE_SELECT));
    });
  };
}

export function setGameServerConnection(gameServerConnection: GameServerClient) {
  return { type: SET_GAME_SERVER_CONNECTION, gameServerConnection };
}

export function setRoomPlayerInfo(roomPlayerInfo: any) {
  return { type: SET_ROOM_PLAYER_INFO, roomPlayerInfo };
}

export function setGameRoomId(gameRoomId: string) {
  return { type: SET_GAME_ROOM_ID, gameRoomId };
}

export function setJoinGameRoomInput(joinGameRoomInput: string) {
  return { type: SET_JOIN_GAME_ROOM_INPUT, joinGameRoomInput };
}

export function setAlias(alias: string) {
  return { type: SET_ALIAS, alias };
}

export function setAliasInput(alias: string) {
  return { type: SET_ALIAS_INPUT, alias };
}

export function setPing(ping: number) {
  return { type: SET_PING, ping };
}

export function startLocalGame() {
  return (dispatch: Dispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    dispatch(setUiState(UI_STATE.PLAYING_LOCAL_SESSION));

    const state = getState();

    setTimeout(() => {
      createMupen64PlusWeb({
        canvas: document.getElementById('canvas'),
        romData: state.selectedRomData,
        romPath: '/roms/tmp_rom_path',
        beginStats: stats.begin,
        endStats: stats.end,
        coreConfig: {
          emuMode: 0
        },
        locateFile: (path: string, prefix: string) => {

          console.log("path: %o", path);
          console.log("env: %o", process.env.PUBLIC_URL);

          const publicURL = process.env.PUBLIC_URL;

          if (path.endsWith('.wasm') || path.endsWith('.data')) {
            return publicURL + "/dist/" + path;
          }

          return prefix + path;
        },
        setErrorStatus: (errorMessage: string) => {
          console.log("errorMessage: %s", errorMessage);
          dispatch(setEmulatorErrorMessage(errorMessage));
        }
      });
    });
  }
}
