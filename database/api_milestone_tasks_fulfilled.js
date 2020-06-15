import React from 'react';
import { Image } from 'react-native';

import map from 'lodash/map';

import { API_FETCH_MILESTONES_FULFILLED } from '../actions/types';

// This function prefetchs external images used in the questions
// and caches them for faster display and offline use.

export default store => next => action => {
  if (!action || !action.type) {
    return null;
  }
  if (action.type !== API_FETCH_MILESTONES_FULFILLED || !action.payload.data) {
    return next(action);
  }

  const task_attachments = action.payload.data['task_attachments'];

  map(task_attachments, att => {
    Image.prefetch(att.attachment_url).catch(error => {
      console.log('There has been a problem with an image prefetch operation: ' + error.message);
    });
  });

  return next(action);
};
