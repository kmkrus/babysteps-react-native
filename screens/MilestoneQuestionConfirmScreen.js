import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';

import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

class MilestoneQuestionConfirmScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textBlock}>
          <Image
            style={styles.image}
            source={require('../assets/images/thank_you_balloons.png')}
          />
          <Text style={styles.header}>Thank You</Text>
          <Text style={styles.text}>
            {"We've received the answers to this questionaire and will follow up with you if necessary."}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={() => this.props.navigation.navigate('Overview')}
            title="Go to Overview"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
    marginTop: 40,
    width: width - 100,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    fontSize: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
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
});

export default MilestoneQuestionConfirmScreen;
