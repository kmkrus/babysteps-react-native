import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  fetchRespondent,
  resetSubject,
  createSubject,
  updateSubject,
  apiCreateSubject,
} from '../actions/registration_actions';
import { apiCreateMilestoneCalendar } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import TextFieldWithLabel from './textFieldWithLabel';
import DatePicker from './datePickerInput';
import Picker from './pickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';
import AppStyles from '../constants/Styles';

const TextField = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(TextFieldWithLabel);
const PickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(Picker);
const DatePickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(DatePicker);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("Your baby's first name is required"),
  last_name: Yup.string()
    .required("Your baby's last name is required"),
  gender: Yup.string()
    .typeError("Your baby's gender is required")
    .required("Your baby's gender is required"),
  conception_method: Yup.string()
    .typeError("Please provide your baby's conception method")
    .required("Please provide your baby's conception method"),
  date_of_birth: Yup.date()
    .typeError("Your baby's date of birth must be a date")
    .required("Your baby's date of birth is required"),
});

const genders = [
  { label: 'Unknown', value: 'unknown' },
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

const conceptionMethods = [
  { label: 'Natural', value: 'natural' },
  { label: 'IVF', value: 'ivf' },
  { label: 'IUI', value: 'iui' },
  { label: 'ICSI', value: 'icsi' },
];

class RegistrationSubjectForm extends Component {
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
    const session = nextProps.session;
    const auth = nextProps.registration.auth;

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
    const respondent = this.props.registration.respondent;
    const subject = this.props.registration.subject;
    const dobError = this.state.dobError;

    return (
      <Formik
        onSubmit={values => {
          if (values.date_of_birth) {
            const newSubject = {
              ...values,
              respondent_ids: [respondent.data.api_id],
              screening_blood: subject.data.screening_blood,
            };
            this.props.createSubject(newSubject);
          } else {
            this.setState({ dobError: 'You must provide the Date of Birth' });
          }
        }}
        validationSchema={validationSchema}
        initialValues={{
          respondent_ids: null,
          gender: 'female',
          date_of_birth: null,
          conception_method: 'natural',
          screening_blood: null,
          outcome: 'live_birth',
        }}
        render={props => {
          return (
            <Form>
              <Text style={AppStyles.registrationHeader}>
                Step 3: Update Your Baby&apos;s Profile
              </Text>
              <TextField
                autoCapitalize="words"
                label="First Name"
                name="first_name"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />
              <TextField
                autoCapitalize="words"
                label="Middle Name"
                name="middle_name"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />
              <TextField
                autoCapitalize="words"
                label="Last Name"
                name="last_name"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />

              <PickerInput
                label="Gender"
                prompt="Gender"
                name="gender"
                data={genders}
                selectedValue={props.values.gender}
                handleChange={value => props.setFieldValue('gender', value)}
                labelStyle={AppStyles.registrationLabel}
                textInputStyle={AppStyles.registrationPickerText}
              />

              <PickerInput
                label="Conception Method"
                prompt="Conception Method"
                name="conception_method"
                data={conceptionMethods}
                selectedValue={props.values.conception_method}
                handleChange={value => props.setFieldValue('conception_method', value)}
                labelStyle={AppStyles.registrationLabel}
                textInputStyle={AppStyles.registrationPickerText}
              />

              <DatePickerInput
                label="Date of Birth"
                labelStyle={AppStyles.registrationLabel}
                name="date_of_birth"
                containerStyle={AppStyles.registrationDateContainer}
                date={props.values.date_of_birth}
                handleChange={ value => {
                  this.setState({ dobError: null });
                  props.setFieldValue('date_of_birth', value);
                }}
                showIcon={false}
                style={{ width: '100%' }}
                customStyles={{
                  dateInput: AppStyles.registrationDateInput,
                  dateText: AppStyles.registrationTextInput,
                }}
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
  fetchRespondent,
  resetSubject,
  createSubject,
  updateSubject,
  apiCreateSubject,
  apiCreateMilestoneCalendar,
  updateSession,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationSubjectForm);
