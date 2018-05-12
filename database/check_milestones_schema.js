import axios from "axios";
import { 
  tableNames, 
  createTable,
  insertRows,
  dropTable
} from './common';
import CONSTANTS from '../constants';
import schema from './milestones_schema.json';

const checkMilestonesSchema = () => {
  console.log('checkMilestonesSchema function');

  // list of tables from schema
  const tables = Object.keys(schema);

  // drop tables for testing
  if (CONSTANTS.DROP_MILESTONE_TABLES) {
    tables.forEach( function(name) {
      dropTable(name);
    });
  }

  return new Promise((resolve, reject) => {

    tableNames()
    .then( (result) => {
      console.log('add milestone tables if needed')
      return new Promise((resolve, reject) => {
      
        // list of tables in SQLite
        const existing_tables = eval(result).map( a => a.name );
        var rebuild = false
        
        // create for missing tables
        tables.forEach( function(name) {
          if (!existing_tables.includes(name)) {
            createTable(name, schema[name]);
            rebuild = true
          }
        })
        resolve(rebuild);
      }) // return Promise
    })
    .then( (rebuild) => {
      if ( CONSTANTS.REBUILD_MILESTONES || rebuild ) {
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

export default checkMilestonesSchema;
