import { Notifications, SQLite } from 'expo';

import moment from 'moment';
import forEach from 'lodash/forEach';
import map from 'lodash/map';

const db = SQLite.openDatabase('babysteps.db');

const notifications = [];

function scheduleNotificaton(localNotification, scheduleTime) {
  const schedulingOptions = { time: scheduleTime.valueOf() };
  Notifications.scheduleLocalNotificationAsync(
    localNotification,
    schedulingOptions,
  );
  const notify_at = scheduleTime.toISOString();
  const data = localNotification.data;
  // console.log('****** Notfication Scheduled: ', notify_at, data.body);
  createNotifications([{ ...data, notify_at, channel_id: 'screeningEvents' }]);
}

function localNotificationMessage(entry) {
  return {
    title: entry.message,
    body: entry.name,
    data: {
      task_id: entry.task_id,
      momentary_assessment: entry.momentary_assessment,
      response_scale: entry.response_scale,
      title: entry.message,
      body: entry.name,
      type: 'info',
    },
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      vibrate: true,
      priority: 'high',
      channelId: 'screeningEvents',
    },
  };
}

function milestoneFrequency(frequency) {
  switch(frequency) {
    case 'daily':
      return [1, 1];
    case 'bi_weekly':
      return [7, 2];
    case 'weekly':
      return [7, 1];
    case 'bi_monthly':
      return [30, 2];
    case 'monthly':
      return [30, 1];
    case 'bi_annually':
      return [365, 2];
    case 'annually':
      return [365, 1];
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum and minimum are inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function buildMomentaryAssessmentEntries(entry, studyEndDate) {
  let cycleDate = moment(entry.notify_at).startOf('day');
  if (entry.notify_at === null || moment().isAfter(entry.notify_at)) cycleDate = moment().startOf('day');
  // only construct 14 days of momentary assessments
  // in order to stay under the 64 local notifications
  // limit of IOS.
  let endDate = moment(cycleDate).add(14, 'days');
  if (endDate.isAfter(studyEndDate)) endDate = studyEndDate;
  const term = milestoneFrequency(entry.frequency)[0];
  const number = milestoneFrequency(entry.frequency)[1];
  while (moment(cycleDate).isBefore(endDate)) {
    for (let i = 0; i < number; i++) {
      const scheduleTime = moment(cycleDate)
        .add(getRandomInt(1, term), 'days')
        .add(getRandomInt(8, 19), 'hours')
        .add(getRandomInt(0, 59), 'minutes');
      const localNotification = localNotificationMessage(entry);
      scheduleNotificaton(localNotification, scheduleTime);
      cycleDate = scheduleTime.startOf('day');
    }
  }
}

export const setMomentaryAssessments = (entries, studyEndDate) => {
  forEach(entries, entry => {
    buildMomentaryAssessmentEntries(entry, studyEndDate);
  });
};

export const setNotifications = entries => {
  forEach(entries, entry => {
    const localNotification = localNotificationMessage(entry);
    const scheduleTime = moment(entry.notify_at);
    if (scheduleTime.isValid()) {
      scheduleNotificaton(localNotification, scheduleTime);
    }
  });
};

export const deleteNotifications = () => {
  Notifications.cancelAllScheduledNotificationsAsync();
  // console.log('****** All Notifications Cancelled');
};

export const createNotifications = entries => {
  const notificationFields = [
    'task_id',
    'notify_at',
    'momentary_assessment',
    'response_scale',
    'title',
    'body',
    'type',
    'channel_id',
  ];
  const values = map(entries, entry => {
    return `(${entry.task_id}, "${entry.notify_at}", ${entry.momentary_assessment}, "${entry.response_scale}", "${entry.title}", "${entry.body}", "info", "screeningEvents")`
  });
  const sql =`INSERT INTO notifications ( ${notificationFields.join(', ')} ) VALUES ${values.join(', ')};`;

  console.log("Creating Notification", entries, sql);

  return db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (_, response) => {
        // console.log('****** Notifications Saved');
      },
      (_, error) => {
        console.log('****** Notifications Error', error);
      },
    );
  });
};
