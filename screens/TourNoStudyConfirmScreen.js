import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Button } from 'react-native-elements';

import { connect} from 'react-redux';
import { updateSession } from '../actions/session_actions';

import States from '../actions/states';
import Colors from '../constants/Colors';
import '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const width = screenWidth;


class TourNoStudyConfirmScreen extends Component {

  selectText = () => {
    if (this.props.session.registration_state == States.REGISTERING_NOT_ELIGIBLE ) {
      return (
        <Text>Unfortunately, you are not eligible to participate in the research study, but that's okay!  You can still access many of the features including the Baby Book and Milestone Tracking.</Text>
      )
    } else {
      return (
        <Text>You've chosen not to participate in the research study, and that's okay! Be aware that you will not have access to all the benefits that Baby Steps offers.  I you change your mind, you will be able to join the study later if you wish.</Text>
      )
    }
  }

  selectButtonTitle = () => {
    if (this.props.session.registration_state == States.REGISTERING_ELIGIBILITY) {
      return 'Join Study'
    } else {
      return 'Go Back'
    }
  }
  
  render() {
    
    return (
      
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.textBlock}>
            <Image
              style={styles.image}
              source={require('../assets/images/tour_no_study_confirm.png')} />
            { this.selectText()}
          </View>

        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonOneStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => { 
              this.props.updateSession( {registration_state: States.REGISTERING_ELIGIBILITY} )
            }}
            title={ this.selectButtonTitle() } />
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonTwoStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => { 
              this.props.navigation.navigate('Registration')
            }}
            title='I Understand' />
          </View>

      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  image: {
    width: width - 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textBlock: {
    width: width - 40,
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
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
    width: 120,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  }
})

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(TourNoStudyConfirmScreen);
