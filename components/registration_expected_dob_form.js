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
import { resetSubject, createSubject, apiCreateSubject, fetchRespondent } from '../actions/registration_actions';
import { updateSession } from '../actions/session_actions';

import DatePickerInput from '../components/datePickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  expected_date_of_birth: Yup.string()
    .required('Expected Date of Birth is Required'),
})

class RegistrationExpectedDOB extends Component {

  componentWillMount() {
    this.props.resetSubject()
    this.props.fetchRespondent()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.registration.subject.fetching || nextProps.registration.respondent.fetching ) {
      return false
    } else if (nextProps.registration.subject.fetched) {

      if (nextProps.registration.apiSubject.error != null) {
        return true

      } else if (!nextProps.registration.apiSubject.fetching && !nextProps.registration.apiSubject.fetched) {
        this.props.apiCreateSubject(nextProps.session, nextProps.registration.subject.data)
        return false

      } else if ( nextProps.registration.apiSubject.fetched && !nextProps.session.fetching ) {
        this.props.updateSession( {registration_state: States.REGISTERED_AS_IN_STUDY} )
      }     

    }
    return true
  }

  render() {

    console.log(this.props.registration.respondent.data.api_id)

    return (
      <Formik
        onSubmit={ (values) => {
          this.props.createSubject(values);
        }}
        validationSchema={validationSchema}
        initialValues={{
          'respondent_ids[]': this.props.registration.respondent.data.api_id,
          gender: 'unknown',
          conception_method: 'natural',
          screening_blood: this.props.registration.subject.data.screening_blood,
        }}
        render={ (props) => {

          return (
            <Form>
              <Text h4>Expected date of birth...</Text>

              <DatePickerInput
                label="" 
                name="expected_date_of_birth" 
                date={props.values.expected_date_of_birth}
                handleChange={ (value) => props.setFieldValue('expected_date_of_birth', value) }
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

const mapStateToProps = ({ session, registration }) => ({ session, registration });
const mapDispatchToProps = { resetSubject, createSubject, apiCreateSubject, fetchRespondent, updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationExpectedDOB);