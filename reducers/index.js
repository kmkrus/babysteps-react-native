import { combineReducers } from 'redux';
import milestones from './milestones_reducer';

export default combineReducers({
  milestones: milestones
});