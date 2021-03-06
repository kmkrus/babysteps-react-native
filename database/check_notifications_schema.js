import { tableNames, createTable, dropTable } from './common';
import CONSTANTS from '../constants';
import schema from './notifications_schema.json';

const checkNotificationsSchema = () => {
  console.log('checkNotificationsSchema');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  if (CONSTANTS.DROP_NOTIFICATIONS_TABLE) {
    tables.forEach(name => {
      dropTable(name);
    });
  }

  return new Promise((resolve, reject) => {
    tableNames().then(result => {
      return new Promise((resolve, reject) => {
        // list of tables in SQLite
        const existing_tables = eval(result).map(a => a.name);
        // create for missing tables
        tables.forEach(name => {
          if (!existing_tables.includes(name)) {
            createTable(name, schema[name]);
          }
        });
        resolve(true);
      }); // return Promise
    });
    resolve(true);
  }); // return Promise
};

export default checkNotificationsSchema;