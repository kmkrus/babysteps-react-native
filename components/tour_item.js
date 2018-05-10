import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import tour_images from '../components/tour_images';
import tour_text from '../components/tour_text';

const { width: screenWidth } = Dimensions.get('window');
const width = screenWidth;

export class TourItem extends Component {
  
  static WIDTH = width;

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
            source={ tour_images[index] }
          />
          <View style={styles.textBlock}>
            <Text style={styles.title}>{ tour_text[index]['title']}</Text>
            <Text style={styles.body}>{ tour_text[index]['body']}</Text>
          </View>
        
      </Animated.View>

    );
  };
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: width - 400,
    height: undefined,
  },
  textBlock: {
    width: width - 200,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 22,
  },
  body: {
    textAlign: 'center',
    fontSize: 18,
  }
  
});