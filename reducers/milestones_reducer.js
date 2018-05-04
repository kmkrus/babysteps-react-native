import fetchMilestones from '../actions/milestone_actions';
import {
  FETCH_MILESTONES_PENDING,
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED
} from '../actions/types';

const initialState = {
  fetching: false,
  fetched: false,
  data: [],
  error: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_MILESTONES_PENDING: {
      return {...state, fetching: true}
      break;
    }
    case FETCH_MILESTONES_FULFILLED: {
      return {...state, fetching: false, fetched: true, data: action.payload}
      break;
    }
    case FETCH_MILESTONES_REJECTED: {
      return {...state, fetching: false, error: action.payload}
      break;
    }
  default:
    return state
  }
};

export default reducer;

