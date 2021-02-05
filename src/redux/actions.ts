import { Action, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import MatchmakerClient from "../service/MatchmakerClient";

import MatchmakerService, { GameRoomInfo } from '../service/MatchmakerClient';
import { RootState, UI_STATE } from "./reducers";


// TODO move somewhere common
type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;


export const SET_SELECTED_ROM_DATA = 'SET_SELECTED_ROM_DATA';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_GAME_ROOM_ID = 'SET_GAME_ROOM_ID';
export const SET_JOIN_GAME_ROOM_INPUT = 'SET_JOIN_GAME_ROOM_INPUT';

export function setUiState(uiState: UI_STATE) {
  return { type: 'SET_UI_STATE', state: uiState };
}

export function setSelectedROMData(romData: ArrayBuffer) {
  return { type: 'SET_SELECTED_ROM_DATA', data: romData };
}

export function createGameRoom() {
  return (dispatch: MyThunkDispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    const state = getState();
    const romSimpleName = state.romShortName;
    const region = "us-foo-2";

    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    // creating game room
    matchmakerService.createGameRoom(romSimpleName, region).then((gameRoomInfo: GameRoomInfo) => {

      console.log("Created game room: %o", gameRoomInfo);

      //establishing connection

      setTimeout(() => {
        dispatch(joinGameRoom(gameRoomInfo.gameRoomId));
      }, 100);
    });
  };
}

export function joinGameRoom(gameRoomId: string) {
  return (dispatch: Dispatch, getState: () => RootState, { matchmakerService }: { matchmakerService: MatchmakerService }) => {

    dispatch(setGameRoomId(gameRoomId));
    dispatch(setUiState(UI_STATE.PENDING_GAME_JOIN));

    //establishing connection
    matchmakerService.joinGame("some-dumb-alias", gameRoomId).then((gameServerClient) => {

      console.log("Finished joining game room: %o", gameServerClient);

      dispatch(setUiState(UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION));
      //dispatch(setGameRoomClient(gameServerClient));
    });
  };
}

export function setGameRoomId(gameRoomId: string) {
  return { type: SET_GAME_ROOM_ID, gameRoomId };
}

export function setJoinGameRoomInput(joinGameRoomInput: string) {
  return { type: SET_JOIN_GAME_ROOM_INPUT, joinGameRoomInput };
}
