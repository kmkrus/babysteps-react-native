import { SQLite } from 'expo';
import axios from 'axios';
import url from 'url';

import { _ } from 'lodash';

import { insertRows } from '../database/common';
import { setNotifications } from '../notifications';
import schema from '../database/milestones_schema.json';
import trigger_schema from '../database/milestone_triggers_schema.json';

import CONSTANTS from '../constants';

import {

  SHOW_MOMENTARY_ASSESSMENT,
  HIDE_MOMENTARY_ASSESSMENT,

  FETCH_MOMENTARY_ASSESSMENT_PENDING,
  FETCH_MOMENTARY_ASSESSMENT_FULFILLED,
  FETCH_MOMENTARY_ASSESSMENT_REJECTED,

} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = type => {
  return { type };
};

const Response = (type, payload, formData = {}) => {
  return { type, payload, formData };
};

export const showMomentaryAssessment = data => {
  return dispatch => {
    dispatch(Response(SHOW_MOMENTARY_ASSESSMENT, data));
  };
};

export const hideMomentaryAssessment = (data, formData) => {
  return dispatch => {
    dispatch(Response(HIDE_MOMENTARY_ASSESSMENT, data, formData));
  };
};

export const fetchMomentaryAssessment = params => {
  return dispatch => {
    dispatch( Pending(FETCH_MOMENTARY_ASSESSMENT_PENDING) );
    let sql = `SELECT 
        ts.*, 
        sc.id AS section_id, 
        qn.id AS question_id, 
        qn.title AS title, 
        ch.id AS choice_id 
      FROM tasks AS ts`;
    sql += ' INNER JOIN sections AS sc ON sc.task_id = ts.id';
    sql += ' INNER JOIN questions AS qn ON qn.section_id = sc.id';
    sql += ' INNER JOIN choices AS ch ON ch.question_id = qn.id';
    sql += ` WHERE ts.id = ${params.task_id}`;

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MOMENTARY_ASSESSMENT_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MOMENTARY_ASSESSMENT_REJECTED, error))}
        );
      })
    );
  };
};