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

} from '../actions/types';

import { _ } from 'lodash';

const initialState = {
  entries: {
    fetching: false,
    fetched: false,
    error: null,
    data: [],
  }
};

const reducer = (state=initialState, action) => {
  switch (action.type) {

    case RESET_BABYBOOK_ENTRIES: {
      return {...state, entries: {...state.entries, fetching: false, fetched: false, error: null, data: [] }}
    }

    case FETCH_BABYBOOK_ENTRIES_PENDING: {
      return {...state, entries: { ...state.entries, fetching: true, fetched: false, error: null }}
      break;
    }
    case FETCH_BABYBOOK_ENTRIES_FULFILLED: {
      var data = action.payload.rows['_array'];
      _.forEach(data, function(item) {
        item.id = String(item.id) // key needs to be string for SideSwipe
      })
      data = _.orderBy(data, ['created_at'], ['desc'])
      return {...state, entries: { ...state.entries, fetching: false, fetched: true, data: data }}
      break;
    }
    case FETCH_BABYBOOK_ENTRIES_REJECTED: {
      return {...state, entries: { ...state.entries, fetching: false, error: action.payload }}
      break;
    }

    case CREATE_BABYBOOK_ENTRY_PENDING: {
      return {...state, entries: { ...state.entries, fetching: true, fetched: false, error: null }}
      break;
    }
    case CREATE_BABYBOOK_ENTRY_FULFILLED: {
      return {...state, entries: { ...state.entries, fetching: false, fetched: true }}
      break;
    }
    case CREATE_BABYBOOK_ENTRY_REJECTED: {
      return {...state, entries: { ...state.entries, fetching: false, error: action.payload}}
      break;
    }

    case UPDATE_BABYBOOK_ENTRY_PENDING: {
      return {...state, entries: { ...state.entries, fetching: true, fetched: false, error: null }}
      break;
    }
    case UPDATE_BABYBOOK_ENTRY_FULFILLED: {
      return {...state, entries: { ...state.entries, fetching: false, fetched: true }}
      break;
    }
    case UPDATE_BABYBOOK_ENTRY_REJECTED: {
      return {...state, entries: { ...state.entries, fetching: false, error: action.payload}}
      break;
    }

  default: 
    return state
  }
};

export default reducer;