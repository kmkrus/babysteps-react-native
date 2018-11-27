import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import api from '../database/api';
import apiAnswersFulfilled from '../database/api_answers_fulfilled';

import reducers from '../reducers';

const logger = createLogger();

const store = createStore(
  reducers,
  compose(
    applyMiddleware(promise(), thunk, logger, api, apiAnswersFulfilled),
    offline(offlineConfig),
  ),
);

export default store;
