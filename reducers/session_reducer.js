import {

  SESSION_SYNC_MESSAGE,

  UPDATE_SESSION_ACTION,
  UPDATE_ACCESS_TOKEN,
  SET_FETCHING_TOKEN,
  UPDATE_CONNECTION_TYPE,
  RESET_SESSION,

  API_TOKEN_REFRESH_PENDING,
  API_TOKEN_REFRESH_FULFILLED,
  API_TOKEN_REFRESH_REJECTED,
  API_TOKEN_REFRESH_FAILED,

  FETCH_SESSION_PENDING,
  FETCH_SESSION_FULFILLED,
  FETCH_SESSION_REJECTED,

  UPDATE_SESSION_PENDING,
  UPDATE_SESSION_FULFILLED,
  UPDATE_SESSION_REJECTED,

  UPDATE_SESSION_PENDING_ACTIONS_PENDING,
  UPDATE_SESSION_PENDING_ACTIONS_FULFILLED,
  UPDATE_SESSION_PENDING_ACTIONS_REJECTED,

  DISPATCH_SESSION_PENDING_ACTIONS_PENDING,
  DISPATCH_SESSION_PENDING_ACTIONS_FULFILLED,
  DISPATCH_SESSION_PENDING_ACTIONS_REJECTED,

  API_FETCH_SIGNIN_PENDING,
  API_FETCH_SIGNIN_FULFILLED,
  API_FETCH_SIGNIN_REJECTED,

} from '../actions/types';

const initialState = {
  fetching: false,
  fetching_token: false,
  fetched: false,
  error: null,
  id: null,
  registration_state: 'none',
  notification_period: null,
  notifications_permission: null,
  notifications_updated_at: null,
  access_token: null,
  client: null,
  uid: null,
  user_id: null,
  email: null,
  password: null,
  connectionType: null,
  action: null,
  pending_actions: [],
  dispatching_pending_actions: false,
  syncMessages: {},
};

const reducer = (state = initialState, action, formData = {}) => {
  switch (action.type) {

    case RESET_SESSION: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: null,
      };
    }

    case UPDATE_SESSION_ACTION: {
      const thisAction = (action && action.payload) ? action.payload : null;
      return {
        ...state,
        action: thisAction,
      };
    }

    case SESSION_SYNC_MESSAGE: {
      const messages = JSON.parse(action.payload);
      const syncMessages = {...state.syncMessages, ...messages};
      return {
        ...state,
        syncMessages,
      };
    }

    case UPDATE_SESSION_PENDING_ACTIONS_PENDING: {
      return {
        ...state,
        dispatching_pending_actions: true,
      };
    }
    case UPDATE_SESSION_PENDING_ACTIONS_FULFILLED: {
      return {
        ...state,
        dispatching_pending_actions: false,
        pending_actions: action.payload,
      };
    }
    case UPDATE_SESSION_PENDING_ACTIONS_REJECTED: {
      return {
        ...state,
        dispatching_pending_actions: false,
        error: action.payload,
      };
    }

    case DISPATCH_SESSION_PENDING_ACTIONS_PENDING: {
      return {
        ...state,
        dispatching_pending_actions: true,
      };
    }
    case DISPATCH_SESSION_PENDING_ACTIONS_FULFILLED: {
      return {
        ...state,
        dispatching_pending_actions: false,
        pending_actions: [],
      };
    }
    case DISPATCH_SESSION_PENDING_ACTIONS_REJECTED: {
      return {
        ...state,
        error: action.payload,
      };
    }

    case UPDATE_ACCESS_TOKEN: {
      return {
        ...state,
        access_token: action.payload,
      };
    }

    case UPDATE_CONNECTION_TYPE: {
      return {
        ...state,
        connectionType: action.payload,
      };
    }

    case SET_FETCHING_TOKEN: {
      return {
        ...state,
        fetching_token: true,
      };
    }

    case API_TOKEN_REFRESH_PENDING: {
      return {
        ...state,
        fetching_token: true,
        error: null,
      };
    }
    case API_TOKEN_REFRESH_FULFILLED: {
      const header = (action && action.payload) ? action.payload.headers : null;
      return {
        ...state,
        fetching_token: false,
        access_token: header['access-token'],
        client: header.client,
        uid: header.uid,
        user_id: header.user_id,
      };
    }
    case API_TOKEN_REFRESH_REJECTED: {
      const error = (action && action.payload) ? action.payload : null;
      return {
        ...state,
        fetching_token: false,
        error,
      };
    }
    case API_TOKEN_REFRESH_FAILED: {
      console.log(API_TOKEN_REFRESH_FAILED);
      return {
        ...state,
        fetching_token: false,
        error: 'action failed',
      };
    }

    case FETCH_SESSION_PENDING: {
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null,
      };
    }
    case FETCH_SESSION_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      if (data.pending_actions === null || data.pending_actions === undefined) {
        data.pending_actions = [];
      } else {
        data.pending_actions = JSON.parse(data.pending_actions);
      }
      return {
        ...state,
        fetching: false,
        fetched: true,
        ...data,
      };
    }
    case FETCH_SESSION_REJECTED: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }

    case UPDATE_SESSION_PENDING: {
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null,
      };
    }
    case UPDATE_SESSION_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        ...action.session,
      };
    }
    case UPDATE_SESSION_REJECTED: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }

    case API_FETCH_SIGNIN_PENDING: {
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null,
      };
    }
    case API_FETCH_SIGNIN_FULFILLED: {
      const data = action.payload.data.data;
      const { email, password } = action.session;

      return {
        ...state,
        fetching: false,
        fetched: true,
        api_id: data.api_id,
        email,
        password,
        uid: data.uid,
      };
    }
    case API_FETCH_SIGNIN_REJECTED: {
      const data = action.payload;
      return {
        ...state,
        fetching: false,
        error: data,
        errorMessages: data.response.data.errors,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
