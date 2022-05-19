import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import thunk from 'redux-thunk';
import './index.css';
import './bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { createStore, applyMiddleware, Store } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './redux/reducers';
import { setAlias, setConnectedGamepad, setIsAutoSelectROMEnabled } from './redux/actions';

import MatchmakerService from './service/MatchmakerClient';

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

store.subscribe(() => {
  const alias = store.getState().alias;

  if (alias !== localStorage.getItem('playerAlias')) {
    localStorage.setItem('playerAlias', alias);
  }
});


window.addEventListener('gamepadconnected', function(e: any) {
  console.log(e);

  if (!store.getState().connectedGamepad) {
    store.dispatch(setConnectedGamepad(e.gamepad));
  }
});

window.addEventListener('gamepaddisconnected', function(e: any) {

  const currentConnectedJoystickIndex = store.getState().connectedGamepad?.index;
  if (e.gamepad.index === currentConnectedJoystickIndex) {
    store.dispatch(setConnectedGamepad(null));
  }
});


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
