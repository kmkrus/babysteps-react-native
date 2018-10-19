import React from 'react';
import { Text, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import InputHelper from './inputHelper';
import Colors from '../constants/Colors';

export default class DatePickerInput extends React.PureComponent {
  focus() {
    this.input.onPressDate();
  }

  render() {
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error && touched;
    const styles = {...this.props.style};

    const containerProps = {
      style: this.props.containerStyle,
    };

    return (
      <View {...containerProps}>
        <Text style={this.props.labelStyle}>{this.props.label}</Text>
        <DatePicker
          ref={input => (this.input = input)}
          style={styles}
          mode="date"
          androidMode="spinner"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: {
              borderWidth: 0,
              width: '100%',
            },
          }}
          placeholder={" "}
          onDateChange={ (value) => { this.props.handleChange(value) } }
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
