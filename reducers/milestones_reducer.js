
import {
  FETCH_MILESTONES_PENDING,
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED,

  RESET_API_MILESTONES,

  API_FETCH_MILESTONES_PENDING,
  API_FETCH_MILESTONES_FULFILLED,
  API_FETCH_MILESTONES_REJECTED,

  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED,

  FETCH_MILESTONE_CALENDAR_PENDING,
  FETCH_MILESTONE_CALENDAR_FULFILLED,
  FETCH_MILESTONE_CALENDAR_REJECTED,

  API_FETCH_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_FULFILLED,
  API_FETCH_MILESTONE_CALENDAR_REJECTED,

  FETCH_MILESTONE_TASKS_PENDING,
  FETCH_MILESTONE_TASKS_FULFILLED,
  FETCH_MILESTONE_TASKS_REJECTED,

  FETCH_MILESTONE_SECTIONS_PENDING,
  FETCH_MILESTONE_SECTIONS_FULFILLED,
  FETCH_MILESTONE_SECTIONS_REJECTED,

  RESET_MILESTONE_QUESTIONS,

  FETCH_MILESTONE_QUESTIONS_PENDING,
  FETCH_MILESTONE_QUESTIONS_FULFILLED,
  FETCH_MILESTONE_QUESTIONS_REJECTED,

  RESET_MILESTONE_CHOICES,

  FETCH_MILESTONE_CHOICES_PENDING,
  FETCH_MILESTONE_CHOICES_FULFILLED,
  FETCH_MILESTONE_CHOICES_REJECTED,

} from '../actions/types';

const initialState = {
  milestones: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  api_milestones: {
    rebuild: false,
    fetching: false,
    fetched: false,
    error: null,
  },
  groups: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  calendar: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  api_calendar: {
    fetching: false,
    fetched: false,
    error: null,
  },
  tasks: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  sections: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  questions: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  },
  choices: {
    fetching: false,
    fetched: false,
    data: [],
    error: null,
  }
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_MILESTONES_PENDING: {
      return {...state, milestones: {...state.milestones, fetching: true, fetched: false, error: null, data: [] } }
      break;
    }
    case FETCH_MILESTONES_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, milestones: {...state.milestones, fetching: false, fetched: true, error: null, data: data } }
      break;
    }
    case FETCH_MILESTONES_REJECTED: {
      return {...state, milestones: {...state.milestones, fetching: false, fetched: false, error: action.payload} }
      break;
    }

    case RESET_API_MILESTONES: {
      return {...state, api_milestones: {...state.api_milestones, fetching: false, fetched: false, error: null } }
      break;
    }

    case API_FETCH_MILESTONES_PENDING: {
      return {...state, api_milestones: {...state.api_milestones, fetching: true, fetched: false, error: null } }
      break;
    }
    case API_FETCH_MILESTONES_FULFILLED: {
      return {...state, api_milestones: {...state.api_milestones, fetching: false, fetched: true } }
      break;
    }
    case API_FETCH_MILESTONES_REJECTED: {
      return {...state, api_milestones: {...state.api_milestones, fetching: false, error: action.payload} }
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

    case FETCH_MILESTONE_CALENDAR_PENDING: {
      return {...state, calendar: { ...state.calendar, fetching: true, fetched: false, error: null, data: []} }
      break;
    }
    case FETCH_MILESTONE_CALENDAR_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, calendar: { ...state.calendar, fetching: false, fetched: true, data: data} }
      break;
    }
    case FETCH_MILESTONE_CALENDAR_REJECTED: {
      return {...state, calendar: { ...state.calendar, fetching: false, error: action.payload} }
      break;
    }

    case API_FETCH_MILESTONE_CALENDAR_PENDING: {
      return {...state, api_calendar: {...state.api_calendar, fetching: true, fetched: false, error: null } }
      break;
    }
    case API_FETCH_MILESTONE_CALENDAR_FULFILLED: {
      return {...state, api_calendar: {...state.api_calendar, fetching: false, fetched: true, error: null } }
      break;
    }
    case API_FETCH_MILESTONE_CALENDAR_REJECTED: {
      return {...state, api_calendar: {...state.api_calendar, fetching: false, fetched: false, error: action.payload } }
      break;
    }

    case FETCH_MILESTONE_TASKS_PENDING: {
      return {...state, tasks: {...state.tasks, fetching: true, fetched: false, error: null, data: [] } }
      break;
    }
    case FETCH_MILESTONE_TASKS_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, tasks: {...state.tasks, fetching: false, fetched: true, error: null, data: data } }
      break;
    }
    case FETCH_MILESTONE_TASKS_REJECTED: {
      return {...state, tasks: {...state.tasks, fetching: false, fetched: false, error: action.payload} }
      break;
    }

    case FETCH_MILESTONE_SECTIONS_PENDING: {
      return {...state, sections: {...state.sections, fetching: true, fetched: false, error: null, data: [] } }
      break;
    }
    case FETCH_MILESTONE_SECTIONS_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, sections: {...state.sections, fetching: false, fetched: true, error: null, data: data } }
      break;
    }
    case FETCH_MILESTONE_SECTIONS_REJECTED: {
      return {...state, sections: {...state.sections, fetching: false, fetched: false, error: action.payload} }
      break;
    }

    case RESET_MILESTONE_QUESTIONS: {
      return {...state, questions: {...state.questions, fetching: false, fetched: false, error: null, data: [] } }
      break;
    }

    case FETCH_MILESTONE_QUESTIONS_PENDING: {
      return {...state, questions: {...state.questions, fetching: true, fetched: false, error: null, data: [] } }
      break;
    }
    case FETCH_MILESTONE_QUESTIONS_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, questions: {...state.questions, fetching: false, fetched: true, error: null, data: data } }
      break;
    }
    case FETCH_MILESTONE_QUESTIONS_REJECTED: {
      return {...state, questions: {...state.questions, fetching: false, fetched: false, error: action.payload} }
      break;
    }

    case RESET_MILESTONE_CHOICES: {
      return {...state, choices: {...state.choices, fetching: false, fetched: false, error: null, data: [] } }
      break;
    }

    case FETCH_MILESTONE_CHOICES_PENDING: {
      return {...state, choices: {...state.choices, fetching: true, fetched: false, error: null, data: [] } }
      break;
    }
    case FETCH_MILESTONE_CHOICES_FULFILLED: {
      const data = action.payload.rows['_array']
      return {...state, choices: {...state.choices, fetching: false, fetched: true, error: null, data: data } }
      break;
    }
    case FETCH_MILESTONE_CHOICES_REJECTED: {
      return {...state, choices: {...state.choices, fetching: false, fetched: false, error: action.payload} }
      break;
    }

  default:
    return state
  }
};

export default reducer;

