import './App.css';

import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Home from './views/home/containers/HomeContainer';
import PlayLocally from './views/play-locally/containers/PlayLocallyContainer';
import PlayOnline from './views/play-online/containers/PlayOnlineContainer';
import { RootState } from './redux/reducers';
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
                <PlayLocally />
              </Route>

              <Route path="/play-onlinehos">
                <PlayOnline />
              </Route>

              <Route path="/play-online">
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

