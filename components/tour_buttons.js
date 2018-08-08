import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';

import { connect} from 'react-redux';
import { updateSession } from '../actions/session_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

class TourButtons extends Component {

  render() {
    if (this.props.currentIndex < 3) {
      
      var updateIndex = this.props.updateIndex;
      
      return (
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonThreeStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.props.updateIndex}
            title="Let's Get Started" />
        </View>
      )

   } else {

      return( 
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonOneStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => { 
              this.props.updateSession( {registration_state: States.REGISTERING_AS_NO_STUDY} )
            }}
            title='No Thanks' />
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonTwoStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => { 
              this.props.updateSession( {registration_state: States.REGISTERING_ELIGIBILITY} )
            }}
            title='Join Study' />
        </View>
      )

    } // if props.currentIndex
  } // render

};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    width: 150,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    width: 150,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonThreeStyle: {
    width: 300,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
})

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(TourButtons);