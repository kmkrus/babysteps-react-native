import React, { Component } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  Keyboard
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
import { createRespondent, apiCreateRespondent } from '../actions/registration_actions';

import MaterialTextInput from '../components/materialTextInput';
import DatePickerInput from '../components/datePickerInput';
import PickerInput from '../components/pickerInput';

import States from '../constants/States';
import Colors from '../constants/Colors';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  //first_name: Yup.string()
    //.required('First Name is Required'),
  //last_name: Yup.string()
    //.required('Last Name is Required'),
  //email: Yup.string()
    //.required('Email Address is Required')
    //.email("Not a Valid Email Address"),
  
})

const respondentTypes = [
  { label: "Mother", value: "mother"},
  { label: "Father", value: "father"},
  { label: "Guardian", value: "guardian"},
  { label: "Other", value: "other"}
]

const maritalStatuses = [
  { label: "Married", value: "married"},
  { label: "Single", value: "single"},
  { label: "Living With Father", value: "living_with_father"},
  { label: "Living With Other", value: "living_with_other"}
]

class RegistrationRespondentForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return ( !this.props.registration.respondent.fetching )
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createRespondent(values)
        }}
        validationSchema={validationSchema}
        initialValues={{
          email: this.props.registration.user.data.email,
          first_name: this.props.registration.user.first_name,
          last_name: this.props.registration.user.last_name,
          respondent_type: 'mother',
          state: 'IA',
          marital_status: 'married'
        }}
        render={ (props) => {
          return (
            <Form>
              <Text h4>Update your profile...</Text>

              <PickerInput
                label='Relationship'
                prompt='Relationship'
                name='respondent_type'
                data={respondentTypes}
                selectedValue={props.values.respondent_type}
                handleChange={ (value) => props.setFieldValue('respondent_type', value) }
              />
              
              <TextInput label="First Name" name="first_name" type="name" />
              <TextInput label="Middle Name" name="middle_name" type="name" />
              <TextInput label="Last Name" name="last_name" type="name" />

              <TextInput label="Address 1" name="address_1" type="text" />
              <TextInput label="Address 2" name="address_2" type="text" />
              <TextInput label="City" name="city" type="text" />
              <PickerInput
                label='State'
                prompt='State'
                name='state'
                data={States}
                selectedValue={props.values.state}
                handleChange={ (value) => props.setFieldValue('state', value) }
              />
              <TextInput label="Zip Code" name="zip_code" type="text" />

              <TextInput label="Email" name="email" type="email" />
              <TextInput label="Home Phone" name="home_phone" type="tel" />
              <TextInput label="Other Phone" name="other_phone" type="tel" />
              
              <DatePickerInput
                label="Date of Birth" 
                name="date_of_birth" 
                date={props.values.date_of_birth}
                handleChange={ (value) => props.setFieldValue('date_of_birth', value) }
              />
              
              <TextInput label="Driver's License Number" name="drivers_license_number" type="text" />

              <PickerInput
                label='Marital Status'
                prompt='Marital Status'
                name='marital_status'
                data={maritalStatuses}
                selectedValue={props.values.marital_status}
                handleChange={ (value) => props.setFieldValue('marital_status', value) }
              />
 
              <TextInput label="Weight" name="weight" type="text" keyboardType="number-pad" helper="In pounds" />
              <TextInput label="Height" name="height" type="text" keyboardType="number-pad" helper="In inches" />

              <Button 
                title="NEXT"
                onPress={ props.handleSubmit } 
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
const mapDispatchToProps = { createRespondent, apiCreateRespondent };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationRespondentForm);