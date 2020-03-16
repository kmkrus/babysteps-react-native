import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';

import { connect } from 'react-redux';

import Colors from '../constants/Colors';

class ConsentDisclosureScreeningBlood extends Component {
  render() {
    const { screeningBlood, errorMessage, formState } = this.props;
    const error = !!errorMessage;

    if (formState === 'edit') {
      return (
        <View style={styles.checkboxView}>
          <Text style={styles.header}>
            Please indicate below if you agree to the use of your baby’s newborn 
            screening blood spots for genetic testing:
          </Text>

          <CheckBox
            title="Yes, I will allow the investigators to access my baby’s newborn screening blood spots for genetic testing purpose."
            textStyle={styles.checkboxText}
            checked={screeningBlood === true}
            containerStyle={
              error ? {borderColor: Colors.errorBackground} : {}
            }
            onPress={() => this.props.handleScreeningBlood(true, '')}
          />

          <CheckBox
            title="No, I will not allow the investigators to access my baby’s newborn screening blood spots for genetic testing purpose."
            textStyle={styles.checkboxText}
            checked={screeningBlood === false}
            containerStyle={
              error ? {borderColor: Colors.errorBackground} : {}
            }
            onPress={() => this.props.handleScreeningBlood(false, '')}
          />
        </View>
      );
    }
    const subjectScreeningBlood = this.props.registration.subject.data.screeningBlood;
    if (subjectScreeningBlood) {
      return (
        <View>
          <Text style={styles.header}>
            You have agreed to the use of your baby’s newborn screening blood
            spots for genetic testing
          </Text>
        </View>
      );
    }
    return (
      <View>
        <Text style={styles.header}>
          You have not agreed to the use of your baby’s newborn screening blood
          spots for genetic testing
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  checkboxView: {
    marginBottom: 0,
  },
  checkboxText: {
    fontSize: 11,
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});

export default connect(mapStateToProps)(ConsentDisclosureScreeningBlood);