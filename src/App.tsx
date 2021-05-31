import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import RomUploadContainer from './containers/RomUploadContainer';
import PlayModeSelectContainer from './containers/PlayModeSelectContainer';
import GameOverviewContainer from './containers/GameOverviewContainer';
import GameRoomPlayerInfoContainer from './containers/GameRoomPlayerInfoContainer';
import GameSaveManagementContainer from './containers/GameSaveManagementContainer';
import Mupen64PlusEmuContainer from './containers/Mupen64PlusEmuContainer';

import { RootState, UI_STATE } from './redux/reducers';

const mapStateToProps = (state: RootState) => ({
  uiState: state.uiState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({

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
      </header>
    </div >
  );
}

