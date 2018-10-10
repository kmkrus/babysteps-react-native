import React from 'react';
import { Text, View } from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import InputHelper from './inputHelper';

import Colors from '../constants/Colors';

export default class PickerInput extends React.PureComponent {
  render() {
    const { error, helper, touched, name, label, ...props } = this.props;
    const displayError = !!error && touched;

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

    return (
      <View style={containerStyle}>
        <View>
          <Text style={this.props.labelStyle}>{label}</Text>
          <RNPickerSelect
            ref={input => (this.input = input)}
            onValueChange={value => this.props.handleChange(value)}
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
