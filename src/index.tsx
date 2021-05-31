import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import thunk from 'redux-thunk';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createStore, applyMiddleware, Store } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './redux/reducers';
import { setAlias } from './redux/actions';

import MatchmakerService from './service/MatchmakerClient';

const matchmakerService = new MatchmakerService("wss://agd73oj5c9.execute-api.us-west-2.amazonaws.com/beta");

const store: Store = createStore(appReducer, applyMiddleware(
  thunk.withExtraArgument({
    matchmakerService
  })
));

const maybePersistedAlias = localStorage.getItem('playerAlias');
const alias = maybePersistedAlias ? maybePersistedAlias : '';
store.dispatch(setAlias(alias));

store.subscribe(() => {
  const alias = store.getState().alias;

  if (alias !== localStorage.getItem('playerAlias')) {
    localStorage.setItem('playerAlias', alias);
  }
});


matchmakerService.setUiStore(store);

Modal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
