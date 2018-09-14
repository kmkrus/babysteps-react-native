import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import Colors from '../constants/Colors';

export default class InputHelper extends React.PureComponent {

  render() {

    console.log(this.props)

    if (this.props.displayError) {
      return <FormValidationMessage>{this.props.error}</FormValidationMessage>
    } else if (this.props.helper) {
      return <Text style={styles.helperText}>{this.props.helper}</Text>
    } else {
      return null
    }

  }

}

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'right',
    color: Colors.errorColor,
    height: 20,
  },
  helperText: {
    textAlign: 'center',
    color: Colors.darkGrey,
    fontSize: 11,
    height: 12,
  }
})
