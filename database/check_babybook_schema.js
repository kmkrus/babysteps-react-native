import axios from "axios";
import { 
  tableNames, 
  createTable, 
  dropTable
} from './common';

import CONSTANTS from '../constants';
import schema from './babybook_schema.json';

const checkBabyBookSchema = () => {
  console.log('checkBabyBookSchema');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  if (CONSTANTS.DROP_BABYBOOK_TABLES) {
    tables.forEach( function(name) {
      dropTable(name);
    });
  }

  return new Promise( (resolve, reject) => {

    tableNames()
    .then( (result) => {
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
    resolve(true);
  }) // return Promise ;

};

export default checkBabyBookSchema;
