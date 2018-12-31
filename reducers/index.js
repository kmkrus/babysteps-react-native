import { combineReducers } from 'redux';
//import { reducer as tokenRefresh } from 'redux-refresh-token';

import session from './session_reducer';
import registration from './registration_reducer';
import milestones from './milestones_reducer';
import babybook from './babybook_reducer';
import notifications from './notification_reducer';

import CONSTANTS from '../constants';

const appReducer = combineReducers({
  //tokenRefresh,
  session,
  registration,
  milestones,
  notifications,
  babybook,
});

export default (state, action) => {
  if (CONSTANTS.RESET_STATE) {
    console.log(' ###### Resetting State ######');
    state = undefined;
  }
  return appReducer(state, action);
};
