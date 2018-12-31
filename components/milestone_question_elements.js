import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  CheckBox,
  FormLabel,
  FormInput,
  Slider,
} from 'react-native-elements';
import { ImagePicker, Permissions, Video, WebBrowser } from 'expo';
import DatePicker from 'react-native-datepicker';

import _ from 'lodash';

import CameraModal from './camera_modal';
import AudioModal from './audio_modal';

import Colors from '../constants/Colors';
import VideoFormats from '../constants/VideoFormats';
import ImageFormats from '../constants/ImageFormats';
import AudioFormats from '../constants/AudioFormats';

const { width } = Dimensions.get('window');

const previewWidth = width - 40;
const previewHeight = width * 0.75;

const videoWidth = previewWidth;
const videoHeight = previewWidth;

const formats = {
  file_audio: 'Audio',
  file_image: 'Photo',
  file_video: 'Video',
};
const mediaTypes = {
  file_audio: 'Audio',
  file_image: 'Images',
  file_video: 'Videos',
};

export class RenderCheckBox extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let checked = false;
      let text = '';
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);

      if (answer) {
        checked = answer.answer_boolean;
        text = answer.answer_text;
      }
      const requireExplanation = (choice.require_explanation === 'if_true' && checked);
      let option_group = 'text_short';
      if (choice.rn_input_type) { option_group = choice.rn_input_type }

      return (
        <View key={choice.id} style={styles.checkBoxExplanationContainer}>
          <CheckBox
            title={choice.body}
            textStyle={styles.checkBoxChoiceText}
            containerStyle={styles.checkBoxChoiceContainer}
            checked={checked}
            onPress={() =>
              this.props.saveResponse(
                choice,
                { answer_boolean: !checked },
                { format: this.props.format },
              )
            }
          />
          {requireExplanation &&
            option_group === 'text_short' && (
              <FormInput
                autoCapitalize="words"
                inputStyle={styles.textInput}
                defaultValue={text}
                onChangeText={value =>
                  this.props.saveResponse(
                    choice,
                    { answer_text: value },
                    { preserve: true },
                  )
                }
                containerStyle={{ borderBottomColor: Colors.lightGrey }}
                underlineColorAndroid={Colors.lightGrey}
              />
            )}
          {requireExplanation &&
            option_group === 'number_scale' && (
              <View style={styles.sliderContainer}>
                <Text>Years: {text}</Text>
                <Slider
                  style={styles.slider}
                  trackStyle={styles.sliderTrack}
                  thumbStyle={styles.sliderThumb}
                  minimumValue={0}
                  maximumValue={30}
                  step={1}
                  onSlidingComplete={value =>
                    this.props.saveResponse(
                      choice,
                      { answer_text: value },
                      { preserve: true },
                    )
                  }
                />
              </View>
            )}
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

export class RenderCheckYesNo extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let checked = false;
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        checked = answer.answer_boolean;
      }
      return (
        <CheckBox
          key={choice.id}
          title={choice.body}
          textStyle={styles.checkBoxChoiceText}
          containerStyle={styles.checkBoxChoiceContainer}
          checked={checked}
          onPress={() =>
            this.props.saveResponse(
              choice,
              { answer_boolean: !checked },
              { format: "single" },
            )
          }
        />
      );
    });
    return <View style={{ flexDirection: 'row' }}>{collection}</View>;
  } // render
}


export class RenderTextShort extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let text = '';
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        text = answer.answer_text;
      }
      return (
        <View key={choice.id}>
          <FormLabel labelStyle={styles.textLabel}>{choice.body}</FormLabel>
          <FormInput
            autoCapitalize="words"
            inputStyle={styles.textInput}
            defaultValue={text}
            onChangeText={value =>
              this.props.saveResponse(choice, { answer_text: value })
            }
            containerStyle={{ borderBottomColor: Colors.lightGrey }}
            underlineColorAndroid={Colors.lightGrey}
          />
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

export class RenderTextLong extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let text = '';
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        text = answer.answer_text;
      }
      return (
        <View key={choice.id}>
          <FormLabel labelStyle={styles.textLabel}>{choice.body}</FormLabel>
          <FormInput
            autoCapitalize="sentences"
            inputStyle={styles.textInput}
            defaultValue={text}
            multiline={true}
            numberOfLines={4}
            onChangeText={value =>
              this.props.saveResponse(choice, { answer_text: value })
            }
            containerStyle={{ borderBottomColor: Colors.lightGrey }}
            underlineColorAndroid={Colors.lightGrey}
          />
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

export class RenderTextNumeric extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let text = '';
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        text = answer.answer_text;
      }
      return (
        <View key={choice.id}>
          <FormLabel labelStyle={styles.textLabel}>{choice.body}</FormLabel>
          <FormInput
            inputStyle={styles.textInput}
            defaultValue={text}
            keyboardType="numeric"
            onChangeText={value =>
              this.props.saveResponse(choice, { answer_text: value })
            }
            containerStyle={{ borderBottomColor: Colors.lightGrey }}
            underlineColorAndroid={Colors.lightGrey}
          />
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

export class RenderDate extends React.PureComponent {
  render() {
    const collection = _.map(this.props.choices, choice => {
      let text = new Date().toISOString().slice(0, 10);
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        text = answer.answer_text;
      }
      return (
        <View key={choice.id}>
          <DatePicker
            label={choice.body}
            date={text}
            style={styles.dateInput}
            mode="date"
            androidMode="spinner"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: Colors.lightGrey,
              },
            }}
            onDateChange={value =>
              this.props.saveResponse(choice, { answer_text: value })
            }
          />
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

export class RenderFile extends Component {
  state = {
    choice: null,
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    hasAudioPermission: null,
    permissionMessage: '',
    imageError: '',
    cameraModalVisible: false,
    audioModalVisible: false,
  };

  handleCameraRollPermission = async () => {
    const camera_roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraRollPermission: camera_roll.status === 'granted',
    });
  };

  pickImage = async (choice, source = null) => {
    let image = {};
    this.setState({ choice });
    if (source === 'library') {
      await this.handleCameraRollPermission();
      if (this.state.hasCameraRollPermission) {
        const mediaType = mediaTypes[this.props.question.rn_input_type];
        image = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaType,
        });
        this.saveFile(image);
      } else {
        this.renderNoPermissions(source);
      }
    } else {
      this.setState({ cameraModalVisible: true });
    }
  };

  recordAudio = choice => {
    this.setState({ choice, audioModalVisible: true });
  };

  saveFile = (file) => {
    if (file && !file.cancelled) {
      file.file_type = this.props.question.rn_input_type;
      file.title = this.props.question.title;
      this.props.saveResponse(this.state.choice, { attachments: [file] });
      this.setState({ choice: null });
    }
  };

  renderNoPermissions = source => {
    const message = [];
    if (
      ['camera', 'video'].includes(source) &&
      !this.state.hasCameraPermission
    ) {
      message << 'Camera Permissions not granted - cannot open camera preview';
    }
    if (source === 'library' && !this.state.hasCameraRollPermission) {
      message << 'Camera Roll Permissions not granted - cannot open photo album';
    }
    if (source === 'video' && !this.state.hasAudioPermission) {
      message << 'Audio Recording Permissions not granted - cannot open audio preview';
    }
    this.setState({ permissionMessage: message.join(', ') });
  };

  _closeAudioModal = sound => {
    this.saveFile(sound);
    this.setState({ audioModalVisible: false });
  };

  _closeCameraModal = image => {
    this.saveFile(image);
    this.setState({ cameraModalVisible: false });
  };

  render() {
    const question = this.props.question;
    const format = formats[question.rn_input_type];
    const answers = this.props.answers;
    const attachments = this.props.attachments;
    let loadCameraModal = false;
    let loadAudioModal = false;

    const collection = _.map(this.props.choices, choice => {
      let isVideo = false;
      let isImage = false;
      let isAudio = false;

      let displayVideo = false;
      let displayImage = false;
      let displayAudio = false;

      let uri = null;
      let uriParts = [];
      const image = {};
      let fileType = null;
      const answer = _.find(answers, ['choice_id', choice.id]);
      const attachment = _.find(attachments, ['choice_id', choice.id]);

      if (attachment && attachment.uri) {
        uri = attachment.uri;
        uriParts = uri.split('.');
        fileType = uriParts[uriParts.length - 1];
      }
      switch (question.rn_input_type) {
        case 'file_image':
          isImage = true;
          loadCameraModal = true;
          if (fileType) {displayImage = !!ImageFormats[fileType]};
          break;
        case 'file_video':
          isVideo = true;
          loadCameraModal = true;
          if (fileType) {displayVideo = !!VideoFormats[fileType]};
          break;
        case 'file_audio':
          isAudio = true;
          loadAudioModal = true;
          if (fileType) {displayAudio = !!AudioFormats[fileType]};
          break;
      }

      return (
        <View key={choice.id} style={styles.fileImageContainer}>
          {(isImage || isVideo) && (
            <View>
              <Text style={styles.questionBody}>{question.body}</Text>
              <Button
                title={`Attach ${format}`}
                buttonStyle={styles.libraryButton}
                titleStyle={styles.buttonTitleStyle}
                color={Colors.green}
                onPress={() => this.pickImage(choice, 'library')}
              />
              <Button
                title={`Take a ${format}`}
                buttonStyle={styles.cameraButton}
                titleStyle={styles.buttonTitleStyle}
                color={Colors.green}
                onPress={() => this.pickImage(choice, 'new')}
              />
            </View>
          )}
          {isAudio && (
            <View>
              <Text style={styles.questionBody}>{question.body}</Text>
              <Button
                title="Record Audio"
                buttonStyle={styles.libraryButton}
                titleStyle={styles.buttonTitleStyle}
                color={Colors.green}
                onPress={() => this.recordAudio(choice)}
              />
            </View>
          )}
          <Text style={styles.textError}>
            {this.state.permissionMessage}
            {this.props.errorMessage}
          </Text>

          <View style={styles.pickImageContainer}>
            {displayVideo && (
              <Video
                source={{ uri: uri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={Video.RESIZE_MODE_COVER}
                shouldPlay={false}
                isLooping
                useNativeControls
                style={styles.video}
              />
            )}
            {displayImage && (
              <Image source={{ uri }} style={styles.image} />
            )}
            {displayAudio && (
              <Text>Recording Attached</Text>
            )}
            <Text style={styles.textError}>{this.state.imageError}</Text>
          </View>
        </View>
      ); // return
    }); // map choices
    return (
      <View>
        {collection}
        {loadCameraModal && (
          <CameraModal
            modalVisible={this.state.cameraModalVisible}
            closeCameraModal={image => this._closeCameraModal(image)}
            choice={this.state.choice}
            question={this.props.question}
          />
        )}
        {loadAudioModal && (
          <AudioModal
            modalVisible={this.state.audioModalVisible}
            closeAudioModal={sound => this._closeAudioModal(sound)}
            question={this.props.question}
          />
        )}
      </View>
    );
  } // render
}

export class RenderExternalLink extends React.PureComponent {
  handleLinkPress = choice => {
    WebBrowser.openBrowserAsync(choice.body);
    this.props.saveResponse(choice, { answer_boolean: true });
  };

  render() {
    const collection = _.map(this.props.choices, choice => {
      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      const completed = answer && answer.answer_boolean;

      //
      return (
        <View key={choice.id}>
          <TouchableOpacity onPress={() => this.handleLinkPress(choice)}>
            <Text style={styles.externalLink}>{choice.body}</Text>
          </TouchableOpacity>
          <Text style={styles.externalLinkHelper}>Press Confirm when completed.</Text>
        </View>
      );
    });
    return <View>{collection}</View>;
  } // render
}

const styles = StyleSheet.create({
  checkBoxChoiceContainer: {
    padding: 0,
    marginLeft: 20,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  checkBoxChoiceText: {
    fontSize: 12,
    fontWeight: '400',
  },
  checkBoxExplanationContainer: {
    flexDirection: 'column',
  },
  textInput: {
    fontSize: 14,
    fontWeight: '600',
  },
  textLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  textError: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.red,
    alignSelf: 'center',
  },
  dateInput: {
    width: 200,
    marginBottom: 10,
    marginLeft: 20,
  },
  questionBody: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  fileImageContainer: {
    marginTop: 20,
  },
  cameraButton: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  libraryButton: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: previewWidth,
    height: previewHeight,
  },
  video: {
    flex: 1,
    width: videoWidth,
    height: videoHeight,
  },
  externalLink: {
    padding: 10,
    marginLeft: 20,
    fontSize: 16,
    color: Colors.tintColor,
  },
  externalLinkHelper: {
    marginLeft: 30,
    fontSize: 12,
    color: Colors.grey,
  },
  sliderContainer: {
    marginLeft: 20,
    marginRight: 10,
  },
  sliderThumb: {
    backgroundColor: Colors.darkGreen,
  },
});
