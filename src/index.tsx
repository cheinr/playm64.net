import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './redux/reducers';

import MatchmakerService from './service/MatchmakerClient';

const matchmakerService = new MatchmakerService("wss://yqet5adtzg.execute-api.us-west-2.amazonaws.com/dev");

const store = createStore(appReducer, applyMiddleware(
  thunk.withExtraArgument({
    matchmakerService
  })
));

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
