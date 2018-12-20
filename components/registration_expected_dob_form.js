import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';

import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import moment from 'moment';

import { connect } from 'react-redux';
import {
  resetSubject,
  createSubject,
  updateSubject,
  apiCreateSubject,
  resetRespondent,
  fetchRespondent,
  updateRespondent,
  apiUpdateRespondent,
} from '../actions/registration_actions';
import { apiCreateMilestoneCalendar } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import DatePicker from './datePickerInput';

import Colors from '../constants/Colors';
import AppStyles from '../constants/Styles';
import States from '../actions/states';

const DatePickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(DatePicker);

const Form = withNextInputAutoFocusForm(View, { submitAfterLastInput: false });

class RegistrationExpectedDOB extends Component {
  state = {
    dobError: null,
    apiCreateSubjectSubmitted: false,
    apiCreateMilestoneCalendarSubmitted: false,
  };

  componentWillMount() {
    this.props.resetSubject();
    this.props.resetRespondent();
    this.props.fetchRespondent();
  }

  componentWillReceiveProps(nextProps) {
    const subject = nextProps.registration.subject;
    const apiSubject = nextProps.registration.apiSubject;
    const apiRespondent = nextProps.registration.apiRespondent;
    const session = nextProps.session;
    if (!subject.fetching && subject.fetched) {
      if (!apiSubject.fetching) {
        if (!apiSubject.fetched && !this.state.apiCreateSubjectSubmitted) {
          this.props.apiCreateSubject(session, subject.data);
          this.setState({ apiCreateSubjectSubmitted: true });
        }
        if (apiSubject.fetched && apiSubject.data.id !== undefined) {
          this.props.updateSubject({ api_id: apiSubject.data.id });
          if (
            !session.fetching &&
            session.registration_state !== States.REGISTERED_AS_IN_STUDY
          ) {
            if (!this.state.apiCreateMilestoneCalendarSubmitted) {
              this.props.apiCreateMilestoneCalendar({
                subject_id: apiSubject.data.id,
              });
              this.setState({ apiCreateMilestoneCalendarSubmitted: true });
            }
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

  _handleOnSubmit = values => {
    const respondent = this.props.registration.respondent;
    const subject = this.props.registration.subject;
    if (values.expected_date_of_birth) {
      const newSubject = {
        ...values,
        respondent_ids: [respondent.data.api_id],
        screening_blood: subject.data.screening_blood,
      };
      this.props.createSubject(newSubject);
    } else {
      this.setState({ dobError: 'You must provide the Expected Date of Birth' });
    }
  };

  render() {
    const dobError = this.state.dobError;
    return (
      <Formik
        onSubmit={this._handleOnSubmit}
        //validationSchema={validationSchema}
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
              <Text style={AppStyles.registrationHeader}>
                Step 3: Update Your Baby&apos;s Profile
              </Text>
              <DatePickerInput
                label="Your Baby's Due Date"
                labelStyle={AppStyles.registrationLabel}
                name="expected_date_of_birth"
                containerStyle={AppStyles.registrationDateContainer}
                date={props.values.expected_date_of_birth}
                handleChange={value => {
                  props.setFieldValue('expected_date_of_birth', value);
                }}
                showIcon={false}
                style={{ width: "100%" }}
                customStyles={{
                  dateInput: AppStyles.registrationDateInput,
                  dateText: AppStyles.registrationDateTextInput,
                }}
                error={props.errors.expected_date_of_birth}
              />

              <Text style={styles.errorText}>{dobError}</Text>

              <View style={AppStyles.registrationButtonContainer}>
                <Button
                  title="NEXT"
                  onPress={props.submitForm}
                  buttonStyle={AppStyles.buttonSubmit}
                  titleStyle={ { fontWeight: 900 } }
                  color={Colors.darkGreen}
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
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
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
  resetRespondent,
  fetchRespondent,
  updateRespondent,
  apiUpdateRespondent,
  apiCreateMilestoneCalendar,
  updateSession,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationExpectedDOB);
