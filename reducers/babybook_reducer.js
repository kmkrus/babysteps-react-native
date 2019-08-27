import {
  RESET_BABYBOOK_ENTRIES,

  FETCH_BABYBOOK_ENTRIES_PENDING,
  FETCH_BABYBOOK_ENTRIES_FULFILLED,
  FETCH_BABYBOOK_ENTRIES_REJECTED,

  CREATE_BABYBOOK_ENTRY_PENDING,
  CREATE_BABYBOOK_ENTRY_FULFILLED,
  CREATE_BABYBOOK_ENTRY_REJECTED,

  UPDATE_BABYBOOK_ENTRY_PENDING,
  UPDATE_BABYBOOK_ENTRY_FULFILLED,
  UPDATE_BABYBOOK_ENTRY_REJECTED,

  API_CREATE_BABYBOOK_ENTRY_PENDING,
  API_CREATE_BABYBOOK_ENTRY_FULFILLED,
  API_CREATE_BABYBOOK_ENTRY_REJECTED,

  API_SYNC_BABYBOOK_ENTRIES_PENDING,
  API_SYNC_BABYBOOK_ENTRIES_FULFILLED,
  API_SYNC_BABYBOOK_ENTRIES_REJECTED,

} from '../actions/types';

import { _ } from 'lodash';

const initialState = {
  entries: {
    fetching: false,
    fetched: false,
    error: null,
    data: [],
  },
  entry: {
    fetching: false,
    fetched: false,
    error: null,
    data: [],
  },
  api_entry: {
    fetching: false,
    fetched: false,
    error: null,
    data: [],
  },
  api_entries: {
    fetching: false,
    fetched: false,
    error: null,
    data: [],
  },
};

const reducer = (state = initialState, action, data=[]) => {
  switch (action.type) {

    case RESET_BABYBOOK_ENTRIES: {
      return {
        ...state,
        entries: {
          ...state.entries,
          fetching: false,
          fetched: false,
          error: null,
          data: [],
        },
        entry: {
          ...state.entry,
          fetching: false,
          fetched: false,
          error: null,
          data: [],
        },
        api_entry: {
          ...state.api_entry,
          fetching: false,
          fetched: false,
          error: null,
          data: [],
        },
        api_entries: {
          ...state.api_entries,
          fetching: false,
          fetched: false,
          error: null,
          data: [],
        },
      };
    }

    case FETCH_BABYBOOK_ENTRIES_PENDING: {
      return {
        ...state,
        entries: {
          ...state.entries,
          fetching: true,
          fetched: false,
          error: null,
        },
      };
    }
    case FETCH_BABYBOOK_ENTRIES_FULFILLED: {
      let data = action.payload.rows['_array'];
      _.forEach(data, item => {
        item.id = String(item.id); // key needs to be string for SideSwipe
      });
      data = _.orderBy(data, ['created_at'], ['desc']);
      return {
        ...state,
        entries: {
          ...state.entries,
          fetching: false,
          fetched: true,
          data,
        },
      };
    }
    case FETCH_BABYBOOK_ENTRIES_REJECTED: {
      return {
        ...state,
        entries: {
          ...state.entries,
          fetching: false,
          error: action.payload,
        },
      };
    }

    case CREATE_BABYBOOK_ENTRY_PENDING: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: true,
          fetched: false,
          error: null,
          data: [],
        },
      };
    }
    case CREATE_BABYBOOK_ENTRY_FULFILLED: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: false,
          fetched: true,
          error: null,
          data,
        },
      };
    }
    case CREATE_BABYBOOK_ENTRY_REJECTED: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    case UPDATE_BABYBOOK_ENTRY_PENDING: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: true,
          fetched: false,
          error: null,
        },
      };
    }
    case UPDATE_BABYBOOK_ENTRY_FULFILLED: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: false,
          fetched: true,
          error: null,
          data,
        },
      };
    }
    case UPDATE_BABYBOOK_ENTRY_REJECTED: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    case API_CREATE_BABYBOOK_ENTRY_PENDING: {
      return {
        ...state,
        api_entry: {
          ...state.api_entry,
          fetching: true,
          fetched: false,
          error: null,
        },
      };
    }
    case API_CREATE_BABYBOOK_ENTRY_FULFILLED: {
      return {
        ...state,
        api_entry: {
          ...state.api_entry,
          fetching: false,
          fetched: true,
          error: null,
        },
      };
    }
    case API_CREATE_BABYBOOK_ENTRY_REJECTED: {
      return {
        ...state,
        api_entry: {
          ...state.api_entry,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    case API_SYNC_BABYBOOK_ENTRIES_PENDING: {
      return {
        ...state,
        api_entries: {
          ...state.api_entries,
          fetching: true,
          fetched: false,
          error: null,
        },
      };
    }
    case API_SYNC_BABYBOOK_ENTRIES_FULFILLED: {
      return {
        ...state,
        api_entries: {
          ...state.api_entries,
          fetching: false,
          fetched: true,
          error: null,
          data: action.payload,
        },
      };
    }
    case API_SYNC_BABYBOOK_ENTRIES_REJECTED: {
      return {
        ...state,
        api_entries: {
          ...state.api_entries,
          fetching: false,
          fetched: false,
          error: action.payload,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
