import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native';
import {   Button, Text } from 'react-native-elements';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import { createUser, fetchUser, apiCreateUser } from '../actions/registration_actions';
import { apiFetchMilestones } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import MaterialTextInput from '../components/materialTextInput';
import TextFieldWithLabel from '../components/textFieldWithLabel';
import Colors from '../constants/Colors';
import States from '../actions/states';
import AppStyles from '../constants/Styles';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const TextField = compose(withInputAutoFocus, withNextInputAutoFocusInput)(TextFieldWithLabel);
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

  componentWillMount() {
    this.props.apiFetchMilestones()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.registration.apiUser.fetching || nextProps.registration.user.fetching ) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if ( !nextProps.registration.apiUser.fetching && !nextProps.registration.user.fetching ) {
      if ( nextProps.registration.apiUser.fetched ) {
        if (this.props.registration.auth != nextProps.registration.auth) {
          this.props.updateSession({
            access_token: nextProps.registration.auth.accessToken,
            client: nextProps.registration.auth.client,
            uid: nextProps.registration.auth.uid,
            user_id: nextProps.registration.auth.user_id,
            email: nextProps.registration.apiUser.data.email,
            password: nextProps.registration.apiUser.data.password
          });
        }
        if ( !nextProps.registration.user.fetched ) {
          this.props.createUser({
            ... nextProps.registration.apiUser.data,
            api_id:  nextProps.registration.auth.user_id
          })
        } else if ( nextProps.registration.user.fetched ) {
          this.props.updateSession( {registration_state: States.REGISTERING_RESPONDENT} )
        }
      }
    }
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
              <Text style={AppStyles.registrationHeader}>Step 1: Create an Account</Text>
              <TextField inputStyle={AppStyles.registrationTextInput} labelStyle={AppStyles.registrationLabel} label="First Name" name="first_name" type="name" />
              <TextField inputStyle={AppStyles.registrationTextInput} labelStyle={AppStyles.registrationLabel} label="Last Name" name="last_name" type="name" />
              <TextField inputStyle={AppStyles.registrationTextInput} labelStyle={AppStyles.registrationLabel} label="Email" name="email" type="email" />
              <TextField inputStyle={AppStyles.registrationTextInput} labelStyle={AppStyles.registrationLabel} label="Password" name="password" type="password" />

                <View style={AppStyles.registrationButtonContainer}>

                  <Button
                    title="NEXT"
                    onPress={props.handleSubmit}
                    buttonStyle={AppStyles.buttonSubmit}
                    titleStyle={ {fontWeight: 900} }
                    color={Colors.darkGreen}
                    disabled={ props.isSubmitting }
                  />

                </View>


                <ErrorText apiUser={ this.props.registration.apiUser } />

            </Form>
          );
        }}
      />
    )
  }
};

const styles = StyleSheet.create({
  form_header: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20
  },
})

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { createUser, fetchUser, apiCreateUser, apiFetchMilestones, updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationUserForm);
