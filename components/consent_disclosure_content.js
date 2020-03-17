import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';

import moment from 'moment';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import ConsentDisclosureContent001 from './consent_disclosure_content_001';
import ConsentDisclosureContent002 from './consent_disclosure_content_002';

import IRBInformation from '../constants/IRB';
import States from '../actions/states';
import Colors from '../constants/Colors';
import CONSTANTS from '../constants';

const { width } = Dimensions.get('window');
const oneButtonWidth = width - 100;

const widthOffset = 60;

const signatureWidth = width - (widthOffset * 2);
const signatureHeight = signatureWidth * 0.4;

const components = {
  '001': ConsentDisclosureContent001,
  '002': ConsentDisclosureContent002,
};

class ConsentDisclosureContent extends Component {
  state = {
    screeningBlood: null,
    errorMessage: '',
    errorMessageLocation: 0,
    scrollOffset: 800,
  };

  componentDidUpdate() {
    if (this.state.errorMessage) {
      this._scrollView.scrollTo({ y: this.state.errorMessageLocation + this.state.scrollOffset });
    }
  }

  handleSubmit = action => {
    const screening_blood = this.state.screeningBlood;
    if (screening_blood === null && action === 'agree') {
      const errorMessage =
        "You must select whether or not you will allow collection of your baby's bloodspot.";
      this.setState({ errorMessage });
      return;
    }
    const registration_state =
      action === 'agree'
        ? States.REGISTERING_SIGNATURE
        : States.REGISTERING_AS_NO_STUDY;
    this.props.updateSession({
      screening_blood,
      registration_state,
    });
  };

  handleScreeningBlood = (screeningBlood, errorMessage) => {
    this.setState({ screeningBlood, errorMessage });
  };

  renderButton = () => {
    if (this.props.formState === 'edit') {
      const irb = IRBInformation[this.props.tosID];
      const irbExpired = moment() > moment(irb.expiration_date, "MM/DD/YYYY");
      if (irbExpired) {
        return (
          <View style={styles.buttonContainer}>
            <Text style={styles.expired}>
              This Disclosure has EXPIRED as of: {irb.expiration_date}.
            </Text>
            <Button
              title="REGISTER WITH NO STUDY"
              onPress={() => this.handleSubmit('no_study')}
              color={Colors.pink}
              buttonStyle={[styles.buttonNext, {marginBottom: 10}]}
              titleStyle={styles.buttonNextTitle}
            />
            <Button
              title="REGISTER ANYWAY"
              onPress={() => this.handleSubmit('agree')}
              color={Colors.pink}
              buttonStyle={styles.buttonNext}
              titleStyle={styles.buttonNextTitle}
            />
          </View>
        );
      }
      return (
        <View style={styles.buttonContainer}>
          <Text style={styles.expires}>
            This Disclosure expires: {irb.expiration_date}.
          </Text>
          <Button
            title="AGREE"
            onPress={() => this.handleSubmit('agree')}
            color={Colors.pink}
            buttonStyle={styles.buttonNext}
            titleStyle={styles.buttonNextTitle}
          />
        </View>
      );
    }
    return (
      <View style={[styles.buttonContainer, {marginLeft: 15, marginBottom: 60}]}>
        <Button
          title="RETURN"
          onPress={() => this.props.setModalVisible(false)}
          color={Colors.pink}
          buttonStyle={styles.buttonNext}
          titleStyle={styles.buttonNextTitle}
        />
      </View>
    );
  };

  renderSignature = () => {
    if (this.props.formState === 'view') {
      const signatureDir = FileSystem.documentDirectory + CONSTANTS.SIGNATURE_DIRECTORY;
      const fileName = signatureDir + '/signature.png';
      return (
        <View style={{ flex: 1, justifyContent: 'center', marginLeft: widthOffset, marginBottom: 20}}>
          <Text>Signature</Text>
          <Image
            source={{ uri: fileName }}
            width={signatureWidth}
            style={{ height: signatureHeight }}
            resizeMode="cover"
          />
        </View>
      );
    }
    return null;
  };

  setErrorMessageLocation = y => {
    this.setState({ errorMessageLocation: y });
  };

  render() {
    const { formState, tosID } = this.props;
    const { screeningBlood, errorMessage } = this.state;
    let ConsentDisclosureVersion = components[tosID];

    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        ref={ref => (this._scrollView = ref)}
      >
        <ConsentDisclosureVersion
          screeningBlood={screeningBlood}
          errorMessage={errorMessage}
          formState={formState}
          setErrorMessageLocation={y => this.setErrorMessageLocation(y)}
          handleScreeningBlood={(screeningBlood, errorMessage) =>
            this.handleScreeningBlood(screeningBlood, errorMessage)
          }
        />
        {this.renderSignature()}
        {this.renderButton()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  expires: {
    fontSize: 14,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    color: Colors.darkGrey,
  },
  expired: {
    fontSize: 14,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    color: Colors.errorColor,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonNext: {
    width: oneButtonWidth,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonNextTitle: {
    fontWeight: '900',
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});
const mapDispatchToProps = { updateSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentDisclosureContent);
