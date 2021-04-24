import { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import PlayModeSelectComponent from '../components/PlayModeSelectComponent';
import { RootState } from '../redux/reducers';
import {
  setAlias, createGameRoom, joinGameRoom, setJoinGameRoomInput,
  startLocalGame
} from '../redux/actions';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  alias: state.alias,
  romShortName: state.selectedRomShortName,
  uiState: state.uiState,
  joinGameRoomInput: state.joinGameRoomInput,
  connectionStateMessage: state.connectionStateMessage
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  createGameRoom: () => {
    dispatch(createGameRoom());
  },
  joinGame: (gameRoomId: string) => {
    dispatch(joinGameRoom(gameRoomId));
  },
  onJoinGameRoomInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    const joinCode = event.target.value.replace(/[^a-zA-Z]/, "").toUpperCase();

    dispatch(setJoinGameRoomInput(joinCode));
  },
  onAliasInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAlias(event.target.value));
  },
  startLocalGame: () => {
    dispatch(startLocalGame());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayModeSelectProps = ConnectedProps<typeof connector>;
export default connector(PlayModeSelectComponent);
