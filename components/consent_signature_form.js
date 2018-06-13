import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements';

import Expo from 'expo';
import ExpoPixi from 'expo-pixi';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

class ConsentSignatureForm extends Component {

  handleSubmit = () => {
    //this.props.updateSession({registration_state: States.REGISTERING_AS_ELIGIBLE })
    console.log('submit')
  }

  handleReset = () => {
    console.log('reset')
  }

  render() {

    const onChange = async ({ width, height }) => {
      const options = {
        format: 'png', /// PNG because the view has a clear background
        quality: 0.1, /// Low quality works because it's just a line
        result: 'file',
        height,
        width
      };
      // Using 'Expo.takeSnapShotAsync', and our view 'this.sketch' we can get a uri of the image
      //const uri = await Expo.takeSnapshotAsync(this.sketch, options);
    }

    //GLView won't run with remote debugging running.  Shut off remote debugging or you will get a Can't Find Property 0 error message.

    return (

      <View style={styles.container}>

        <View style={styles.sketchContainer}>
          <ExpoPixi.Sketch
            ref={ref => this.sketch = ref}
            style={styles.signature }
            strokeColor={Colors.black}
            strokeWidth={8}
            transparent={false}

          />
        </View>

        <View style={styles.elevated}>
          <Text style={styles.header}>Your Signature</Text>
          <Text style={styles.text}>Do not sign this form if today’s date is on or after  EXPIRATION DATE: 01/29/19.</Text>

        </View>

        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonOneStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ ()=>this.handleReset() }
            title='Reset' />
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonTwoStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ ()=>this.handleSubmit() }
            title='Done' />
        </View>

      </View>

    ) // return
  } // render
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: Colors.white,
    fontSize: 12,
    padding: 5,
  },
  elevated: {
    backgroundColor: Colors.white,
    marginTop: 20,
    elevation: 2,
  },
  sketchContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor: Colors.grey,
    borderWidth: 0.8,
  },
  signature: {
    height: 150,
    width: '100%',
    backgroundColor: Colors.white, 
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonOneStyle: {
    width: 100,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    width: 100,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
});

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(ConsentSignatureForm);