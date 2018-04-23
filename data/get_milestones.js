import { SQLite } from 'expo';
import schema from './schema.json';

const db = SQLite.openDatabase('babysteps.db');

getMilestones();

function getMilestones() {
  console.log('getMilestones function');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  //tables.forEach( function(name) {
    //dropTable(name);
  //});

  tableNames().then( (result) => {
    // list of tables in SQLite
    const existing_tables = eval(result).map( a => a.name );
    
    // create for missing tables
    tables.forEach( function(name) {
      if (!existing_tables.includes(name)) {
        createTable(schema[name]);
      }
    });
  });

  milestoneList().then( (result) => {
    console.log(result);
  });

}

function milestoneList() {
  console.log('milestoneList function');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
        `SELECT * FROM milestone_groups 
          INNER JOIN milestones ON milestones.milestone_group_id = milestone_groups.id 
          INNER JOIN tasks ON tasks.milestone_id = milestones.id;`, [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject('Error retrieving milestones')
      );
    });
  });
};

function tableNames() {
  console.log('tableNames function');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( `SELECT name FROM sqlite_master WHERE type="table";`, [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject('Error retrieving table names')
      );
    });
  });    
};

function createTable(table) {
  db.transaction(tx => {
    tx.executeSql( table.sql, [], 
      (_, rows) => console.log('** Execute ' + table.sql), 
      (_, error) => console.log('*** Error in executing ' + table.sql)
    );
    table.indexes.forEach( function(sql) {
      //console.log(sql);
      tx.executeSql( sql, [], 
        (_, rows) => console.log('** Execute ' + sql), 
        (_, error) => console.log('*** Error in executing ' + sql)
      );
    });
  });
};

function dropTable(name) {
  db.transaction(tx => {
    tx.executeSql( 'DROP TABLE IF EXISTS ' + name, [], 
      (_, rows) => console.log('** Drop table ' + name), 
      (_, error) => console.log('*** Error in dropping table ' + name)
    );
  });
}

