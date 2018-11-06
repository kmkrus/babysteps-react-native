import React, { PureComponent } from 'react';
import { View } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import InputHelper from './inputHelper';
import Colors from '../constants/Colors';

export default class TextFieldWithLabel extends PureComponent {
  // Your custom input needs a focus function for `withNextInputAutoFocus` to work

  constructor(props) {
    super(props);
    this.onPress = this.focus.bind(this);
  }

  focus() {
    this.input.focus();
  }

  render() {
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error; //&& touched;

    const labelColor = displayError ? Colors.errorColor : Colors.grey;

    const containerProps = {
      style: this.props.containerStyle,
      onStartShouldSetResponder: () => true,
      onResponderRelease: this.onPress,
    };

    const labelProps = {
      labelStyle: { color: labelColor },
    };

    return (
      <View {...containerProps}>
        <FormLabel {...labelProps}>{this.props.label}</FormLabel>
        <FormInput
          ref={input => (this.input = input)}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={this.props.inputContainerStyle}
          {...this.props}
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
