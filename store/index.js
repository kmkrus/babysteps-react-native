import { applyMiddleware, createStore } from 'redux';
import axios from 'axios';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducers from '../reducers';

const BASE_URL = 'https://app-8756.on-aptible.com/api'

const MILESTONE_TOKEN = "816fb58eb3ef6dc4dcf85a230b2049da33bac3b7a744d26f33ca3b89ae136d41"

const logger = createLogger({
  // ...options 
});

const middleware = applyMiddleware(promise(), thunk, logger);

const store = createStore(reducers, middleware);

store.dispatch({
  type: "FETCH_MILESTONES",
  payload: axios({
    method: 'get',
    responseType: 'json',
    baseURL: BASE_URL,
    url: '/milestones',
    headers: {
      "milestone_token": MILESTONE_TOKEN
    }
  })
});

export default store;