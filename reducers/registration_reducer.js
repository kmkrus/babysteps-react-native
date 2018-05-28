
import {
  FETCH_USER_PENDING,
  FETCH_USER_FULFILLED,
  FETCH_USER_REJECTED,
  CREATE_USER_PENDING,
  CREATE_USER_FULFILLED,
  CREATE_USER_REJECTED,
  API_UPDATE_USER_DATA,
  API_CREATE_USER_PENDING,
  API_CREATE_USER_FULFILLED,
  API_CREATE_USER_REJECTED
} from '../actions/types';

const initialState = {
  auth: {
    accessToken: '',
    client: '',
    uid: '',
    user_id: ''
  },
  user: {
    fetching: false,
    fetched: false,
    data: {},
    error: null,
  },
  apiUser: {
    fetching: false,
    fetched: false,
    error: null,
  }
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_USER_PENDING: {
      return {...state, user: {...state.user, fetching: true, error: null} }
      break;
    }
    case FETCH_USER_FULFILLED: {
      const data = action.payload.rows['_array'];
      return {...state, 
        user: {...state.user, fetching: false, fetched: true, data } 
      }
      break;
    }
    case FETCH_USER_REJECTED: {
      return {...state, user: {...state.user, fetching: false, error: action.payload} }
      break;
    }
    case CREATE_USER_PENDING: {
      return {...state, user: {...state.user, fetching: true, error: null} }
      break;
    }
    case CREATE_USER_FULFILLED: {
      return {...state, user: {...state.user, fetching: true, fetched: true } }
      break;
    }
    case CREATE_USER_REJECTED: {
      return {...state, user: {...state.user, fetching: false, error: action.payload} }
      break;
    }
    case API_CREATE_USER_PENDING: {
      return {...state, apiUser: {...state.apiUser, fetching: true, error: null} }
      break;
    }
    case API_CREATE_USER_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {
          ...state.auth, 
          accessToken: accessToken, 
          client: headers.client, 
          uid: headers.uid, 
          user_id: headers.user_id 
        }, 
        apiUser: {...state.apiUser, fetching: false, fetched: true, data: action.user}
      }
      break;
    }
    case API_CREATE_USER_REJECTED: {
      return {...state, apiUser: {...state.apiUser, fetching: false, error: action.payload} }
      break;
    }
  default:
    return state
  }
};

export default reducer;