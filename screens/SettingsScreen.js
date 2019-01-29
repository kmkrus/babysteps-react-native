import React from 'react';
import { Text, View, FlatList, StyleSheet, Platform } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Constants } from 'expo';

import moment from 'moment';

import { connect } from 'react-redux';
import { fetchNotifications } from '../actions/notification_actions';

import { getApiUrl } from '../database/common';

import Colors from '../constants/Colors';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  componentWillMount() {
    this.props.fetchNotifications();
  }

  renderNotificationList() {
    if (__DEV__) {
      const notifications = this.props.notifications.notifications.data;
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications:</Text>
          <FlatList data={notifications} renderItem={this.renderItem} />
        </View>
      );
    }
    return null;
  }

  renderItem = item => {
    const notification = item.item;
    const notify_at = moment(notification.notify_at).format('YYYY-MM-DD HH:mm');
    return (
      <ListItem
        key={item.index}
        title={notify_at}
        subtitle={notification.body}
      />
    );
  };

  getReleaseChannel(manifest) {
    const releaseChannel = manifest.releaseChannel; // returns undefined in DEV
    if (__DEV__ || releaseChannel === undefined) {
      return 'Development';
    }
    if (releaseChannel.indexOf('staging') !== -1) {
      return 'Staging';
    }
    return 'Production';
  }

  render() {
    const { manifest } = Constants;
    const build =
      Platform.OS === 'android'
        ? manifest.android.versionCode
        : manifest.ios.buildNumber;
    const releaseChannel = this.getReleaseChannel(manifest);

    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BabySteps App Information:</Text>
          <Text>
            Version: {manifest.version}:{build}
          </Text>
          <Text>
            Release: {releaseChannel}
          </Text>
        </View>
        {this.renderNotificationList()}
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
});

const mapStateToProps = ({ session, notifications }) => ({ session, notifications });

const mapDispatchToProps = { fetchNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
