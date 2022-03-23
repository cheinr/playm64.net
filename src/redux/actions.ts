import { Action, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import createMupen64PlusWeb from 'mupen64plus-web';

import stats from '../Stats';
import GameServerClient from '../service/GameServerClient';
import MatchmakerClient from '../service/MatchmakerClient';

import MatchmakerService, { GameRoomInfo } from '../service/MatchmakerClient';
import { RootState, UI_STATE } from './reducers';

import { loadROMByShortName } from '../romUtils';

// TODO move somewhere common
type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;


export const SET_ALIAS = 'SET_ALIAS';
export const SET_ALIAS_INPUT = 'SET_ALIAS_INPUT';
export const SET_CONNECTED_GAMEPAD = 'SET_CONNECTED_GAMEPAD';
export const SET_CONNECTION_STATE_MESSAGE = 'SET_CONNECTION_STATE_MESSAGE';
export const SET_DISPLAY_WELCOME_MODAL = 'SET_DISPLAY_WELCOME_MODAL';
export const SET_EMULATOR_ERROR_MESSAGE = 'SET_EMULATOR_ERROR_MESSAGE';
export const SET_EMULATOR_CONFIG_OVERRIDES = 'SET_EMULATOR_CONFIG_OVERRIDES';
export const SET_HOSTING_REGION = 'SET_HOSTING_REGION';
export const SET_IS_AUTO_SELECT_ROM_ENABLED = 'SET_IS_AUTO_SELECT_ROM_ENABLED';
export const SET_SELECTED_ROM_DATA = 'SET_SELECTED_ROM_DATA';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_GAME_ROOM_ID = 'SET_GAME_ROOM_ID';
export const SET_JOIN_GAME_ROOM_INPUT = 'SET_JOIN_GAME_ROOM_INPUT';
export const SET_HOST_REGION_OPTIONS = 'SET_HOST_REGION_OPTIONS';
export const SET_ROOM_PLAYER_INFO = 'SET_ROOM_PLAYER_INFO';
export const SET_GAME_SERVER_CONNECTION = 'SET_GAME_SERVER_CONNECTION';
export const SET_NETPLAY_REGISTRATION_ID = 'SET_NETPLAY_REGISTRATION_ID';
export const SET_NETPLAY_PAUSE_COUNTS = 'SET_NETPLAY_PAUSE_COUNTS';
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

export function setIsAutoSelectROMEnabled(isAutoSelectROMEnabled: boolean) {
  return { type: SET_IS_AUTO_SELECT_ROM_ENABLED, isAutoSelectROMEnabled };
}

export function requestHostingRegionOptionsIfNotLoaded() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    if (!getState().hostRegionOptions) {
      matchmakerService.requestHostingRegionOptions();
    }
  };
}

export function setConnectionStateMessage(message: string, isError: boolean) {
  return {
    type: SET_CONNECTION_STATE_MESSAGE, connectionStateMessage: {
      message,
      isError
    }
  };
}

export function confirmNetplayGamePaused(actualPauseCounts: number[]) {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {
    const gameServerConnection = getState().gameServerConnection;

    if (gameServerConnection) {
      gameServerConnection.confirmGamePaused(actualPauseCounts);
      dispatch(setUiState(UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION));
    }
  };
}

export function netplayReset() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {
    matchmakerService.reset();

    dispatch(setConnectionStateMessage('', false));
    dispatch(setNetplayPauseCounts(null));
    dispatch(setNetplayRegistrationId(null));
  };
}

export function setNetplayPauseCounts(netplayPauseCounts: number[] | null) {
  return { type: SET_NETPLAY_PAUSE_COUNTS, netplayPauseCounts };
}

export function setNetplayRegistrationId(registrationId: number | null) {
  return { type: SET_NETPLAY_REGISTRATION_ID, registrationId };
}

export function setEmulatorErrorMessage(message: string) {
  return { type: SET_EMULATOR_ERROR_MESSAGE, message };
}

export function setEmulatorConfigOverrides(emulatorConfigOverrides: any): any {
  return { type: SET_EMULATOR_CONFIG_OVERRIDES, emulatorConfigOverrides };
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
      console.error('requestGameStart called but no gameServerClient is present');
    }
  };
}

export function requestGamePause() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const gameServerConnection: GameServerClient = getState()
      .gameServerConnection;

    if (gameServerConnection) {
      gameServerConnection.requestGamePause();
    } else {
      console.error('requestGamePause called but no gameServerClient is present');
    }
  };
}

export function requestGameResume() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const gameServerConnection: GameServerClient = getState()
      .gameServerConnection;

    if (gameServerConnection) {
      gameServerConnection.requestGameResume();
    } else {
      console.error('requestGameResume called but no gameServerClient is present');
    }
  };
}

export function requestClientControllerReassign(clientId: number, controllerId: number) {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const gameServerConnection: GameServerClient = getState()
      .gameServerConnection;

    if (gameServerConnection) {
      gameServerConnection.requestClientControllerReassign(clientId, controllerId);
    } else {
      console.error('requestClientControllerReassign called but no gameServerClient is present');
    }
  };
}

export function toggleHostNewGameMenu() {
  return { type: TOGGLE_HOST_NEW_GAME_MENU };
}

export function createGameRoom() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const state = getState();
    const romSimpleName = state.selectedRomShortName;
    const region = state.hostingRegion;

    console.log('Creating game room for region: \'%s\'', region);

    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    // creating game room
    matchmakerService.createGameRoom(romSimpleName, region).then((gameRoomInfo: GameRoomInfo) => {

      console.log('Created game room: %o', gameRoomInfo);

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

export function joinGameRoom(gameRoomId: string, autoSelectROMEnabled?: boolean) {
  return (dispatch: Dispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    dispatch(setGameRoomId(gameRoomId));
    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    const state = getState();
    const alias = state.alias;
    const romSimpleName = state.selectedRomShortName;


    // Base case is rom is already loaded and ready to go
    let prepareROM: Promise<string> = new Promise((resolve) => resolve(romSimpleName));

    if (autoSelectROMEnabled) {
      prepareROM = new Promise((resolve, reject) => {
        matchmakerService.getGameRoomParameters(gameRoomId).then(async (parameters) => {
          const romShortName = parameters.romSimpleName;

          return loadROMByShortName(romShortName).then((romData) => {

            if (!romData) {
              dispatch(setIsAutoSelectROMEnabled(false));
              reject(`Unable to find ROM in library with shortName "${romShortName}". Please try manually loading this ROM and try again.`);

            } else {
              dispatch(setSelectedROMData(romData));
              resolve(romShortName);
            }
          });
        }).catch((err) => {
          reject(err);
        });
      });

    }

    prepareROM.then(async (preparedROMName) => {
      //establishing connection
      return matchmakerService.joinGame(alias, gameRoomId, preparedROMName).then((gameServerClient: GameServerClient) => {

        console.log('Finished joining game room: %o', gameServerClient);

        dispatch(setUiState(UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION));
        dispatch(setGameServerConnection(gameServerClient));

        gameServerClient.onDisconnect(() => {
          const uiState = getState().uiState;

          if (uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION || uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION) {
            dispatch(setUiState(UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION));
            alert('Lost connection to the game room, you will not be able to rejoin.'
              + ' Please refresh the page to start a new session.');
          }
        });

        gameServerClient.onRoomPlayerInfoUpdate((roomPlayerInfo: any) => {
          dispatch(setRoomPlayerInfo(roomPlayerInfo));
        });
      });
    }).catch((err) => {
      console.error('Failed to join game: ', err);
      dispatch(setConnectionStateMessage(`Failed to join game: ${err}`, true));
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
