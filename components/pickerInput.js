import React from 'react';
import { 
  Text, 
  View, 
  Picker
} from 'react-native';
import InputHelper from '../components/inputHelper';
import Colors from '../constants/Colors';

export default class PickerInput extends React.PureComponent {

  focus() {
    //this.input.focus();
  }

  render() {
    const { error, helper, touched, name, ...props } = this.props;
    const displayError = !!error && touched;
    const baseColor = displayError ? Colors.errorColor : Colors.darkGrey
    const styles = {...this.props.style, 
      flex: 1, marginBottom: 10,
      borderBottomWidth: 1, 
      borderColor: Colors.grey 
    }
   
    return (
      <View>
        <View style={ styles }>
          <Text>{ this.props.label }</Text>
          <Picker
            ref={input => (this.input = input)}
            {...this.props}
            onValueChange={ (value) => this.props.handleChange(value)  }
            mode='dropdown'>

            { this.props.data.map( (r, index) => (
              <Picker.Item
                key={index}
                label={r.label}
                value={r.value}
              />
            ))} 

          </Picker>
        </View>
        <InputHelper 
          displayError={ displayError }
          helper={ helper }
          error={ error }
        />
      </View>
    )
  }
}