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

import { _ } from 'lodash';

import { connect} from 'react-redux';

import Colors from '../constants/Colors';
import CONSTANTS from '../constants';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 // compensate for header and navbar
const widthOffset = 40

const imageSize = width - widthOffset - 60

class BabyBookCoverItem extends Component {

  subtitleContent() {
    const subject = this.props.registration.subject.data
    if ( !_.isEmpty( subject ) ) {
      var name = null
      if (!_.isEmpty( subject.first_name )) {
        name = subject.first_name + ' '
      }
      if (!_.isEmpty( subject.last_name )) {
        name += subject.last_name
      }
      var dob = ''
      if (!_.isEmpty( subject.date_of_birth )) {
        dob = 'Born: ' + subject.date_of_birth
      } else {
        dob = 'Expected: ' + subject.expected_date_of_birth
      }
      return (
        <View>
          <Text style={styles.subtitleContentName}>{name}</Text>
          <Text style={styles.subtitleContentDob}>{dob}</Text>
        </View>
      )
    }
  }

  getSource() {
    if (!this.props.item.file_name) {
      return require('../assets/images/baby_book_timeline_incomplete_baby_profile_placeholder.png')
    }
    return {uri: Expo.FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY + '/'+ this.props.item.file_name}
  }

  render() {

    return (

      <View style={styles.container}>

        <ImageBackground
          source={ require('../assets/images/baby_book_cover_background.png') }
          imageStyle={styles.backgroundImage}
          style={styles.imageBackground}>

          <View style={styles.imageContainer}>

            <Image 
              style={styles.image}
              source={ this.getSource() }
              resizeMode={'contain'}
            />

            <Image 
              style={styles.imageCornerTopLeft}
              source={ require('../assets/images/baby_book_picture_frame_top_left.png')}
            />
            <Image 
              style={styles.imageCornerTopRight}
              source={ require('../assets/images/baby_book_picture_frame_top_right.png')}
            />
            <Image 
              style={styles.imageCornerBottomLeft}
              source={ require('../assets/images/baby_book_picture_frame_bottom_left.png')}
            />
            <Image 
              style={styles.imageCornerBottomRight}
              source={ require('../assets/images/baby_book_picture_frame_bottom_right.png')}
            />

          </View>
        
          <View style={styles.subtitle} >
            { this.subtitleContent() }
          </View>

        </ImageBackground>

      </View>
    );
  };
}

const imageCorner = {
  height: 40,
  width: 40,
  position: 'absolute',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: widthOffset / 2,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - heightOffset,
    width: width - widthOffset,
  },
  backgroundImage: {
    resizeMode: 'stretch',
    width: width - widthOffset,
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
    height: imageSize,
    width: imageSize,
    padding: 5
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
  },
  subtitle: {
    marginTop: 20,
  },
  subtitleContentName: {
    color: Colors.white,
    fontSize: 16,
  },
  subtitleContentDob: {
    color: Colors.white,
    fontSize: 12,
  }
  
});

const mapStateToProps = ({ registration, babybook }) => ({ registration, babybook });

export default connect( mapStateToProps )( BabyBookCoverItem );