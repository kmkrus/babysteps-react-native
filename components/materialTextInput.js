import React from 'react';
import { Text, View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Colors from '../constants/Colors';

export default class MaterialTextInput extends React.PureComponent {
  // Your custom input needs a focus function for `withNextInputAutoFocus` to work
  focus() {
    this.input.focus();
  }

  render() {
    const { error, touched, ...props } = this.props;
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
        <Text style={{
            textAlign: 'right',
            color: displayError ? Colors.errorColor : 'transparent',
            height: 20,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }
}