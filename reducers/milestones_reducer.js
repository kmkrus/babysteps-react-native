
import {
  FETCH_MILESTONES_PENDING,
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED,

  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED,

} from '../actions/types';

const initialState = {
  fetching: false,
  fetched: false,
  data: [],
  error: null,
  groups: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  }
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
    case FETCH_MILESTONE_GROUPS_PENDING: {
      return {...state, groups: { ...state.groups, fetching: true, fetched: false, error: null} }
      break;
    }
    case FETCH_MILESTONE_GROUPS_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, groups: {...state.groups, fetching: false, fetched: true, data: data} }
      break;
    }
    case FETCH_MILESTONE_GROUPS_REJECTED: {
      return {...state, groups: {...state.groups, fetching: false, error: action.payload} }
      break;
    }
  default:
    return state
  }
};

export default reducer;

