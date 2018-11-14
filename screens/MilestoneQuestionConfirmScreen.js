import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { StackActions } from 'react-navigation';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const imageHeight = height / 3;

class MilestoneQuestionConfirmScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  returnToOverview = () => {
    //const { navigate } = this.props.navigation;
    this.props.navigation.dispatch(StackActions.popToTop());
    this.props.navigation.navigate('Overview');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textBlock}>
          <Image
            style={styles.image}
            source={require('../assets/images/thank_you_balloons.png')}
          />
          <Text style={styles.header}>You've completed this task!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.returnToOverview}
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
  textBlock: {
    marginTop: 10,
    width: width - 100,
    alignItems: 'center',
  },
  image: {
    height: imageHeight,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: {
    marginBottom: 10,
    fontSize: 20,
    color: Colors.green,
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
