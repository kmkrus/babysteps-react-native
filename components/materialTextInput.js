import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import InputHelper from '../components/inputHelper';
import Colors from '../constants/Colors';

export default class MaterialTextInput extends React.PureComponent {
  // Your custom input needs a focus function for `withNextInputAutoFocus` to work
  focus() {
    this.input.focus();
  }

  render() {
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error && touched;

    return (

      <View >
        <TextField
          ref={input => (this.input = input)}
          labelHeight={14}
          labelFontSize={12}
          baseColor={displayError ? Colors.errorColor : Colors.darkGrey}
          tintColor={Colors.darkGrey} 
          textColor={Colors.textColor}
          {...props}
        />
        <InputHelper 
          displayError={displayError}
          helper={helper}
          error={error}
        />
      </View>
      
    );
  }
}