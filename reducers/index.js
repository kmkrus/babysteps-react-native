import { combineReducers } from 'redux';

import session from './session_reducer';
import registration from './registration_reducer';
import milestones from './milestones_reducer';

import CONSTANTS from '../constants';

const appReducer = combineReducers({
  session: session,
  registration: registration,
  milestones: milestones
});

export default (state, action) => {
  if (CONSTANTS.RESET_STATE) {
    state = undefined;
  } 
  return appReducer(state, action)
}
