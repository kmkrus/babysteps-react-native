import { SQLite } from 'expo';
import axios from "axios";

import { _ } from 'lodash';

import CONSTANTS from '../constants';

import {

  FETCH_BABYBOOK_ENTRIES_PENDING,
  FETCH_BABYBOOK_ENTRIES_FULFILLED,
  FETCH_BABYBOOK_ENTRIES_REJECTED,

  CREATE_BABYBOOK_ENTRY_PENDING,
  CREATE_BABYBOOK_ENTRY_FULFILLED,
  CREATE_BABYBOOK_ENTRY_REJECTED,

  UPDATE_BABYBOOK_ENTRY_PENDING,
  UPDATE_BABYBOOK_ENTRY_FULFILLED,
  UPDATE_BABYBOOK_ENTRY_REJECTED,

} from '../actions/types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};

export const fetchBabyBookEntries = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_BABYBOOK_ENTRIES_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM babybook_entries;', [],
          (_, response) => { dispatch( Response(FETCH_BABYBOOK_ENTRIES_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_BABYBOOK_ENTRIES_REJECTED, error) ) }
        );
      })
    )
  };

};

export const createBabyBookEntry = (data, image) => {

  return function (dispatch) {

    dispatch( Pending(CREATE_BABYBOOK_ENTRY_PENDING) );

    const fileName = image.uri.split('/').pop()
    const newDir = Expo.FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY 
    const newUri = newDir + fileName
    
    data = {...data, uri: newUri, file_type: image.type }
    
    return (

      Expo.FileSystem.copyAsync({from: image.uri, to: newDir})
      .then( () => { 
        db.transaction(tx => {
          tx.executeSql( 
            'INSERT INTO babybook_entries (title, detail, uri, file_type, created_at) VALUES (?, ?, ?, ?, ?);', 
            [data.title, data.detail, data.uri, data.file_type, data.created_at],
            (_, response) => { 
              dispatch( Response(CREATE_BABYBOOK_ENTRY_FULFILLED, response, data) );
            },
            (_, error) => { 
              dispatch( Response(CREATE_BABYBOOK_ENTRY_REJECTED, error) ) 
            }
          );
        })
      })
      .catch( (error) => { 
        dispatch( Response(CREATE_BABYBOOK_ENTRY_REJECTED, error) ) 
      }) 
   
    ) // return
  } // dispatch
};

export const updateBabyBookEntry = (id, data, image=null) => {
  return function (dispatch) {

    dispatch( Pending(UPDATE_BABYBOOK_ENTRY_PENDING) );

    delete data.id 
    
    const keys = _.keys(data);
    const values = _.values(data);
    var updateSQL = []

    _.forEach( keys, (key) => {
      updateSQL.push( key + " = '" + data[key] + "'" )
    })

    updateSQL = 'UPDATE babybook_entries SET ' + updateSQL.join(', ') + ' WHERE babybook_entries.id = ' + id +' ;'

    return (
      db.transaction(tx => {
        tx.executeSql( updateSQL, [],
          (_, response) => { 
            dispatch( Response(UPDATE_BABYBOOK_ENTRY_FULFILLED, response, data) );
          },
          (_, error) => { 
            dispatch( Response(UPDATE_BABYBOOK_ENTRY_REJECTED, error) ) 
          }
        );
      })
    )
  };
}