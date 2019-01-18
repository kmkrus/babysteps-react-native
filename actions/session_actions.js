import { SQLite } from 'expo';
import { _ } from 'lodash';

import {
  API_TOKEN_REFRESH_PENDING,
  API_TOKEN_REFRESH_FULFILLED,
  API_TOKEN_REFRESH_REJECTED,
  API_TOKEN_REFRESH_FAILED,

  FETCH_SESSION_PENDING,
  FETCH_SESSION_FULFILLED,
  FETCH_SESSION_REJECTED,

  UPDATE_SESSION_PENDING,
  UPDATE_SESSION_FULFILLED,
  UPDATE_SESSION_REJECTED,

  UPDATE_CONNECTION_TYPE,

  UPDATE_SESSION_PENDING_ACTIONS_PENDING,
  UPDATE_SESSION_PENDING_ACTIONS_FULFILLED,
  UPDATE_SESSION_PENDING_ACTIONS_REJECTED,

  DISPATCH_SESSION_PENDING_ACTIONS_PENDING,
  DISPATCH_SESSION_PENDING_ACTIONS_FULFILLED,
  DISPATCH_SESSION_PENDING_ACTIONS_REJECTED,
} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = type => {
  return { type };
};

const Response = (type, payload, session = {}) => {
  return { type, payload, session };
};

export const fetchSession = () => {
  return function(dispatch) {
    dispatch(Pending(FETCH_SESSION_PENDING));
    return db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM sessions LIMIT 1;',
        [],
        (_, response) => dispatch(Response(FETCH_SESSION_FULFILLED, response)),
        (_, error) => dispatch(Response(FETCH_SESSION_REJECTED, error)),
      );
    });
  };
};

const sendSessionUpdate = (dispatch, data) => {
  dispatch(Pending(UPDATE_SESSION_PENDING));

  const keys = _.keys(data);
  const updateSQL = [];

  _.forEach(keys, key => {
    updateSQL.push(`${key} = '${data[key]}'`);
  });

  return db.transaction(tx => {
    tx.executeSql(
      `UPDATE sessions SET ${updateSQL.join(', ')};`,
      [],
      (_, response) => dispatch(Response(UPDATE_SESSION_FULFILLED, response, data)),
      (_, error) => dispatch(Response(UPDATE_SESSION_REJECTED, error)),
    );
  });
};

export const updateSession = data => {
  return function(dispatch) {
    sendSessionUpdate(dispatch, data);
  };
};

export const apiUpdateSession = (dispatch, data) => {
  return sendSessionUpdate(dispatch, data);
};

export const apiTokenRefresh = (dispatch, session) => {
  return dispatch({
    type: API_TOKEN_REFRESH_PENDING,
    payload: {
      session,
      data: {
        email: session.email,
        password: session.password,
      },
    }, // payload
    meta: {
      offline: {
        effect: {
          method: 'POST',
          url: '/user_session',
          fulfilled: API_TOKEN_REFRESH_FULFILLED,
          rejected: API_TOKEN_REFRESH_REJECTED,
        },
      },
    }, // meta
  });
};

export const apiTokenRefreshFailed = () => {
  return function(dispatch) {
    dispatch(Pending(API_TOKEN_REFRESH_FAILED));
  };
};

export const updatePendingActions = (dispatch, actions) => {
  dispatch(Pending(UPDATE_SESSION_PENDING_ACTIONS_PENDING));
  return db.transaction(tx => {
    tx.executeSql(
      'UPDATE sessions SET pending_actions = ?;',
      [JSON.stringify(actions)],
      (_, response) => dispatch(Response(UPDATE_SESSION_PENDING_ACTIONS_FULFILLED, actions)),
      (_, error) => dispatch(Response(UPDATE_SESSION_PENDING_ACTIONS_REJECTED, error)),
    );
  });
};

export const dispatchPendingActions = pending_actions => {
  return function(dispatch) {
    dispatch(Pending(DISPATCH_SESSION_PENDING_ACTIONS_PENDING));
    _.forEach(pending_actions, action => {
      dispatch(action);
    });

    return db.transaction(tx => {
      tx.executeSql(
        'UPDATE sessions SET pending_actions = ?;',
        [JSON.stringify([])],
        (_, response) => dispatch(Response(DISPATCH_SESSION_PENDING_ACTIONS_FULFILLED, response)),
        (_, error) => dispatch(Response(DISPATCH_SESSION_PENDING_ACTIONS_REJECTED, error)),
      );
    });
  };
};

export const updateConnectionType = type => {
  return function(dispatch) {
    dispatch(Response(UPDATE_CONNECTION_TYPE, type));
  };
};
