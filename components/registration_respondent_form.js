import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, CheckBox } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';

import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  fetchUser,
  resetRespondent,
  createRespondent,
  updateRespondent,
  apiCreateRespondent,
  apiUpdateRespondent,
  apiSaveSignature,
} from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import DatePicker from './datePickerInput';
import Picker from './pickerInput';
import TextFieldWithLabel from './textFieldWithLabel';

import States from '../constants/States';
import Colors from '../constants/Colors';
import AppStyles from '../constants/Styles';
import CONSTANTS from '../constants';

import ActionStates from '../actions/states';

const TextField = compose(withInputAutoFocus, withNextInputAutoFocusInput)(TextFieldWithLabel);
const PickerInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(Picker);
const DatePickerInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(DatePicker);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  respondent_type: Yup.string()
    .typeError('Relationship is required')
    .required('Relationship is required'),
  address_1: Yup.string()
    .required('Address is required'),
  city: Yup.string()
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  zip_code: Yup.string()
    .required('Zip code is required')
    .matches(/\d{5}/, 'Zip code must be 5 digits'),
  home_phone: Yup.string()
    .required('Home phone is required'),
  date_of_birth: Yup.date()
    .typeError('Date of birth must be a valid date')
    .required('Date of birth is required'),
  drivers_license_number: Yup.string()
    .required("Driver's license number is required"),
  marital_status: Yup.string()
    .required('Marital status is required'),
  weight: Yup.number('Weight must be a number')
    .typeError('Weight must be a number')
    .required('Weight is required')
    .positive('Weight must be greater than 0'),
  height: Yup.number()
    .typeError('Height must be a number')
    .required('Height is required')
    .positive('Height must be greater than 0'),
});

const respondentTypes = [
  { label: 'Mother', value: 'mother' },
  { label: 'Father', value: 'father' },
  { label: 'Guardian', value: 'guardian' },
  { label: 'Other', value: 'other' },
];

const maritalStatuses = [
  { label: 'Married', value: 'married' },
  { label: 'Single', value: 'single' },
  { label: 'Living With Father', value: 'living_with_father' },
  { label: 'Living With Other', value: 'living_with_other' },
];

class RegistrationRespondentForm extends Component {
  state = {
    signature_submitted: false,
  };

  componentWillMount() {
    this.props.fetchUser();
    this.props.resetRespondent();
  }

  componentWillReceiveProps(nextProps) {
    const respondent = nextProps.registration.respondent;
    const apiRespondent = nextProps.registration.apiRespondent;
    const registration = nextProps.registration;
    if (!respondent.fetching && respondent.fetched) {
      if (!apiRespondent.fetching) {
        if (!apiRespondent.fetched) {
          this.props.apiCreateRespondent(nextProps.session, respondent.data);
        } else if (apiRespondent.data.id !== undefined) {
          // Upload signature image if we have respondent id
          const api_id = apiRespondent.data.id;
          this.props.updateRespondent({api_id: api_id});
          if (!this.state.signature_submitted) {
            this.saveSignature(api_id);
            this.setState({ signature_submitted: true });
          }
          if (this.props.registration.auth !== nextProps.registration.auth) {
            this.props.updateSession({
              access_token: registration.auth.accessToken,
              client: registration.auth.client,
              uid: registration.auth.uid,
              user_id: registration.auth.user_id,
            });
          }
          if (respondent.data.pregnant) {
            this.props.updateSession({
              registration_state: ActionStates.REGISTERING_EXPECTED_DOB,
            });
          } else {
            this.props.updateSession({
              registration_state: ActionStates.REGISTERING_SUBJECT,
            });
          }
        } // apiRespondent.fetched
      } // apiRespondent.fetching
    } // respondent.fetching
  }

  shouldComponentUpdate(nextProps) {
    const registration = nextProps.registration;
    if (
      registration.user.fetching ||
      registration.respondent.fetching ||
      registration.apiRespondent.fetching
    ) {
      return false;
    }
    return true;
  }

  saveSignature = async (api_id) => {
    const uri = Expo.FileSystem.documentDirectory + CONSTANTS.SIGNATURE_DIRECTORY + '/signature.png';
    const signatureFile = await Expo.FileSystem.getInfoAsync(uri, {size: true});
    if (signatureFile.exists) {
      this.props.apiSaveSignature(this.props.session, api_id, uri);
    } else {
      console.log('no signature available');
    } // signatureFile exists
  };

  render() {
    const user = this.props.registration.user;
    return (
      <Formik
        onSubmit={values => {
          const respondent = {...values,
            user_id: user.data.api_id,
            email: user.data.email,
            first_name: user.data.first_name,
            last_name: user.data.last_name,
            accepted_tos_at: new Date().toISOString(),
          }
          this.props.createRespondent(respondent);
        }}
        validationSchema={validationSchema}
        initialValues={{
          respondent_type: 'mother',
          state: 'IA',
          marital_status: 'married',
          pregnant: false,
        }}
        render={props => {
          return (
            <Form>
              <Text style={AppStyles.registrationHeader}>Step 2: Update Your Profile</Text>

              <PickerInput
                label="Relationship"
                labelStyle={AppStyles.registrationLabel}
                textInputStyle={AppStyles.registrationPickerText}
                prompt="Relationship"
                name="respondent_type"
                data={respondentTypes}
                selectedValue={props.values.respondent_type}
                handleChange={value => props.setFieldValue('respondent_type', value)}
              />

              <TextField
                autoCapitalize="words"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="Address 1"
                name="address_1"
              />
              <TextField
                autoCapitalize="words"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="Address 2"
                name="address_2"
              />
              <TextField
                autoCapitalize="words"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="City"
                name="city"
              />
              <PickerInput
                label="State"
                labelStyle={AppStyles.registrationLabel}
                textInputStyle={AppStyles.registrationPickerText}
                prompt="State"
                name="state"
                data={States}
                selectedValue={props.values.state}
                handleChange={value => props.setFieldValue('state', value)}
              />
              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                keyboardType="number-pad"
                label="Zip Code"
                name="zip_code"
                returnKeyType="done"
              />
              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                keyboardType="phone-pad"
                label="Home Phone"
                name="home_phone"
                returnKeyType="done"
                type="tel"
              />
              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                keyboardType="phone-pad"
                label="Other Phone"
                name="other_phone"
                returnKeyType="done"
                type="tel"
              />
              <DatePickerInput
                label="Date of Birth"
                labelStyle={AppStyles.registrationLabel}
                name="date_of_birth"
                containerStyle={AppStyles.registrationDateContainer}
                date={props.values.date_of_birth}
                handleChange={value =>
                  props.setFieldValue('date_of_birth', value)
                }
                showIcon={ false }
                style={{ width: "100%" }}
                customStyles={{
                  dateInput: AppStyles.registrationDateInput,
                  dateText: AppStyles.registrationDateTextInput,
                }}
              />

              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="Driver's License Number"
                name="drivers_license_number"
              />

              <PickerInput
                label="Marital Status"
                labelStyle={AppStyles.registrationLabel}
                textInputStyle={AppStyles.registrationPickerText}
                prompt="Marital Status"
                name="marital_status"
                data={maritalStatuses}
                selectedValue={props.values.marital_status}
                handleChange={value => props.setFieldValue('marital_status', value)}
              />

              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="Weight"
                name="weight" 
                type="text"
                returnKeyType="done"
                keyboardType="numeric"
                helper="In pounds"
              />
              <TextField
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
                label="Height"
                name="height"
                type="text"
                returnKeyType="done"
                keyboardType="numeric"
                helper="In inches"
              />

              <View style={AppStyles.registrationCheckBoxes}>
                <Text style={[AppStyles.registrationLabel, {marginTop: 20, marginBottom: 10}]}>Are You Currently Pregnant?</Text>
                <CheckBox
                  title="Yes"
                  checked={props.values.pregnant}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  onPress={() => props.setFieldValue('pregnant', true)}
                />
                <CheckBox
                  title="No"
                  checked={!props.values.pregnant}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  onPress={() => props.setFieldValue('pregnant', false)}
                />
              </View>

              <View style={AppStyles.registrationButtonContainer}>
                <Button
                  title="NEXT"
                  onPress={props.submitForm}
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
    )
  }
};

const styles = StyleSheet.create({
  checkboxContainer: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
    backgroundColor: Colors.backgroundColor,
  },
  checkboxText: {
    fontSize: 12,
  },
});

const mapStateToProps = ({ session, registration }) => ({ session, registration });
const mapDispatchToProps = {
  fetchUser,
  resetRespondent,
  createRespondent,
  updateRespondent,
  apiCreateRespondent,
  apiUpdateRespondent,
  apiSaveSignature,
  updateSession,
};



export default connect( mapStateToProps, mapDispatchToProps )(RegistrationRespondentForm);
