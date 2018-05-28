import { Notifications } from 'expo';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { connect} from 'react-redux';
import _ from 'lodash';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import TourScreen from '../screens/TourScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

import { fetchUser } from '../actions/registration_actions';

import Colors from '../constants/Colors';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: Colors.headerBackgroundColor, 
      },
      headerTintColor: Colors.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      
    }),
  }
);


const RegistrationNavigator = StackNavigator(
  {
    Main: {
      screen: RegistrationScreen,
    },
    rootStack: {
      screen: props => <RootStackNavigator />
    }
  },
  {
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: Colors.headerBackgroundColor, 
      },
      headerTintColor: Colors.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

const TourNavigator = StackNavigator(
  {
    Main: {
      screen: TourScreen,
    },
    Registration: {
      screen: props => <RegistrationNavigator />
    }
  },
  {
    navigationOptions: () => ({
      header: null
    }),
  }
);

class RootNavigator extends Component {

  componentWillMount() {
    // note redux doesn't actually change state until render
    this.props.fetchUser();
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    if (_.isEmpty(this.props.registration.user.data) ) {
      return <TourNavigator />
    } else {
      return <RootStackNavigator />;
    }
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { fetchUser }

export default connect( mapStateToProps, mapDispatchToProps )( RootNavigator );
