import axios from 'axios';

import pick from 'lodash/pick';

import {
  updateSession,
  apiTokenRefresh,
  updatePendingActions,
} from '../actions/session_actions';
import { getApiUrl } from './common';
import { AnalyticsEvent } from '../components/analytics';

import {
  API_TOKEN_REFRESH_PENDING,
  API_CREATE_USER_PENDING,
  API_FETCH_MILESTONES_PENDING,
  API_NEW_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_PENDING,
  API_CREATE_MILESTONE_CALENDAR_PENDING,
  API_UPDATE_MILESTONE_CALENDAR_PENDING,
  API_SYNC_MILESTONE_ANSWERS_PENDING,
  API_SAVE_SIGNATURE_PENDING,
  API_FETCH_SIGNIN_PENDING,
  API_SYNC_REGISTRATION_PENDING,
  API_SYNC_SIGNATURE_PENDING,
  RESET_API_MILESTONES,
  RESET_API_MILESTONE_CALENDAR,
  UPDATE_ACCESS_TOKEN,
  UPDATE_SESSION_ACTION,
} from '../actions/types';

const excludeTypes = [
  API_CREATE_USER_PENDING,
  API_FETCH_MILESTONES_PENDING,
  API_NEW_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_PENDING,
  API_CREATE_MILESTONE_CALENDAR_PENDING,
  API_UPDATE_MILESTONE_CALENDAR_PENDING,
  API_SYNC_MILESTONE_ANSWERS_PENDING,
  API_FETCH_SIGNIN_PENDING,
  API_SYNC_REGISTRATION_PENDING,
  API_SYNC_SIGNATURE_PENDING,
  API_SAVE_SIGNATURE_PENDING,
  RESET_API_MILESTONES,
  RESET_API_MILESTONE_CALENDAR,
];

const Pending = type => {
  return { type };
};

const Response = (type, payload, session = {}) => {
  return { type, payload, session };
};

export default store => next => action => {
  if (!action.type.includes('api_') || !action.type.includes('_pending')) {
    //console.log('***** not an offline api call');
    return next(action);
  }
  if (excludeTypes.includes(action.type)) {
    console.log('***** milestone token api call');
    return next(action);
  }

  const session = store.getState().session;
  const effect = action.meta.offline.effect;

  // Store action if there is no network connection
  // Cross-platform: [none, wifi, cellular, unknown]
  // Android: [bluetooth, ethernet, wimax]
  if (['none', 'unknown'].includes(session.connectionType)) {
    if (action.type !== API_TOKEN_REFRESH_PENDING) {
      const pending_actions = [...session.pending_actions];
      pending_actions.push(action);
      updatePendingActions(store.dispatch, pending_actions);
    }
    return next(action);
  }

  // save action in case we need to retry after token refresh
  if (action.type !== API_TOKEN_REFRESH_PENDING) {
    store.dispatch(Response(UPDATE_SESSION_ACTION, action));
  }

  const headers = {
    'ACCESS-TOKEN': session.access_token,
    'TOKEN-TYPE': 'Bearer',
    CLIENT: session.client,
    UID: session.uid,
  };

  if (action.payload.multipart) {
    headers['CONTENT-TYPE'] = 'multipart/form-data';
  }

  const baseURL = getApiUrl();

  AnalyticsEvent(
    'API',
    action.type,
    'headers',
    JSON.stringify({
      access_token: session.access_token,
      uid: session.uid,
      event_at: Date(),
    }),
  );

  return axios({
    method: effect.method,
    responseType: 'json',
    baseURL,
    url: effect.url,
    headers,
    data: action.payload.data,
  })
    .then(response => {
      store.dispatch(Response(effect.fulfilled, response));
      // retry next action if this was a token refresh
      if (action.type === API_TOKEN_REFRESH_PENDING) {
        const nextAction = store.getState().session.action;
        if (nextAction) {
          store.dispatch(nextAction);
        }
      }
      // remove action from store
      store.dispatch(Response(UPDATE_SESSION_ACTION, null));
      // update access token in store unless
      // access-token in header is empty then
      // continue to use existing token
      const headers = response.headers;
      if (headers['access-token'] !== '') {
        const data = {
          access_token: headers['access-token'],
          client: headers.client,
          uid: headers.uid,
          user_id: headers.user_id,
        };
        updateSession(data);
      }
      AnalyticsEvent(
        'API',
        effect.fulfilled,
        'headers',
        JSON.stringify({
          access_token: headers['access-token'],
          uid: headers.uid,
          user_id: headers.user_id,
          event_at: Date(),
        }),
      );
    })
    .catch(error => {
      const { request, response } = error;
      const session = store.getState().session;
      if (!request) throw error; // There was an error creating the request
      if (!response) return false; // There was no response
     //debugger
      AnalyticsEvent(
        'API',
        effect.rejected,
        'error',
        JSON.stringify({
          access_token: request._headers['access-token'],
          uid: request._headers['uid'],
          message: error.message,
          event_at: Date(),
        }),
      );
      // Not signed in
      if (response.status === 401) {
        // not already getting fresh token
        if (!session.fetching_token) {
          AnalyticsEvent(
            'API',
            API_TOKEN_REFRESH_PENDING,
            'session',
            JSON.stringify({
              uid: session.uid,
              event_at: Date(),
            }),
          );
          apiTokenRefresh(store.dispatch, session);
          return false;
        }
      } else {
        store.dispatch(Response(effect.rejected, error));
      }
    }); // catch
}; // action
