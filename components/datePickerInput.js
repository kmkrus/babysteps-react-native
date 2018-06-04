import React from 'react';
import { Text, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import InputHelper from '../components/inputHelper';
import Colors from '../constants/Colors';

export default class DatePickerInput extends React.PureComponent {

  render() {
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error && touched;
    const baseColor = displayError ? Colors.errorColor : Colors.darkGrey;

    return (
      <View>
        <Text>{this.props.label}</Text>
        <DatePicker
          style={{...this.props.style, width: 200, marginBottom: 10 }}
          mode='date'
          androidMode="spinner"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: {
              borderWidth: 0,
              borderBottomWidth: 1,
              borderBottomColor: baseColor
            }
          }}
          onDateChange={ (value) => { this.props.handleChange(value) } }
          {...this.props}
        />
        <InputHelper 
          displayError={displayError}
          helper={helper}
          error={error}
        />
      </View>
    )
  }
}