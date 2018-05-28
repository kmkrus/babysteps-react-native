import { SQLite } from 'expo';

const db = SQLite.openDatabase('babysteps.db');

export function tableNames() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql( 
        `SELECT name FROM sqlite_master WHERE type="table";`, [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject('Error retrieving table names')
      );
    });
  });    
};

export function createTable(name, schema) {
  db.transaction(tx => {
    sql = 'CREATE TABLE IF NOT EXISTS ' + name + ' ( '
    Object.keys(schema.columns).forEach( function(column) {
      sql = sql + column + ' ' + schema.columns[column] + ', '
    })
    sql = sql.slice(0, -2)
    sql = sql + ' );'

    tx.executeSql( sql, [], 
      (_, rows) => console.log('** Execute ' + sql), 
      (_, error) => console.log('*** Error in executing ' + sql)
    );
    schema.indexes.forEach( function(sql) {
      tx.executeSql( 'CREATE INDEX IF NOT EXISTS ' + sql, [], 
        (_, rows) => console.log('** Execute CREATE INDEX ' + sql), 
        (_, error) => console.log('*** Error in executing CREATE INDEX ' + sql)
      );
    });
  });
};

export function insertRows(name, schema, data) {
  db.transaction(tx => {
    // Clear table
    tx.executeSql( 'DELETE FROM ' + name, [], 
      (_, rows) => console.log('** Delete rows from table ' + name), 
      (_, error) => console.log('*** Error in deleting rows from table ' + name)
    );
    
    //Construct SQL
    prefix = 'INSERT INTO ' + name + ' ( '
    Object.keys(schema.columns).forEach( function(column) {
      prefix = prefix + column + ', '
    })
    prefix = prefix.slice(0, -2)
    prefix = prefix + ' ) VALUES '

    data.forEach( function(row) {
      values = []
      sql = prefix 
      sql = sql + '('
      Object.keys(schema.columns).forEach( function(column) {
        sql = sql + ' ?,'
        // need to trap booleans
        if (typeof(row[column]) == typeof(true)) {
          values.push( row[column] ? 1 : 0)
        } else {
          values.push( row[column] )
        }
      })
      sql = sql.slice(0, -1)
      sql = sql + ' )'
      tx.executeSql( sql, values, 
        (_, rows) => console.log('** Execute ' + sql), 
        (_, error) => console.log('*** Error in executing ' + sql)
      )
    });
   
  });
}

export function dropTable(name) {
  db.transaction(tx => {
    tx.executeSql( 'DROP TABLE IF EXISTS ' + name, [], 
      (_, rows) => console.log('** Drop table ' + name), 
      (_, error) => console.log('*** Error in dropping table ' + name)
    );
  });
}
