import { combineReducers } from 'redux';
import milestones from './milestones_reducer';
import registration from './registration_reducer';

export default combineReducers({
  milestones: milestones,
  registration: registration,
});