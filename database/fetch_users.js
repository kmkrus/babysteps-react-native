import { SQLite } from 'expo';

const db = SQLite.openDatabase('babysteps.db');

const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
        `SELECT * FROM users;`, [],
        (_, response) =>resolve( response.rows ),
        (_, err) => reject( err )
      );
    });
  });
};

export default fetchUsers; 