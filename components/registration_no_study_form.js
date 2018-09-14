import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  createRespondent,
  createSubject,
} from '../actions/registration_actions';
import {
  apiFetchMilestones,
  apiCreateMilestoneCalendar,
} from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from './materialTextInput';
import DatePicker from './datePickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const TextInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(MaterialTextInput);
const DatePickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(DatePicker);
const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Your First Name is Required'),
  last_name: Yup.string()
    .required('Your Last Name is Required'),
});

class RegistrationNoStudyForm extends Component {
  state = {
    dobError: null,
  };

  componentWillMount() {
    this.props.apiFetchMilestones();
  }

  componentWillReceiveProps(nextProps) {
    const respondent = nextProps.registration.respondent;
    const subject = nextProps.registration.subject;
    if (!respondent.fetching && !subject.fetching) {
      if (subject.fetched && subject.fetched) {
        if (subject.data.expected_date_of_birth) {
          this.props.apiCreateMilestoneCalendar({
            base_date: subject.data.expected_date_of_birth,
          });
        }
        this.props.updateSession({
          registration_state: States.REGISTERED_AS_NO_STUDY,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const respondent = nextProps.registration.respondent;
    const subject = nextProps.registration.subject;
    return (!respondent.fetching && !subject.fetching)
  }

  render() {
    return (
      <Formik
        onSubmit={ values => {
          if (values.expected_date_of_birth) {
            this.props.createRespondent({
              first_name: values.first_name,
              last_name: values.last_name,
              date_of_birth: values.date_of_birth,
            });
            this.props.createSubject({ expected_date_of_birth: values.expected_date_of_birth });
          } else {
            this.setState({ dobError: 'You must provide the Expected Date of Birth' })
          }
        }}
        validationSchema={validationSchema}
        initialValues={{
          expected_date_of_birth: null,
        }}
        render={ props => {
          return (
            <Form>
              <TextInput
                label="Your First Name"
                name="first_name"
                type="name"
              />
              <TextInput
                label="Your Last Name"
                name="last_name"
                type="name"
              />
              <DatePickerInput
                label="Your Date of Birth"
                name="date_of_birth"
                date={props.values.date_of_birth}
                handleChange={value => props.setFieldValue('date_of_birth', value)}
              />
              <DatePickerInput
                label="Your Baby's Due Date"
                name="expected_date_of_birth" 
                date={props.values.expected_date_of_birth}
                handleChange={ value => {
                  this.setState({ dobError: null });
                  props.setFieldValue('expected_date_of_birth', value);
                }}
              />
              <Text style={styles.errorText}>{this.state.dobError}</Text>
              <Button
                title="DONE"
                onPress={props.handleSubmit}
                color={Colors.green}
              />
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

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = {
  createRespondent,
  createSubject,
  apiFetchMilestones,
  apiCreateMilestoneCalendar,
  updateSession,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationNoStudyForm);
