
import {
  FETCH_USERS_PENDING,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED
} from '../actions/types';

const initialState = {
  users: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_PENDING: {
      return {...state, users: {...state.users, fetching: true} }
      break;
    }
    case FETCH_USERS_FULFILLED: {
      return {...state, users: {...state.users, fetching: false, fetched: true, data: action.payload} }
      break;
    }
    case FETCH_USERS_REJECTED: {
      return {...state, users: {...state.users, fetching: false, error: action.payload} }
      break;
    }
  default:
    return state
  }
};

export default reducer;