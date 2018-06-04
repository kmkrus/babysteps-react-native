import { combineReducers } from 'redux';
import session from './session_reducer';
import registration from './registration_reducer';
import milestones from './milestones_reducer';

const appReducer = combineReducers({
  session: session,
  registration: registration,
  milestones: milestones,
});

export default (state, action) => {
  // uncomment to reset redux state
  //state = undefined; 
  return appReducer(state, action)
}
