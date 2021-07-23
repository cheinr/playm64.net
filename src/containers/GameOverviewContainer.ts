import { setJoinGameRoomInput, requestGameStart } from '../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import GameRoomOverviewComponent from '../components/GameOverviewComponent';
import { RootState, UI_STATE } from '../redux/reducers';
import MatchmakerClient from '../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  gameRoomId: state.gameRoomId,
  joinGameRoomInput: state.joinGameRoomInput,
  romShortName: state.selectedRomShortName,
  gameRoomPlayerInfo: state.roomPlayerInfo,
  // TODO - Remove assumption player 0 is the host
  localPlayerIsHost: state.roomPlayerInfo?.clientPlayerId === 0,
  waitingForNetplayGameStart: state.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  setJoinGameRoomInput: (input: string) => {
    dispatch(setJoinGameRoomInput(input));
  },
  onStartGameClick: () => {
    dispatch(requestGameStart());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameRoomOverviewProps = ConnectedProps<typeof connector>;
export default connector(GameRoomOverviewComponent);
