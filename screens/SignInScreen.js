import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import isEmpty from 'lodash/isEmpty';

import { connect } from 'react-redux';
import {
  resetSession,
  apiFetchSignin,
  updateSession,
} from '../actions/session_actions';

import {
  resetApiMilestones,
  apiFetchMilestones,
  resetMilestoneCalendar,
  apiFetchMilestoneCalendar,
  resetMilestoneAnswers,
  apiSyncMilestoneAnswers,
} from '../actions/milestone_actions';

import {
  resetRespondent,
  resetSubject,
  apiSyncRegistration,
  apiSyncSignature,
} from '../actions/registration_actions';

import States from '../actions/states';
import Colors from '../constants/Colors';

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isSubmitting: false,
      errorMessages: [],
      shouldUpdate: true,
      syncMilestones: false,
      syncRegistration: false,
      syncCalendar: false,
      syncAnswers: false,
    };

    this.props.resetSession();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  }

  componentDidUpdate(prevProps, prevState) {
    const session = this.props.session;
    if (!session.fetching) {
      this._saveSignInSession(session);
    }
  }

  _saveSignInSession = session => {
    const syncMilestones = this.state.syncMilestones;
    const syncRegistration = this.state.syncRegistration;
    const syncCalendar = this.state.syncCalendar;
    const syncAnswers = this.state.syncAnswers;
    const milestones = this.props.milestones;
    const registration = this.props.registration;
    if (session.fetched) {
      // slow down cycles to allow API to respond
      setTimeout(() => {}, 1000);
      if (!syncMilestones) {
        this.setState({ syncMilestones: true });
        this.props.resetApiMilestones();
        this.props.apiFetchMilestones();
      }
      if (!syncRegistration) {
        this.setState({ syncRegistration: true });
        this.props.resetRespondent();
        this.props.resetSubject();
        this.props.apiSyncRegistration(session.api_id);
        this.props.apiSyncSignature(session.api_id);
      }
      if (!syncCalendar && !isEmpty(registration.subject.data)) {
        this.setState({ syncCalendar: true });
        this.props.resetMilestoneCalendar();
        this.props.apiFetchMilestoneCalendar({ subject_id: registration.subject.data.api_id });
      }
      if (
        !syncAnswers &&
        !milestones.apiAnswers.fetched &&
        !isEmpty(registration.respondent.data) &&
        !isEmpty(registration.subject.data)
      ) {
        this.setState({ syncAnswers: true });
        this.props.resetMilestoneAnswers();
        this.props.apiSyncMilestoneAnswers(session.api_id);
      }
      if (
        syncMilestones &&
        milestones.api_milestones.fetched &&
        syncRegistration &&
        registration.apiRespondent.fetched &&
        registration.apiSignature.fetched &&
        syncCalendar &&
        milestones.api_calendar.fetched &&
        syncAnswers &&
        milestones.apiAnswers.fetched
      ) {
        this.setState({ shouldUpdate: false });
        this.props.updateSession({
          registration_state: States.REGISTERED_AS_IN_STUDY,
        });
      }
    }
    if (session.errorMessages && this.state.isSubmitting) {
      this.setState({ isSubmitting: false, errorMessages: session.errorMessages });
    }
  };

  handlePress = () => {
    const { email, password } = this.state;
    this.setState({ isSubmitting: true, errorMessages: [] });
    this.props.apiFetchSignin(email, password);
  };

  handlePasswordLink = () => {
    WebBrowser.openBrowserAsync('http://api.babystepsapp.net/admin/password/new');
  };

  render() {
    const { email, password, isSubmitting, errorMessages } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Sign In</Text>
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          placeholder="email"
          placeholderTextColor={Colors.grey}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={password => this.setState({ password })}
          placeholder="password"
          secureTextEntry
          placeholderTextColor={Colors.grey}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="SIGN IN"
            onPress={this.handlePress}
            buttonStyle={styles.button}
            titleStyle={{ fontWeight: 900 }}
            color={Colors.darkGreen}
            disabled={isSubmitting}
          />
        </View>
        {!isSubmitting && (
          <View styles={styles.passwordContainer}>
            <Text style={styles.passwordLink} onPress={this.handlePasswordLink}>
              Reset My Password
            </Text>
          </View>
        )}
        <View styles={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessages.join('\r\n')}</Text>
        </View>
        {isSubmitting && (
          <View>
            <ActivityIndicator size="large" color={Colors.tint} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: 200,
    height: 40,
    marginBottom: 40,
    marginTop: 20,
  },
  button: {
    width: 200,
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 2,
    borderRadius: 5,
  },
  input: {
    width: 300,
    fontSize: 18,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 5,
    marginVertical: 10,
  },
  passwordContainer: {
    justifyContent: 'center',
  },
  passwordLink: {
    color: Colors.darkGreen,
  },
  errorContainer: {
    justifyContent: 'center',
  },
  errorMessage: {
    color: Colors.red,
  },
});

const mapStateToProps = ({
  session,
  registration,
  milestones,
}) => ({
  session,
  registration,
  milestones,
});

const mapDispatchToProps = {
  resetSession,
  updateSession,
  apiFetchSignin,
  resetApiMilestones,
  apiFetchMilestones,
  resetMilestoneCalendar,
  apiFetchMilestoneCalendar,
  resetMilestoneAnswers,
  apiSyncMilestoneAnswers,
  resetRespondent,
  resetSubject,
  apiSyncRegistration,
  apiSyncSignature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
