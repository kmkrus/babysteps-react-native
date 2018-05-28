import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { Api } from '../database/api';

import reducers from '../reducers';

const logger = createLogger();

const effect = (effect, action) => Api(effect, action);
const discard = (error, _action, _retries) => {
  const { request, response } = error;
  if (!request) throw error; // There was an error creating the request
  if (!response) return false; // There was no response
  return 400 <= response.status && response.status < 500;
};

const store = createStore(
  reducers,
  compose(
    applyMiddleware(promise(), thunk, logger),
    offline({
      ...offlineConfig,
      effect,
      discard
    })
  )
);

export default store;