import { requestGameStart } from '../../../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { UI_STATE } from '../../../redux/reducers';

import GameRoomPlayerInfoComponent from '../components/GameRoomPlayerInfoComponent';
import { RootState } from '../../../redux/reducers';
import MatchmakerClient from '../../../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => ({
  gameRoomPlayerInfo: state.roomPlayerInfo,
  uiState: state.uiState,
  localPlayerIsHost: state.roomPlayerInfo?.clientPlayerIndex === 0,
  ping: state.ping,
  gameIsPendingStart: state.uiState
    === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  onStartGameClick: () => {
    dispatch(requestGameStart());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameRoomPlayerInfoProps = ConnectedProps<typeof connector>;
export default connector(GameRoomPlayerInfoComponent);
