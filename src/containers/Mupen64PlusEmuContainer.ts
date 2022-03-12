import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Mupen64PlusEmuComponent from '../components/Mupen64PlusEmuComponent';
import { RootState, UI_STATE } from '../redux/reducers';
import { requestGameStart, requestGamePause, requestGameResume } from '../redux/actions';
import MatchmakerClient from '../service/MatchmakerClient';

type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => {
  return {
    gameServerConnection: state.gameServerConnection,
    selectedRomData: state.selectedRomData,
    isInNetplaySession:
      state.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
      || state.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
      || state.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
      || state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
      || state.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION,
    uiState: state.uiState,
    localPlayerIsHost: (state.roomPlayerInfo?.clientPlayerIndex === 0)
  };
};

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  onStartNetplayGameClick: () => {
    dispatch(requestGameStart());
  },
  onPauseNetplayGameClick: () => {
    dispatch(requestGamePause());
  },
  onResumeNetplayGameClick: () => {
    dispatch(requestGameResume());
  }

});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type Mupen64PlusEmuProps = ConnectedProps<typeof connector>;
export default connector(Mupen64PlusEmuComponent);
