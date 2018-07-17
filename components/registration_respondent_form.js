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
import { 
  fetchUser, 
  resetRespondent, 
  createRespondent, 
  updateRespondent, 
  apiCreateRespondent,
  apiUpdateRespondent
} from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from '../components/materialTextInput';
import DatePicker from '../components/datePickerInput';
import Picker from '../components/pickerInput';

import States from '../constants/States';
import Colors from '../constants/Colors';
import CONSTANTS from '../constants';

import ActionStates from '../actions/states';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const PickerInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(Picker);
const DatePickerInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(DatePicker);

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

  componentWillMount() {
    this.props.fetchUser()
    this.props.resetRespondent()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.registration.user.fetching || 
      nextProps.registration.respondent.fetching || 
      nextProps.registration.apiRespondent.fetching ) {
      return false
    }
    return true
  }

  componentWillReceiveProps(nextProps, nextState) {
    
    if ( !nextProps.registration.respondent.fetching && nextProps.registration.respondent.fetched ) {
      if (!nextProps.registration.apiRespondent.fetching) {

        if (!nextProps.registration.apiRespondent.fetched) {
          this.props.apiCreateRespondent(nextProps.session, nextProps.registration.respondent.data)
        
        } else {

          // Upload signatture image if we have respondent id
          if (nextProps.registration.apiRespondent.data.id !== undefined ) {
            const api_id = nextProps.registration.apiRespondent.data.id
            
            this.apiSaveSignature( api_id )

            this.props.updateRespondent({ api_id: api_id})

            if (nextProps.registration.respondent.data.pregnant) {
              this.props.updateSession({ registration_state: ActionStates.REGISTERING_EXPECTED_DOB })
            } else {
              this.props.updateSession({ registration_state: ActionStates.REGISTERING_SUBJECT })
            }
          } // apiRespondent.id
        } // apiRespondent.fetched
      } // apiRespondent.fetching
    } // respondent.fetching
  }

  apiSaveSignature = async (api_id) => {
    const uri = Expo.FileSystem.documentDirectory + CONSTANTS.SIGNATURE_DIRECTORY + '/signature.png'
    const getResult = await Expo.FileSystem.getInfoAsync(uri, {size: true})

    if ( getResult.exists ) {
      const maniResult = await Expo.ImageManipulator.manipulate(uri, [], {base64: true})
      const image = 'data:image/png;base64, ' + maniResult.base64
      this.props.apiUpdateRespondent(
        this.props.session, { api_id: api_id, respondent: { attachments: image} }
      )
    } else {
      console.log('no signature available')
    }
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createRespondent(values)
        }}
        validationSchema={validationSchema}
        initialValues={{
          user_id: this.props.registration.user.data.api_id,
          email: this.props.registration.user.data.email,
          first_name: this.props.registration.user.data.first_name,
          last_name: this.props.registration.user.data.last_name,
          respondent_type: 'mother',
          state: 'IA',
          marital_status: 'married',
          accepted_tos_at: new Date().toISOString(),
          pregnant: false,
        }}
        render={ (props) => {

          return (
            <Form>
              <Text style={styles.form_header}>Step 2: Update Your Profile.</Text>

              <PickerInput
                label='Relationship'
                prompt='Relationship'
                name='respondent_type'
                data={respondentTypes}
                selectedValue={props.values.respondent_type}
                handleChange={ (value) => props.setFieldValue('respondent_type', value) }
              />

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

              <Text style={styles.label}>Are You Currently Pregnant?</Text>
              <CheckBox
                title='Yes'
                checked={ props.values.pregnant }
                containerStyle={ styles.checkboxContainer }
                textStyle={ styles.checkboxText }
                onPress={ (value) => props.setFieldValue('pregnant', true) }
              />
              <CheckBox
                title='No'
                checked={ !props.values.pregnant }
                containerStyle={ styles.checkboxContainer }
                textStyle={ styles.checkboxText }
                onPress={ (value) => props.setFieldValue('pregnant', false) }
              />

              <View style={styles.buttonContainer}>
                <Button 
                  title="NEXT"
                  onPress={ props.handleSubmit } 
                  color={Colors.green}
                  disabled={ props.isSubmitting }
                />
              </View>
            </Form>
          );
        }}
      />
    )
  }
};

const styles = StyleSheet.create({
  form_header: {
    fontSize: 18,
    marginBottom: 16,
  },
  label: {
    marginTop: 20,
  },
  checkboxContainer: {
    margin: 0,
    padding:0,
    backgroundColor: Colors.backgroundColor,
  },
  checkboxText: {
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
  }
})

const mapStateToProps = ({ session, registration }) => ({ session, registration });
const mapDispatchToProps = { 
  fetchUser, 
  resetRespondent,
  createRespondent, 
  updateRespondent, 
  apiCreateRespondent,
  apiUpdateRespondent,
  updateSession 
};

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationRespondentForm);