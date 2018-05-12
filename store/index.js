import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import reducers from '../reducers';

const logger = createLogger();

const store = createStore(
  reducers,
  compose(
    applyMiddleware(promise(), thunk, logger),
    offline(offlineConfig)
  )
);

export default store;