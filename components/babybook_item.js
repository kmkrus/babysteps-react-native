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

import { connect} from 'react-redux';

import BabyBookGetImage from '../components/babybook_get_image';

import Colors from '../constants/Colors';
import CONSTANTS from '../constants';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 ;// compensate for header and navbar
const widthOffset = 40;

const imageSize = width - widthOffset - 60;
const backgroundImage = require('../assets/images/baby_book_inside_background.png');

class BabyBookItem extends Component {

  static WIDTH = width;

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.registration.subject.fetching || this.props.babybook.entries.fetching) {
      return false;
    }
    return true;
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
            item={ this.props.item }
          />
          <View style={styles.subtitle} >
            <Text style={styles.title}>{ this.props.item.title }</Text>
            <Text style={styles.date}>{ new Date(this.props.item.created_at).toDateString() }</Text>
            <Text style={styles.detail}>{ this.props.item.detail }</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const imageCorner = {
  height: 40,
  width: 40,
  position: 'absolute',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: widthOffset / 2,
  },
  imageBackground: {
    flex: 1,
    paddingTop: widthOffset / 2,
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
    maxHeight: 150,
    width: width - (widthOffset * 2.5),
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 10,
  },
  detail: {
    paddingTop: 10,
    fontSize: 12,
  },
});

const mapStateToProps = ({ registration, babybook }) => ({
  registration,
  babybook,
});

export default connect(mapStateToProps)(BabyBookItem);