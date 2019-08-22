import * as FileSystem from 'expo-file-system';
import { SQLite } from 'expo-sqlite';

import { insertRows, getApiUrl } from '../database/common';

import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import values from 'lodash/values';

import CONSTANTS from '../constants';

import {
  RESET_BABYBOOK_ENTRIES,

  FETCH_BABYBOOK_ENTRIES_PENDING,
  FETCH_BABYBOOK_ENTRIES_FULFILLED,
  FETCH_BABYBOOK_ENTRIES_REJECTED,

  CREATE_BABYBOOK_ENTRY_PENDING,
  CREATE_BABYBOOK_ENTRY_FULFILLED,
  CREATE_BABYBOOK_ENTRY_REJECTED,

  UPDATE_BABYBOOK_ENTRY_PENDING,
  UPDATE_BABYBOOK_ENTRY_FULFILLED,
  UPDATE_BABYBOOK_ENTRY_REJECTED,

  API_CREATE_BABYBOOK_ENTRY_PENDING,
  API_CREATE_BABYBOOK_ENTRY_FULFILLED,
  API_CREATE_BABYBOOK_ENTRY_REJECTED,

} from './types';

import VideoFormats from '../constants/VideoFormats';
import ImageFormats from '../constants/ImageFormats';
import AudioFormats from '../constants/AudioFormats';

const db = SQLite.openDatabase('babysteps.db');

const Pending = type => {
  return { type };
};

const Response = (type, payload, formData = {}) => {
  return { type, payload, formData };
};

export const resetBabyBookEntries = () => {
  return function(dispatch) {
    dispatch(Pending(RESET_BABYBOOK_ENTRIES));
  };
};

export const fetchBabyBookEntries = () => {
  return function(dispatch) {

    dispatch(Pending(FETCH_BABYBOOK_ENTRIES_PENDING));

    return (
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM babybook_entries;', [],
          (_, response) => {dispatch(Response(FETCH_BABYBOOK_ENTRIES_FULFILLED, response)) },
          (_, error) => {dispatch(Response(FETCH_BABYBOOK_ENTRIES_REJECTED, error))}
        );
      })
    )
  };
};

const parseImageMetaData = (data, image) => {
  const newDir = FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY;

  data.file_name = image.filename ? image.filename : image.uri.split('/').pop();

  data.uri = newDir + '/' + data.file_name;

  if (!data.title && image.title) {
    data.title = image.title;
  }

  if (image.content_type) {
    data.file_type = image.content_type;
  } else {
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    data.file_type = {
      ...VideoFormats,
      ...ImageFormats,
    }[fileType];
  }
  return data;
};

export const createBabyBookEntry = (data, image) => {
  data = parseImageMetaData(data, image);
  return function(dispatch) {
    dispatch(Pending(CREATE_BABYBOOK_ENTRY_PENDING));

    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }

    return FileSystem.copyAsync({ from: image.uri, to: data.uri })
      .then(() => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO babybook_entries (user_id, title, detail, cover, file_name, file_type, uri, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [
              data.user_id,
              data.title,
              data.detail,
              data.cover,
              data.file_name,
              data.file_type,
              data.uri,
              data.created_at,
            ],
            (_, response) => {
              dispatch(Response(CREATE_BABYBOOK_ENTRY_FULFILLED, response, data));
            },
            (_, error) => {
              dispatch(Response(CREATE_BABYBOOK_ENTRY_REJECTED, error));
            },
          );
        });
      })
      .catch(error => {
        dispatch(Response(CREATE_BABYBOOK_ENTRY_REJECTED, error));
      });
  }; // dispatch
};

export const updateBabyBookEntry = (id, data, image = null) => {
  return function(dispatch) {
    dispatch(Pending(UPDATE_BABYBOOK_ENTRY_PENDING));

    delete data.id;

    const keys = keys(data);
    const values = values(data);
    let updateSQL = [];

    forEach(keys, key => {
      updateSQL.push(key + " = '" + data[key] + "'");
    });

    updateSQL = `UPDATE babybook_entries SET ${updateSQL.join(', ')} WHERE babybook_entries.id = ${id};`

    return (
      db.transaction(tx => {
        tx.executeSql( updateSQL, [],
          (_, response) => {
            dispatch(Response(UPDATE_BABYBOOK_ENTRY_FULFILLED, response, data));
          },
          (_, error) => {
            dispatch(Response(UPDATE_BABYBOOK_ENTRY_REJECTED, error))
          }
        );
      })
    )
  };
};

export const apiCreateBabyBookEntry = (session, data, image = null) => {
  data = parseImageMetaData(data, image);

  const formData = new FormData();

  if (data.file_name) {
    formData.append(`babybook_entry[attachment]`, {
      uri: data.uri,
      name: data.file_name,
      type: data.file_type,
    });
  }
  const entry = omit(data, ['uri', 'file_name', 'file_type']);
  forEach(entry, (value, key) => {
    const name = `babybook_entry[${key}]`;
    formData.append(name, value);
  });
  return dispatch => {
    dispatch({
      type: API_CREATE_BABYBOOK_ENTRY_PENDING,
      payload: {
        data: formData,
        session,
        multipart: true,
      },
      meta: {
        offline: {
          effect: {
            method: 'POST',
            url: '/babybooks',
            fulfilled: API_CREATE_BABYBOOK_ENTRY_FULFILLED,
            rejected: API_CREATE_BABYBOOK_ENTRY_REJECTED,
          },
        },
      },
    });
  }; // return dispatch
};


export const apiSyncBabybookEntries = (api_user_id) => {
  return dispatch => {
    dispatch(Pending(API_SYNC_BABYBOOK_ENTRIES_PENDING));

    // stub out pending completion
    return true;
    const baseURL = getApiUrl();
    const fileUri = FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY;

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        responseType: 'json',
        baseURL,
        url: '/sync_babybook_entries',
        headers: {
          milestone_token: CONSTANTS.MILESTONE_TOKEN,
        },
        data: {
          user_id: api_user_id,
        },
      })
        .then(response => {
          const entries = response.data.babybook_entries;
          entries.forEach(entry => {
            entry.api_id = entry.id;
            entry.user_api_id = entry.user_id;
          });
          // primary key on sqlite becomes id from api
          insertRows('babybook_entries', babybook_schema.babybook_entries, entries);

          const attachments = response.data.attachments;
          db.transaction(tx => {
            tx.executeSql( 'DELETE FROM attachments', [],
              (_, response) => console.log('*** Clear Answer Attachments table'),
              (_, error) => console.log('*** Error in clearing Answer Attachments table'),
            );
          });

          attachments.forEach(attachment => {
            attachment.api_id = attachment.id;
            attachment.uri = `${fileUri}/${attachment.filename}`;
            FileSystem.downloadAsync(attachment.url, attachment.uri)
              .then(response => {
                const values = this.parseFields(attachment, attachmentFields);
                const sql =`INSERT INTO attachments ( ${attachmentFields.join(', ')} ) VALUES (${values});`;
                db.transaction(tx => {
                  tx.executeSql(
                    sql,
                    [],
                    (_, response) => console.log(`*** Answer Attachment sync'd ${attachment.filename}`),
                    (_, error) => console.log(`*** Error: Answer Attachment sync ${attachment.filename}`),
                  );
                });
              })
              .catch(error => {
                dispatch(Response(API_SYNC_MILESTONE_ANSWERS_REJECTED, error));
              });
          });
          dispatch(Response(API_SYNC_MILESTONE_ANSWERS_FULFILLED, response));
        })
        .catch(error => {
          dispatch(Response(API_SYNC_MILESTONE_ANSWERS_REJECTED, error));
        });
    }); // return Promise
  }; // return dispatch
};