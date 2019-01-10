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
import { Camera, Video } from 'expo';
import * as moment from 'moment';
import padStart from 'lodash/padStart';
import Colors from '../constants/Colors';

// TODO fix horizontal styles
const { width, height } = Dimensions.get('window');
const imageWidth = width;
const imageHeight = height * 0.7;
const imageButtonsHeight = height * 0.3;
const cameraPositionMargin = 35;
const cameraPositionMarginTop = 70;
const cameraPositionWidth = width - (cameraPositionMargin * 2);
const cameraPositionHeight = (height * 0.6) - cameraPositionMargin;

const mediaTypes = {
  file_audio: 'audio',
  file_image: 'photo',
  file_video: 'video',
};

class CameraModal extends Component {
  state = {
    activeOption: 'photo',
    limitOption: false,
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    isLandscape: false,
    recording: false,
    confirmingImage: false,
    videoTimer: null,
  };

  componentDidMount() {
    if (this.props.question) {
      this.setState({
        limitOption: true,
        activeOption: mediaTypes[this.props.question.rn_input_type],
      });
    }
  }

  onLayout = () => {
    if (!this.container) return;

    if (width >= height) {
      this.setState({ isLandscape: true });
      return;
    }

    this.setState({ isLandscape: false });
  };

  startVideo = async () => {
    const recordingConfig = {
      quality: String(Camera.Constants.VideoQuality['720p']),
    };

    this.cancelRecording = false;
    this.setState({ recording: true, videoTimer: moment.duration(0) });
    if (this.videoTimeInterval) clearInterval(setInterval);
    this.videoTimeInterval = setInterval(() => {
      this.setState({ videoTimer: this.state.videoTimer.add(1, 's') });
    }, 1000);

    this.image = await this.camera.recordAsync(recordingConfig);

    if (!this.cancelRecording) {
      this.setState({ confirmingImage: true, recording: false });
      Vibration.vibrate();
    } else {
      this.setState({ recording: false });
    }
  };

  stopVideo = () => {
    if (this.videoTimeInterval) clearInterval(this.videoTimeInterval);
    this.camera.stopRecording();
  };

  cancelVideo = () => {
    this.cancelRecording = true;
    this.setState({ videoTimer: moment.duration(0) });
    this.stopVideo();
  };

  handlePressVideoOption = async () => {
    this.setState({ activeOption: 'video', videoTimer: moment.duration(0) });
  };

  handleTakePicture = async () => {
    this.image = null;
    const { activeOption } = this.state;

    if (activeOption === 'video') {
      if (this.state.recording) {
        this.stopVideo();
      } else {
        this.startVideo();
      }
      return;
    }

    this.image = await this.camera.takePictureAsync();
    this.camera.pausePreview();
    this.setState({ confirmingImage: true });
  };

  handleChangeFlashMode = () => {
    this.setState({
      flashMode:
        this.state.flashMode === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off,
    });
  };

  handleChangeCameraType = () => {
    this.cancelVideo();
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  handleCancelImage = () => {
    if (this.videoTimeInterval) clearInterval(this.videoTimeInterval);
    this.videoTimer = moment.duration(0);
    this.image = null;
    this.camera.resumePreview();
    this.setState({ confirmingImage: false, videoTimer: moment.duration(0) });
  };

  handleConfirmImage = () => {
    if (this.videoTimeInterval) clearInterval(this.videoTimeInterval);
    this.videoTimer = moment.duration(0);
    this.props.closeCameraModal(this.image);
    this.image = null;
    this.setState({ confirmingImage: false, videoTimer: moment.duration(0) });
  };

  renderBottomBar = () => {
    const { videoTimer, limitOption, activeOption, isLandscape } = this.state;
    let takePictureButtonColor = { backgroundColor: Colors.magenta };
    if (videoTimer) {
      if ((videoTimer.minutes() > 3) && (videoTimer.seconds() % 2 === 0)) {
        takePictureButtonColor = {};
      }
    }
    return (
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarActions}>
          <View style={styles.bottomBarAction}>
            <TouchableOpacity onPress={() => this.props.closeCameraModal(null)}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  transform: [
                    { rotateX: isLandscape ? '90deg' : '0deg' },
                  ],
                }}
                source={require('../assets/images/camera_cancel_camera_icon.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => this.handleTakePicture()}
            style={styles.takePictureButton}
          >
            <View style={[styles.takePictureButtonInner, takePictureButtonColor]} />
          </TouchableOpacity>

          <View style={styles.bottomBarAction}>
            <TouchableOpacity onPress={this.handleChangeCameraType}>
              <Image
                style={{
                  width: 27,
                  height: 27,
                  marginRight: 26,
                  transform: [
                    { rotateX: isLandscape ? '90deg' : '0deg' },
                  ],
                }}
                source={require('../assets/images/camera_flip_direction_icon.png')}
              />
            </TouchableOpacity>
            {activeOption === 'photo' && (
              <TouchableOpacity onPress={this.handleChangeFlashMode}>
                <Image
                  style={{
                    width: 28,
                    height: 27,
                    transform: [
                      { rotateX: isLandscape ? '90deg' : '0deg' },
                    ],
                  }}
                  source={
                    this.state.flashMode === Camera.Constants.FlashMode.off
                      ? require('../assets/images/camera_toggle_flash_icon.png')
                      : require('../assets/images/camera_toggle_flash_icon_active.png')
                  }
                />
              </TouchableOpacity>
            )}
            {activeOption === 'video' && (
              <View>
                <Text style={{ color: Colors.white }}>
                  {videoTimer && (
                    `${videoTimer.minutes()}:${padStart(videoTimer.seconds(), 2, '0')}`
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.bottomBarMenu}>
          {(!limitOption) && (
            <TouchableOpacity
              onPress={() => this.setState({ activeOption: 'photo' })}
            >
              <Text
                style={{
                  marginRight: 72,
                  fontSize: 15,
                  color:
                    activeOption === 'photo'
                      ? Colors.magenta
                      : Colors.white,
                }}
              >
                Photo
              </Text>
            </TouchableOpacity>
          )}
          {(!limitOption) && (
            <TouchableOpacity onPress={this.handlePressVideoOption}>
              <Text
                style={{
                  fontSize: 15,
                  color:
                    activeOption === 'video'
                      ? Colors.magenta
                      : Colors.white,
                }}
              >
                Video
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  renderConfirmImage = () => {
    return (
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarConfirmActions}>
          <TouchableOpacity onPress={() => this.handleCancelImage()}>
            <Image
              style={{
                width: 27,
                height: 27,
                transform: [
                  { rotateX: this.state.isLandscape ? '90deg' : '0deg' },
                ],
              }}
              source={require('../assets/images/camera_delete_media_save_video.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleConfirmImage()}>
            <Image
              style={{
                width: 27,
                height: 27,
                transform: [
                  { rotateX: this.state.isLandscape ? '90deg' : '0deg' },
                ],
                marginBottom: 4,
              }}
              source={require('../assets/images/camera_accept_media_icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderImagePreview = () => {
    const { activeOption } = this.state;
    return (
      <View style={styles.imagePreview}>
        {activeOption === 'photo' && (
          <Image
            source={{ uri: this.image.uri }}
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode="contain"
          />
        )}
        {activeOption === 'video' && (
          <Video
            source={{ uri: this.image.uri }}
            shouldPlay={false}
            resizeMode={Video.RESIZE_MODE_COVER}
            style={{ flex: 1 }}
            useNativeControls
          />
        )}
        {this.renderConfirmImage()}
      </View>
    );
  };

  renderCameraPosition = choice => {
    if (choice !== undefined && choice) {
      let cameraPositionTemplate = '';
      if (choice.overview_timeline === 'post_birth') {
        cameraPositionTemplate = require('../assets/images/camera_face_position.png');
      }
      if (choice.overview_timeline === 'during_pregnancy') {
        cameraPositionTemplate = require('../assets/images/camera_belly_position.png');
      }
      if (cameraPositionTemplate) {
        return (
          <Image
            source={cameraPositionTemplate}
            style={styles.cameraPosition}
            resizeMode="stretch"
          />
        );
      }
    }
    return null;
  };

  handleOnShow = () => {
    const camera = this.camera;
    if (camera) {
      camera.resumePreview();
    }
  };

  handleOnDismiss = () => {
    const camera = this.camera;
    if (camera) {
      camera.pausePreview();
    }
  };

  renderCameraContents = (confirmingImage, choice) => {
    if (confirmingImage && this.image) {
      return this.renderImagePreview();
    }
    return this.renderBottomBar();
  };

  render() {
    const { confirmingImage, flashMode, type } = this.state;
    const choice = this.props.choice;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onShow={() => this.handleOnShow()}
        onDismiss={() => this.handleOnDismiss()}
        onRequestClose={() => {}}
      >
        <View
          style={styles.camera}
          ref={ref => (this.container = ref)}
        >
          <Camera
            ref={ref => (this.camera = ref)}
            style={styles.camera}
            type={type}
            flashMode={flashMode}
          >
            {this.renderCameraContents(confirmingImage, choice)}
          </Camera>
          {!confirmingImage && this.renderCameraPosition(choice)}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: Colors.black,
    justifyContent: 'space-between',
    height: 165,
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  bottomBarAction: {
    flex: 0.3,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarActions: {
    height: 110,
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarConfirmActions: {
    height: imageButtonsHeight,
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarMenu: {
    height: isIphoneX() ? 50 : 30,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  camera: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  imagePreview: {
    flex: 1,
    width: imageWidth,
    height: imageHeight,
  },
  cameraPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: cameraPositionWidth,
    height: cameraPositionHeight,
    marginTop: cameraPositionMarginTop,
    marginLeft: cameraPositionMargin,
    marginRight: cameraPositionMargin,
  },
  takePictureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Colors.black,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: 'center',
  },
  takePictureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignSelf: 'center',
  },
});

export default CameraModal;
