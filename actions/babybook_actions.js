import { SQLite } from 'expo';

import CONSTANTS from '../constants';

import {
  SAVE_BABYBOOK_FILE_PENDING_PENDING,
  SAVE_BABYBOOK_FILE_PENDING_FULFILLED,
  SAVE_BABYBOOK_FILE_PENDING_REJECTED,
} from './types';

const db = SQLite.openDatabase('babysteps.db');

const Pending = (type) => {
  return { type }
};

const Response = ( type, payload, formData={} ) => {
  return { type, payload, formData }
};


export const saveFile = (uri) => {
  return function (dispatch) {
    
    dispatch( Pending(SAVE_BABYBOOK_FILE_PENDING) );

    const fileName = Expo.FileSystem.cacheDirectory + 'signature/signature.png'
    Expo.FileSystem.deleteAsync(fileName, { idempotent:  true });

    Expo.FileSystem.copyAsync({from: image.uri, to: fileName})
    .then( () => { dispatch( Pending(SAVE_BABYBOOK_FILE_FULFILLED) ) })
    .catch( (error) => { 
      dispatch( Response(SAVE_BABYBOOK_FILE_REJECTED, error) ) 
    }) 
  }
}