import React, { Component } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform
} from 'react-native';
import { Text } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import { createRespondent, createSubject } from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from '../components/materialTextInput';
import DatePickerInput from '../components/datePickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  first_name:  Yup.string()
    .required('Your First Name is Required'),
  last_name:  Yup.string()
    .required('Your Last Name is Required'),
})

class RegistrationNoStudyForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if ( !nextProps.registration.respondent.fetching && !nextProps.registration.subject.fetching) {
      return false
    } else {
      this.props.updateSession({registration_state: States.REGISTERED_AS_NO_STUDY});
    }
    return true;
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createRespondent({
            first_name: values.first_name,
            last_name: values.last_name,
            date_of_birth: values.date_of_birth
          });
          this.props.createSubject({expected_date_of_birth: values.expected_date_of_birth});
          
        }}
        validationSchema={validationSchema}
        initialValues={{
          expected_date_of_birth: null,
        }}
        render={ (props) => {

          return (
            <Form>
              <TextInput label="Your First Name" name="first_name" type="name" />
              <TextInput label="Your Last Name" name="last_name" type="name" />

              <DatePickerInput
                label="Your Date of Birth" 
                name="date_of_birth" 
                date={props.values.date_of_birth}
                handleChange={ (value) => props.setFieldValue('date_of_birth', value) }
              />
              
              <DatePickerInput
                label="Your Baby's Due Date" 
                name="expected_date_of_birth" 
                date={props.values.expected_date_of_birth}
                handleChange={ (value) => props.setFieldValue('expected_date_of_birth', value) }
              />

              <Button 
                title="DONE" 
                onPress={props.handleSubmit} 
                color={Colors.green}
                disabled={ props.isSubmitting }
              />

            </Form>
          );
        }}
      />
    )
  }
};

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { createRespondent, createSubject, updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationNoStudyForm);