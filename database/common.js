import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';

import forEach from 'lodash/forEach';

import CONSTANTS from '../constants';

const db = SQLite.openDatabase('babysteps.db');

export function tableNames() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type="table";`, [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject('Error retrieving table names'),
      );
    });
  });
}

export function createTable(name, schema) {
  db.transaction(tx => {
    let sql = `CREATE TABLE IF NOT EXISTS ${name} (`;
    Object.keys(schema.columns).forEach(column => {
      sql += `${column} ${schema.columns[column]}, `;
    });
    sql = sql.slice(0, -2);
    sql += ' );';

    tx.executeSql(
      sql, [],
      (_, rows) => console.log('** Execute ' + sql),
      (_, error) => console.log('*** Error in executing ' + sql),
    );
    schema.indexes.forEach(sql => {
      tx.executeSql(
        'CREATE INDEX IF NOT EXISTS ' + sql, [],
        (_, rows) => console.log('** Execute CREATE INDEX ' + sql),
        (_, error) => console.log('*** Error in executing CREATE INDEX ' + sql),
      );
    });
  });
}

export function insertRows(name, schema, data) {
  if (typeof data !== 'object') {
    console.log('*** Insert Failed: data is improper format: ', data);
    return;
  };
  db.transaction(tx => {
    // Clear table
    tx.executeSql(
      `DELETE FROM ${name}`,
      [],
      (_, rows) => console.log('** Delete rows from table ' + name),
      (_, error) => console.log('*** Error in deleting rows from table ' + name),
    );

    //Construct SQL
    let prefix = `INSERT INTO ${name} ( `;
    Object.keys(schema.columns).forEach(column => {
      prefix += `${column}, `;
    });
    prefix = `${prefix.slice(0, -2)} ) VALUES `;
    forEach(data, row => {
      const values = [];
      let sql = `${prefix} (`;
      Object.keys(schema.columns).forEach(column => {
        sql += ' ?,';
        // need to trap booleans
        if (typeof row[column] === typeof true) {
          values.push(row[column] ? 1 : 0);
        } else {
          values.push(row[column]);
        }
      });
      sql = sql.slice(0, -1);
      sql += ' )';
      tx.executeSql(
        sql,
        values,
        (_, rows) => console.log('** Execute ' + sql),
        (_, error) => console.log('*** Error in executing ' + error),
      );
    });
  });
}

export function dropTable(name) {
  db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS ' + name, [],
      (_, rows) => console.log('** Drop table ' + name),
      (_, error) => console.log('*** Error in dropping table ' + name),
    );
  });
}

export function createSessionRecord() {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO sessions (registration_state) VALUES (?);',
      ['none'],
      (_, rows) => console.log('** Add Session Record '),
      (_, error) => console.log('*** Error in creating session record '),
    );
  });
}

export function getApiUrl() {
  // https://docs.expo.io/versions/latest/distribution/release-channels
  if (__DEV__ || Constants.manifest === undefined) {
    return CONSTANTS.BASE_DEVELOPMENT_URL;
  }
  const baseAPIUrl = Constants.manifest.extra.baseAPIUrl;
  return baseAPIUrl;
}
