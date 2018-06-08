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
import { createUser, fetchUser, apiCreateUser } from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from '../components/materialTextInput';
import Colors from '../constants/Colors';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email Address is Required')
    .email("Not a Valid Email Address"),
  password: Yup.string()
    .required('Password is Required')
    .min(8, 'Password must be at Least 8 Characters'),
  first_name: Yup.string()
    .required('First Name is Required'),
  last_name: Yup.string()
    .required('Last Name is Required'),
})

class ErrorMessage extends Component {
  render() {
    if (this.props.apiUser.error) {
      if ( typeof(this.props.apiUser.error.response.data.errors.full_messages) !== 'undefined' ) {
          return this.props.apiUser.error.response.data.errors.full_messages.join("\n")
      } else {
        return this.props.apiUser.error.message
      };
    }
    return ''
  }
}

class ErrorText extends Component {
  render() {
    return (
      <Text style={{
          fontSize: 16,
          margin: 20,
          textAlign: 'center',
          color: this.props.apiUser.error ? Colors.errorColor : 'transparent',
          height: 24,
        }}
      >
        <ErrorMessage apiUser={this.props.apiUser} />
      </Text>
    )
  }
}

class RegistrationUserForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {

    if ( nextProps.registration.apiUser.fetching) {
      return false;
    }
    if ( nextProps.registration.apiUser.fetched ) {
      if (nextProps.registration.auth) {
        this.props.updateSession({
          access_token: nextProps.registration.auth.accessToken,
          client: nextProps.registration.auth.client,
          uid: nextProps.registration.auth.uid,
          user_id: nextProps.registration.auth.user_id,
          email: nextProps.registration.apiUser.data.email,
          password: nextProps.registration.apiUser.data.password
        });
      }
      if ( nextProps.registration.user.fetching ) {
        return false;
      } else if (  nextProps.registration.user.fetched ) {

        return true;
      } else {
        this.props.createUser({
          ... nextProps.registration.apiUser.data, 
          api_id:  nextProps.registration.auth.user_id
        })
        return false;
      }

    }
    return true;
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.apiCreateUser(values);
        }}
        validationSchema={validationSchema}
        render={ (props) => {

          return (
            <Form>
              <Text h4>First let's get you registered...</Text>
              <TextInput label="First Name" name="first_name" type="name" />
              <TextInput label="Last Name" name="last_name" type="name" />
              <TextInput label="Email" name="email" type="email" />
              <TextInput label="Password" name="password" type="password" />
  
                <Button 
                  title="NEXT" 
                  onPress={props.handleSubmit} 
                  color={Colors.green}
                  //disabled={ props.isSubmitting }
                />
              
                <ErrorText apiUser={this.props.registration.apiUser} />

            </Form>
          );
        }}
      />
    )
  }
};

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { createUser, fetchUser, apiCreateUser, updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationUserForm);