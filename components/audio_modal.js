import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  Slider,
  Vibration,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import { Audio, FileSystem, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';

const { width, height, } = Dimensions.get('window');


const modalWidth = width - 40;
const modalHeight = height - 40;

const iconRecordButtonSize = 40;
const iconRecordButtonContnainer = iconRecordButtonSize + 60;

const iconRecordingSize = 40;

const iconVolumeSize = 32;

const iconRecordDataContainer = iconRecordingSize + 60;
const iconRecordDataRowContainer = iconRecordDataContainer - 10;

const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

class AudioModal extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      recordingPermission: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundInfo: null,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY),
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  async componentDidMount() {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (response.status === 'granted') {
      this.setState({ recordingPermission: true });
    } else {
      this.renderNoPermissions('audio');
      this.closeAudioModal();
    }
  }

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  _handleOnRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  };

  async _stopRecordingAndEnablePlayback() {
    this.setState({ isLoading: true });

    await this.recording.stopAndUnloadAsync();

    const info = await FileSystem.getInfoAsync(this.recording.getURI());

    this.setState({ soundInfo: info });

    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus,
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  };

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundPosition)} / ${this._getMMSSFromMillis(
        this.state.soundDuration
      )}`;
    }
    return '';
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  _handleCancelRecording() {
    this.props.closeAudioModal();
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
      this.setState({ soundInfo: null })
    }
  }

  _handleConfirmRecording() {
    this.props.closeAudioModal(this.state.soundInfo);
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
      this.setState({ soundInfo: null })
    }
  }

  render() {
    const haveRecordingPermission = this.state.recordingPermission;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >

        {!haveRecordingPermission && (
          <View style={styles.container}>
            <Text style={styles.noPermissionsText}>
              You must enable audio recording permissions in order to use this
              app.
            </Text>
          </View>
        )}

        {haveRecordingPermission && (
          <View style={styles.container}>
            <View
              style={[
                styles.halfScreenContainer,
                {
                  marginBottom: 10,
                  opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                },
              ]}
            >
              <View />

              <Text style={styles.title}>{this.props.question.title}</Text>

              <View style={styles.recordingContainer}>
                <Text style={styles.heading}>
                  {this.state.isRecording ? "Stop" : "Record"}
                </Text>
                <TouchableHighlight
                  underlayColor={Colors.black}
                  style={styles.wrapper}
                  onPress={this._handleOnRecordPressed}
                  disabled={this.state.isLoading}
                >
                  <FontAwesome
                    name={this.state.isRecording ? "circle-o" : "circle"}
                    size={iconRecordButtonSize}
                    color={this.state.isRecording ? Colors.red : Colors.white}
                  />
                </TouchableHighlight>
              </View>

              <View />

              <View style={styles.recordingDataContainer}>
                <View />
                {this.state.isRecording && (
                  <Text style={styles.liveText}>LIVE</Text>
                )}
                <View style={styles.recordingDataRowContainer}>
                  {this.state.isRecording && (
                    <Ionicons
                      name="ios-recording"
                      size={iconRecordingSize}
                      color={Colors.red}
                      style={[styles.image, {paddingRight: 20}]}
                    />
                  )}
                  <Text style={styles.recordingTimestamp}>
                    {this._getRecordingTimestamp()}
                  </Text>
                </View>
                <View />
              </View>
              <View />
            </View>

            <View
              style={[
                styles.halfScreenContainer,
                { opacity: !this.state.isPlaybackAllowed || this.state.isLoading ? DISABLED_OPACITY : 1.0 },
              ]}
            >
              <View />
              <View style={styles.playbackContainer}>
                <Text style={styles.heading}>Playback</Text>
                <Slider
                  style={styles.playbackSlider}
                  value={this._getSeekSliderPosition()}
                  onValueChange={this._onSeekSliderValueChange}
                  onSlidingComplete={this._onSeekSliderSlidingComplete}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                />
                <Text style={styles.playbackTimestamp}>
                  {this._getPlaybackTimestamp()}
                </Text>
              </View>

              <View style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}>
                <View style={styles.volumeContainer}>
                  <TouchableHighlight
                    underlayColor={Colors.background}
                    style={styles.wrapper}
                    onPress={this._onMutePressed}
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                  >
                    <Ionicons
                      name={ this.state.muted ? "md-volume-off" : "md-volume-mute" }
                      size={iconVolumeSize}
                      color={Colors.iconDefault}
                      style={styles.image}
                    />
                  </TouchableHighlight>
                  <Slider
                    style={styles.volumeSlider}
                    value={1}
                    onValueChange={this._onVolumeSliderValueChange}
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                  />
                </View>

                <View style={styles.playStopContainer}>
                  <TouchableHighlight
                    underlayColor={Colors.background}
                    style={styles.wrapper}
                    onPress={this._onPlayPausePressed}
                    disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                  >
                    <Ionicons
                      name={ this.state.isPlaying ? "md-pause" : "md-play"}
                      size={32}
                      color={Colors.iconDefault}
                      style={[styles.image, {marginLeft: 20}]}
                    />
                  </TouchableHighlight>
                  {this.state.isPlaying && (
                    <TouchableHighlight
                      underlayColor={Colors.background}
                      style={styles.wrapper}
                      onPress={this._onStopPressed}
                      disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                    >
                      <Ionicons
                        name="md-square"
                        size={32}
                        color={Colors.iconDefault}
                        style={[styles.image, {marginLeft: 20}]}
                      />
                    </TouchableHighlight>
                  )}
                </View>
              </View>

              <View style={styles.bottomBar}>
                <View style={styles.bottomBarConfirmActions}>
                  <TouchableOpacity onPressIn={() => this._handleCancelRecording()}>
                    <Image
                      style={{
                        width: 27,
                        height: 27,
                      }}
                      source={require('../assets/images/camera_delete_media_save_video.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPressIn={() => this._handleConfirmRecording()}>
                    <Image
                      style={{
                        width: 27,
                        height: 27,
                        marginBottom: 4,
                      }}
                      source={require('../assets/images/camera_accept_media_icon.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        )}

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.black,
    minHeight: modalHeight,
    maxHeight: modalWidth,
    padding: 20,
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  wrapper: {},
  halfScreenContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: modalHeight / 2.0 - 20,
    maxHeight: modalWidth / 2.0,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 5,
    padding: 20,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: iconRecordButtonContnainer,
    marginTop: 20,
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: iconRecordDataContainer,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: iconRecordDataRowContainer,
  },
  title: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.white,
  },
  heading: {
    fontSize: 14,
    color: Colors.white,
  },
  liveText: {
    color: Colors.red,
  },
  recordingTimestamp: {
    color: Colors.white,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  playbackTimestamp: {
    color: Colors.white,
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  image: {
    backgroundColor: Colors.black,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    height: 40,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: modalWidth / 2.0,
  },
  volumeSlider: {
    width: modalWidth / 2.0 - iconVolumeSize,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: modalWidth / 2.0 - 10,
    marginLeft: 10,
  },
  bottomBar: {
    backgroundColor: Colors.black,
    justifyContent: 'space-between',
    height: 165,
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  bottomBarConfirmActions: {
    height: 110,
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AudioModal;
