import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import RomUploadContainer from './containers/RomUploadContainer';
import PlayModeSelectContainer from './containers/PlayModeSelectContainer';
import GameControlsDisplayContainer from './containers/GameControlsDisplayContainer';
import GameOverviewContainer from './containers/GameOverviewContainer';
import GameRoomPlayerInfoContainer from './containers/GameRoomPlayerInfoContainer';
import GameSaveManagementContainer from './containers/GameSaveManagementContainer';
import Mupen64PlusEmuContainer from './containers/Mupen64PlusEmuContainer';
import WelcomeModalContainer from './containers/WelcomeModalContainer';
import { RootState, UI_STATE } from './redux/reducers';
import { setDisplayWelcomeModal } from './redux/actions';

const mapStateToProps = (state: RootState) => ({
  uiState: state.uiState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  displayWelcomeMessage: () => {
    delete localStorage.disableWelcomeModal;
    dispatch(setDisplayWelcomeModal(true));
  }
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
);

export type AppProps = ConnectedProps<typeof connector>;
export default connector(App);

function App(props: AppProps) {

  console.log("props: %o", props.uiState);
  return (
    <div className="App">
      <i className="fa fa-upload" aria-hidden="true" />
      <header className="App-header">

        <WelcomeModalContainer />

        {(props.uiState === UI_STATE.PENDING_ROM_LOAD)
          && <RomUploadContainer />}

        {(props.uiState === UI_STATE.PENDING_MODE_SELECT
          || props.uiState === UI_STATE.PENDING_GAME_JOIN)
          && <PlayModeSelectContainer />}

        {(props.uiState === UI_STATE.PLAYING_LOCAL_SESSION
          || props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION)
          && <GameOverviewContainer />}


        {(props.uiState === UI_STATE.PLAYING_LOCAL_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION)
          && <Mupen64PlusEmuContainer />}


        {(props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION)
          && <GameRoomPlayerInfoContainer />}

        {(props.uiState === UI_STATE.PENDING_MODE_SELECT)
          && <GameSaveManagementContainer />}

        {(props.uiState === UI_STATE.PLAYING_LOCAL_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
          || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION)
          && <GameControlsDisplayContainer />}

        <div>
          <div className="welcome-message-link"><a href="#" onClick={() => props.displayWelcomeMessage()}>welcome message</a></div>
        </div>
      </header>
    </div >
  );
}

