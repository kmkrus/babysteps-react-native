import { Notifications, SQLite } from 'expo';

const db = SQLite.openDatabase('babysteps.db');

export const setNotifications = async entries => {

  const result = await Notifications.dismissAllNotificationsAsync();

  const timeNow = new Date();

  entries.forEach(async entry => {

    const milestone = await getMilestone(entry.milestone_id);

    const localNotification = {
      title: milestone.title,
      body: milestone.message,
      data: {
        title: milestone.title,
        body: milestone.message,
        type: 'info',
      },
      ios: {
        sound: true,
      },
      android: {
        channelid: 'screeningEvents',
      },
    };

    const scheduleTime = new Date(entry.notify_at);

    if (scheduleTime > timeNow) {

      const schedulingOptions = { time: scheduleTime };

      Notifications.scheduleLocalNotificationAsync(
        localNotification,
        schedulingOptions,
      );
    }

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

