import { SQLite } from 'expo';

const db = SQLite.openDatabase('babysteps.db');

const fetchMilestoneGroups = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
        `SELECT * FROM milestone_groups ORDER BY study_id, position`, [],
        (_, response) =>resolve( response.rows ),
        (_, err) => reject( 'Error retrieving milestone groups' )
      );
    });
  });
};

export default fetchMilestoneGroups; 