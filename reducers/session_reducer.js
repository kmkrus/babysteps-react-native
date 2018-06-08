import {

  UPDATE_ACCESS_TOKEN,

  API_TOKEN_REFRESH_PENDING,
  API_TOKEN_REFRESH_FULFILLED,
  API_TOKEN_REFRESH_REJECTED,
  
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
  access_token: null,
  client: null,
  uid: null,
  user_id: null,
  email: null,
  password: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {

    case UPDATE_ACCESS_TOKEN: {
      return{...state, access_token: action.payload}
      break;
    }

    case API_TOKEN_REFRESH_PENDING: {
      console.log('API_TOKEN_REFRESH_PENDING reducer')
      return {...state, fetching_token: true, error: null }
      break;
    }
    case API_TOKEN_REFRESH_FULFILLED: {
      const header = action.payload.headers;
      return {...state, fetching_token: false, 
        access_token: header['access-token'],
        client: header['client'],
        uid: header['uid'],
        user_id: header['user_id']
      }
      break;
    }
    case API_TOKEN_REFRESH_REJECTED: {
      return {...state, fetching_token: false, error: action.payload } 
      break;
    }

    case FETCH_SESSION_PENDING: {
      return {...state, fetching: true, fetched: false, error: null }
      break;
    }
    case FETCH_SESSION_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {...state, fetching: false, fetched: true, ...data }
      break;
    }
    case FETCH_SESSION_REJECTED: {
      return {...state, fetching: false, error: action.payload} 
      break;
    }

    case UPDATE_SESSION_PENDING: {
      return {...state, fetching: true, fetched: false, error: null }
      break;
    }
    case UPDATE_SESSION_FULFILLED: {
      return {...state, fetching: false, fetched: true, ...action.session }
      break;
    }
    case UPDATE_SESSION_REJECTED: {
      return {...state, fetching: false, error: action.payload} 
      break;
    }

  default: 
    return state
  }
};

export default reducer;