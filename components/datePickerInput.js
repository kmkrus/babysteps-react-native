import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Appearance } from 'react-native-appearance';
import DatePicker from 'react-native-datepicker';
import { FormLabel } from 'react-native-elements';

import InputHelper from './inputHelper';
import Colors from '../constants/Colors';

export default class DatePickerInput extends PureComponent {
  focus() {
    this.input.onPressDate();
  }

  render() {
    const { error, helper, touched } = this.props;
    const displayError = !!error && touched;
    const styles = {...this.props.style};

    const labelColor = displayError ? Colors.errorColor : Colors.grey;

    const containerProps = {
      style: this.props.containerStyle,
    };

    let colorScheme = Appearance.getColorScheme();

    let customStyles = this.props.customStyles;
    if (colorScheme === 'dark') {
      customStyles = {
        ...customStyles,
        datePicker: {
          backgroundColor: Colors.grey,
        },
        datePickerCon: {
          backgroundColor: Colors.darkGrey,
        },
      };
    }

    return (
      <View {...containerProps}>
        <FormLabel style={this.props.labelStyle}>{this.props.label}</FormLabel>
        <DatePicker
          ref={input => (this.input = input)}
          name={this.props.name}
          date={this.props.date}
          style={styles}
          customStyles={customStyles}
          mode="date"
          androidMode="spinner"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={this.props.showIcon}
          placeholder={" "}
          onDateChange={ (value) => { this.props.handleChange(value) } }
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
