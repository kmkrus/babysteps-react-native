import { SQLite } from 'expo';

import { _ } from 'lodash';

import CONSTANTS from '../constants';

import {

  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED,

} from './types';


const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};

export const milestonesTable = (type, payload) => ({ type, payload })

export const fetchMilestoneGroups = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_GROUPS_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM milestone_groups;', [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_GROUPS_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_GROUPS_REJECTED, error) ) }
        );
      })
    )
  };

};