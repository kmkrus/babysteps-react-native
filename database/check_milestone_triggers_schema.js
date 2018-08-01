import { 
  tableNames, 
  createTable,
  dropTable
} from './common';
import CONSTANTS from '../constants';
import schema from './milestone_triggers_schema.json';

const checkMilestoneTriggersSchema = () => {
  console.log('checkMilestoneTriggersSchema');

  // drop tables for testing
  if (CONSTANTS.DROP_MILESTONE_TRIGGERS_TABLE) {
    dropTable('milestone_triggers');
  }

  return new Promise((resolve, reject) => {

    tableNames()
    .then( (result) => {
      return new Promise((resolve, reject) => {
      
        // list of tables in SQLite
        const existing_tables = eval(result).map( a => a.name );
        
        // create for missing table
        if (!existing_tables.includes('milestone_triggers')) {
          createTable('milestone_triggers', schema['milestone_triggers']);
        }
        resolve(true);
      }) // return Promise
    })
    
    resolve(true)
  }); // return Promise
};

export default checkMilestoneTriggersSchema;
