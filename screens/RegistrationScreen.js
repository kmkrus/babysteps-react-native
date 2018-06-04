import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';

import { connect} from 'react-redux';
import { updateSession } from '../actions/session_actions';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { _ } from 'lodash';

import RegistrationUserForm from '../components/registration_user_form';
import RegistrationRespondentForm from '../components/registration_respondent_form';
import RegistrationSubjectForm from '../components/registration_subject_form';

import States from '../actions/states';

class RegistrationScreen extends Component {

  static navigationOptions = {
    title: 'Registration',
  };

  selectForm = () => {
    if ( _.isEmpty(this.props.registration.user.data ) ) { 
      return <RegistrationUserForm />
    } else if ( _.isEmpty(this.props.registration.respondent.data) ) {
      return <RegistrationRespondentForm />
    } else if ( _.isEmpty(this.props.registration.subject.data) ) {
      return <RegistrationSubjectForm />
    } else {
      this.props.updateSession({registration_state: States.REGISTERED_AS_IN_STUDY})
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} >
        <View style={ styles.container }>
          { this.selectForm() }
        </View>
      </KeyboardAwareScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  }
});

const mapStateToProps = ({ registration }) => ({ registration });

const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationScreen);
