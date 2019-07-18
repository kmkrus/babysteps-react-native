import React from 'react';
import {
  Linking,
  Text,
  View,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Constants, Permissions } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import moment from 'moment';

import { connect } from 'react-redux';
import { fetchNotifications } from '../actions/notification_actions';

import ConsentDisclosureContent from '../components/consent_disclosure_content';

import Colors from '../constants/Colors';

const { manifest } = Constants;

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    notificationPermissions: '',
    consentModalVisible: false,
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
        key={notification.id}
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

    const version = `${manifest.version}:${build}`;
    const body = `\n\n\n________________________\n\nPlatform: ${Platform.OS}\nVersion: ${version}\nRelease: ${releaseChannel}\nNotifications Updated At: ${moment(this.props.session.notifications_updated_at).format('MMMM Do YYYY, h:mm a Z')}\nNotification Permissions: ${this.state.notificationPermissions}\n________________________\n\n`;

    Linking.openURL(`mailto:feedback@babystepsapp.net?subject=BabySteps App Feedback (v${version})&body=${body}`);
  };

  _handleConsentAgreementPress = () => {
    this.setState({ consentModalVisible: true });
  };

  renderConsentModal = () => {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.consentModalVisible}
          onRequestClose={() => {}}
        >
          <ConsentDisclosureContent
            formState="view"
            screeningBlood={this.state.screeningBlood}
            setModalVisible={this.setModalVisible}
          />
        </Modal>
      </View>
    );
  };

  setModalVisible = (visible) => {
    this.setState({consentModalVisible: visible});
  };

  getAppVersion = () => {
    const build =
      Platform.OS === 'android'
        ? manifest.android.versionCode
        : manifest.ios.buildNumber;
    return build;
  };

  getNotificationPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    // console.log("Notification Settings: ", status);

    this.setState({ notificationPermissions: status });
  };

  renderDevDebugItems = releaseChannel => {
    if (releaseChannel !== 'Production') {
      return (
        <View>
          <Text>
            Notification Permissions: {this.state.notificationPermissions}
          </Text>
          <Text>
            Notifications Updated:
            {moment(this.props.session.notifications_updated_at).format(
              'MMMM Do YYYY, h:mm a z',
            )}
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
            style={styles.linkContainer}
            onPress={this._handleFeedbackPress}
          >
            <Text style={styles.linkText}>Provide Feedback</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={28}
              color="#bdc6cf"
              style={styles.linkIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={this._handleConsentAgreementPress}
          >
            <Text style={styles.linkText}>Review Consent Agreement</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={28}
              color="#bdc6cf"
              style={styles.linkIcon}
            />
          </TouchableOpacity>
        </View>

        {this.renderNotificationList(releaseChannel)}

        {this.renderConsentModal()}
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
  linkContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.mediumGrey,
    borderBottomColor: Colors.mediumGrey,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    position: 'relative',
  },
  linkText: {
    fontSize: 16,
    color: Colors.darkGreen,
    marginLeft: 10,
  },
  linkIcon: {
    color: Colors.darkGreen,
    right: 9,
    position: 'absolute',
    top: 12,
  },
});

const mapStateToProps = ({
  session,
  notifications,
  milestones,
  registration,
}) => ({
  session,
  notifications,
  milestones,
  registration,
});

const mapDispatchToProps = { fetchNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
