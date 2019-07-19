import { SQLite } from 'expo-sqlite';
import moment from 'moment';

import {
  setNotifications,
  setMomentaryAssessments,
  deleteNotifications,
} from '../notifications';

import {
  SHOW_MOMENTARY_ASSESSMENT,
  HIDE_MOMENTARY_ASSESSMENT,

  FETCH_MOMENTARY_ASSESSMENT_PENDING,
  FETCH_MOMENTARY_ASSESSMENT_FULFILLED,
  FETCH_MOMENTARY_ASSESSMENT_REJECTED,

  FETCH_NOTIFICATIONS_PENDING,
  FETCH_NOTIFICATIONS_FULFILLED,
  FETCH_NOTIFICATIONS_REJECTED,

  UPDATE_NOTIFICATIONS_PENDING,
  UPDATE_NOTIFICATIONS_FULFILLED,
  UPDATE_NOTIFICATIONS_REJECTED,

  UPDATE_MOMENTARY_ASSESSMENTS_PENDING,
  UPDATE_MOMENTARY_ASSESSMENTS_FULFILLED,
  UPDATE_MOMENTARY_ASSESSMENTS_REJECTED,

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

export const fetchNotifications = () => {
  return dispatch => {
    dispatch(Pending(FETCH_NOTIFICATIONS_PENDING));
    const sql = 'SELECT * FROM notifications ORDER BY notify_at;';
    return db.transaction(tx => {
      tx.executeSql(
        sql,
        [],
        (_, response) => {
          dispatch(Response(FETCH_NOTIFICATIONS_FULFILLED, response));
        },
        (_, error) => {
          dispatch(Response(FETCH_NOTIFICATIONS_REJECTED, error));
        },
      );
    });
  };
};

export const updateNotifications = () => {
  const today = moment().toISOString();
  return dispatch => {
    dispatch(Pending(UPDATE_NOTIFICATIONS_PENDING));
    const sql =
      'SELECT * FROM milestone_triggers AS mt \
        WHERE mt.momentary_assessment = 0 AND mt.notify_at >= ? \
        ORDER BY mt.notify_at \
        LIMIT 10;';
    return db.transaction(tx => {
      tx.executeSql(
        sql,
        [today],
        (_, response) => {
          const entries = response.rows['_array'];
          setNotifications(entries);
          dispatch(Response(UPDATE_NOTIFICATIONS_FULFILLED, entries));
        },
        (_, error) => dispatch(Response(UPDATE_NOTIFICATIONS_REJECTED, error)),
      );
    });
  };
};

export const updateMomentaryAssessments = studyEndDate => {
  return dispatch => {
    dispatch(Pending(UPDATE_MOMENTARY_ASSESSMENTS_PENDING));
    const sql =
      'SELECT * FROM milestone_triggers AS mt WHERE mt.momentary_assessment = 1';
    return db.transaction(tx => {
      tx.executeSql(
        sql,
        [],
        (_, response) => {
          const entries = response.rows['_array'];
          setMomentaryAssessments(entries, studyEndDate);
          dispatch(Response(UPDATE_MOMENTARY_ASSESSMENTS_FULFILLED, entries));
        },
        (_, error) => dispatch(Response(UPDATE_MOMENTARY_ASSESSMENTS_REJECTED, error)),
      );
    });
  };
};

export const deleteAllNotifications = () => {
  return dispatch => {
    deleteNotifications();
    dispatch(Response(DELETE_NOTIFICATIONS));
    return db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM notifications;',
        [],
        (_, rows) => console.log('****** Clear notifications table'),
        (_, error) => console.log('****** Error in clearing notifications table'),
      );
    });
  };
};
