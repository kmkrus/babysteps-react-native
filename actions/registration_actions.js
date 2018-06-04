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
  API_CREATE_USER_REJECTED,

  FETCH_RESPONDENT_PENDING,
  FETCH_RESPONDENT_FULFILLED,
  FETCH_RESPONDENT_REJECTED,

  CREATE_RESPONDENT_PENDING,
  CREATE_RESPONDENT_FULFILLED,
  CREATE_RESPONDENT_REJECTED,

  API_CREATE_RESPONDENT_PENDING,
  API_CREATE_RESPONDENT_FULFILLED,
  API_CREATE_RESPONDENT_REJECTED,

  FETCH_SUBJECT_PENDING,
  FETCH_SUBJECT_FULFILLED,
  FETCH_SUBJECT_REJECTED,

  CREATE_SUBJECT_PENDING,
  CREATE_SUBJECT_FULFILLED,
  CREATE_SUBJECT_REJECTED,

  API_CREATE_SUBJECT_PENDING,
  API_CREATE_SUBJECT_FULFILLED,
  API_CREATE_SUBJECT_REJECTED,

} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};

export const fetchRegistrationData = () => {
  // Thunk middleware knows how to handle functions.
  return function (dispatch) {
    
    fetchUser()
    .then( () => {
      fetchRespondent()
    })
    .then( () => {
      fetchSubject()
    })

  }
}

export const fetchUser = () => {
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
          },
          (_, error) => { 
            dispatch( Response(CREATE_USER_REJECTED, error) ) 
          }
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

export const fetchRespondent = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_RESPONDENT_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          `SELECT * FROM respondents LIMIT 1;`, [],
          (_, response) => { dispatch( Response(FETCH_RESPONDENT_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_RESPONDENT_REJECTED, error) ) }
        );
      })
    )
  };

};

export const createRespondent = (respondent) => {
  return function (dispatch) {

    dispatch( Pending(CREATE_RESPONDENT_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 'DELETE FROM respondents', [], 
          (_, rows) => console.log('** Clear respondents table'), 
          (_, error) => console.log('*** Error in clearing respondents table')
        );
        const sql = 'INSERT INTO respondents ( \
          respondent_type, \
          first_name, \
          last_name, \
          middle_name, \
          address_1, \
          address_2, \
          city, \
          state, \
          zip_code, \
          country_code, \
          email, \
          home_phone, \
          other_phone, \
          date_of_birth, \
          drivers_license_number, \
          marital_status, \
          weight, \
          height \
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
        const values = [
          respondent.respondent_type,
          respondent.first_name,
          respondent.last_name,
          respondent.middle_name,
          respondent.address_1,
          respondent.address_2,
          respondent.city,
          respondent.state,
          respondent.zip_code,
          'USA',
          respondent.email,
          respondent.home_phone,
          respondent.other_phone,
          respondent.date_of_birth,
          respondent.drivers_license_number,
          respondent.marital_status,
          respondent.weight,
          respondent.height
        ]
        tx.executeSql( sql, values,
          (_, response) => { 
            dispatch( Response(CREATE_RESPONDENT_FULFILLED, response, respondent) );
          },
          (_, error) => { 
            dispatch( Response(CREATE_RESPONDENT_REJECTED, error) ) 
          }
        );
      })
    )
  };
}

export const fetchSubject = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_SUBJECT_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          `SELECT * FROM subjects LIMIT 1;`, [],
          (_, response) => { dispatch( Response(FETCH_SUBJECT_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_SUBJECT_REJECTED, error) ) }
        );
      })
    )
  };

};

export const createSubject = (subject) => {
 return function (dispatch) {

    dispatch( Pending(CREATE_SUBJECT_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 'DELETE FROM subjects', [], 
          (_, rows) => console.log('** Clear subjects table'), 
          (_, error) => console.log('*** Error in clearing subjects table')
        );
        const sql = 'INSERT INTO subjects ( \
          first_name, \
          last_name, \
          middle_name, \
          gender, \
          conception_method, \
          expected_date_of_birth, \
          date_of_birth, \
          days_premature \
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
        const values = [
          subject.first_name,
          subject.last_name,
          subject.middle_name,
          subject.gender,
          subject.conception_method,
          subject.expected_date_of_birth,
          subject.date_of_birth,
          subject.days_premature
        ]
        tx.executeSql( sql, values,
          (_, response) => { 
            dispatch( Response(CREATE_SUBJECT_FULFILLED, response, subject) );
          },
          (_, error) => { 
            dispatch( Response(CREATE_SUBJECT_REJECTED, error) ) 
          }
        );
      })
    )
  };
}