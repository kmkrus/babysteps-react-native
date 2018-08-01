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
import { apiFetchMilestoneCalendar } from '../actions/milestone_actions';
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
    if ( nextProps.registration.subject.fetching || 
      nextProps.registration.respondent.fetching ||
      nextProps.registration.apiSubject.fetching ||
      nextProps.session.fetching ) {
      return false
    } 
    return true
  }

  componentWillReceiveProps(nextProps, nextState) {
    if ( !nextProps.registration.subject.fetching && nextProps.registration.subject.fetched ) {
      if ( !nextProps.registration.apiSubject.fetching ) {
        if (!nextProps.registration.apiSubject.fetched ) {
          this.props.apiCreateSubject(nextProps.session, nextProps.registration.subject.data)
        } else if ( nextProps.registration.apiSubject.data.id !== undefined ) {
          const api_id = nextProps.registration.apiSubject.data.id
          this.props.updateSubject({ api_id: api_id })
          this.props.apiFetchMilestoneCalendar({ subject_id: api_id })
          if ( !nextProps.session.fetching && nextProps.session.registration_state != States.REGISTERED_AS_IN_STUDY ) {
            //this.props.updateSession( {registration_state: States.REGISTERED_AS_IN_STUDY} )
          }
        } // apiSubject fetched 
      } // apiSubject fetching
    } // subject fetching
  }

  render() {

    return (
      <Formik
        onSubmit={ (values) => {
          if (values.expected_date_of_birth) {
            this.props.createSubject(values)
          } else {
            this.setState({ dobError: 'You must provide the Expected Date of Birth' })
          }
        }}
        validationSchema={validationSchema}
        initialValues={{
          respondent_ids: this.props.registration.respondent.data.api_id,
          gender: 'unknown',
          expected_date_of_birth: null,
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
                handleChange={ (value) => {
                  this.setState({ dobError: null })
                  props.setFieldValue('expected_date_of_birth', value) 
                }}
              />

              <Text style={ styles.errorText }>{ this.state.dobError }</Text>

              <Button 
                title="NEXT" 
                onPress={ props.handleSubmit } 
                color={Colors.green}
              />

            </Form>
          );
        }}
      />
    )
  }
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    marginTop: -20,
    marginBottom: 20,
    color: Colors.errorColor,
  }
})

const mapStateToProps = ({ session, registration }) => ({ session, registration });
const mapDispatchToProps = { 
  resetSubject, 
  createSubject, 
  apiCreateSubject, 
  fetchRespondent, 
  apiFetchMilestoneCalendar,
  updateSession
};

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationExpectedDOB);