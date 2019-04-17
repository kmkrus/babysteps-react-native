import React from 'react';
import {
  Linking,
  Text,
  View,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Constants, Permissions } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';


import isEmpty from 'lodash/isEmpty';

import moment from 'moment';

import { connect } from 'react-redux';
import { fetchNotifications } from '../actions/notification_actions';

import { getApiUrl } from '../database/common';

import Colors from '../constants/Colors';

const { manifest } = Constants;

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    notificationPermissions: '',
  };


  componentWillMount() {
    this.props.fetchNotifications();
    this.getNotificationPermissions();
  }

  renderNotificationList = releaseChannel => {
    if (releaseChannel !== 'Production') {
      const notifications = this.props.notifications.notifications.data;
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications:</Text>
          <FlatList
            scrollEnabled
            data={notifications}
            renderItem={this.renderItem}
          />
        </View>
      );
    }
    return null;
  };

  renderItem = item => {
    const notification = item.item;
    const notify_at = moment(notification.notify_at).format('YYYY-MM-DD h:mm a Z');
    return (
      <ListItem
        key={item.index}
        title={notify_at}
        subtitle={notification.body}
      />
    );
  };

  getReleaseChannel = manifest => {
    const releaseChannel = manifest.releaseChannel; // returns undefined in DEV
    if (__DEV__ || releaseChannel === undefined) {
      return 'Development';
    }
    if (releaseChannel.indexOf('staging') !== -1) {
      return 'Staging';
    }
    return 'Production';
  };

  _handleFeedbackPress = () => {
    const build = this.getAppVersion();
    const releaseChannel = this.getReleaseChannel(manifest);

    let version = `${manifest.version}:${build}`;
    let body = `\n\n\n________________________\n\nPlatform: ${Platform.OS}\nVersion: ${version}\nRelease: ${releaseChannel}\nNotifications Updated At: ${moment(this.props.session.notifications_updated_at).format('MMMM Do YYYY, h:mm a Z')}\nNotification Permissions: ${this.state.notificationPermissions}`;

    Linking.openURL(`mailto:feedback@babystepsapp.net?subject=BabySteps App Feedback (v${version})&body=${body}`);
  };

  getAppVersion = () => {
    const build =
      Platform.OS === 'android'
        ? manifest.android.versionCode
        : manifest.ios.buildNumber;
    return build;
  };

  getNotificationPermissions = async () => {
    const { status } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS,
    );

    console.log("Notification Settings: ",status);

    this.setState({notificationPermissions: status});
  };

  renderDevDebugItems = releaseChannel => {
    if (releaseChannel !== 'Production') {
      return (
      <View>
        <Text>
          Notification Permissions: {this.state.notificationPermissions}
        </Text>
        <Text>
          Notifications Updated: {moment(this.props.session.notifications_updated_at).format('MMMM Do YYYY, h:mm a z')}
        </Text>
      </View>
    );
    }
    return null;
  };


  render() {
    const build = this.getAppVersion();
    const releaseChannel = this.getReleaseChannel(manifest);
    const calendar = this.props.milestones.calendar;
    const session = this.props.session;
    const subject = this.props.registration.subject.data;

    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BabySteps App Information:</Text>
          <Text>
            Version: {manifest.version}:{build}
          </Text>
          {this.renderDevDebugItems(releaseChannel)}
          <Text>Release: {releaseChannel}</Text>
          <TouchableOpacity
            style={styles.feedbackContainer}
            onPress={this._handleFeedbackPress}
          >
            <Text style={styles.feedbackText}>Provide Feedback</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={28}
              color="#bdc6cf"
              style={styles.feedbackIcon}
            />
          </TouchableOpacity>
        </View>
        {this.renderNotificationList(releaseChannel)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  feedbackContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#bbb',
    borderBottomColor: '#bbb',
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    position: 'relative',
  },
  feedbackText: {
    fontSize: 16,
    color: '#43484d',
    marginLeft: 10,
  },
  feedbackIcon: {
    right: 9,
    position: 'absolute',
    top: 12,
  }


});

const mapStateToProps = ({ session, notifications, milestones, registration }) => ({ session, notifications, milestones, registration, });

const mapDispatchToProps = { fetchNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
