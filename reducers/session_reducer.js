import {
  UPDATE_ACCESS_TOKEN,

  SET_FETCHING_TOKEN,

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

} from '../actions/types';

const initialState = {
  fetching: false,
  fetching_token: false,
  fetched: false,
  error: null,
  id: null,
  registration_state: 'none',
  notification_period: null,
  access_token: null,
  client: null,
  uid: null,
  user_id: null,
  email: null,
  password: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCESS_TOKEN: {
      return { ...state, access_token: action.payload };
    }

    case SET_FETCHING_TOKEN: {
      return { ...state, fetching_token: true };
    }

    case API_TOKEN_REFRESH_PENDING: {
      return { ...state, fetching_token: true, error: null };
    }
    case API_TOKEN_REFRESH_FULFILLED: {
      const header = action.payload.headers;
      return {
        ...state,
        fetching_token: false,
        access_token: header['access-token'],
        client: header.client,
        uid: header.uid,
        user_id: header.user_id,
      };
    }
    case API_TOKEN_REFRESH_REJECTED: {
      return { ...state, fetching_token: false, error: action.payload };
    }
    case API_TOKEN_REFRESH_FAILED: {
      console.log(API_TOKEN_REFRESH_FAILED);
      return { ...state, fetching_token: false, error: 'action failed' };
    }

    case FETCH_SESSION_PENDING: {
      return { ...state, fetching: true, fetched: false, error: null };
    }
    case FETCH_SESSION_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return { ...state, fetching: false, fetched: true, ...data };
    }
    case FETCH_SESSION_REJECTED: {
      return { ...state, fetching: false, error: action.payload };
    }

    case UPDATE_SESSION_PENDING: {
      return { ...state, fetching: true, fetched: false, error: null };
    }
    case UPDATE_SESSION_FULFILLED: {
      return { ...state, fetching: false, fetched: true, ...action.session };
    }
    case UPDATE_SESSION_REJECTED: {
      return { ...state, fetching: false, error: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
