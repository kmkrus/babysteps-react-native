import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import RegistrationUserForm from '../components/registration_user_form';
import RegistrationRespondentForm from '../components/registration_respondent_form';
import RegistrationExpectedDOB from '../components/registration_expected_dob_form';
import RegistrationSubjectForm from '../components/registration_subject_form';

import States from '../actions/states';
import Colors from '../constants/Colors';

class RegistrationScreen extends Component {
  static navigationOptions = {
    title: 'Registration',
  };

  selectForm = () => {
    const registration_state = this.props.session.registration_state;
    const navigation = this.props.navigation;
    switch (registration_state) {
      case States.REGISTERING_USER:
        return <RegistrationUserForm navigation={navigation} />;
      case States.REGISTERING_RESPONDENT:
        return <RegistrationRespondentForm />;
      case States.REGISTERING_EXPECTED_DOB:
        return <RegistrationExpectedDOB />;
      case States.REGISTERING_SUBJECT:
        return <RegistrationSubjectForm />;
    }
  };

  _scrollToInput = reactNode => {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.scrollToFocusedInput(reactNode);
  };

  render() {
    return (
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        enableAutomaticScroll
        enableOnAndroid
        extraScrollHeight={50}
        innerRef={ref => {this.scroll = ref}}
      >
        <View style={styles.container}>{this.selectForm()}</View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { updateSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationScreen);
