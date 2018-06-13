import { Notifications } from 'expo';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';

import { connect} from 'react-redux';
import { fetchSession } from '../actions/session_actions';
import { fetchUser, fetchRespondent, fetchSubject } from '../actions/registration_actions';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import TourScreen from '../screens/TourScreen';
import ConsentScreen from '../screens/ConsentScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import TourNoStudyConfirmScreen from '../screens/TourNoStudyConfirmScreen';
import RegistrationNoStudyScreen from '../screens/RegistrationNoStudyScreen';

import Colors from '../constants/Colors';
import States from '../actions/states';

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
      screen: ConsentScreen,
    },
    Registration: {
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
      screen: RegistrationNavigator
    }
  },
  {
    navigationOptions: () => ({
      header: null
    }),
  }
);

const TourNoStudyNavigator = StackNavigator(
  {
    Main: {
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
  }
);

class RootNavigator extends Component {

  componentWillMount() {
    this.props.fetchSession();
    this.props.fetchUser();
    this.props.fetchRespondent();
    this.props.fetchSubject();
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    //return <RootStackNavigator />
    if ( States.REGISTRATION_COMPLETE.includes(this.props.session.registration_state) ) {
      return <RootStackNavigator />
    } else if (this.props.session.registration_state == States.REGISTERING_AS_NO_STUDY) {
      return <TourNoStudyNavigator />
    } else if ( States.REGISTERING_IN_STUDY_STATES.includes(this.props.session.registration_state) ) {
      return <RegistrationNavigator />
    } else if (this.props.session.registration_state == States.REGISTERING_NOT_ELIGIBLE ) {
      return <TourNoStudyNavigator />
    } else if (this.props.session.registration_state == States.REGISTERING_AS_IN_STUDY) {
      return <RegistrationNavigator navigate={'Registration'} />
    } else {
      return <TourNavigator /> 
    };

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

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { fetchSession, fetchUser, fetchRespondent, fetchSubject };

export default connect( mapStateToProps, mapDispatchToProps )(RootNavigator);
