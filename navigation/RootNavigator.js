import React, { Component } from 'react';

import { Notifications } from 'expo';

import { createStackNavigator } from 'react-navigation';

import AppNavigator from '../navigation/AppNavigator';

import TourScreen from '../screens/TourScreen';
import ConsentScreen from '../screens/ConsentScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import TourNoStudyConfirmScreen from '../screens/TourNoStudyConfirmScreen';
import RegistrationNoStudyScreen from '../screens/RegistrationNoStudyScreen';

import { connect} from 'react-redux';
import { updateSession, fetchSession } from '../actions/session_actions';

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
}

const ConsentNavigator = createStackNavigator({
  screen: ConsentScreen
},
 {
  navigationOptions: headerOptions ,
});

const RegistrationNavigator = createStackNavigator({
  screen: RegistrationScreen
},
{
  navigationOptions: headerOptions ,
});

const TourNavigator = createStackNavigator({
  Tour: {
    screen: TourScreen,
  },
  Registration: {
    screen: RegistrationNavigator
  }
},
{
  navigationOptions: () => ({
    header: null
  }),
});

const TourNoStudyNavigator = createStackNavigator({
  Tour: {
    screen: TourNoStudyConfirmScreen,
  },
  Registration: {
    screen: RegistrationNoStudyScreen, 
  }
},
{
  navigationOptions: () => ({
    header: null
  }),
});

class RootNavigator extends Component {

  componentWillMount() {
    this.props.fetchSession()
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
  
    if ( States.REGISTRATION_COMPLETE.includes(this.props.session.registration_state) ) {
      return <AppNavigator />
    } else if ( States.REGISTERING_NO_STUDY.includes(this.props.session.registration_state) ) {
      return <TourNoStudyNavigator />
    } else if ( States.REGISTERING_CONSENT.includes(this.props.session.registration_state) ) {
      return <ConsentNavigator />
    } else if ( States.REGISTERING_REGISTRATION.includes(this.props.session.registration_state) ) {
      return <RegistrationNavigator />
    } else {
      return <TourNavigator /> 
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

const mapStateToProps = ({ session }) => ({ session })
const mapDispatchToProps = { updateSession, fetchSession }

export default connect( mapStateToProps, mapDispatchToProps )(RootNavigator);
