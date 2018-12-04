import { Notifications, SQLite } from 'expo';

import moment from 'moment';
import forEach from 'lodash/forEach';

import CONSTANTS from '../constants';

const db = SQLite.openDatabase('babysteps.db');

function scheduleNotificaton(localNotification, scheduleTime) {
  const schedulingOptions = { time: scheduleTime };
  Notifications.scheduleLocalNotificationAsync(
    localNotification,
    schedulingOptions,
  );
  console.log('****** Notfication Scheduled: ', task.name, scheduleTime);
}

function localNotification(entry, milestone, task) {
  return {
    title: milestone.message,
    body: task.name,
    data: {
      task_id: entry.task_id,
      momentary_assessment: entry.momentary_assessment,
      response_scale: entry.response_scale,
      title: milestone.message,
      body: task.name,
      type: 'info',
    },
    ios: {
      sound: true,
    },
    android: {
      channelId: 'screeningEvents',
    },
  };
}

function getMilestone(id) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM milestones WHERE id = ?;', [id],
        (_, result) => resolve(result.rows._array[0]),
        (_, error) => reject('Error retrieving milestone'),
      );
    });
  });
}

function getTask(id) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE id = ?;', [id],
        (_, result) => resolve(result.rows._array[0]),
        (_, error) => reject('Error retrieving task'),
      );
    });
  });
}

function getSubject() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM subjects;', [],
        (_, result) => resolve(result.rows._array[0]),
        (_, error) => reject('Error retrieving subject'),
      );
    });
  });
}

async function calculateStudyEndDate() {
  const subject = await getSubject();
  if (subject) {
    if (subject.date_of_birth) {
      return moment(subject.date_of_birth).add(CONSTANTS.POST_BIRTH_END_OF_STUDY, 'days')
    }
    return moment(subject.expected_date_of_birth).add(CONSTANTS.POST_BIRTH_END_OF_STUDY, 'days')
  }
  console.log('****** Notification - Subject not found');
  return null;
}

function milestoneFrequency(milestone) {
  switch(milestone.frequency) {
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

function buildMomentaryAssessmentEntries(entry, milestone, task) {
  let cycleDate = moment().isBefore(entry.notify_at) ? moment(entry.notify_at) : moment();
  const endDate = calculateStudyEndDate();
  const term = milestoneFrequency(milestone)[0];
  const number = milestoneFrequency(milestone)[1];
  while (moment(cycleDate).isBefore(endDate)) {
    for (let i = 0; i < number; i++) {
      const scheduleTime = moment(cycleDate)
        .add(getRandomInt(1, term), 'days')
        .add(getRandomInt(8, 19), 'hours')
        .add(getRandomInt(0, 59), 'minutes');
      const localNotification = localNotification(entry, milestone, task);
      scheduleNotificaton(localNotification, scheduleTime);
      cycleDate = scheduleTime;
    };
    console.log("****** Momentary Assessments Scheduled: ", task.id);
  }
}

export const setNotifications = async entries => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const timeNow = new Date();
  forEach(entries, async entry => {
    const milestone = await getMilestone(entry.milestone_id);
    const task = await getTask(entry.task_id);
    if (!milestone) {
      console.log("****** Notification - Milestone ID not found: ", entry.milestone_id);
      return;
    }
    if (task) {
      console.log("****** Notification - Task ID not found: ", entry.task_id);
      return;
    }

    if (entry.momentary_assessment) {
      buildMomentaryAssessmentEntries(entry, milestone, task);
    } else {
      const localNotification = localNotification(entry, milestone, task);
      const scheduleTime = moment(entry.notify_at);
      if (scheduleTime > timeNow) {
        scheduleNotificaton(localNotification, scheduleTime);
        console.log("****** Notification Scheduled: ", task.id);
      }
    }
  });
};

export const deleteNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
