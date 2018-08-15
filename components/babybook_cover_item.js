import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { _ } from 'lodash';

import { connect } from 'react-redux';

import BabyBookGetImage from './babybook_get_image';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const heightOffset = 180; // compensate for header and navbar
const widthOffset = 40;

const imageSize = width - widthOffset - 60;
const backgroundImage = require('../assets/images/baby_book_cover_background.png');

class BabyBookCoverItem extends Component {
  subtitleContent() {
    const subject = this.props.registration.subject.data;
    if (!_.isEmpty(subject)) {
      let name = null;
      if (!_.isEmpty(subject.first_name)) {
        name = `${subject.first_name} `;
      }
      if (!_.isEmpty(subject.last_name)) {
        name += subject.last_name;
      }
      let dob = '';
      if (!_.isEmpty(subject.date_of_birth)) {
        dob = `Born: ${subject.date_of_birth}`;
      } else {
        dob = `Expected: ${subject.expected_date_of_birth}`;
      }
      return (
        <View>
          <Text style={styles.subtitleContentName}>{name}</Text>
          <Text style={styles.subtitleContentDob}>{dob}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          imageStyle={styles.backgroundImage}
          style={styles.imageBackground}
        >
          <BabyBookGetImage
            navigation={this.props.navigation}
            item={this.props.item}
          />

          <View style={styles.subtitle}>{this.subtitleContent()}</View>
        </ImageBackground>
      </View>
    );
  }
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
    flex: 1,
    resizeMode: 'stretch',
    width: width - widthOffset,
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
  },
});

const mapStateToProps = ({ registration, babybook }) => ({
  registration,
  babybook,
});

export default connect(mapStateToProps)(BabyBookCoverItem);
