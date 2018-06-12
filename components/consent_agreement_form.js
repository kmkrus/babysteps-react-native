import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

class ConsentAgreementForm extends Component {

  handleSubmit = () => {
    if ( _.sum(this.state.selectedIndex) > 0 ) {
      // any no
      this.props.updateSession({registration_state: States.REGISTERING_NOT_ELIGIBLE })
    } else {
      // all yes
      this.props.updateSession({registration_state: States.REGISTERING_AS_ELIGIBLE })
    }
  }

  handleLinkPress = (url) => {
    WebBrowser.openBrowserAsync(url);
  }

  render() {

    return (

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} >

          <View style={styles.elevated}>
            <Ionicons
              name={'md-construct'}
              size={28}
              style={styles.icon}
              color={Colors.iconDefault}
            />
            <Text style={styles.header}>Study Purposes and Goals</Text>
            <Text style={styles.text}>To provide you with an easily accessible and practical guide to your pregnancy, baby's delivery and early childhood development.  From the information you provide along the way, you will also create a record of you and your child's journey together, at the same time helping researchers to better understand child development.</Text>
            <Button
              title='Learn More'
              onPress={ ()=>this.handleLinkPress('http://example.com') }
              buttonStyle={styles.buttonLink}
              color={Colors.pink}
            />
            
          </View>

          <View style={styles.elevated}>
            <Ionicons
              name={'md-cog'}
              size={28}
              style={styles.icon}
              color={Colors.iconDefault}
            />
            <Text style={styles.header}>Data Processing</Text>
            <Text style={styles.text}>This information may allow researchers to better understand patterns relating to your infant's health and development.</Text>
            <Button
              title='Learn More'
              onPress={ ()=>this.handleLinkPress('http://example.com') }
              buttonStyle={styles.buttonLink}
              color={Colors.pink}
            />
            
          </View>

          <View style={styles.elevated}>
            <Ionicons
              name={'md-lock'}
              size={28}
              style={styles.icon}
              color={Colors.iconDefault}
            />
            <Text style={styles.header}>Data Protections</Text>
            <Text style={styles.text}>Your data will be encrypted and sent to a secure database with your name replaced by a random code.  Your consent, personal information and video data will be stored in a seperate location to preserve your privacy.</Text>
            <Button
              title='Learn More'
              onPress={ ()=>this.handleLinkPress('http://example.com') }
              buttonStyle={styles.buttonLink}
              color={Colors.pink}
            />
            
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button 
            title="NEXT"
            onPress={ this.handleSubmit } 
            color={Colors.pink}
            buttonStyle={styles.buttonNext}
            titleStyle={styles.buttonNextTitle}
          />
        </View>

      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 10,
    borderTopColor: Colors.grey,
    borderTopWidth: 1,
  },
  icon: {
    textAlign: 'center',
    marginTop: 5,
  },
  header: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: Colors.white,
    fontSize: 12,
    padding: 5,
  },
  elevated: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    elevation: 2,
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonLink: {
    backgroundColor: Colors.white,
  },
  buttonNext: {
    width: 300,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonNextTitle: {
    fontWeight: '900',
  }
});

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession };

export default connect( mapStateToProps, mapDispatchToProps )(ConsentAgreementForm);