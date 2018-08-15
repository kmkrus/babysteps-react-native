import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Video } from 'expo';

import Colors from '../constants/Colors';
import CONSTANTS from '../constants';

const { width } = Dimensions.get('window');
const widthOffset = 40;
const imageOffset = 60;

const imageWidth = width - (widthOffset + imageOffset);

class BabyBookGetImage extends Component {
  static IMAGE_WIDTH = imageWidth;

  state = {
    imageHeight: imageWidth,
  };

  componentWillReceiveProps(nextProps, nextState) {
    const item = nextProps.item;
    if (item.file_name && item.file_uri) {
      Image.getSize(
        item.file_uri.uri,
        (width, height) => {
          this.setState({ imageHeight: imageWidth * (height / width) });
        },
        error => {
          console.log(error);
        },
      ); // Image.getSize
    } // if item.file_uri
  }

  handleImageOnPress = () => {
    if (this.props.item.type == 'cover') {
      this.props.navigation.navigate('BabyBookEntry');
    }
  };

  render() {
    const imageContainerHeight = this.state.imageHeight + 2;
    const imageFileType = this.props.item.data
      ? this.props.item.data.file_type
      : null;

    return (
      <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
        <TouchableOpacity
          onPress={() => {
            this.handleImageOnPress();
          }}
        >
          {imageFileType === 'video/mp4' ? (
            <Video
              style={[
                styles.image,
                { width: imageWidth, height: imageWidth * 0.75 },
              ]}
              source={this.props.item.file_uri}
              isMuted
              shouldPlay
              resizeMode={Expo.Video.RESIZE_MODE_COVER}
            />
          ) : (
            <Image
              source={this.props.item.file_uri}
              style={[styles.image, { height: this.state.imageHeight }]}
            />
          )}
        </TouchableOpacity>

        <Image
          style={styles.imageCornerTopLeft}
          source={require('../assets/images/baby_book_picture_frame_top_left.png')}
        />
        <Image
          style={styles.imageCornerTopRight}
          source={require('../assets/images/baby_book_picture_frame_top_right.png')}
        />
        <Image
          style={styles.imageCornerBottomLeft}
          source={require('../assets/images/baby_book_picture_frame_bottom_left.png')}
        />
        <Image
          style={styles.imageCornerBottomRight}
          source={require('../assets/images/baby_book_picture_frame_bottom_right.png')}
        />
      </View>
    );
  }
}

const imageCorner = {
  height: 36,
  width: 36,
  position: 'absolute',
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: imageWidth + 2,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    padding: 5,
  },
  image: {
    width: imageWidth,
  },
  imageCornerTopLeft: {
    ...imageCorner,
    top: -2,
    left: -2,
  },
  imageCornerTopRight: {
    ...imageCorner,
    top: -2,
    right: -2,
  },
  imageCornerBottomLeft: {
    ...imageCorner,
    bottom: -2,
    left: -2,
  },
  imageCornerBottomRight: {
    ...imageCorner,
    bottom: -2,
    right: -2,
  },
});

export default BabyBookGetImage;
