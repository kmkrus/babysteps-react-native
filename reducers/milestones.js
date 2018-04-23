import checkMilestonesSchema from '../database/check_milestones_schema';

const check_schema_result = checkMilestonesSchema();

const initialState = {
  fetching: false,
  fetched: false,
  milestones: [],
  error: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_MILESTONES_PENDING': {
      return {...state, fetching: true}
      break;
    }
    case 'FETCH_MILESTONES_FULFILLED': {
      return {...state, fetching: false, fetched: true, milestones: action.payload}
      break;
    }
    case 'FETCH_MILESTONES_REJECTED': {
      return {...state, fetching: false, error: action.payload}
      break;
    }
  default:
    return state
  }
};

export default reducer;

