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

  RESET_API_MILESTONE_CALENDAR,

  API_CREATE_MILESTONE_CALENDAR_PENDING,
  API_CREATE_MILESTONE_CALENDAR_FULFILLED,
  API_CREATE_MILESTONE_CALENDAR_REJECTED,

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

  RESET_MILESTONE_ANSWERS,

  FETCH_MILESTONE_ANSWERS_PENDING,
  FETCH_MILESTONE_ANSWERS_FULFILLED,
  FETCH_MILESTONE_ANSWERS_REJECTED,

  UPDATE_MILESTONE_ANSWERS_PENDING,
  UPDATE_MILESTONE_ANSWERS_FULFILLED,
  UPDATE_MILESTONE_ANSWERS_REJECTED,

  API_UPDATE_MILESTONE_ANSWERS_PENDING,
  API_UPDATE_MILESTONE_ANSWERS_FULFILLED,
  API_UPDATE_MILESTONE_ANSWERS_REJECTED,

} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = type => {
  return { type };
};

const Response = (type, payload, formData = {}) => {
  return { type, payload, formData };
};

export const fetchMilestones = () => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONES_PENDING));
    return (
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM milestones;', [],
          (_, response) => { dispatch( Response(FETCH_MILESTONES_FULFILLED, response))},
          (_, error) => {dispatch( Response(FETCH_MILESTONES_REJECTED, error))}
        );
      })
    );
  };

};

export const resetApiMilestones = () => {
  return dispatch => {
    dispatch(Pending(RESET_API_MILESTONES));
  };
};

// this fetches all milestone and related tables
export const apiFetchMilestones = () => {

  return dispatch => {
    dispatch(Pending(API_FETCH_MILESTONES_PENDING));
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        responseType: 'json',
        baseURL: CONSTANTS.BASE_URL,
        url: '/milestones',
        headers: {
          "milestone_token": CONSTANTS.MILESTONE_TOKEN,
        }
      })
      .then( response => {
        Object.keys(response.data).map( name => {
          insertRows(name, schema[name], response.data[name])
        })
        dispatch(Response(API_FETCH_MILESTONES_FULFILLED, response))
      })
      .catch(error => {
         dispatch(Response(API_FETCH_MILESTONES_REJECTED, error))
      });
    }); // return Promise

  }; // return dispatch
};

export const fetchMilestoneGroups = () => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONE_GROUPS_PENDING));
    return (
      db.transaction(tx => {
        tx.executeSql( 
          'SELECT * FROM milestone_groups;', [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_GROUPS_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_GROUPS_REJECTED, error))}
        );
      })
    )
  };
};

export const fetchMilestoneCalendar = () => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONE_CALENDAR_PENDING));
    return (
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM milestone_triggers INNER JOIN milestones ON milestone_triggers.milestone_id = milestones.id ORDER BY milestones.days_since_baseline;', [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_CALENDAR_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_CALENDAR_REJECTED, error))}
        );
      })
    )
  };

};

export const resetApiMilestoneCalendar = () => {
  return dispatch => {
    dispatch(Pending(RESET_API_MILESTONE_CALENDAR));
  };
};

export const apiCreateMilestoneCalendar = params => {
  return dispatch => {
    dispatch(Pending(API_CREATE_MILESTONE_CALENDAR_PENDING));

    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        responseType: 'json',
        baseURL: CONSTANTS.BASE_URL,
        url: '/milestone_calendars/new',
        params,
        headers: { milestone_token: CONSTANTS.MILESTONE_TOKEN },
      })
        .then(response => {
          insertRows('milestone_triggers', trigger_schema.milestone_triggers, response.data);
          setNotifications(response.data);
          dispatch(Response(API_CREATE_MILESTONE_CALENDAR_FULFILLED, response));
        })
        .catch(error => {
          dispatch(Response(API_CREATE_MILESTONE_CALENDAR_REJECTED, error));
        });
    }); // return Promise
  }; // return dispatch
};

export const apiFetchMilestoneCalendar = params => {
  return dispatch => {
    dispatch(Pending(API_FETCH_MILESTONE_CALENDAR_PENDING));

    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        responseType: 'json',
        baseURL: CONSTANTS.BASE_URL,
        url: '/milestone_calendars',
        params,
        headers: { milestone_token: CONSTANTS.MILESTONE_TOKEN },
      })
        .then( response => {
          insertRows('milestone_triggers', trigger_schema.milestone_triggers, response.data);
          dispatch(Response(API_FETCH_MILESTONE_CALENDAR_FULFILLED, response));
        })
        .catch(error => {
          dispatch(Response(API_FETCH_MILESTONE_CALENDAR_REJECTED, error));
        });
    }); // return Promise
  }; // return dispatch
};

export const fetchMilestoneTasks = (params = {}) => {
  return dispatch => {
    dispatch( Pending(FETCH_MILESTONE_TASKS_PENDING) );
    var sql = 'SELECT ts.*, mg.position AS milestone_group_position, ms.milestone_group_id, ms.position AS milestone_position, ms.title AS milestone_title FROM tasks AS ts';
    sql = sql + ' INNER JOIN milestones AS ms ON ms.id = ts.milestone_id';
    sql = sql + ' INNER JOIN milestone_groups AS mg ON mg.id = ms.milestone_group_id';
    sql = sql + ' WHERE mg.visible = 1 AND ms.always_visible = 1';
    sql = sql + ' ORDER BY milestone_group_position, milestone_position, position;';

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_TASKS_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_TASKS_REJECTED, error))}
        );
      })
    );
  };

};

export const fetchMilestoneSections = (params = {}) => {
  return dispatch => {
    dispatch( Pending(FETCH_MILESTONE_SECTIONS_PENDING) );
    var sql = 'SELECT * FROM sections';
    sql = sql + ' WHERE sections.task_id = ' + params['task_id'];
    sql = sql + ' ORDER BY sections.position;';

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_SECTIONS_FULFILLED, response))},
          (_, error) => { dispatch( Response(FETCH_MILESTONE_SECTIONS_REJECTED, error))}
        );
      })
    );
  };
};

export const resetMilestoneQuestions = () => {
  return function (dispatch) {
     dispatch(Pending(RESET_MILESTONE_QUESTIONS));
  }
}

export const fetchMilestoneQuestions = (params={}) => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONE_QUESTIONS_PENDING));
    var sql = 'SELECT qs.*, ops.input_type, ops.rn_input_type FROM questions AS qs';
    sql = sql + ' INNER JOIN option_groups AS ops ON qs.option_group_id = ops.id';
    sql = sql + ' WHERE qs.section_id = ' + params['section_id'];
    sql = sql + ' ORDER BY qs.position;';

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_QUESTIONS_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_QUESTIONS_REJECTED, error))}
        );
      })
    );
  };
};

export const resetMilestoneChoices = () => {
  return dispatch => {
    dispatch(Pending(RESET_MILESTONE_CHOICES));
  };
};

export const fetchMilestoneChoices = (params={}) => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONE_CHOICES_PENDING));

    const question_ids = `( ${params.question_ids.join(', ')} )`;

    let sql = 'SELECT * FROM choices';
    sql = sql + ' WHERE question_id IN ' + question_ids;
    sql = sql + ' ORDER BY question_id, position;';

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_CHOICES_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_CHOICES_REJECTED, error))}
        );
      })
    );
  };
};

export const resetMilestoneAnswers = () => {
  return dispatch => {
    dispatch(Pending(RESET_MILESTONE_ANSWERS));
  };
};

export const fetchMilestoneAnswers = (params={}) => {
  return dispatch => {
    dispatch(Pending(FETCH_MILESTONE_ANSWERS_PENDING));

    var sql = 'SELECT * FROM answers WHERE answers.section_id = ' + params['section_id'];
    sql = sql + ' ORDER BY question_id, choice_id;';

    return (
      db.transaction(tx => {
        tx.executeSql( 
          sql, [],
          (_, response) => {dispatch(Response(FETCH_MILESTONE_ANSWERS_FULFILLED, response))},
          (_, error) => {dispatch(Response(FETCH_MILESTONE_ANSWERS_REJECTED, error))}
        );
      })
    );
  };
};

export const updateMilestoneAnswers = (section, answers) => {
  return dispatch => {
    dispatch(Pending(UPDATE_MILESTONE_ANSWERS_PENDING));

    const fields = [
      'api_id',
      'user_id',
      'user_api_id',
      'respondent_id',
      'respondent_api_id',
      'subject_id',
      'subject_api_id',
      'milestone_id',
      'task_id',
      'section_id',
      'question_id',
      'choice_id',
      'answer_numeric',
      'answer_boolean',
      'answer_text',
      'score',
    ];

    const values = [];
    let row = [];
    _.map(answers, answer => {
      row = [];
      _.map(fields, field => {
        if (answer[field] === undefined || answer[field] === null) {
          row.push('null');
        } else if (answer[field] === true) {
          row.push(1);
        } else if (answer[field] === false) {
          row.push(0);
        } else if (field === 'answer_text') {
          row.push(`"${answer[field]}"`);
        } else {
          row.push(answer[field]) ;
        }
      })
      values.push(`( ${row.join(', ')} )`);
    });

    const sql = `INSERT INTO answers ( ${fields.join(', ')} ) VALUES ${values.join(', ')} `;

    return (
      db.transaction(tx => {
        tx.executeSql( 'DELETE FROM answers WHERE section_id = ?', [section.id], 
          (_, rows) => console.log('** Clear answers table for section ' + section.title ), 
          (_, error) => console.log('*** Error in clearing answers table for section ' + section.title )
        );
        tx.executeSql( 
          sql, [],
          (_, response) => { dispatch( Response(UPDATE_MILESTONE_ANSWERS_FULFILLED, response, answers) ) },
          (_, error) => { dispatch( Response(UPDATE_MILESTONE_ANSWERS_REJECTED, error) ) }
        );
      })
    );
  };
};

export const apiUpdateMilestoneAnswers = (session, section_id, data) => {

  const answers = [];
  _.forEach(data, row => {
    const answer = _.omit(row, ['api_id', 'user_api_id', 'respondent_api_id', 'subject_api_id']);
    answers.push({
      ...answer,
      id: row.api_id,
      user_id: row.user_api_id,
      respondent_id: row.respondent_api_id,
      subject_id: row.subject_api_id,
    })
  });

  return dispatch => {

    dispatch({
      type: API_UPDATE_MILESTONE_ANSWERS_PENDING,
      payload: {
        data: { answers },
        session,
      },
      meta: {
        offline: {
          effect: {
            method: 'PUT',
            url: '/answers/bulk_update/' + section_id,
            fulfilled: API_UPDATE_MILESTONE_ANSWERS_FULFILLED,
            rejected: API_UPDATE_MILESTONE_ANSWERS_REJECTED,
          },
        },
      },
    });
  }; // return dispatch
};
