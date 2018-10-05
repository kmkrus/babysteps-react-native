import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  resetSubject,
  createSubject,
  updateSubject,
  apiCreateSubject,
  fetchRespondent,
} from '../actions/registration_actions';
import { apiCreateMilestoneCalendar } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import DatePicker from './datePickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';
import AppStyles from '../constants/Styles';

const DatePickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(DatePicker);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  //expected_date_of_birth: Yup.string()
  //  .required('Expected Date of Birth is Required'),
});

class RegistrationExpectedDOB extends Component {
  state = {
    dobError: null,
    submitted: false,
  };

  componentWillMount() {
    this.props.resetSubject();
    this.props.fetchRespondent();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const subject = nextProps.registration.subject;
    const apiSubject = nextProps.registration.apiSubject;
    const auth = nextProps.registration.auth;
    const session = nextProps.session;
    if (!subject.fetching && subject.fetched) {
      if (!apiSubject.fetching) {
        if (!apiSubject.fetched && !nextState.submitted) {
          this.props.apiCreateSubject(session, subject.data);
          this.setState({ submitted: true });
        } else if (apiSubject.data.id !== undefined) {
          this.props.updateSubject({ api_id: apiSubject.data.id });
          if (this.props.registration.auth !== nextProps.registration.auth) {
            this.props.updateSession({
              access_token: auth.accessToken,
              client: auth.client,
              uid: auth.uid,
              user_id: auth.user_id,
            });
          }
          if (
            !session.fetching &&
            session.registration_state !== States.REGISTERED_AS_IN_STUDY
          ) {
            this.props.apiCreateMilestoneCalendar({
              subject_id: apiSubject.data.id,
            });
            this.props.updateSession({
              registration_state: States.REGISTERED_AS_IN_STUDY,
            });
          }
        } // apiSubject fetched
      } // apiSubject fetching
    } // subject fetching
  }

  shouldComponentUpdate(nextProps) {
    const subject = nextProps.registration.subject;
    const apiSubject = nextProps.registration.apiSubject;
    const respondent = nextProps.registration.respondent;
    const session = nextProps.session;
    if (
      subject.fetching ||
      respondent.fetching ||
      apiSubject.fetching ||
      session.fetching
    ) {
      return false;
    }
    return true;
  }

  render() {
    const registration = this.props.registration;
    return (
      <Formik
        onSubmit={values => {
          if (values.expected_date_of_birth) {
            const subject = {...values,
              respondent_ids: [registration.respondent.data.api_id],
              screening_blood: registration.subject.data.screening_blood,
            };
            this.props.createSubject(subject);
          } else {
            this.setState({
              dobError: 'You must provide the Expected Date of Birth',
            });
          }
        }}
        validationSchema={validationSchema}
        initialValues={{
          respondent_ids: null,
          gender: 'unknown',
          expected_date_of_birth: null,
          conception_method: 'natural',
          screening_blood: null,
        }}
        render={props => {
          return (
            <Form>
              <Text style={AppStyles.registrationHeader}>Step 3: Due Date</Text>
              <DatePickerInput
                label="Due Date"
                labelStyle={AppStyles.registrationLabel}
                name="expected_date_of_birth"
                date={props.values.expected_date_of_birth}
                handleChange={value => {
                  this.setState({ dobError: null });
                  props.setFieldValue('expected_date_of_birth', value);
                }}
                showIcon={ false }
                style={{ width: "100%", marginLeft: 20 }}
                customStyles={{
                  dateInput: AppStyles.registrationDateInput,
                  dateText: AppStyles.registrationDateTextInput,
                }}
              />
              <Text style={styles.errorText}>{this.state.dobError}</Text>
              <View style={AppStyles.registrationButtonContainer}>
                <Button
                  title="NEXT"
                  onPress={props.handleSubmit}
                  buttonStyle={AppStyles.buttonSubmit}
                  titleStyle={{fontWeight: 900}}
                  color={Colors.darkGreen}
                  disabled={props.isSubmitting}
                />
              </View>
            </Form>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    marginTop: -20,
    marginBottom: 20,
    color: Colors.errorColor,
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});

const mapDispatchToProps = {
  resetSubject,
  createSubject,
  updateSubject,
  apiCreateSubject,
  fetchRespondent,
  apiCreateMilestoneCalendar,
  updateSession,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationExpectedDOB);
