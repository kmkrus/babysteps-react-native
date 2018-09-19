import React from 'react';
import {
  Text,
  View,
  Picker
} from 'react-native';
import InputHelper from '../components/inputHelper';
import Colors from '../constants/Colors';
import { Label } from 'react-native-material-textfield';
import RNPickerSelect from 'react-native-picker-select';
import AppStyles from '../constants/Styles';

export default class PickerInput extends React.PureComponent {

  focus() {
    //this.input.focus();
  }

  render() {
    const { error, helper, touched, name, ...props } = this.props;
    const displayError = !!error && touched;

    const pickerStyle = {
        inputIOS: this.props.textInputStyle,
        inputAndroid: this.props.textInputStyle
    }

    const containerStyle = {
      borderBottomWidth: .25,
      borderBottomColor: Colors.grey,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15,
      marginBottom: 1
    }

    return (
      <View style={containerStyle}>
        <View>
          <Text style={this.props.labelStyle}>{ this.props.label }</Text>
          <RNPickerSelect
            ref={input => (this.input = input)}
            onValueChange={ (value) => this.props.handleChange(value)  }
            items={this.props.data}
            style={ pickerStyle }
            hideIcon={true}
            placeholder={{label: ''}}
          >
          </RNPickerSelect>
        </View>
        <InputHelper
          displayError={ displayError }
          helper={ helper }
          error={ error }
        />
      </View>
    )

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            backgroundColor: 'white',
            color: 'red',
        },
    });

  }
}
