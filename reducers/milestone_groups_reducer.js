
import {
  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED
} from '../actions/types';

const initialState = {
  fetching: false,
  fetched: false,
  data: [],
  error: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_MILESTONE_GROUPS_PENDING: {
      return {...state, fetching: true}
      break;
    }
    case FETCH_MILESTONE_GROUPS_FULFILLED: {
      return {...state, fetching: false, fetched: true, data: action.payload}
      break;
    }
    case FETCH_MILESTONE_GROUPS_REJECTED: {
      return {...state, fetching: false, error: action.payload}
      break;
    }
  default:
    return state
  }
};

export default reducer;