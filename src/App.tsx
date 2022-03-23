import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Prompt
} from 'react-router-dom';

import Home from './views/home/containers/HomeContainer';
import PlayLocally from './views/play-locally/containers/PlayLocallyContainer';
import PlayOnline from './views/play-online/containers/PlayOnlineContainer';
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

  const isInGameRoom =
    props.uiState === UI_STATE.PENDING_GAME_START_IN_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
    || props.uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION;

  const isPlayingLocally = props.uiState === UI_STATE.PLAYING_LOCAL_SESSION;

  return (
    <Router>
      <div className="app container h-100">
        <div />
        <div className="row align-items-center justify-content-center h-100">

          <div className="col" />
          <div className="col">

            <div className="text-center py-4" >
              <img src="/title.png" />
            </div>

            <Switch>

              <Route path="/play-locally">
                <Prompt
                  when={isPlayingLocally}
                  message="Are you sure you want to leave? Your current emulation progress will be lost."
                />
                <PlayLocally />
              </Route>

              <Route path="/play-online">
                <Prompt
                  when={isInGameRoom}
                  message="Are you sure you want to leave? Your current emulation progress will be lost and you may not be able to rejoin this netplay session."
                />
                <PlayOnline />
              </Route>


              <Route path="/">
                <Home />
              </Route>

            </Switch>
          </div>
          <div className="col" />
        </div>

      </div>
    </Router >
  );
}

