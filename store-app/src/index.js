import React from 'react';
import ReactDOM from 'react-dom';
import LoadLocalStorage from './LoadLocalStorage';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';

import cartReducer from './store/reducer/cart';
import authReducer from './store/reducer/auth';

import './index.css';



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <LoadLocalStorage>
        <App />
      </LoadLocalStorage>
    </Provider>
  </BrowserRouter>

  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
