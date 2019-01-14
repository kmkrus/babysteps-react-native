import React, { PureComponent } from 'react';
import { View } from 'react-native';

import { FormLabel, FormInput } from 'react-native-elements';

import { compose } from 'recompose';
import makeInput, { withPickerValues } from 'react-native-formik';

import find from 'lodash/find';

import InputHelper from './inputHelper';

import Colors from '../constants/Colors';

const Picker = compose(makeInput, withPickerValues)(FormInput);

export default class PickerInput extends PureComponent {

  render() {
    const { error, helper, touched, label, name, values, ...props } = this.props;
    const displayError = !!error && touched;
    const labelColor = displayError ? Colors.errorColor : Colors.grey;
    const containerStyle = { marginBottom: 1, borderWidth: 1, borderColor: Colors.red };

    const labelProps = {
      labelStyle: { color: labelColor, marginLeft: 20 },
    };

    const selectedValue = find(this.props.values, ['value', this.props.selectedValue]).label;

    return (
      <View style={containerStyle}>
        <View>
          <FormLabel {...labelProps}>{label}</FormLabel>
          <Picker
            name={name}
            containerStyle={containerStyle}
            value={selectedValue}
            autoCapitalize="none"
            autoCorrect={false}
            values={values}
            {...this.props}
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
