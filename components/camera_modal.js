import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  Vibration,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Constants, Camera, Permissions } from 'expo';
import Colors from '../constants/Colors';

class CameraModal extends Component {
  state = {
    cameraMessage: null,
    activeOption: 'photo',
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    isLandscape: false,
    recording: false,
  };

  async componentWillMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    if (!(camera.status === 'granted')) {
      this.props.closeModal();
    }
  }

  onSelectVideo = async () => {
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (!(audio.status === 'granted')) {
      return;
    }
    this.setState({ activeOption: 'video' });
  };

  onLayout = () => {
    console.log('layout');
    if (!this.container) return;

    const dim = Dimensions.get('window');
    const { width, height } = dim;
    console.log(width, height);
    if (dim.width >= dim.height) {
      this.setState({ isLandscape: true });
      return;
    }

    this.setState({ isLandscape: false });
  };

  startVideo = async () => {
    const recordingConfig = {
      quality: String(Camera.Constants.VideoQuality['720p']),
      maxDuration: 15,
    };

    this.setState({ recording: true });
    const image = await this.camera.recordAsync(recordingConfig);

    Vibration.vibrate();
    // TODO: add confirm photo, video screen
    this.props.closeModal(image);
  };

  stopVideo = () => {
    this.camera.stopRecording();
  };

  handleTakePicture = async () => {
    const { activeOption } = this.state;

    if (activeOption === 'video') {
      if (this.state.recording) {
        this.stopVideo();
      } else {
        this.startVideo();
      }
      return;
    }

    // TODO: add confirm photo, video screen
    const image = await this.camera.takePictureAsync();
    this.props.closeModal(image);
  };

  handleChangeFlashMode = () => {
    this.setState({
      flashMode:
        this.state.flashMode === Camera.Constants.FlashMode.off
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  handleChangeCameraType = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarActions}>
        <View style={styles.bottomBarAction}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Image
              style={{
                width: 22,
                height: 22,
                transform: [
                  { rotateX: this.state.isLandscape ? '90deg' : '0deg' },
                ],
              }}
              source={require('../assets/images/camera_cancel_camera_icon.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={this.handleTakePicture}
          style={styles.takePictureButton}
        />
        <View style={styles.bottomBarAction}>
          <TouchableOpacity onPress={this.handleChangeCameraType}>
            <Image
              style={{
                width: 27,
                height: 27,
                marginRight: 26,
                transform: [
                  { rotateX: this.state.isLandscape ? '90deg' : '0deg' },
                ],
              }}
              source={require('../assets/images/camera_flip_direction_icon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleChangeFlashMode}>
            <Image
              style={{
                width: 27,
                height: 27,
                transform: [
                  { rotateX: this.state.isLandscape ? '90deg' : '0deg' },
                ],
              }}
              source={require('../assets/images/camera_toggle_flash_icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomBarMenu}>
        <Text
          style={{
            marginRight: 72,
            fontSize: 15,
            color:
              this.state.activeOption === 'photo'
                ? Colors.magenta
                : Colors.white,
          }}
          onPress={() => this.setState({ activeOption: 'photo' })}
        >
          Photo
        </Text>
        <Text
          style={{
            fontSize: 15,
            color:
              this.state.activeOption === 'video'
                ? Colors.magenta
                : Colors.white,
          }}
          onPress={() => this.setState({ activeOption: 'video' })}
        >
          Video
        </Text>
      </View>
    </View>
  );

  render() {
    const { flashMode, type } = this.state;
    console.log('islandscape', this.state.isLandscape);
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >
        <View
          style={styles.camera}
          ref={r => (this.container = r)}
          //          onLayout={this.onLayout}
        >
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.camera}
            type={type}
            flashMode={flashMode}
          >
            {this.renderBottomBar()}
          </Camera>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: Colors.black,
    justifyContent: 'space-between',
    flex: 1,
    height: 165,
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  bottomBarAction: {
    flex: 0.3,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  //  bottomBarMainAction: {
  //    flex: 0.4,
  //    justifyContent: 'center',
  //  },
  bottomBarActions: {
    height: 110,
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  //  bottomBarIcon: {
  //    width: 34,
  //    height: 'auto',
  //  },
  bottomBarMenu: {
    height: isIphoneX() ? 50 : 30,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  camera: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  takePictureButton: {
    width: 74,
    height: 74,
    borderRadius: 38.5,
    backgroundColor: Colors.magenta,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
  },
});

export default CameraModal;
