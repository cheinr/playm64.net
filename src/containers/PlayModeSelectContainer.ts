import { ChangeEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import PlayModeSelectComponent from '../components/PlayModeSelectComponent';
import { RootState } from '../redux/reducers';
import { createGameRoom, joinGameRoom, setJoinGameRoomInput } from '../redux/actions';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  romShortName: state.selectedRomShortName,
  uiState: state.uiState,
  joinGameRoomInput: state.joinGameRoomInput
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  createGameRoom: () => {
    dispatch(createGameRoom());
  },
  joinGame: (gameRoomId: string) => {
    dispatch(joinGameRoom(gameRoomId));
  },
  onJoinGameRoomInputChange: (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setJoinGameRoomInput(event.target.value));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type PlayModeSelectProps = ConnectedProps<typeof connector>;
export default connector(PlayModeSelectComponent);