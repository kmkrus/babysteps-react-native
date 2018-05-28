import { SQLite } from 'expo';
import axios from "axios";
import CONSTANTS from '../constants';

import {
  FETCH_USER_PENDING,
  FETCH_USER_FULFILLED,
  FETCH_USER_REJECTED,
  CREATE_USER_PENDING,
  CREATE_USER_FULFILLED,
  CREATE_USER_REJECTED,
  API_CREATE_USER_PENDING,
  API_CREATE_USER_FULFILLED,
  API_CREATE_USER_REJECTED
} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, user={} ) => {
  return { type, payload, user }
};

export const fetchUser = () => {
  // Thunk middleware knows how to handle functions.
  return function (dispatch) {
    
    dispatch( Pending(FETCH_USER_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          `SELECT * FROM users LIMIT 1;`, [],
          (_, response) => { dispatch( Response(FETCH_USER_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_USER_REJECTED, error) ) }
        );
      })
    )
  };

};

export const createUser = (user) => {
  return function (dispatch) {

    dispatch( Pending(CREATE_USER_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 'DELETE FROM users', [], 
          (_, rows) => console.log('** Clear users table'), 
          (_, error) => console.log('*** Error in clearing users table')
        );
        tx.executeSql( 
          'INSERT INTO users (api_id, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?);', 
          [user.api_id, user.email, user.password, user.first_name, user.last_name],
          (_, response) => { 
            dispatch( Response(CREATE_USER_FULFILLED, response, user) );
            dispatch( Pending(FETCH_USER_PENDING) );
          },
          (_, error) => { dispatch( Response(CREATE_USER_REJECTED, error) ) }
        );

        tx.executeSql( 
          `SELECT * FROM users LIMIT 1;`, [],
          (_, response) => { dispatch( Response(FETCH_USER_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_USER_REJECTED, error) ) }
        );
      })
    )
  };
};

export const apiCreateUser = (user) => {
 
  return function (dispatch) {

    dispatch( Pending(API_CREATE_USER_PENDING) );

    return ( 
      
      axios({
        method: 'POST',
        responseType: 'json',
        baseURL: CONSTANTS.BASE_URL,
        url: '/user_registration',
        data: user,
      })
      .then(function (response) {
        dispatch( Response(API_CREATE_USER_FULFILLED, response, user) );
      })
      .catch(function (error) {
        dispatch( Response(API_CREATE_USER_REJECTED, error) );
      })
    
    ) 
  }
};