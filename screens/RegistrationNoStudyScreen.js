import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RegistrationNoStudyForm from '../components/registration_no_study_form';

import Colors from '../constants/Colors';

class RegistrationNoStudyScreen extends Component {
  static navigationOptions = {
    title: 'Registration',
  };

  render() {
    return (
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        enableAutomaticScroll={false}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
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
    backgroundColor: Colors.backgroundColor,
  },
});

export default RegistrationNoStudyScreen;
