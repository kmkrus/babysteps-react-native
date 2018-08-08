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
import { resetSubject, createSubject, updateSubject, apiCreateSubject, fetchRespondent } from '../actions/registration_actions';
import { apiFetchMilestoneCalendar } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import DatePicker from '../components/datePickerInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const DatePickerInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(DatePicker);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  //expected_date_of_birth: Yup.string()
  //  .required('Expected Date of Birth is Required'),
})

class RegistrationExpectedDOB extends Component {

  state = {
    dobError: null,
    submitted: false,
  }

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
        if (!nextProps.registration.apiSubject.fetched  && !nextState.submitted ) {
          
          this.props.apiCreateSubject(nextProps.session, nextProps.registration.subject.data)
          this.setState({submitted: true})

        } else if ( nextProps.registration.apiSubject.data.id != undefined ) {

          this.props.updateSubject({ api_id: nextProps.registration.apiSubject.data.id })

          if (this.props.registration.auth != nextProps.registration.auth) {
            this.props.updateSession({
              access_token: nextProps.registration.auth.accessToken,
              client: nextProps.registration.auth.client,
              uid: nextProps.registration.auth.uid,
              user_id: nextProps.registration.auth.user_id
            });
          }

          if ( !nextProps.session.fetching && nextProps.session.registration_state != States.REGISTERED_AS_IN_STUDY ) {
            this.props.apiFetchMilestoneCalendar({subject_id: nextProps.registration.apiSubject.data.id})
            this.props.updateSession( {registration_state: States.REGISTERED_AS_IN_STUDY} )
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
            const subject = {...values, 
              respondent_ids:  [this.props.registration.respondent.data.api_id],
              screening_blood: this.props.registration.subject.data.screening_blood,
            }
            this.props.createSubject(subject)
          } else {
            this.setState({ dobError: 'You must provide the Expected Date of Birth' })
          }
        }}
       
        validationSchema={validationSchema}
        initialValues={{
          respondent_ids: null,
          gender: 'unknown',
          expected_date_of_birth: null,
          conception_method: 'natural',
          screening_blood: null,
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
  updateSubject,
  apiCreateSubject, 
  fetchRespondent, 
  apiFetchMilestoneCalendar,
  updateSession
};

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationExpectedDOB);