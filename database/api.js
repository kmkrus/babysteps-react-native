import axios from 'axios';

import { apiTokenRefresh } from '../actions/session_actions';

import CONSTANTS from '../constants';

import {
  API_CREATE_USER_PENDING,
  API_FETCH_MILESTONES_PENDING,
  API_CREATE_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_PENDING,
  API_SAVE_SIGNATURE_PENDING,
  RESET_API_MILESTONES,
  RESET_API_MILESTONE_CALENDAR,
  UPDATE_ACCESS_TOKEN,
} from '../actions/types';

const excludeTypes = [
  API_CREATE_USER_PENDING,
  API_FETCH_MILESTONES_PENDING,
  API_CREATE_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_PENDING,
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
    // not a pending api call
    return next(action);
  }
  if (excludeTypes.includes(action.type)) {
    console.log('***** not an offline api call ******');
    return next(action);
  }

  const session = store.getState().session;
  const effect = action.meta.offline.effect;

  const headers = {
    'ACCESS-TOKEN': session.access_token,
    'TOKEN-TYPE': 'Bearer',
    CLIENT: session.client,
    UID: session.uid,
  };

  return (
    axios({
      method: effect.method,
      responseType: 'json',
      baseURL: CONSTANTS.BASE_URL,
      url: effect.url,
      headers,
      data: action.payload.data,
    })
    .then(response => {
      store.dispatch(Response( effect.fulfilled, response ))
      // if access-token in header is empty, continue to use existing token
      if (response.headers['access-token'] !== '') {
        store.dispatch(Response( UPDATE_ACCESS_TOKEN, response.headers['access-token']))
      }
    })
    .catch(error => {
      const { request, response } = error;
      if (!request) throw error; // There was an error creating the request
      if (!response) return false; // There was no response
      // Not signed in
      if (response.status === 401) {
        // not already getting fresh token
        if (!store.getState().session.fetching_token) {
          apiTokenRefresh(store.dispatch, session);
        }
      } else {
        store.dispatch(Response(effect.rejected, error));
      }
    }) // catch
  ) // return
} // action