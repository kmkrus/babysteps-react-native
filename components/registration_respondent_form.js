import React, { Component } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native';
import { Text, CheckBox } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { _ } from 'lodash';

import { connect } from 'react-redux';
import { createRespondent, updateRespondent, apiCreateRespondent } from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from '../components/materialTextInput';
import DatePickerInput from '../components/datePickerInput';
import PickerInput from '../components/pickerInput';

import States from '../constants/States';
import Colors from '../constants/Colors';

import ActionStates from '../actions/states';

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
    if ( nextProps.registration.respondent.fetching ) {
      return false
    } else if (nextProps.registration.respondent.fetched) {

      if (nextProps.registration.apiRespondent.error != null) {
        return true

      } else if (!nextProps.registration.apiRespondent.fetching && !nextProps.registration.apiRespondent.fetched) {
        this.props.apiCreateRespondent(nextProps.session, nextProps.registration.respondent.data)
        return false
      } else if (nextProps.registration.apiRespondent.fetched) {
        // Upload signatture image if we have respondent id
        //if (this.props.registration.apiRespondent.data.id !== undefined ) {
        //  const fileName = Expo.FileSystem.cacheDirectory + 'signature/signature.png'
        //  const image = Expo.FileSystem.readAsStringAsync(fileName)
        //  const api_id = this.props.registration.apiRespondent.data.id
        //  const accepted_tos_at = new Date().toISOString()
        //  this.props.apiUpdateRespondent( { api_id: api_id, respondent: { accepted_tos_at: accepted_tos_at,  'attachments[]': image } } )
        //}
        this.props.updateRespondent({ api_id: nextProps.registration.apiRespondent.data.id})

        if (nextProps.registration.respondent.data.pregnant) {
          this.props.updateSession({ registration_state: ActionStates.REGISTERING_EXPECTED_DOB })
        } else {
          this.props.updateSession({ registration_state: ActionStates.REGISTERING_SUBJECT })
        }
      } 

    }
    return true
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createRespondent(values)
        }}
        validationSchema={validationSchema}
        initialValues={{
          user_id: this.props.registration.user.data.id,
          email: this.props.registration.user.data.email,
          first_name: this.props.registration.user.data.first_name,
          last_name: this.props.registration.user.data.last_name,
          respondent_type: 'mother',
          state: 'IA',
          marital_status: 'married',
          pregnant: true,
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

              <CheckBox
                title='Are You Currently Pregnant?'
                textStyle={styles.checkboxText}
                checked={props.values.pregnant}
                onPress={ (value) => props.setFieldValue('pregnant', value) }
              />

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

const styles = StyleSheet.create({
  checkboxText: {
    fontSize: 11,
  }
})

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { createRespondent, updateRespondent, apiCreateRespondent, updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationRespondentForm);