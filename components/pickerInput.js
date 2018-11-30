import React, { PureComponent } from 'react';
import { View } from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import { FormLabel, FormInput } from 'react-native-elements';

import find from 'lodash/find';

import InputHelper from './inputHelper';

import Colors from '../constants/Colors';

export default class PickerInput extends PureComponent {
  constructor(props) {
    super(props);
    this.onPress = this.focus.bind(this);
  }

  focus() {
    this.input.focus();
  }

  render() {
    const {
      error,
      helper,
      touched,
      name,
      label,
      inputStyle,
      data,
      ...props
    } = this.props;

    const displayError = !!error; //&& touched;

    const labelColor = displayError ? Colors.errorColor : Colors.grey;

    const containerStyle = {
      borderBottomWidth: 0.25,
      borderBottomColor: Colors.grey,
      marginBottom: 1,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15,
    };

    const labelProps = {
      labelStyle: { color: labelColor, marginLeft: 0 },
    };
    
    const selectedValue = find(data, ['value', this.props.selectedValue]).label;

    return (
      <View style={containerStyle}>
        <View>
          <FormLabel {...labelProps}>{label}</FormLabel>
          <RNPickerSelect
            ref={input => (this.input = input)}
            onValueChange={value => this.props.handleChange(value)}
            items={data}
            hideIcon
          >
            <FormInput
              ref={input => (this.input = input)}
              inputStyle={inputStyle}
              value={selectedValue}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </RNPickerSelect>
        </View>
        <InputHelper
          displayError={displayError}
          helper={helper}
          error={error}
        />
      </View>
    );
  }
}
