import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

import moment from 'moment';

import { connect } from 'react-redux';
import { fetchNotifications } from '../actions/notification_actions';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  componentWillMount() {
    this.props.fetchNotifications();
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

  render() {
    const notifications = this.props.notifications.notifications.data;
    return (
      <FlatList
        data={notifications}
        renderItem={this.renderItem}
      />
    );
  }
}

const mapStateToProps = ({ session, notifications }) => ({ session, notifications });

const mapDispatchToProps = { fetchNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
