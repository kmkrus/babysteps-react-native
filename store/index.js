import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducers from '../reducers';

const logger = createLogger();

const middleware = applyMiddleware(promise(), thunk, logger);

const store = createStore(reducers, middleware);

export default store;