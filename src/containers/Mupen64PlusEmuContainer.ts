import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Mupen64PlusEmuComponent from '../components/Mupen64PlusEmuComponent';
import { RootState, UI_STATE } from '../redux/reducers';
import { requestGameStart, requestGamePause, requestGameResume, confirmNetplayGamePaused } from '../redux/actions';
import MatchmakerClient from '../service/MatchmakerClient';
import { gamepadSimulator } from '../GamepadSimulator';

type MyExtraArg = { matchmakerService: MatchmakerClient };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const mapStateToProps = (state: RootState) => {

  const isInNetplaySession =
    state.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    || state.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
    || state.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION;

  const netplayConfig = isInNetplaySession
    && state.uiState !== UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    ? {
      player: state.roomPlayerInfo.clients[state.roomPlayerInfo.clientPlayerIndex].mappedController,
      registrationId: state.netplayRegistrationId,
      reliableChannel: state.gameServerConnection.rtcReliableChannel,
      unreliableChannel: state.gameServerConnection.rtcUnreliableChannel
    }
    : { player: 0 };

  const isUsingTouchControls = state.connectedGamepad
    && (state.connectedGamepad.id === gamepadSimulator.fakeController.id);

  return {
    gameServerConnection: state.gameServerConnection,
    selectedRomData: state.selectedRomData,
    isInNetplaySession,
    isUsingTouchControls,
    uiState: state.uiState,
    localPlayerIsHost: (state.roomPlayerInfo?.clientPlayerIndex === 0),

    emulatorConfigOverrides: state.emulatorConfigOverrides,
    netplayConfig,
    netplayPauseCounts: state.netplayPauseCounts
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
  },
  confirmNetplayPause: (pauseCounts: number[]) => {
    dispatch(confirmNetplayGamePaused(pauseCounts));
  }
});

type OwnProps = {
  children?: React.ReactNode
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type Mupen64PlusEmuProps = OwnProps & ConnectedProps<typeof connector>;
export default connector(Mupen64PlusEmuComponent);
