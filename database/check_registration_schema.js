import {
  tableNames,
  createTable,
  dropTable,
  createSessionRecord,
} from './common';

import CONSTANTS from '../constants';
import schema from './registration_schema.json';

const checkRegistrationSchema = () => {
  console.log('checkRegistrationSchema');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  if (CONSTANTS.DROP_REGISTRATION_TABLES) {
    tables.forEach(name => {
      dropTable(name);
    });
  }

  return new Promise(resolve => {
    tableNames().then(result => {
      return new Promise(resolve => {
        // list of tables in SQLite
        const existing_tables = eval(result).map(a => a.name);
        // create for missing tables
        tables.forEach(name => {
          if (!existing_tables.includes(name)) {
            createTable(name, schema[name]);
            if (name === 'sessions') {
              // need a session record to initialize app
              createSessionRecord();
            }
          }
        });
        resolve(true);
      }); // return Promise
    });
    resolve(true);
  }); // return Promise
};

export default checkRegistrationSchema;
