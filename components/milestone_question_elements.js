import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  CheckBox,
  FormLabel,
  FormInput,
} from 'react-native-elements';
import { ImagePicker, Permissions, Video } from 'expo';
import DatePicker from 'react-native-datepicker';

import _ from 'lodash';

import CameraModal from './camera_modal';

import Colors from '../constants/Colors';
import VideoFormats from '../constants/VideoFormats';

const { width } = Dimensions.get('window');

const itemWidth = width - 40;

const previewWidth = width - 40;
const previewHeight = width * 0.75;

const videoWidth = previewWidth;
const videoHeight = previewWidth;

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
          {requireExplanation && (
            <FormInput
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

export class renderTextNumeric extends React.PureComponent {
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
    images: [],
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    hasAudioPermission: null,
    permissionMessage: '',
    imageError: '',
    cameraModalVisible: false,
  };

  handleCameraRollPermission = async () => {
    const camera_roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraRollPermission: camera_roll.status === 'granted',
    });
  };

  pickImage = async (choice, source = null) => {
    let image = {};
    if (source === 'library') {
      await this.handleCameraRollPermission();
      if (this.state.hasCameraRollPermission) {
        const mediaType = this.props.format === 'Photo' ? 'Images' : 'Videos';
        image = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaType,
        });
        this.saveImage(choice, image);
      } else {
        this.renderNoPermissions(source);
      }
    } else {
      this.setState({ cameraModalVisible: true });
    }
  };

  saveImage = (choice, image) => {
    if (image && !image.cancelled) {
      const images = _.extend(this.state.images);
      _.remove(images, ['choice_id', choice.id]);
      image.choice_id = choice.id;
      images.push(image);
      this.setState({ images });
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
      message << 'Audio Recording Permissions not granted - cannot open video preview';
    }
    this.setState({ permissionMessage: message.join(', ') });
  };

  closeModal = image => {
    this.saveImage(choice, image);
    this.setState({ cameraModalVisible: false });
  };

  render() {
    const images =this.state.images;
    const format = this.props.format;

    const collection = _.map(this.props.choices, choice => {
      let hasUri = false;
      let isVideo = false;
      let uri = null;
      let uriParts = [];
      let attachment = {};

      const answer = _.find(this.props.answers, ['choice_id', choice.id]);
      if (answer) {
        attachment = answer.attachments[0];
      }

      const image = _.find(images, ['choice_id', choice.id]);

      if (image) {
        if (image.uri) {
          uri = image.uri;
          hasUri = true;
          uriParts = uri.split('.');
        }
        isVideo = VideoFormats.includes(uriParts[uriParts.length - 1]);
      }

      return (
        <View key={choice.id} style={styles.fileImageContainer}>
          <Button
            title={`Attach ${format}`}
            buttonStyle={styles.libraryButton}
            titleStyle={styles.buttonTitleStyle}
            color={Colors.darkGreen}
            onPressIn={() => this.pickImage(choice, 'library')}
          />
          <Button
            title={`Take a ${format}`}
            buttonStyle={styles.cameraButton}
            titleStyle={styles.buttonTitleStyle}
            color={Colors.darkGreen}
            onPressIn={() => this.pickImage(choice, 'new')}
          />
          <Text>{this.state.permissionMessage}</Text>

          <View style={styles.pickImageContainer}>
            {!!isVideo &&
              !!hasUri && (
                <Video
                  source={uri}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode={Video.RESIZE_MODE_COVER}
                  shouldPlay={false}
                  isLooping
                  useNativeControls
                  style={{ width: videoWidth, height: videoHeight }}
                />
            )}
            {!isVideo &&
              !!hasUri && (
              <Image source={{ uri }} style={styles.image} />
            )}

            <Text style={styles.textError}>{this.state.imageError}</Text>
          </View>
        </View>
      ); // return
    }); // map choices
    return (
      <View>
        {collection}
        <CameraModal
          modalVisible={this.state.cameraModalVisible}
          closeModal={image => this.closeModal(image)}
        />
      </View>
    );
  }; // render
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
  },
  questionContainer: {
    flexDirection: 'column',
    padding: 5,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  questionLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: itemWidth,
  },
  question: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 5,
    color: Colors.tint,
  },
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
  dateInput: {
    width: 200,
    marginBottom: 10,
    marginLeft: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
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
  fileImageContainer: {
    marginTop: 20,
  },
  cameraButton: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.darkGreen,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  libraryButton: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.darkGreen,
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
});
