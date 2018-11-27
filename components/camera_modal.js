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
import { Camera, Permissions, Video } from 'expo';
import * as moment from 'moment';
import padStart from 'lodash/padStart';
import Colors from '../constants/Colors';

// TODO fix horizontal styles
const { width, height } = Dimensions.get('window');
const cameraFacePositionMargin = 35;
const cameraFacePositionWidth = width - (cameraFacePositionMargin * 2);
const cameraFacePositionHeight = (height * 0.6) - cameraFacePositionMargin;

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

  async componentWillMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    if (!(camera.status === 'granted')) {
      this.props.closeModal();
    }
  }

  componentDidMount() {
    if (this.props.question) {
      this.setState({
        limitOption: true,
        activeOption: mediaTypes[this.props.question.rn_input_type],
      });
    }
  }

  onLayout = () => {
    console.log('layout');
    if (!this.container) return;

    const dim = Dimensions.get('window');
    const { width, height } = dim;
    if (dim.width >= dim.height) {
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
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (!(audio.status === 'granted')) {
      return;
    }
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
    this.setState({ confirmingImage: false, videoTimer: moment.duration(0) });
  };

  handleConfirmImage = () => {
    if (this.videoTimeInterval) clearInterval(this.videoTimeInterval);
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
            <TouchableOpacity onPressIn={() => this.props.closeCameraModal(null)}>
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
            onPressIn={this.handleTakePicture}
            style={styles.takePictureButton}
          >
            <View style={[styles.takePictureButtonInner, takePictureButtonColor]} />
          </TouchableOpacity>

          <View style={styles.bottomBarAction}>
            <TouchableOpacity onPressIn={this.handleChangeCameraType}>
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
              <TouchableOpacity onPressIn={this.handleChangeFlashMode}>
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
          {(!limitOption || activeOption === 'photo') && (
            <TouchableOpacity
              onPressIn={() => this.setState({ activeOption: 'photo' })}
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
          {(!limitOption || activeOption === 'video') && (
            <TouchableOpacity onPressIn={this.handlePressVideoOption}>
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

  renderConfirmImage = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarConfirmActions}>
        <TouchableOpacity onPressIn={this.handleCancelImage}>
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
        <TouchableOpacity onPressIn={this.handleConfirmImage}>
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

  renderImagePreview = () => {
    const { activeOption } = this.state;
    return (
      <View style={styles.imagePreview}>
        {activeOption === 'photo' && (
          <Image source={{ uri: this.image.uri }} style={{ flex: 1 }} />
        )}
        {activeOption === 'video' && (
          <Video
            source={{ uri: this.image.uri }}
            shouldPlay={false}
            resizeMode={Expo.Video.RESIZE_MODE_COVER}
            style={{ flex: 1 }}
            useNativeControls
          />
        )}
      </View>
    );
  };

  render() {
    const { confirmingImage, flashMode, type, videoTimer } = this.state;
    let showCameraFacePosition = false;
    if (this.props.choice !== undefined && this.props.choice) {
      showCameraFacePosition = this.props.choice.overview_timeline === 'post_birth';
    }
    if (videoTimer) {
      console.log('SECONDS: ', videoTimer.seconds() );
    }
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
            {confirmingImage && this.image && this.renderImagePreview()}
            {confirmingImage
              ? this.renderConfirmImage()
              : this.renderBottomBar()}
          </Camera>
          {showCameraFacePosition && (
            <Image
              source={require('../assets/images/camera_face_position.png')}
              style={styles.cameraFacePosition}
              resizeMode='stretch'
            />
          )}
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
    height: 110,
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
    height: height - 165,
    alignSelf: 'flex-start',
    width: '100%',
  },
  cameraFacePosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: cameraFacePositionWidth,
    height: cameraFacePositionHeight,
    marginTop: cameraFacePositionMargin,
    marginLeft: cameraFacePositionMargin,
    marginRight: cameraFacePositionMargin,
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
