import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Button } from 'react-native-elements';

import Colors from '../constants/Colors';
import '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const width = screenWidth;


export default class TourNoStudyConfirmScreen extends Component {

  static WIDTH = width;
  
  render() {

    console.log(this.props)
    
    return (
      
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.textBlock}>
            <Text>You've chosen not to participate in the research study, and that's okay! Be aware that you will not have access to all the benefits that Baby Steps offers.  I you change your mind, you will be able to join the study later.</Text>
          </View>

        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
              color={Colors.grey}
              buttonStyle={styles.buttonOneStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={ () => { 
                this.props.updateSession( {registration_state: States.REGISTERING_AS_IN_STUDY} )
              }}
              title='Join Study' />
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
    alignItems: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  textBlock: {
    width: width - 40,
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