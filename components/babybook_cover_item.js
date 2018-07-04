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
import { fetchSubject } from '../actions/registration_actions';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 // compensate for header and navbar
const widthOffset = 40

const imageSize = width - widthOffset - 60

class BabyBookCoverItem extends Component {

  componentWillMount() {
    this.props.fetchSubject()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.registration.subject.fetching
  }

  subtitleContent = () => {
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

  render = () => {

    //require('../assets/images/baby_book_cover_background.png') 
    //require('../assets/images/baby_book_inside_background.png') 
    return (

      <View style={styles.container}>
        <ImageBackground
          source={ require('../assets/images/baby_book_cover_background.png') }
          imageStyle={styles.backgroundImage}
          style={styles.imageBackground}>

          <View style={styles.imageContainer}>

            <Image 
              style={styles.image}
              resizeMode={'contain'}
              source={ require( '../assets/images/baby_book_timeline_incomplete_baby_profile_placeholder.png') } 
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
    width: width - widthOffset,
  },
  imageBackground: {
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
    top: 0,
    left: 0,
  },
  imageCornerTopRight: {
    ...imageCorner,
    top: 0,
    right: 0,
  },
  imageCornerBottomLeft: {
    ...imageCorner,
    bottom: 0,
    left: 0,
  },
  imageCornerBottomRight: {
    ...imageCorner,
    bottom: 0,
    right: 0,
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
    alignSelf: 'center',
    width: imageSize,
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

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { fetchSubject };

export default connect( mapStateToProps, mapDispatchToProps )( BabyBookCoverItem );