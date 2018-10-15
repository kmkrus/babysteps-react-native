import { Notifications, SQLite } from 'expo';

const db = SQLite.openDatabase('babysteps.db');

export const setNotifications = async entries => {
  const result = await Notifications.cancelAllScheduledNotificationsAsync();
  const timeNow = new Date();
  entries.forEach(async entry => {
    const milestone = await getMilestone(entry.milestone_id);
    const task = await getTask(entry.task_id);

    if (!milestone || !task) {
      console.log("Milestone ID not found: ", entry.milestone_id);
      return;
    }

    const localNotification = {
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

    const scheduleTime = new Date(entry.notify_at);

    if (scheduleTime > timeNow) {
      const schedulingOptions = { time: scheduleTime };
      Notifications.scheduleLocalNotificationAsync(
        localNotification,
        schedulingOptions,
      );
      console.log('Notfication Scheduled:', task.name, scheduleTime);
    };
  });

};

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
