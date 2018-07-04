import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

const itemDimensions = {width: (width - 40), height: (height - 200)}

export class BabyBookItem extends Component {

  static WIDTH = width;

  render = () => {
    
    return (

      <View style={styles.container}>
        <ImageBackground
          source={ require('../assets/images/baby_book_cover_background.png') 
            //require('../assets/images/baby_book_inside_background.png') 
          }
          imageStyle={styles.backgroundImage}
          style={styles.imageBackground}
        >
          <Image source={{uri: item.uri}} />
        
          <Text>{item.uri}</Text>

        </ImageBackground>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  imageBackground: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'stretch',
    width: itemDimensions.width 
  },
  
});