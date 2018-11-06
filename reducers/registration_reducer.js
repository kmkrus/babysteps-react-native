
import {

  FETCH_SESSION_PENDING,
  FETCH_SESSION_FULFILLED,
  FETCH_SESSION_REJECTED,

  FETCH_USER_PENDING,
  FETCH_USER_FULFILLED,
  FETCH_USER_REJECTED,

  CREATE_USER_PENDING,
  CREATE_USER_FULFILLED,
  CREATE_USER_REJECTED,

  API_CREATE_USER_PENDING,
  API_CREATE_USER_FULFILLED,
  API_CREATE_USER_REJECTED,

  RESET_RESPONDENT,

  FETCH_RESPONDENT_PENDING,
  FETCH_RESPONDENT_FULFILLED,
  FETCH_RESPONDENT_REJECTED,

  CREATE_RESPONDENT_PENDING,
  CREATE_RESPONDENT_FULFILLED,
  CREATE_RESPONDENT_REJECTED,

  UPDATE_RESPONDENT_PENDING,
  UPDATE_RESPONDENT_FULFILLED,
  UPDATE_RESPONDENT_REJECTED,

  API_CREATE_RESPONDENT_PENDING,
  API_CREATE_RESPONDENT_FULFILLED,
  API_CREATE_RESPONDENT_REJECTED,

  API_UPDATE_RESPONDENT_PENDING,
  API_UPDATE_RESPONDENT_FULFILLED,
  API_UPDATE_RESPONDENT_REJECTED,

  API_SAVE_SIGNATURE_PENDING,
  API_SAVE_SIGNATURE_FULFILLED,
  API_SAVE_SIGNATURE_REJECTED,

  FETCH_SUBJECT_PENDING,
  FETCH_SUBJECT_FULFILLED,
  FETCH_SUBJECT_REJECTED,

  RESET_SUBJECT,

  CREATE_SUBJECT_PENDING,
  CREATE_SUBJECT_FULFILLED,
  CREATE_SUBJECT_REJECTED,

  UPDATE_SUBJECT_PENDING,
  UPDATE_SUBJECT_FULFILLED,
  UPDATE_SUBJECT_REJECTED,

  API_CREATE_SUBJECT_PENDING,
  API_CREATE_SUBJECT_FULFILLED,
  API_CREATE_SUBJECT_REJECTED,

  API_UPDATE_SUBJECT_PENDING,
  API_UPDATE_SUBJECT_FULFILLED,
  API_UPDATE_SUBJECT_REJECTED,

} from '../actions/types';

const initialState = {
  user: {
    fetching: false,
    fetched: false,
    data: { id: null },
    error: null,
  },
  apiUser: {
    fetching: false,
    fetched: false,
    error: null,
  },
  respondent: {
    fetching: false,
    fetched: false,
    data: {},
    error: null,
  },
  apiRespondent: {
    fetching: false,
    fetched: false,
    error: null,
  },
  apiSignature: {
    fetching: false,
    fetched: false,
    error: null,
  },
  subject: {
    fetching: false,
    fetched: false,
    data: {},
    error: null,
  },
  apiSubject: {
    fetching: false,
    fetched: false,
    error: null,
  },
};

const reducer = (state=initialState, action, formData={}) => {

  switch (action.type) {
    
    // FETCH USER
    case FETCH_USER_PENDING: {
      return {...state, user: {...state.user, fetching: true, fetched: false, error: null} }
      break;
    }
    case FETCH_USER_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {...state, 
        user: {...state.user, fetching: false, fetched: true, data } 
      }
      break;
    }
    case FETCH_USER_REJECTED: {
      return {...state, user: {...state.user, fetching: false, error: action.payload} }
      break;
    }

    // CREATE USER
    case CREATE_USER_PENDING: {
      return {...state, user: {...state.user, fetching: true, fetched: false, error: null} }
      break;
    }
    case CREATE_USER_FULFILLED: {
      return {...state, user: 
        {...state.user, fetching: false, fetched: true, 
          data: {...action.formData, id: action.payload.insertId } 
        } 
      }
      break;
    }
    case CREATE_USER_REJECTED: {
      return {...state, user: {...state.user, fetching: false, error: action.payload} }
      break;
    }

    // API CREATE USER
    case API_CREATE_USER_PENDING: {
      return {...state, 
        apiUser: {...state.apiUser, fetching: true, fetched: false, error: null},
        user: {...state.user, fetching: false, fetched: false, error: null}
      }
      break;
    }
    case API_CREATE_USER_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {...state.auth, accessToken: accessToken, client: headers.client, uid: headers.uid, user_id: headers.user_id }, 
        apiUser: {...state.apiUser, fetching: false, fetched: true, error: null, data: action.formData}
      }
      break;
    }
    case API_CREATE_USER_REJECTED: {
      return {...state, apiUser: {...state.apiUser, fetching: false, error: action.payload} }
      break;
    }

     // RESET RESPONDENT
    case RESET_RESPONDENT: {
      return {...state, respondent: {...state.respondent, fetching: false, fetched: false, error: null}}
    }

    // FETCH RESPONDENT
    case FETCH_RESPONDENT_PENDING: {
      return {...state, respondent: {...state.respondent, fetching: true, fetched: false, error: null} }
      break;
    }
    case FETCH_RESPONDENT_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {...state, 
        respondent: {...state.respondent, fetching: false, fetched: true, data } 
      }
      break;
    }
    case FETCH_RESPONDENT_REJECTED: {
      return {...state, respondent: {...state.respondent, fetching: false, error: action.payload} }
      break;
    }

    // CREATE RESPONDENT
    case CREATE_RESPONDENT_PENDING: {
      return {...state, respondent: {...state.respondent, fetching: true, fetched: false, error: null} }
      break;
    }
    case CREATE_RESPONDENT_FULFILLED: {
      return {...state, respondent: 
        {...state.respondent, fetching: false, fetched: true, 
          data:  Object.assign( {}, {id: action.payload.insertId},  action.formData ) 
        } 
      }
      break;
    }
    case CREATE_RESPONDENT_REJECTED: {
      return {...state, respondent: {...state.respondent, fetching: false, error: action.payload} }
      break;
    }

    // CREATE RESPONDENT
    case UPDATE_RESPONDENT_PENDING: {
      return {...state, respondent: {...state.respondent, fetching: true, fetched: false, error: null} }
      break;
    }
    case UPDATE_RESPONDENT_FULFILLED: {
      return {...state, respondent: 
        {...state.respondent, fetching: false, fetched: true, 
          data: Object.assign( {}, state.respondent.data, action.formData )
        } 
      }
      break;
    }
    case UPDATE_RESPONDENT_REJECTED: {
      return {...state, respondent: {...state.respondent, fetching: false, error: action.payload} }
      break;
    }

    // API_CREATE_RESPONDENT
    case API_CREATE_RESPONDENT_PENDING: {
      return {...state, apiRespondent: {...state.apiRespondent, fetching: true, fetched: false, error: null }}
      break;
    }
    case API_CREATE_RESPONDENT_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {...state.auth, accessToken: accessToken, client: headers.client, uid: headers.uid, user_id: headers.user_id }, 
        apiRespondent: {...state.apiRespondent, fetching: false, fetched: true, data: action.payload.data }
      }
      break;
    }
    case API_CREATE_RESPONDENT_REJECTED: {
      return {...state, apiRespondent: {...state.apiRespondent, fetching: false, fetched: false, error: action.payload }}
      break;
    }

    // API_UPDATE_RESPONDENT
    case API_UPDATE_RESPONDENT_PENDING: {
      return {...state, apiRespondent: {...state.apiRespondent, fetching: true, fetched: false, error: null }}
      break;
    }
    case API_UPDATE_RESPONDENT_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {...state.auth, accessToken: accessToken, client: headers.client, uid: headers.uid, user_id: headers.user_id }, 
        apiRespondent: {...state.apiRespondent, fetching: false, fetched: true, data: action.payload.data }
      }
      break;
    }
    case API_UPDATE_RESPONDENT_REJECTED: {
      return {...state, apiRespondent: {...state.apiRespondent, fetching: false, fetched: false, error: action.payload }}
      break;
    }

    // API_SAVE_SIGNATURE
    case API_SAVE_SIGNATURE_PENDING: {
      return {...state, apiSignature: {...state.apiSignature, fetching: true, fetched: false, error: null }}
      break;
    }
    case API_SAVE_SIGNATURE_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {...state.auth, accessToken: accessToken, client: headers.client, uid: headers.uid, user_id: headers.user_id },  
        apiSignature: {...state.apiSignature, fetching: false, fetched: true }
      }
      break;
    }
    case API_SAVE_SIGNATURE_REJECTED: {
      return {...state, apiSignature: {...state.apiSignature, fetching: false, fetched: false, error: action.payload }}
      break;
    }

    // RESET SUBJECT
    case RESET_SUBJECT: {
      return {...state, subject: {...state.subject, fetching: false, fetched: false, error:null}}
    }

    // FETCH SUBJECT
    case FETCH_SUBJECT_PENDING: {
      return {...state, subject: {...state.subject, fetching: true, fetched: false, error: null} }
      break;
    }
    case FETCH_SUBJECT_FULFILLED: {
      const data = action.payload.rows['_array'][0];
      return {...state, 
        subject: {...state.subject, fetching: false, fetched: true, data } 
      }
      break;
    }
    case FETCH_SUBJECT_REJECTED: {
      return {...state, subject: {...state.subject, fetching: false, error: action.payload} }
      break;
    }

    // CREATE SUBJECT
    case CREATE_SUBJECT_PENDING: {
      return {...state, subject: {...state.subject, fetching: true, fetched: false, error: null} }
      break;
    }
    case CREATE_SUBJECT_FULFILLED: {
      return {...state, subject: 
        {...state.subject, fetching: false, fetched: true, 
          data: {...action.formData, id: action.payload.insertId } 
        } 
      }
      break;
    }
    case CREATE_SUBJECT_REJECTED: {
      return {...state, subject: {...state.subject, fetching: false, error: action.payload} }
      break;
    }

    // UPDATE SUBJECT
    case UPDATE_SUBJECT_PENDING: {
      return {...state, subject: {...state.subject, fetching: true, fetched: false, error: null} }
      break;
    }
    case UPDATE_SUBJECT_FULFILLED: {
      return {...state, subject: 
        {...state.subject, fetching: false, fetched: true, 
          data: Object.assign( {}, state.subject.data, action.formData ) 
        } 
      }
      break;
    }
    case UPDATE_SUBJECT_REJECTED: {
      return {...state, subject: {...state.subject, fetching: false, error: action.payload} }
      break;
    }

   // API_CREATE_SUBJECT
    case API_CREATE_SUBJECT_PENDING: {
      return {...state, apiSubject: {...state.apiSubject, fetching: true, fetched: false, error: null }}
      break;
    }
    case API_CREATE_SUBJECT_FULFILLED: {
      const headers = action.payload.headers;
      const accessToken = (headers['access-token']) ? headers['access-token'] : state.auth.accessToken;
      return {...state, 
        auth: {...state.auth, accessToken: accessToken, client: headers.client, uid: headers.uid, user_id: headers.user_id }, 
        apiSubject: {...state.apiSubject, fetching: false, fetched: true, data: action.payload.data }
      }
      break;
    }
    case API_CREATE_SUBJECT_REJECTED: {
      return {...state, apiSubject: {...state.apiSubject, fetching: false, fetched: false, error: action.payload }}
      break;
    }

  default: 
    return state
  }
};

export default reducer;