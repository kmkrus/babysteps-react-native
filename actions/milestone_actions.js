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
  API_FETCH_MILESTONE_CALENDAR_REJECTED,

  FETCH_MILESTONE_TASKS_PENDING,
  FETCH_MILESTONE_TASKS_FULFILLED,
  FETCH_MILESTONE_TASKS_REJECTED,

  FETCH_MILESTONE_SECTIONS_PENDING,
  FETCH_MILESTONE_SECTIONS_FULFILLED,
  FETCH_MILESTONE_SECTIONS_REJECTED,

  RESET_MILESTONE_QUESTIONS,

  FETCH_MILESTONE_QUESTIONS_PENDING,
  FETCH_MILESTONE_QUESTIONS_FULFILLED,
  FETCH_MILESTONE_QUESTIONS_REJECTED,

  RESET_MILESTONE_CHOICES,

  FETCH_MILESTONE_CHOICES_PENDING,
  FETCH_MILESTONE_CHOICES_FULFILLED,
  FETCH_MILESTONE_CHOICES_REJECTED,

} from './types';


const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};

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

export const resetApiMilestones =() => {
  return function (dispatch) {
     dispatch( Pending(RESET_API_MILESTONES) );
  }
}

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

export const fetchMilestoneTasks = ( params={} ) => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_TASKS_PENDING) );

    var sql = 'SELECT ts.*, mg.position AS milestone_group_position, ms.milestone_group_id, ms.position AS milestone_position, ms.title AS milestone_title FROM tasks AS ts'
    sql = sql + ' INNER JOIN milestones AS ms ON ms.id = ts.milestone_id'
    sql = sql + ' INNER JOIN milestone_groups AS mg ON mg.id = ms.milestone_group_id'
    sql = sql + ' WHERE mg.visible = 1 AND ms.always_visible = 1'
    sql = sql + ' ORDER BY milestone_group_position, milestone_position, position;'
    
    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_TASKS_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_TASKS_REJECTED, error) ) }
        );
      })
    )
  };

};

export const fetchMilestoneSections = ( params={} ) => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_SECTIONS_PENDING) );

    var sql = 'SELECT * FROM sections'
    sql = sql + ' WHERE sections.task_id = ' + params['task_id']
    sql = sql + ' ORDER BY sections.position;'

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_SECTIONS_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_SECTIONS_REJECTED, error) ) }
        );
      })
    )
  };

};

export const resetMilestoneQuestions =() => {
  return function (dispatch) {
     dispatch( Pending(RESET_MILESTONE_QUESTIONS) );
  }
}

export const fetchMilestoneQuestions = ( params={} ) => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_QUESTIONS_PENDING) );

    var sql = 'SELECT qs.*, ops.input_type, ops.rn_input_type FROM questions AS qs'
    sql = sql + ' INNER JOIN option_groups AS ops ON qs.option_group_id = ops.id'
    sql = sql + ' WHERE qs.section_id = ' + params['section_id']
    sql = sql + ' ORDER BY qs.position;'

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_QUESTIONS_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_QUESTIONS_REJECTED, error) ) }
        );
      })
    )
  };

};

export const resetMilestoneChoices =() => {
  return function (dispatch) {
     dispatch( Pending(RESET_MILESTONE_CHOICES) );
  }
}

export const fetchMilestoneChoices = ( params={} ) => {
  return function (dispatch) {
    
    dispatch( Pending(FETCH_MILESTONE_CHOICES_PENDING) );

    var question_ids = `( ${ params['question_ids'].join(', ') } )`

    var sql = 'SELECT * FROM choices'
    sql = sql + ' WHERE question_id IN ' + question_ids 
    sql = sql + ' ORDER BY question_id, position;'

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => { dispatch( Response(FETCH_MILESTONE_CHOICES_FULFILLED, response) ) },
          (_, error) => { dispatch( Response(FETCH_MILESTONE_CHOICES_REJECTED, error) ) }
        );
      })
    )
  };

};