import {
  
  FETCH_SESSION_PENDING,
  FETCH_SESSION_FULFILLED,
  FETCH_SESSION_REJECTED,

  UPDATE_SESSION_PENDING,
  UPDATE_SESSION_FULFILLED,
  UPDATE_SESSION_REJECTED,

} from '../actions/types';

const initialState = {
  fetching: false,
  fetched: false,
  error: null,
  id: null,
  registration_state: 'none',
  accessToken: '',
  client: '',
  uid: '',
  user_id: ''
};

const reducer = (state=initialState, action) => {
  switch (action.type) {

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