import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import { Action, applyMiddleware, createStore, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { isMobile } from 'react-device-detect';
import App from './App';
import './bootstrap.min.css';
import './index.css';
import {
  setAlias,
  setConnectedGamepad,
  setIsAutoSelectROMEnabled,
  setIsDynarecEnabled
} from './redux/actions';
import appReducer, { RootState } from './redux/reducers';
import reportWebVitals from './reportWebVitals';
import MatchmakerService from './service/MatchmakerClient';
import { gamepadSimulator } from './GamepadSimulator';
import { UI_STATE } from './redux/reducers';

type MyExtraArg = { matchmakerService: MatchmakerService };
type MyThunkDispatch = ThunkDispatch<RootState, MyExtraArg, Action>;

const matchmakerURL = (process.env.NODE_ENV === 'production')
  ? 'wss://ahcv76zlb4.execute-api.us-west-2.amazonaws.com/prod'
  : 'wss://agd73oj5c9.execute-api.us-west-2.amazonaws.com/beta';

const matchmakerService = new MatchmakerService(matchmakerURL);

const store: Store = createStore(appReducer, applyMiddleware(
  thunk.withExtraArgument({
    matchmakerService
  })
));

const maybePersistedAlias = localStorage.getItem('playerAlias');
const alias = maybePersistedAlias ? maybePersistedAlias : '';
store.dispatch(setAlias(alias));

// TODO - move preference keys to definitions file
const isAutoSelectROMEnabled = JSON.parse(localStorage.getItem('isAutoSelectROMEnabled') ?? 'false');
store.dispatch(setIsAutoSelectROMEnabled(isAutoSelectROMEnabled));

const isDynarecEnabled = JSON.parse(localStorage.getItem('isDynarecEnabled') ?? 'false');
store.dispatch(setIsDynarecEnabled(isDynarecEnabled));

store.subscribe(() => {
  const alias = store.getState().alias;

  if (alias !== localStorage.getItem('playerAlias')) {
    localStorage.setItem('playerAlias', alias);
  }
});

if (isMobile) {
  gamepadSimulator.create();
}

window.addEventListener('gamepadconnected', function(e: any) {
  console.log(e);
  const uiState = store.getState().uiState;
  const emulatorStarted = uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
    || uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
    || uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
    || uiState === UI_STATE.PLAYING_LOCAL_SESSION;

  if (!emulatorStarted
    && gamepadSimulator.isActive()
    && e.gamepad.id !== gamepadSimulator.fakeController.id) {

    console.log('Non touchscreen controller detected! Using that over playm64 touch controls');
    gamepadSimulator.destroy();
  }

  if (!store.getState().connectedGamepad) {
    (store.dispatch as MyThunkDispatch)(setConnectedGamepad(e.gamepad));
  }
});

window.addEventListener('gamepaddisconnected', function(e: any) {

  const currentConnectedGamepad = store.getState().connectedGamepad;
  if (e.gamepad.index === currentConnectedGamepad?.index
    && e.gamepad.id === currentConnectedGamepad?.id) {

    (store.dispatch as MyThunkDispatch)(setConnectedGamepad(null));

    const uiState = store.getState().uiState;
    const emulatorStarted = uiState === UI_STATE.PLAYING_IN_NETPLAY_SESSION
      || uiState === UI_STATE.PLAYING_IN_DISCONNECTED_NETPLAY_SESSION
      || uiState === UI_STATE.PLAYING_IN_PAUSED_NETPLAY_SESSION
      || uiState === UI_STATE.PLAYING_LOCAL_SESSION;

    if (isMobile
      && e.gamepad.id !== gamepadSimulator.fakeController.id
      && !emulatorStarted) {

      gamepadSimulator.create();
      gamepadSimulator.connect();
    }
  }
});

if (isMobile) {
  gamepadSimulator.connect();
}


matchmakerService.setUiStore(store);

Modal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
