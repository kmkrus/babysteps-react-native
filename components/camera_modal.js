import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Vibration,
  CameraRoll,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';

import { Constants, Camera } from 'expo';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const preview_width = width - 40
const preview_height = width * 0.75

class CameraModal extends Component {

  state = {
     cameraMessage: null,
  }

  startVideo = async () => {
    if ( this.camera ) {

      const recordingConfig = {
        quality: String( Camera.Constants.VideoQuality['720p'] ),
        maxDuration: 15,
      }

      const data = await this.camera.recordAsync(recordingConfig)
      
      console.log( data )
      Vibration.vibrate()
      
      //const saveResult = await CameraRoll.saveToCameraRoll(data.uri);
      
    }

  }

  stopVideo = () => {
    if ( !this.camera ) return;
    this.camera.stopRecording();
    this.props.closeModal()
  }

  render() {
    return (

      <Modal
        animationType={ 'slide'}
        transparent   = { false }
        visible={ this.props.modalVisible }
        onRequestClose={ () => { } } >

        <View style={ styles.container }>
          <View style={ styles.cameraContainer }>
            <Camera
              ref={ (ref) => { this.camera = ref; } }
              style={ styles.preview }
              type={ Camera.Constants.Type.back }
              onCameraReady={ () => { 
                 this.setState( { cameraMessage : 'Camera Ready!'})
              }} />

            <Text style={ styles.message }>{ this.state.cameraMessage }</Text>

          </View>


          <View style={styles.buttonContainer}>
             <Button
              color={Colors.pink}
              buttonStyle={styles.buttonOne}
              titleStyle={styles.buttonTitle}
              onPress={ this.startVideo.bind(this) }
              title='Record' />
            <Button
              color={Colors.grey}
              buttonStyle={styles.buttonTwo}
              titleStyle={styles.buttonTitle}
              onPress={ this.stopVideo.bind(this) }
              title='Stop' />
          </View>

        </View>

      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginTop: 60,
  },
  preview: {
    width: preview_width,
    height: preview_height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.grey,
    opacity: 100,
  },
  message : {
    width: '100%',
    fontSize: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonOne: {
    width: 150,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwo: {
    width: 150,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
});


export default CameraModal