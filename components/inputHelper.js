import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default class InputHelper extends React.PureComponent {

  render() {

    if (this.props.displayError) {
      return <Text style={styles.errorText}>{this.props.error}</Text>
    } else if (this.props.helper !== null) {
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