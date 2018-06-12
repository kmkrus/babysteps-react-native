import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import {
  Button,
  ButtonGroup
} from 'react-native-elements';

import { _ } from 'lodash';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

class ConsentEligibilityForm extends Component {

  state = {
    selectedIndex: [],
  }

  handleOnPress = (buttonGroup, index) => {
    var selectedState = this.state.selectedIndex
    selectedState[buttonGroup] = index
    this.setState( { selectedIndex: selectedState } )
  }

  handleSubmit = () => {
    if ( this.state.selectedIndex.length < 3 ) {
      return  // not complete
    }
    if ( _.sum(this.state.selectedIndex) > 0 ) {
      // any no
      this.props.updateSession({registration_state: States.REGISTERING_NOT_ELIGIBLE })
    } else {
      // all yes
      this.props.updateSession({registration_state: States.REGISTERING_AS_ELIGIBLE })
    }
    
    console.log('submit')
  }

  render() {

    const buttons = ['Yes', 'No']

    return (
      <View style={styles.container}>

        <View style={styles.elevated}>
          <Text style={styles.text}>Do you have an infant younger than 24 months, are you currently pregnant or are you planning to become pregnant within the next six months?</Text>
          <ButtonGroup
            onPress={ (value)=>this.handleOnPress(0, value) }
            selectedIndex={this.state.selectedIndex[0]}
            buttons={buttons}
            containerStyle={styles.buttonGroup}
            textStyle={styles.buttonText}
            selectedTextStyle={styles.buttonSelected}
          />
        </View>

        <View style={styles.elevated}>
          <Text style={styles.text}>Can you read and understand English fluently?</Text>
          <ButtonGroup
            onPress={ (value)=>this.handleOnPress(1, value) }
            selectedIndex={this.state.selectedIndex[1]}
            buttons={buttons}
            containerStyle={styles.buttonGroup}
            textStyle={styles.buttonText}
            selectedTextStyle={styles.buttonSelected}
          />
        </View>

        <View style={styles.elevated}>
          <Text style={styles.text}>Do you live in the United States?</Text>
        
          <ButtonGroup
            onPress={ (value)=>this.handleOnPress(2, value) }
            selectedIndex={this.state.selectedIndex[2]}
            buttons={buttons}
            containerStyle={styles.buttonGroup}
            textStyle={styles.buttonText}
            selectedTextStyle={styles.buttonSelected}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="NEXT"
            onPress={ this.handleSubmit } 
            color={Colors.pink}
            buttonStyle={styles.buttonNext}
            titleStyle={styles.buttonNextTitle}
          />
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    backgroundColor: Colors.white,
    fontSize: 12,
    padding: 5,
  },
  elevated: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    elevation: 2,
  },
  buttonGroup: {
    backgroundColor: Colors.white,
    height: 60,
    borderColor: Colors.white,
    elevation: 0,
  },
  buttonText: {
    fontSize: 22,
  },
  buttonSelected: {
    color: Colors.darkGreen,
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonNext: {
    width: 300,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonNextTitle: {
    fontWeight: '900',
  }
});

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(ConsentEligibilityForm);