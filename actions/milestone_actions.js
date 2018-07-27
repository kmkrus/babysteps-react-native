import { SQLite } from 'expo';
import axios from "axios";

import { _ } from 'lodash';

import { insertRows } from '../database/common';
import schema from '../database/milestones_schema.json';

import CONSTANTS from '../constants';

import {

  FETCH_MILESTONE_GROUPS_PENDING,
  FETCH_MILESTONE_GROUPS_FULFILLED,
  FETCH_MILESTONE_GROUPS_REJECTED,

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

export const milestonesTable = (type, payload) => ({ type, payload })

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
        insertRows('milestone_triggers', schema['milestone_triggers'], response.data) 
        dispatch( Response(API_FETCH_MILESTONE_CALENDAR_FULFILLED, response) )
      })
      .catch(function (error) {
        dispatch( Response(API_FETCH_MILESTONE_CALENDAR_REJECTED, error) )
      });
    }) // return Promise

  } // return dispatch
}