import React, { Component } from 'react';

import { Notifications } from 'expo';

import { createStackNavigator } from 'react-navigation';

import { connect } from 'react-redux';
import { updateSession, fetchSession } from '../actions/session_actions';

import AppNavigator from './AppNavigator';

import TourScreen from '../screens/TourScreen';
import ConsentScreen from '../screens/ConsentScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import TourNoStudyConfirmScreen from '../screens/TourNoStudyConfirmScreen';
import RegistrationNoStudyScreen from '../screens/RegistrationNoStudyScreen';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import Colors from '../constants/Colors';
import States from '../actions/states';

const headerOptions = {
  headerStyle: {
    backgroundColor: Colors.headerBackground,
  },
  headerTintColor: Colors.headerTint,
  headerTitleStyle: {
    fontWeight: '900',
  },
};

const ConsentNavigator = createStackNavigator(
  {
    screen: ConsentScreen,
  },
  {
    navigationOptions: headerOptions,
  },
);

const RegistrationNavigator = createStackNavigator(
  {
    screen: RegistrationScreen,
  },
  {
    navigationOptions: headerOptions,
  },
);

const TourNavigator = createStackNavigator(
  {
    Tour: {
      screen: TourScreen,
    },
    Registration: {
      screen: RegistrationNavigator,
    },
  },
  {
    navigationOptions: () => ({
      header: null,
    }),
  },
);

const TourNoStudyNavigator = createStackNavigator(
  {
    Tour: {
      screen: TourNoStudyConfirmScreen,
    },
    Registration: {
      screen: RegistrationNoStudyScreen,
    },
  },
  {
    navigationOptions: () => ({
      header: null,
    }),
  },
);

class RootNavigator extends Component {
  componentWillMount() {
    this.props.fetchSession();
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
    );
  };

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render() {
    const registration_state = this.props.session.registration_state;
    if (States.REGISTRATION_COMPLETE.includes(registration_state)) {
      return <AppNavigator />;
    }
    if (States.REGISTERING_NO_STUDY.includes(registration_state)) {
      return <TourNoStudyNavigator />;
    }
    if (States.REGISTERING_CONSENT.includes(registration_state)) {
      return <ConsentNavigator />;
    }
    if (States.REGISTERING_REGISTRATION.includes(registration_state)) {
      return <RegistrationNavigator />;
    }
    return <TourNavigator />;
  }
}

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession, fetchSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootNavigator);
