import { SQLite } from 'expo';
import axios from "axios";
import { _ } from 'lodash';

import CONSTANTS from '../constants';

import {
  FETCH_SESSION_PENDING,
  FETCH_SESSION_FULFILLED,
  FETCH_SESSION_REJECTED,

  UPDATE_SESSION_PENDING,
  UPDATE_SESSION_FULFILLED,
  UPDATE_SESSION_REJECTED
} from '../actions/types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, session={} ) => {
  return { type, payload, session }
};

export const fetchSession = () => {

  return function (dispatch) {

    dispatch( Pending(FETCH_SESSION_PENDING) )

    return (

      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM sessions LIMIT 1;', 
          [],
          (_, response) => { dispatch( Response(FETCH_SESSION_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_SESSION_REJECTED, error) ) }
        );
      })
      
    )
  }
}

export const updateSession = (data) => {

  return function (dispatch) {

    dispatch( Pending(UPDATE_SESSION_PENDING) )

    const keys = _.keys(data);
    const values = _.values(data);
    var updateSQL = []

    _.forEach( keys, (key) => {
      updateSQL.push( key + " = '" + data[key] + "'" )
    })

    return (

      db.transaction(tx => {
        tx.executeSql(
          'UPDATE sessions SET ' + updateSQL.join(', ') + ';', 
          [],
          (_, response) => { dispatch( Response(UPDATE_SESSION_FULFILLED, response, data) ) },
          (_, error) => { dispatch( Response(UPDATE_SESSION_REJECTED, error) ) }
        );
      })
      
    )
  }
}