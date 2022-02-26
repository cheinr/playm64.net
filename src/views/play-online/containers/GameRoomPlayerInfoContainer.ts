import { requestGameStart, requestGamePause, requestGameResume } from '../../../redux/actions';
import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { UI_STATE } from '../../../redux/reducers';

import GameRoomPlayerInfoComponent from '../components/GameRoomPlayerInfoComponent';
import { RootState } from '../../../redux/reducers';
import MatchmakerClient from '../../../service/MatchmakerClient';


type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => {

  const localPlayerIsHost = state.roomPlayerInfo?.clientPlayerIndex === 0;
  const gameIsPaused = state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION;
  const gameIsPendingStart = state.uiState == UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION;

  return {
    gameRoomPlayerInfo: state.roomPlayerInfo,
    uiState: state.uiState,
    localPlayerIsHost: state.roomPlayerInfo?.clientPlayerIndex === 0,
    localPlayerCanReassignControllers: localPlayerIsHost && (gameIsPaused || gameIsPendingStart),
    ping: state.ping,
    gameIsPendingStart: state.uiState
      === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION,
    gameIsPaused: state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
  };
};

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  onStartGameClick: () => {
    dispatch(requestGameStart());
  },
  onPauseGameClick: () => {
    dispatch(requestGamePause());
  },
  onResumeGameClick: () => {
    dispatch(requestGameResume());
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type GameRoomPlayerInfoProps = ConnectedProps<typeof connector>;
export default connector(GameRoomPlayerInfoComponent);
