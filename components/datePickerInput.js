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
    const { error, helper, touched, ...props } = this.props;
    const displayError = !!error && touched;
    const styles = {...this.props.style};

    const labelColor = displayError ? Colors.errorColor : Colors.grey;

    const containerProps = {
      style: this.props.containerStyle,
    };

    const labelProps = {
      labelStyle: { color: labelColor, marginLeft: 0 },
    };

    let colorScheme = Appearance.getColorScheme();
    let darkMode = false;
    if (colorScheme === 'dark') {
      darkMode = true;
    }

    return (
      <View {...containerProps}>
        <FormLabel {...labelProps}>{this.props.label}</FormLabel>
        <DatePicker
          ref={input => (this.input = input)}
          style={styles}
          mode="date"
          androidMode="spinner"
          isDarkModeEnabled={darkMode}
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
