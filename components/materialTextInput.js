import React from 'react';
import { View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import InputHelper from './inputHelper';
import Colors from '../constants/Colors';

export default class MaterialTextInput extends React.PureComponent {
  // Your custom input needs a focus function for `withNextInputAutoFocus` to work
  focus() {
    this.input.focus();
  }

  render() {
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error && touched;

    const baseColor = displayError ? Colors.errorColor : Colors.textColor;

    return (
      <View>
        <TextField
          ref={input => (this.input = input)}
          labelHeight={14}
          labelFontSize={12}
          fontSize={14}
          labelTextStyle={this.props.labelStyle}
          style={this.props.textInputStyle}
          baseColor={baseColor}
          tintColor={Colors.textColor}
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
