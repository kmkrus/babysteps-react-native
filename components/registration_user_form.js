import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

import isEmpty from 'lodash/isEmpty';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  createUser,
  fetchUser,
  apiCreateUser,
} from '../actions/registration_actions';
import { apiFetchMilestones } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import TextFieldWithLabel from './textFieldWithLabel';
import Colors from '../constants/Colors';
import States from '../actions/states';
import AppStyles from '../constants/Styles';

const TextField = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(TextFieldWithLabel);

const Form = withNextInputAutoFocusForm(View, { submitAfterLastInput: false });

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email Address is Required')
    .email('Not a Valid Email Address'),
  password: Yup.string()
    .required('Password is Required')
    .min(8, 'Password must be at Least 8 Characters'),
  first_name: Yup.string().required('First Name is Required'),
  last_name: Yup.string().required('Last Name is Required'),
});

class ErrorMessage extends Component {
  render() {
    const apiUser = this.props.apiUser;
    if (apiUser.error && !isEmpty(apiUser.error.data)) {
      if (typeof(apiUser.error.response.data.errors.full_messages) !== 'undefined') {
        return apiUser.error.response.data.errors.full_messages.join('\n');
      }
      return apiUser.error.message;
    }
    return '';
  }
}

class RegistrationUserForm extends Component {

  componentWillMount() {
    this.props.apiFetchMilestones();
  }

  componentWillReceiveProps(nextProps) {
    const registration = nextProps.registration;
    if (!registration.apiUser.fetching && !registration.user.fetching) {
      if (registration.apiUser.fetched) {
        if (this.props.registration.auth !== registration.auth) {
          this.props.updateSession({
            access_token: registration.auth.accessToken,
            client: registration.auth.client,
            uid: registration.auth.uid,
            user_id: registration.auth.user_id,
            email: registration.apiUser.data.email,
            password: registration.apiUser.data.password,
          });
        }
        if (!registration.user.fetched) {
          this.props.createUser({
            ...registration.apiUser.data,
            api_id: registration.auth.user_id,
          });
        } else if (registration.user.fetched) {
          this.props.updateSession({ registration_state: States.REGISTERING_RESPONDENT });
        }
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const registration = nextProps.registration;
    if (registration.apiUser.fetching || registration.user.fetching) {
      return false;
    }
    return true;
  }

  _onSubmit = values => {
    this.props.apiCreateUser(values);
  };

  render() {
    const apiUser = this.props.registration.apiUser;
    return (
      <Formik
        onSubmit={values => {
          this._onSubmit(values);
        }}
        validationSchema={validationSchema}
        render={props => {
          return (
            <Form>
              <Text style={AppStyles.registrationHeader}>
                Step 1: Create an Account
              </Text>
              <TextField
                autoCapitalize="words"
                label="First Name"
                name="first_name"
                type="name"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />
              <TextField
                autoCapitalize="words"
                label="Last Name"
                name="last_name"
                type="name"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />
              <TextField
                keyboardType="email-address"
                label="Email"
                name="email"
                type="email"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                inputStyle={AppStyles.registrationTextInput}
                inputContainerStyle={AppStyles.registrationTextInputContainer}
              />

              <View style={AppStyles.registrationButtonContainer}>
                <Button
                  title="NEXT"
                  onPress={props.submitForm}
                  buttonStyle={AppStyles.buttonSubmit}
                  titleStyle={{ fontWeight: 900 }}
                  color={Colors.darkGreen}
                />
              </View>
              <Text
                style={[
                  styles.errorMessage,
                  {color: apiUser.error ? Colors.errorColor : 'transparent'},
                ]}
              >
                <ErrorMessage apiUser={apiUser} />
              </Text>
            </Form>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
    height: 24,
  },
});

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = {
  createUser,
  fetchUser,
  apiCreateUser,
  apiFetchMilestones,
  updateSession,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationUserForm);
