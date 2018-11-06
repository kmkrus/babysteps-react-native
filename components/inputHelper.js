import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import Colors from '../constants/Colors';

export default class InputHelper extends PureComponent {
  render() {
    if (this.props.displayError) {
      return <FormValidationMessage>{this.props.error}</FormValidationMessage>;
    }
    if (this.props.helper) {
      return <Text style={styles.helperText}>{this.props.helper}</Text>;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  helperText: {
    textAlign: 'center',
    color: Colors.darkGrey,
    fontSize: 11,
    height: 12,
  },
});
