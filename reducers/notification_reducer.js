import {
  SHOW_MOMENTARY_ASSESSMENT,
  HIDE_MOMENTARY_ASSESSMENT,

  FETCH_MOMENTARY_ASSESSMENT_PENDING,
  FETCH_MOMENTARY_ASSESSMENT_FULFILLED,
  FETCH_MOMENTARY_ASSESSMENT_REJECTED,

  UPDATE_NOTIFICATIONS_PENDING,
  UPDATE_NOTIFICATIONS_FULFILLED,
  UPDATE_NOTIFICATIONS_REJECTED,

  DELETE_NOTIFICATIONS,
} from '../actions/types';

const initialState = {
  show_momentary_assessment: false,
  momentary_assessment: {
    fetching: false,
    fetched: false,
    error: null,
    data: {},
  },
  notifications: {
    fetching: false,
    fetched: false,
    error: null,
  },
};

const reducer = (state = initialState, action, formData = []) => {
  switch (action.type) {
    case SHOW_MOMENTARY_ASSESSMENT: {
      return {
        ...state,
        show_momentary_assessment: true,
        momentary_assessment: {
          ...state.momentary_assessment,
          fetching: false,
          fetched: false,
          error: null,
          data: action.payload,
        },
      };
    }
    case HIDE_MOMENTARY_ASSESSMENT: {
      return {
        ...state,
        show_momentary_assessment: false,
        momentary_assessment: {
          ...state.momentary_assessment,
          fetching: false,
          fetched: false,
          error: null,
          data: action.payload,
          answer: formData,
        },
      };
    }

    case FETCH_MOMENTARY_ASSESSMENT_PENDING: {
      return {
        ...state,
        momentary_assessment: {
          ...state.momentary_assessment,
          fetching: true,
          fetched: false,
          error: null,
          data: {},
        },
      };
    }
    case FETCH_MOMENTARY_ASSESSMENT_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {
        ...state,
        momentary_assessment: {
          ...state.momentary_assessment,
          fetching: false,
          fetched: true,
          error: null,
          data,
        },
      };
    }
    case FETCH_MOMENTARY_ASSESSMENT_REJECTED: {
      return {
        ...state,
        momentary_assessment: {
          ...state.momentary_assessment,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    case UPDATE_NOTIFICATIONS_PENDING: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          fetching: true,
          fetched: false,
          error: null,
        },
      };
    }
    case UPDATE_NOTIFICATIONS_FULFILLED: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          fetching: false,
          fetched: true,
          error: null,
        },
      };
    }
    case UPDATE_NOTIFICATIONS_REJECTED: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    case DELETE_NOTIFICATIONS: {
      return state;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
