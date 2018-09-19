import {
  SHOW_MOMENTARY_ASSESSMENT,
  HIDE_MOMENTARY_ASSESSMENT,

  FETCH_MOMENTARY_ASSESSMENT_PENDING,
  FETCH_MOMENTARY_ASSESSMENT_FULFILLED,
  FETCH_MOMENTARY_ASSESSMENT_REJECTED,

} from '../actions/types';

const initialState = {
  show_momentary_assessment: false,
  momentary_assessment: {
    fetching: false,
    fetched: false,
    error: null,
    data: {},
  },
};

const reducer = (state = initialState, action, formData = []) => {
  switch (action.type) {
    case SHOW_MOMENTARY_ASSESSMENT: {
      return {...state, show_momentary_assessment: true, fetching: false, fetched: false, error: null, data: action.payload};
      break;
    }
    case HIDE_MOMENTARY_ASSESSMENT: {
      return {...state, show_momentary_assessment: false, fetching: false, fetched: false, error: null, data: {},
        momentary_assessment: {data: action.payload, answer: formData}
      };
      break;
    }

    case FETCH_MOMENTARY_ASSESSMENT_PENDING: {
      return {...state, momentary_assessment:
        {...state.momentary_assessment, fetching: true, fetched: false, error: null, data: {}},
      };
      break;
    }
    case FETCH_MOMENTARY_ASSESSMENT_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {...state, momentary_assessment:
        {...state.momentary_assessment, fetching: false, fetched: true, error: null, data: data},
      };
      break;
    }
    case FETCH_MOMENTARY_ASSESSMENT_REJECTED: {
      return {...state, momentary_assessment:
        {...state.momentary_assessment, fetching: false, fetched: false, error: action.payload},
      };
      break;
    }

  default:
    return state;
  }
};

export default reducer;