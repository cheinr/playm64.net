import { setJoinGameRoomInput } from '../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import GameRoomOverviewComponent from '../components/GameRoomOverviewComponent';
import { RootState } from '../redux/reducers';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  gameRoomId: state.gameRoomId,
  joinGameRoomInput: state.joinGameRoomInput,
  romShortName: state.selectedRomShortName,
  gameRoomPlayerInfo: state.roomPlayerInfo
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  setJoinGameRoomInput: (input: string) => {
    dispatch(setJoinGameRoomInput(input));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameRoomOverviewProps = ConnectedProps<typeof connector>;
export default connector(GameRoomOverviewComponent);
