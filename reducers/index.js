import { combineReducers } from 'redux';
import milestones from './milestones_reducer';
import milestoneGroups from './milestone_groups_reducer';

export default combineReducers({
  milestones: milestones,
  milestoneGroups: milestoneGroups,
});