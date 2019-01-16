import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import api from '../database/api';
import apiAnswersFulfilled from '../database/api_answers_fulfilled';

import reducers from '../reducers';

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
}

const logger = createLogger();

const store = createStore(
  reducers,
  compose(
    applyMiddleware(promise(), thunk, logger, api, apiAnswersFulfilled),
    offline(offlineConfig),
  ),
);

export default store;
