import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withInputAutoFocus, {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';

import { connect } from 'react-redux';
import { resetBabyBookEntries, createBabyBookEntry } from '../actions/babybook_actions';

import DatePickerInput from '../components/datePickerInput';
import MaterialTextInput from '../components/materialTextInput';

import Colors from '../constants/Colors';
import States from '../actions/states';

const TextInput = compose(withInputAutoFocus, withNextInputAutoFocusInput)(MaterialTextInput);
const Form = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is Required')
})

class BabyBookEntryForm extends Component {

  state = {
    image: null,
    imageError: '',
  };

  shouldComponentUpdate(nextProps, nextState) {
    return ( !nextProps.babybook.entries.fetching )
  }

  askPermissionsAsync = async () => {
    const camera_roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio_recording = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      
    return {cameraRoll: camera_roll, camera: camera, audio_recording: audio_recording}
  };

  pickImage = async (source=null) => {

    let permissions = await this.askPermissionsAsync();

    if (permissions.cameraRoll.status === 'granted' && permissions.camera.status === 'granted') {
      var image = {}
      if (source === 'library') {
        image = await ImagePicker.launchImageLibraryAsync()
      } else {
        image = await ImagePicker.launchCameraAsync()
      }
      if (!image.cancelled) {
        this.setState({ image: image });
      }
    } else {
      // TODO handle no permissions
    }

  }

  render() {

    return (

      <Formik
        onSubmit={ (values) => {
          this.props.createBabyBookEntry(values, this.state.image)
        }}
        validationSchema={validationSchema}
        initialValues={{
          'created_at': new Date().toISOString(),
        }}
        render={ (props) => {

          let uri = this.state.image ? this.state.image.uri : null

          return (
            <Form>
              <TextInput label="Title" name="title" type="name" />
              <DatePickerInput
                label="Date" 
                name="created_at" 
                date={props.values.created_at}
                handleChange={ (value) => props.setFieldValue('created_at', value) }
              />

              <Button
                  title='Attach Photo or Video'
                  buttonStyle={styles.libraryButton}
                  titleStyle={styles.buttonTitleStyle}
                  color={Colors.darkGreen}
                  onPress={ () => this.pickImage('library') }
                   
              />
              <Button
                  title='Take a Photo or Video'
                  buttonStyle={styles.cameraButton}
                  titleStyle={styles.buttonTitleStyle}
                  color={Colors.darkGreen}
                  onPress={ () => this.pickImage('camera') }
              />
              <View style={styles.pickImageContainer}>
                <Image 
                    source={{uri: uri}}
                    style={styles.image}
                  />
                <Text style={styles.textError}>{this.state.imageError}</Text>
              </View>

              <View style={styles.textAreaContainer} >
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid={"transparent"}
                  label={'Details'}
                  placeholderTextColor={"grey"}
                  numberOfLines={10}
                  multiline={true}
                  name={'detail'}
                />
              </View>

              <View style={styles.buttonContainer}>
  
                <Button 
                  title="Save Entry"
                  buttonStyle={styles.buttonStyle}
                  titleStyle={styles.buttonTitleStyle}
                  disabled={ (props.isSubmitting || !this.state.image) }
                  onPress={props.handleSubmit} 
                  color={Colors.pink}
                />

              </View>
              
            </Form>
          );
        }} // render
      /> // Formik

    ) // return 
  } // render
};

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
  pickImage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.darkGreen,
    borderWidth: 1,
    borderRadius: 5,
  },
  pickImageText: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: Colors.transparent,
  },
  image: { 
    flex: 1,
    width: 200, 
    height: 200,
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
    justifyContent: "flex-start"
  },
  textError: {
    textAlign: 'center',
    color: Colors.errorColor,
    fontSize: 11,
    padding: 5,
  }
})

const mapStateToProps = ({ babybook }) => ({ babybook });
const mapDispatchToProps = { resetBabyBookEntries, createBabyBookEntry };

export default connect( mapStateToProps, mapDispatchToProps )(BabyBookEntryForm);