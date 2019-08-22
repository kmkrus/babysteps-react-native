import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';

import tour_images from './tour_images';
import tour_text from './tour_text';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const containerHeight = height * 0.75;
const imageHeight = height * 0.25;

// eslint-disable-next-line import/prefer-default-export
export class TourItem extends Component {
  static WIDTH = width;

  handleSignInOnPress = () => {
    const { navigate } = this.props.navigation;
    navigate('SignIn');
  };

  render = () => {
    const { animatedValue, index } = this.props;
    return (
      <Animated.View style={styles.container}>
        <Animated.Image
          style={[
            styles.image,
            {
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [1, 1.1, 1],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: ['90deg', '0deg', '-90deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          source={tour_images[index]}
        />
        <View style={styles.textBlock}>
          <Text style={styles.title}>{tour_text[index].title}</Text>
          <Text style={styles.body}>{tour_text[index].body}</Text>
          {index === 0 && (
            <View style={styles.signInContainer}>
              <Button
                title="Already Created an Account? Sign In"
                onPress={() => this.handleSignInOnPress()}
                buttonStyle={styles.signInButton}
                titleStyle={{ fontWeight: 900 }}
                color={Colors.red}
              />
            </View>
          )}
        </View>
      </Animated.View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width,
    height: containerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    height: imageHeight,
    marginBottom: 10,
  },
  textBlock: {
    width: width - 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  body: {
    textAlign: 'center',
    fontSize: 14,
  },
  signInContainer: {
    flex: 1,
    marginTop: 10,
  },
  signInButton: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    //borderColor: Colors.grey,
    //borderWidth: 1,
    //borderRadius: 5,
  },
});
