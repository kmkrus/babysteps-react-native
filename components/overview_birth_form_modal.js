import React, { Component } from 'react';
import { Text, View, Modal, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

import find from 'lodash/find';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  updateSubject,
  apiUpdateSubject,
} from '../actions/registration_actions';

import TextFieldWithLabel from './textFieldWithLabel';
import DatePicker from './datePickerInput';
import PickerInput from './pickerInput';

import Colors from '../constants/Colors';
import AppStyles from '../constants/Styles';

//const TextField = TextFieldWithLabel;
//const PickerInputField = PickerInput;
//const DatePickerInput = DatePicker;

const TextField = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(TextFieldWithLabel);
const PickerInputField = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(PickerInput);
const DatePickerInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(DatePicker);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  outcome: Yup.string()
    .typeError('Outcome of your pregnancy is required')
    .required('Outcome of your pregnancy is required'),
  first_name: Yup.string().when('outcome', {
    is: 'live_birth',
    then: Yup.string().required("Your baby's first name is required"),
  }),
  last_name: Yup.string().when('outcome', {
    is: 'live_birth',
    then: Yup.string().required("Your baby's last name is required"),
  }),
  gender: Yup.string().when('outcome', {
    is: 'live_birth',
    then: Yup.string()
      .typeError("Your baby's gender is required")
      .required("Your baby's gender is required"),
  }),
  conception_method: Yup.string().when('outcome', {
    is: 'live_birth',
    then: Yup.string()
      .typeError("Please provide your baby's conception method")
      .required("Please provide your baby's conception method"),
  }),
});

const outcomes = [
  { label: 'Live Birth', value: 'live_birth' },
  { label: 'Miscarriage', value: 'miscarriage' },
  { label: 'Still Birth', value: 'still_birth' },
];

const genders = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

const conceptionMethods = [
  { label: 'Natural', value: 'natural' },
  { label: 'IVF', value: 'ivf' },
  { label: 'IUI', value: 'iui' },
  { label: 'ICSI', value: 'icsi' },
];

const { width, height } = Dimensions.get('window');
const twoButtonWidth = (width / 2) - 30;

class OverviewBirthFormModal extends Component {
  state = {
    submitted: false,
    outcomeIsLiveBirth: true,
    outcome: 'live_birth',
    dateError: null,
  };

  _handleOutcomeChange = value => {
    this.node.setFieldValue('outcome', value);
    if (value === 'live_birth') {
      this.setState({ outcomeIsLiveBirth: true, outcome: value });
      this.node.setFieldValue('date_of_loss', null);
    } else {
      this.setState({ outcomeIsLiveBirth: false, outcome: value });
      this.node.setFieldValue('date_of_birth', null);
    }
  };

  _onSubmit = values => {
    if (values.outcome === 'live_birth') {
      if (!values.date_of_birth) {
        this.setState({ dateError: 'You must provide the Date of Birth' });
        return null;
      }
    } else if (!values.date_of_loss) {
      this.setState({ dateError: 'You must provide the Date of Loss' });
      return null;
    }
    this.props.updateSubject(values);
    if (values.api_id) {
      this.props.apiUpdateSubject(this.props.session, values);
    }
    this.props.closeModal();
  }

  render() {
    const subject = this.props.registration.subject.data;
    const dateError = this.state.dateError;
    const outcomeIsLiveBirth = this.state.outcomeIsLiveBirth;
    const dateLabel = find(outcomes, ['value', this.state.outcome])
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Formik
            ref={ref => (this.node = ref)}
            onSubmit={values => this._onSubmit(values)}
            validationSchema={validationSchema}
            initialValues={{
              api_id: subject.api_id,
              outcome: 'live_birth',
              gender: subject.gender,
              date_of_birth: new Date().toISOString(),
              conception_method: subject.conception_method,
            }}
            render={props => {
              return (
                <Form>
                  <Text style={AppStyles.registrationHeader}>
                    Update Your Baby&apos;s Profile
                  </Text>

                  <PickerInput
                    label="Outcome of Your Pregnancy"
                    prompt="Outcome"
                    name="outcome"
                    data={outcomes}
                    selectedValue={props.values.outcome}
                    handleChange={(value) => this._handleOutcomeChange(value)}
                    labelStyle={AppStyles.registrationLabel}
                    textInputStyle={AppStyles.registrationPickerText}
                  />

                  {outcomeIsLiveBirth && (
                    <View>
                      <DatePickerInput
                        label="Date of Birth"
                        labelStyle={AppStyles.registrationLabel}
                        name="date_of_birth"
                        containerStyle={AppStyles.registrationDateContainer}
                        date={props.values.date_of_birth}
                        handleChange={value => {
                          this.setState({ dateError: null });
                          props.setFieldValue('date_of_birth', value);
                        }}
                        showIcon={false}
                        style={{ width: '100%' }}
                        customStyles={{
                          dateInput: AppStyles.registrationDateInput,
                          dateText: AppStyles.registrationTextInput,
                        }}
                      />
                      <Text style={styles.errorText}>{dateError}</Text>

                      <PickerInputField
                        label="Conception Method"
                        prompt="Conception Method"
                        name="conception_method"
                        data={conceptionMethods}
                        selectedValue={props.values.conception_method}
                        handleChange={value => props.setFieldValue('conception_method', value)}
                        labelStyle={AppStyles.registrationLabel}
                        textInputStyle={AppStyles.registrationPickerText}
                      />

                      <PickerInputField
                        label="Gender"
                        prompt="Gender"
                        name="gender"
                        data={genders}
                        selectedValue={props.values.gender}
                        handleChange={value => props.setFieldValue('gender', value)}
                        labelStyle={AppStyles.registrationLabel}
                        textInputStyle={AppStyles.registrationPickerText}
                      />

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
                    </View>
                  )}

                  {!outcomeIsLiveBirth && (
                    <View>
                      <DatePickerInput
                        label={`Date of ${dateLabel.label}`}
                        labelStyle={AppStyles.registrationLabel}
                        name="date_of_loss"
                        containerStyle={AppStyles.registrationDateContainer}
                        date={props.values.date_of_loss}
                        handleChange={value => {
                          this.setState({ dateError: null });
                          props.setFieldValue('date_of_loss', value);
                        }}
                        showIcon={false}
                        style={{ width: '100%' }}
                        customStyles={{
                          dateInput: AppStyles.registrationDateInput,
                          dateText: AppStyles.registrationTextInput,
                        }}
                      />
                      <Text style={styles.errorText}>{dateError}</Text>
                      <Text style={styles.notLiveBirthText}>
                        We&apos;re so sorry to hear of your loss. We appreciate
                        the contribution you have made to this study.
                      </Text>
                    </View>
                  )}

                  <View style={AppStyles.registrationButtonContainer}>
                    <Button
                      color={Colors.grey}
                      buttonStyle={styles.buttonOneStyle}
                      titleStyle={styles.buttonTitleStyle}
                      onPress={this.props.closeModal}
                      title="CANCEL"
                    />
                    <Button
                      color={Colors.pink}
                      buttonStyle={styles.buttonTwoStyle}
                      titleStyle={styles.buttonTitleStyle}
                      onPress={props.submitForm}
                      title="SAVE"
                    />
                  </View>
                </Form>
              );
            }}
          />
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    marginTop: -5,
    marginBottom: 20,
    marginLeft: 20,
    color: Colors.errorColor,
  },
  notLiveBirthText: {
    fontSize: 16,
    margin: 30,
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    flex: 1,
    width: twoButtonWidth,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    flex: 1,
    width: twoButtonWidth,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});
const mapDispatchToProps = {
  updateSubject,
  apiUpdateSubject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewBirthFormModal);
