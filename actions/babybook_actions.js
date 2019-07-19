import * as FileSystem from 'expo-file-system';
import { SQLite } from 'expo-sqlite';

import { _ } from 'lodash';

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

export const createBabyBookEntry = (data, image) => {
  return function(dispatch) {
    dispatch(Pending(CREATE_BABYBOOK_ENTRY_PENDING));
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

    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }

    return (
      FileSystem.copyAsync({from: image.uri, to: data.uri})
      .then(() => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO babybook_entries (title, detail, cover, file_name, file_type, uri, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [
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
      })
    ) // return
  }; // dispatch
};

export const updateBabyBookEntry = (id, data, image = null) => {
  return function(dispatch) {
    dispatch(Pending(UPDATE_BABYBOOK_ENTRY_PENDING));

    delete data.id;

    const keys = _.keys(data);
    const values = _.values(data);
    let updateSQL = [];

    _.forEach( keys, key => {
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
}