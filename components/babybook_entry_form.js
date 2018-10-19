import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { ImagePicker, Permissions, Video } from 'expo';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import {
  resetBabyBookEntries,
  createBabyBookEntry,
} from '../actions/babybook_actions';

import DatePickerInput from './datePickerInput';
import MaterialTextInput from './materialTextInput';
import CameraModal from './camera_modal';

import Colors from '../constants/Colors';
import VideoFormats from '../constants/VideoFormats';
import ImageFormats from '../constants/ImageFormats';
import AudioFormats from '../constants/AudioFormats';

const { width } = Dimensions.get('window');

const previewWidth = width - 40;
const previewHeight = width * 0.75;

const videoWidth = previewWidth;
const videoHeight = previewWidth;

const TextInput = compose(
  withInputAutoFocus,
  withNextInputAutoFocusInput,
)(MaterialTextInput);

const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is Required'),
});

class BabyBookEntryForm extends Component {
  state = {
    image: null,
    imageError: '',
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    hasAudioPermission: null,
    permissionMessage: '',
    cameraModalVisible: false,
  };

  async componentDidMount() {
    await this.handleCameraRollPermission();
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.babybook.entries.fetching;
  }

  handleCameraRollPermission = async () => {
    const camera_roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraRollPermission: camera_roll.status === 'granted',
    });
  };

  pickImage = async (source = null) => {
    let image = {};
    if (source === 'library') {
      if (this.state.hasCameraRollPermission) {
        image = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'All',
        });
      } else {
        await this.handleCameraRollPermission();
        this.renderNoPermissions(source);
      }
    } else {
      this.setState({ cameraModalVisible: true });
    }

    if (image && !image.cancelled) {
      this.setState({ image });
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
    if (image) this.setState({ image });
    this.setState({ cameraModalVisible: false });
  };

  render() {
    const image = this.state.image;
    let hasUri = false;
    let isVideo = false;
    let isImage = false;
    let isAudio = false;
    let uri = null;
    let uriParts = [];

    if (image && image.uri) {
      uri = image.uri;
      hasUri = true;
      uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      isVideo = !!VideoFormats[fileType];
      isImage = !!ImageFormats[fileType];
      isAudio = !!AudioFormats[fileType];
    }

    return (
      <Formik
        onSubmit={values => {
          this.props.createBabyBookEntry(values, this.state.image);
        }}
        validationSchema={validationSchema}
        initialValues={{
          created_at: new Date().toISOString(),
        }}
        render={props => {
          return (
            <Form>
              <TextInput label="Title" name="title" type="name" />
              <DatePickerInput
                label="Date"
                name="created_at"
                date={props.values.created_at}
                handleChange={value => props.setFieldValue('created_at', value)}
              />

              <Button
                title="Attach Photo or Video"
                buttonStyle={styles.libraryButton}
                titleStyle={styles.buttonTitleStyle}
                color={Colors.darkGreen}
                onPressIn={() => this.pickImage('library')}
              />
              <Button
                title="Take a Photo or Video "
                buttonStyle={styles.cameraButton}
                titleStyle={styles.buttonTitleStyle}
                color={Colors.darkGreen}
                onPressIn={() => this.pickImage('new')}
              />
              <Text>{this.state.permissionMessage}</Text>

              <View style={styles.pickImageContainer}>
                {!!hasUri &&
                  (!!isVideo && (
                    <Video
                      source={{ uri }}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode={Video.RESIZE_MODE_COVER}
                      shouldPlay={false}
                      isLooping
                      useNativeControls
                      style={styles.video}
                    />
                  ) ||
                    !isVideo && (
                      <Image source={{ uri }} style={styles.image} />
                  ))
                }

                <Text style={styles.textError}>{this.state.imageError}</Text>
              </View>

              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  label="Details"
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline
                  name="detail"
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Save Entry"
                  buttonStyle={styles.buttonStyle}
                  titleStyle={styles.buttonTitleStyle}
                  disabled={props.isSubmitting || !this.state.image}
                  onPress={props.submitForm}
                  color={Colors.pink}
                />
              </View>

              <CameraModal
                modalVisible={this.state.cameraModalVisible}
                closeModal={image => this.closeModal(image)}
              />
            </Form>
          );
        }} // render
      /> // Formik
    ); // return
  } // render
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',

    bottom: 10,
    marginTop: 10,
    width: '100%',
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonStyle: {
    width: 200,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  pickImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  textAreaContainer: {
    flex: 1,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
    padding: 5,
    marginBottom: 20,
  },
  textArea: {
    flex: 1,
    height: 150,
    justifyContent: 'flex-start',
  },
  textError: {
    textAlign: 'center',
    color: Colors.errorColor,
    fontSize: 11,
    padding: 5,
  },
});

const mapStateToProps = ({ babybook }) => ({ babybook });
const mapDispatchToProps = { resetBabyBookEntries, createBabyBookEntry };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BabyBookEntryForm);
