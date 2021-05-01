import {
  SET_ALIAS,
  SET_ALIAS_INPUT,
  SET_SELECTED_ROM_DATA,
  SET_UI_STATE,
  SET_GAME_ROOM_ID,
  SET_JOIN_GAME_ROOM_INPUT,
  SET_ROOM_PLAYER_INFO,
  SET_GAME_SERVER_CONNECTION,
  SET_PING,
  SET_CONNECTION_STATE_MESSAGE
} from './actions';

import { getRomShortName } from '../romUtils';

export enum UI_STATE {
  PENDING_ROM_LOAD = 0,
  PENDING_MODE_SELECT = 1,
  PENDING_GAME_JOIN = 2,
  PLAYING_LOCAL_SESSION = 3,
  PENDING_GAME_START_IN_NETPLAY_SESSION = 4,
  PLAYING_IN_NETPLAY_SESSION = 5
}

const initialState = {
  alias: '',
  aliasInput: '',
  uiState: UI_STATE.PENDING_ROM_LOAD,
  selectedRomData: null,
  selectedRomShortName: null,
  joinGameRoomInput: '',
  gameRoomId: null,
  roomPlayerInfo: null,
  gameServerConnection: null,
  ping: 0,
  connectionStateMessage: {
    message: '',
    isError: false
  }
};


export default function appReducer(state: any, action: any) {
  if (state === undefined) return initialState;

  switch (action.type) {
    case SET_SELECTED_ROM_DATA:

      return Object.assign({}, state, {
        uiState: UI_STATE.PENDING_MODE_SELECT,
        selectedRomData: action.data,
        selectedRomShortName: getRomShortName(action.data)
      });

    case SET_CONNECTION_STATE_MESSAGE:
      return Object.assign({}, state, {
        connectionStateMessage: action.connectionStateMessage
      });

    case SET_UI_STATE:
      return Object.assign({}, state, {
        uiState: action.state
      });

    case SET_GAME_ROOM_ID:
      return Object.assign({}, state, {
        gameRoomId: action.gameRoomId
      });

    case SET_JOIN_GAME_ROOM_INPUT:
      return Object.assign({}, state, {
        joinGameRoomInput: action.joinGameRoomInput
      });

    case SET_ROOM_PLAYER_INFO:
      return Object.assign({}, state, {
        roomPlayerInfo: action.roomPlayerInfo
      });

    case SET_ALIAS:
      return Object.assign({}, state, {
        alias: action.alias
      });

    case SET_ALIAS_INPUT:
      return Object.assign({}, state, {
        aliasInput: action.alias
      });


    case SET_GAME_SERVER_CONNECTION:
      return Object.assign({}, state, {
        gameServerConnection: action.gameServerConnection
      });

    case SET_PING:
      return Object.assign({}, state, {
        ping: action.ping
      });
  }

  return initialState;
}


export type RootState = ReturnType<typeof appReducer>;
