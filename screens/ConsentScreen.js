import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import ConsentEligibilityForm from '../components/consent_eligibility_form';
import ConsentDisclosureForm from '../components/consent_disclosure_form';
import ConsentAgreementForm from '../components/consent_agreement_form';
import ConsentSignatureForm from '../components/consent_signature_form';

import States from '../actions/states';

class ConsentScreen extends Component {
  static navigationOptions = {
    title: 'Eligibility & Consent',
  };

  selectForm = () => {
    const registration_state = this.props.session.registration_state;
    if (registration_state === States.REGISTERING_ELIGIBILITY) {
      return <ConsentEligibilityForm />;
    }
    if (registration_state === States.REGISTERING_AS_ELIGIBLE) {
      return <ConsentDisclosureForm />;
    }
    if (registration_state === States.REGISTERING_SIGNATURE) {
      return <ConsentSignatureForm />;
    }
  };

  render() {
    return <View style={styles.container}>{this.selectForm()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { updateSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentScreen);
