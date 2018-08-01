import { SQLite } from 'expo';
import axios from "axios";

import { _ } from 'lodash';

import { insertRows } from '../database/common';
import schema from '../database/milestones_schema.json';
import trigger_schema from '../database/milestone_triggers_schema.json';

import CONSTANTS from '../constants';

import {

  FETCH_MILESTONES_PENDING,
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED,

  RESET_API_MILESTONES,

  API_FETCH_MILESTONES_PENDING,
  API_FETCH_MILESTONES_FULFILLED,
  API_FETCH_MILESTONES_REJECTED,

  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED,

  FETCH_MILESTONE_CALENDAR_PENDING,
  FETCH_MILESTONE_CALENDAR_FULFILLED,
  FETCH_MILESTONE_CALENDAR_REJECTED,

  API_FETCH_MILESTONE_CALENDAR_PENDING,
  API_FETCH_MILESTONE_CALENDAR_FULFILLED,
  API_FETCH_MILESTONE_CALENDAR_REJECTED

} from './types';


const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};

export const resetApiMilestones =() => {
  return function (dispatch) {
     dispatch( Pending(RESET_API_MILESTONES) );
  }
}

export const fetchMilestones = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONES_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM milestones;', [],
          (_, response) => { dispatch( Response(FETCH_MILESTONES_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONES_REJECTED, error) ) }
        );
      })
    )
  };

};

// this fetches all milestone and related tables
export const apiFetchMilestones = () => {

  return function (dispatch) {
    dispatch( Pending(API_FETCH_MILESTONES_PENDING) );
   
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
        dispatch( Response(API_FETCH_MILESTONES_FULFILLED, response) )
      })
      .catch(function (error) {
         dispatch( Response(API_FETCH_MILESTONES_REJECTED, error) )
      });
    }) // return Promise

  } // return dispatch
}

export const fetchMilestoneGroups = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_GROUPS_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM milestone_groups;', [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_GROUPS_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_GROUPS_REJECTED, error) ) }
        );
      })
    )
  };

};

export const fetchMilestoneCalendar = () => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_CALENDAR_PENDING) );

    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM milestone_triggers INNER JOIN milestones ON milestone_triggers.milestone_id = milestones.id ORDER BY milestones.days_since_baseline;', [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_CALENDAR_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_CALENDAR_REJECTED, error) ) }
        );
      })
    )
  };

};

export const apiFetchMilestoneCalendar = (params) => {
  return function (dispatch) {
    
    dispatch( Pending(API_FETCH_MILESTONE_CALENDAR_PENDING) );

    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        responseType: 'json',
        baseURL: CONSTANTS.BASE_URL,
        url: '/milestone_calendars',
        params: params,
        headers: {
          "milestone_token": CONSTANTS.MILESTONE_TOKEN
        }
      })
      .then(function (response) {
        insertRows('milestone_triggers', trigger_schema.milestone_triggers, response.data) 
        dispatch( Response(API_FETCH_MILESTONE_CALENDAR_FULFILLED, response) )
      })
      .catch(function (error) {
        dispatch( Response(API_FETCH_MILESTONE_CALENDAR_REJECTED, error) )
      });
    }) // return Promise

  } // return dispatch
}