import { SQLite } from 'expo';
import moment from 'moment';

import { setNotifications, deleteNotifications } from '../notifications';

import {
  SHOW_MOMENTARY_ASSESSMENT,
  HIDE_MOMENTARY_ASSESSMENT,

  FETCH_MOMENTARY_ASSESSMENT_PENDING,
  FETCH_MOMENTARY_ASSESSMENT_FULFILLED,
  FETCH_MOMENTARY_ASSESSMENT_REJECTED,

  UPDATE_NOTIFICATIONS_PENDING,
  UPDATE_NOTIFICATIONS_FULFILLED,
  UPDATE_NOTIFICATIONS_REJECTED,

  DELETE_NOTIFICATIONS,
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
    dispatch(Pending(FETCH_MOMENTARY_ASSESSMENT_PENDING));
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

    return db.transaction(tx => {
      tx.executeSql(
        sql,
        [],
        (_, response) => {
          dispatch(Response(FETCH_MOMENTARY_ASSESSMENT_FULFILLED, response));
        },
        (_, error) => {
          dispatch(Response(FETCH_MOMENTARY_ASSESSMENT_REJECTED, error));
        },
      );
    });
  };
};

export const updateNotifications = () => {
  const today = moment().toISOString();
  return function(dispatch) {
    dispatch(Pending(UPDATE_NOTIFICATIONS_PENDING));
    let sql = 'SELECT * FROM milestone_triggers ';
    sql += 'WHERE notify_at >= ? ';
    sql += 'ORDER BY milestone_triggers.notify_at ';
    sql += 'LIMIT 50';
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [today],
        (_, response) => {
          setNotifications(response.data);
          dispatch(Response(UPDATE_NOTIFICATIONS_FULFILLED, response));
        },
        (_, error) => dispatch(Response(UPDATE_NOTIFICATIONS_REJECTED, error)),
      );
    });
  };
};

export const deleteAllNotifications = () => {
  return dispatch => {
    deleteNotifications();
    dispatch(Response(DELETE_NOTIFICATIONS));
  };
};
