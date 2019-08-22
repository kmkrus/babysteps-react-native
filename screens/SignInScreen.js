import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { WebBrowser } from 'expo';

import isEmpty from 'lodash/isEmpty';

import { connect } from 'react-redux';
import {
  resetSession,
  apiFetchSignin,
  updateSession,
} from '../actions/session_actions';

import {
  apiFetchMilestones,
  apiFetchMilestoneCalendar,
  apiSyncMilestoneAnswers,
} from '../actions/milestone_actions';

import {
  apiSyncRegistration,
  apiSyncSignature,
} from '../actions/registration_actions';

import States from '../actions/states';
import Colors from '../constants/Colors';

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  };

  state = {
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

  componentWillMount() {
    this.props.resetSession();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const {
      syncMilestones,
      syncRegistration,
      syncCalendar,
      syncAnswers,
    } = this.state;
    const session = nextProps.session;
    const milestones = nextProps.milestones;
    const registration = nextProps.registration;

    if (!session.fetching) {
      if (session.fetched) {
        this.setState({ shouldUpdate: false });
        if (!syncMilestones) {
          this.setState({ syncMilestones: true });
          this.props.apiFetchMilestones();
        }
        if (!syncRegistration) {
          this.setState({ syncRegistration: true });
          this.props.apiSyncRegistration(session.api_id);
          this.props.apiSyncSignature(session.api_id);
        }
        if (!syncCalendar && !isEmpty(registration.subject.data)) {
          this.setState({ syncCalendar: true });
          this.props.apiFetchMilestoneCalendar({ subject_id: registration.subject.data.api_id });
        }
        if (
          !syncAnswers &&
          !milestones.apiAnswers.fetched &&
          !isEmpty(registration.respondent.data) &&
          !isEmpty(registration.subject.data)
        ) {
          this.setState({ syncAnswers: true });
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
          this.props.updateSession({
            registration_state: States.REGISTERED_AS_IN_STUDY,
          });
        }
      }
      if (session.errorMessages) {
        this.setState({ isSubmitting: false, errorMessages: session.errorMessages });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  }

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
  apiFetchMilestones,
  apiFetchMilestoneCalendar,
  apiSyncMilestoneAnswers,
  apiSyncRegistration,
  apiSyncSignature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
