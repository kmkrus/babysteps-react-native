import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { values } from 'lodash';

import Colors from '../constants/Colors';
import VideoFormats from '../constants/VideoFormats';

import AutoHeightImage from './auto_height_image';

const { width, height } = Dimensions.get('window');
const widthOffset = 40;
const imageOffset = 60;

const imageWidth = width - (widthOffset + imageOffset);
const imageMaxHeight = height * 0.4;
const videoWidth = imageWidth;
const videoHeight = imageWidth;

class BabyBookGetImage extends Component {
  static IMAGE_WIDTH = imageWidth;

  state = {
    imageHeight: imageWidth,
  };

  handleImageOnPress = () => {
    if (this.props.item.type === 'cover') {
      this.props.navigation.navigate('BabyBookEntry');
    }
  };

  handleVideoOnPress = () => {
    this.videoPlayer.presentFullscreenPlayer();
    this.videoPlayer.replayAsync();
  };

  render() {
    const imageContainerHeight = this.state.imageHeight;
    const item = this.props.item;
    const uri = item.file_uri;
    const isPlaceholder = item.placeholder;
    let isVideo = false;
    if (item.file_type) {
      const formats = values(VideoFormats);
      isVideo = formats.includes(item.file_type);
    }
    const imageHeight = this.state.imageHeight;

    let containerStyle = styles.imageContainer;
    if (isVideo) containerStyle = styles.videoContainer;

    return (
      <View style={[containerStyle, { height: imageContainerHeight }]}>
        {isPlaceholder && (
          <Image source={uri} style={[styles.image, { height: imageHeight }]} />
        )}
        {isVideo && !isPlaceholder && (
          <View>
            <Video
              source={uri}
              resizeMode={Video.RESIZE_MODE_COVER}
              shouldPlay={false}
              useNativeControls={false}
              onPress={this.handleVideoOnPress}
              ref={ref => this.videoPlayer = ref}
              style={{ flex: 1, width: videoWidth, height: videoHeight }}
            />
            <TouchableOpacity
              onPress={this.handleVideoOnPress}
              style={[
                styles.videoOverlay,
                { width: videoWidth, height: videoHeight },
              ]}
            >
              <Ionicons
                name="md-play"
                size={80}
                color="#fff"
                style={styles.videPlayIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        {!isVideo && !isPlaceholder && (
          <Image
            source={uri}
            width={imageWidth}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
          />
        )}

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
    width: imageWidth,
    maxHeight: imageMaxHeight,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    padding: 2,
    overflow: 'hidden',
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: imageWidth + 2,
    maxHeight: imageMaxHeight,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    padding: 5,
    position: 'relative',
  },
  videoOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    maxHeight: imageMaxHeight,
  },
  croppedImage: {
    position: 'absolute',
    left: 0,
    top: -60,
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
