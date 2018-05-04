import { SQLite } from 'expo';
import {
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED
} from './types';

const db = SQLite.openDatabase('babysteps.db');

export function fetchMilestones(dispatch) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
        `SELECT * FROM milestone_groups 
          INNER JOIN milestones ON milestones.milestone_group_id = milestone_groups.id 
          INNER JOIN tasks ON tasks.milestone_id = milestones.id;`, [],
        (_, response) => resolve( response.rows._array),
        (_, err) => reject(err)
      )
    }) // db.transaction
  });
}