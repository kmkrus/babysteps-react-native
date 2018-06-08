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
import { createSubject } from '../actions/registration_actions';

import MaterialTextInput from '../components/materialTextInput';
import DatePickerInput from '../components/datePickerInput';
import PickerInput from '../components/pickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  expected_date_of_birth:  Yup.string()
    .required('Expected Date of Birth is Required'),
})

const genders = [
  { label: "Unknown", value: "unknown"},
  { label: "Female", value: "female"},
  { label: "Male", value: "male"},
]

const conceptionMethods = [
  { label: "Natural", value: "natural"},
  { label: "IVF", value: "ivf"},
  { label: "IUI", value: "iui"},
  { label: "ICSI", value: "icsi"},
]

class RegistrationSubjectForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return ( !nextProps.registration.subject.fetching)
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createSubject(values);
        }}
        validationSchema={validationSchema}
        initialValues={{
          'respondent_ids[]': this.props.registration.respondent.data.id,
          gender: 'female',
          conception_method: 'natural',
          expected_date_of_birth: null,
          date_of_birth: null,
        }}
        render={ (props) => {

          return (
            <Form>
              <Text h4>Add your baby's information...</Text>
              <TextInput label="First Name" name="first_name" type="name" />
              <TextInput label="Middle Name" name="middle_name" type="name" />
              <TextInput label="Last Name" name="last_name" type="name" />
              
              <PickerInput
                label='Gender'
                prompt='Gender'
                name='gender'
                data={genders}
                selectedValue={props.values.gender}
                handleChange={ (value) => props.setFieldValue('gender', value) }
              />

              <PickerInput
                label='Conception Method'
                prompt='Conception Method'
                name='conception_method'
                data={conceptionMethods}
                selectedValue={props.values.conception_method}
                handleChange={ (value) => props.setFieldValue('conception_method', value) }
              />

              <DatePickerInput
                label="Expected Date of Birth" 
                name="expected_date_of_birth" 
                date={props.values.expected_date_of_birth}
                handleChange={ (value) => props.setFieldValue('expected_date_of_birth', value) }
              />

              <DatePickerInput
                label="Date of Birth" 
                name="date_of_birth" 
                date={props.values.date_of_birth}
                handleChange={ (value) => props.setFieldValue('date_of_birth', value) }
              />

              <TextInput label="Days Premature" name="days_premature" type="name" />

              <Button 
                title="NEXT" 
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
const mapDispatchToProps = { createSubject };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationSubjectForm);