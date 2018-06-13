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

class ConsentDisclosureForm extends Component {

  handleSubmit = () => {
    this.props.updateSession({registration_state: States.REGISTERING_ACCEPT_TERMS })
  }

  handleLinkPress = (url) => {
    WebBrowser.openBrowserAsync(url);
  }

  render() {

    return (

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
        
        <View style={styles.elevated}>
          <Ionicons
            name={'md-person'}
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Your Commitment</Text>
          <Text style={styles.text}>You may be asked to respond to some simple questionaires about your feelings during the pregnancy and as a parent, stressors that you may be experiencing, or health issues. After your baby is born, you will be asked to videotape yourself with him or her during play, as well as during special milestones like first words or steps.  You are free to not respond to any questions that may make you uncomfortable.  You will also be asked to share your newborn screening blood spot (which is collected from every newborn baby), so that we can search for genetic risk markers of developmental delay or autism.</Text>
          <Button
            title='Learn More'
            onPress={ ()=>this.handleLinkPress('http://example.com') }
            buttonStyle={styles.buttonLink}
            color={Colors.pink}
          />
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name={'md-people'}
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Our Commitment to You</Text>
          <Text style={styles.text}>After 24 months we will ask you questions to help screen for any developmental concerns with your child, such as language delays or autism, and help you obtain any additional evaluations or treatment if needed.</Text>
          <Button
            title='Learn More'
            onPress={ ()=>this.handleLinkPress('http://example.com') }
            buttonStyle={styles.buttonLink}
            color={Colors.pink}
          />
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name={'md-thumbs-down'}
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Discontinuing the Study</Text>
          <Text style={styles.text}>You may withdraw from the study at any time, after which we wil not collect any additional data.</Text>
          <Button
            title='Learn More'
            onPress={ ()=>this.handleLinkPress('http://example.com') }
            buttonStyle={styles.buttonLink}
            color={Colors.pink}
          />
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name={'md-body'}
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Potential Benefits</Text>
          <Text style={styles.text}>The information from this study may help you to identify and receive help for an developmental concerns that arise for your child.  You will also receive a compiled video record of your child's development over the first two years of life.  Overall, your participation may help us to better understand what factors may lead to development disorders such as autism.</Text>
          <Button
            title='Learn More'
            onPress={ ()=>this.handleLinkPress('http://example.com') }
            buttonStyle={styles.buttonLink}
            color={Colors.pink}
          />
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name={'md-contact'}
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Risks to Privacy</Text>
          <Text style={styles.text}>Although we will make every effort to protect your privacy, we cannot guarantee total anonymity.</Text>
          <Button
            title='Learn More'
            onPress={ ()=>this.handleLinkPress('http://example.com') }
            buttonStyle={styles.buttonLink}
            color={Colors.pink}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="NEXT"
            onPress={ this.handleSubmit } 
            color={Colors.pink}
            buttonStyle={styles.buttonNext}
            titleStyle={styles.buttonNextTitle}
          />
        </View>

      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
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
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 20,
    elevation: 2,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
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

export default connect( mapStateToProps, mapDispatchToProps )(ConsentDisclosureForm);