import { Alert,  Linking, Platform, } from 'react-native';
import { Permissions } from 'expo';

import pullAllWith from 'lodash/pullAllWith';
import isEqual from 'lodash/isEqual';

const registerForPermission = async permission => {
  // check to see if permission is already granted
  const { status: existingStatus } = await Permissions.getAsync(permission);
  let finalStatus = existingStatus;
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(permission);
    finalStatus = status;
  }
  return finalStatus === 'granted';
};

export default registerForPermission;

export const renderNoPermissionsMessage = (source, message = []) => {
  const lastLine = 'Please enable the permission[s] in your settings.';
  message = pullAllWith(message, [lastLine], isEqual);
  if (['camera', 'video'].includes(source)) {
    message = ['Camera Permissions not granted - cannot open camera preview'];
  }
  if (source === 'library') {
    message = [...message, 'Camera Roll Permissions not granted - cannot open photo album'];
  }
  if (source === 'audio') {
    message = [...message, 'Audio Recording Permissions not granted - cannot open audio preview'];
  }
  return [...message, lastLine];
};

export const openSettingsDialog = message => {
  Alert.alert(
    'Permissions',
    message.join(', '),
    [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'Settings', onPress: () => openSettings()},
    ],
    { cancelable: true },
  );
};

const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  }
  // currently only need to open IOS manually
  //if (Platform.OS === 'android') {
    // https://stackoverflow.com/questions/32822101/how-to-programmatically-open-the-permission-screen-for-a-specific-app-on-android
    //IntentLauncherAndroid.startActivityAsync(
    //  IntentLauncherAndroid.ACTION_MANAGE_APPLICATIONS_SETTINGS,
    //);
  //}
};
