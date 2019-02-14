import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Video } from 'expo';

import { values } from 'lodash';

import Colors from '../constants/Colors';
import VideoFormats from '../constants/VideoFormats';

import AutoHeightImage from './auto_height_image';

const { width, height } = Dimensions.get('window');
const widthOffset = 40;
const imageOffset = 60;

const imageWidth = width - (widthOffset + imageOffset);
const imageMaxHeight =  height * 0.4;
const videoWidth = imageWidth;
const videoHeight = imageWidth;

class BabyBookGetImage extends Component {
  static IMAGE_WIDTH = imageWidth;

  state = {
    imageHeight: imageWidth,
  };

  componentWillReceiveProps(nextProps, nextState) {
    const item = nextProps.item;
    if (!!VideoFormats[item.file_type]) {
      return;
    }
    if (item.file_name && item.file_uri) {
      Image.getSize(
        item.file_uri.uri,
        (width, height) => {
          this.setState({ imageHeight: imageWidth * (height / width) });
        },
        error => {
          // not fatal
          console.log(error);
        },
      ); // Image.getSize
    } // if item.file_uri
  }

  handleImageOnPress = () => {
    if (this.props.item.type === 'cover') {
      this.props.navigation.navigate('BabyBookEntry');
    }
  };

  render() {
    const imageContainerHeight = this.state.imageHeight + 2;
    const item = this.props.item;
    const uri = item.file_uri;
    const isPlaceholder = item.placeholder;
    let isVideo = false;
    if (item.file_type) {
      const formats = values(VideoFormats);
      isVideo = formats.includes(item.file_type);
    }
    const imageHeight = this.state.imageHeight;
    console.log(item);
    console.log(uri);

    return (
      <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
        <TouchableOpacity
          onPressIn={() => {
            this.handleImageOnPress();
          }}
        >
          {isPlaceholder && (
            <Image
              source={uri}
              style={[styles.image, { height: imageHeight }]}
            />
          )}
          {isVideo && !isPlaceholder && (
            <Video
              source={uri}
              resizeMode={Video.RESIZE_MODE_COVER}
              shouldPlay={false}
              useNativeControls
              style={{ flex: 1, width: videoWidth, height: videoHeight }}
            />
          )}
          {!isVideo && !isPlaceholder && (
            <AutoHeightImage
              source={uri}
              width={imageWidth}
              style={styles.croppedImage}
              resizeMode="cover"
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
    width: imageWidth + 2,
    maxHeight: imageMaxHeight,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    padding: 5,
    overflow: 'hidden',
  },
  image: {
  },
  imageCornerTopLeft: {
    ...imageCorner,
    top: -2,
    left: -2,
  },
  croppedImage: {
    position: 'absolute',
    left: 0,
    top: -60,
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
