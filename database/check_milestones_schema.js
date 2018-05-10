import { SQLite } from 'expo';
import axios from "axios";
import CONSTANTS from '../constants';
import schema from './milestones_schema.json';

const db = SQLite.openDatabase('babysteps.db');

const checkMilestonesSchema = () => {
  console.log('checkMilestonesSchema function');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  if (CONSTANTS.DROP_TABLES) {
    tables.forEach( function(name) {
      dropTable(name);
    });
  }

  return new Promise((resolve, reject) => {

    tableNames()
    .then( (result) => {
      console.log('add tables if needed')
      return new Promise((resolve, reject) => {
      
        // list of tables in SQLite
        const existing_tables = eval(result).map( a => a.name );
        
        // create for missing tables
        tables.forEach( function(name) {
          if (!existing_tables.includes(name)) {
            createTable(name, schema[name]);
          }
        })
        resolve(true);
      }) // return Promise
    })
    .then( (result) => {
      if (CONSTANTS.REBUILD_MILESTONES) {
        console.log('rebuild milestones')
        
        return new Promise((resolve, reject) => {
          axios({
            method: 'get',
            responseType: 'json',
            baseURL: CONSTANTS.BASE_URL,
            url: '/milestones',
            headers: {
              "milestone_token": CONSTANTS.MILESTONE_TOKEN
            }
          })
          .then(function (response) {
            Object.keys(response.data).map( function(name) {
              insertRows(name, schema[name], response.data[name])
            })
          })
          .catch(function (error) {
              console.log(error)
          });
        }) // return Promise

      } // if REBUILD_MILESTONES
    }); // then
    resolve(true)
  }); // return Promise
};

function tableNames() {
  console.log('tableNames function');
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

function createTable(name, schema) {
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

function insertRows(name, schema, data) {
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

function dropTable(name) {
  db.transaction(tx => {
    tx.executeSql( 'DROP TABLE IF EXISTS ' + name, [], 
      (_, rows) => console.log('** Drop table ' + name), 
      (_, error) => console.log('*** Error in dropping table ' + name)
    );
  });
}

export default checkMilestonesSchema;
