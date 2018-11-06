import React, { PureComponent } from 'react';
import { View } from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import { FormLabel } from 'react-native-elements';

import InputHelper from './inputHelper';

import Colors from '../constants/Colors';

export default class PickerInput extends PureComponent {
  render() {
    const { error, helper, touched, name, label, ...props } = this.props;
    const displayError = !!error; //&& touched;

    const labelColor = displayError ? Colors.errorColor : Colors.grey;

    const pickerStyle = {
      inputIOS: this.props.textInputStyle,
      inputAndroid: this.props.textInputStyle,
    };

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

    return (
      <View style={containerStyle}>
        <View>
          <FormLabel {...labelProps}>{label}</FormLabel>
          <RNPickerSelect
            ref={input => (this.input = input)}
            onValueChange={value => this.props.handleChange(value)}
            value={this.props.selectedValue}
            items={this.props.data}
            style={pickerStyle}
            hideIcon
            placeholder={{ label: '' }}
          />
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
