import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import RegistrationNoStudyForm from '../components/registration_no_study_form';

import States from '../actions/states';

class RegistrationNoStudyScreen extends Component {

  static navigationOptions = {
    title: 'Registration',
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} >
        <View style={ styles.container }>
          <RegistrationNoStudyForm />
        </View>
      </KeyboardAwareScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    margin: 20,
  }
});

export default RegistrationNoStudyScreen