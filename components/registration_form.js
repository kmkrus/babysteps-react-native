import React, { Component } from 'react';
import {
  View,
  Button,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import {
  CREATE_USER_PENDING,
  CREATE_USER_FULFILLED,
  CREATE_USER_REJECTED,
  API_CREATE_USER_PENDING
} from '../actions/types';

import MaterialTextInput from '../components/materialTextInput';
import Colors from '../constants/Colors';

const MyInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
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

class RegistrationForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return ( 
      !(nextProps.registration.user.fetching || nextProps.registration.apiUser.fetching) 
    )
  }

  render() {

    if ( this.props.registration.apiUser.fetched ) {
      this.props.createUser(
        {...this.props.registration.apiUser.data, 
          api_id: this.props.registration.auth.user_id
        }
      );
    }

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.apiCreateUser(values);
        }}
        validationSchema={validationSchema}
        render={ (props) => {

          return (
            <Form>
              <Text h4>First we'll set up your sign in.</Text>
              <MyInput label="First Name" name="first_name" type="name" />
              <MyInput label="Last Name" name="last_name" type="name" />
              <MyInput label="Email" name="email" type="email" />
              <MyInput label="Password" name="password" type="password" />
              <Button 
                title="NEXT" 
                onPress={props.handleSubmit} 
                color={Colors.green}
              />
              
                <ErrorText apiUser={this.props.registration.apiUser} />

            </Form>
          );
        }}
      />
    )
  }
};

export default RegistrationForm