import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

import { connect } from 'react-redux';

import BabyBookGetImage from './babybook_get_image';

const { width, height } = Dimensions.get('window');
const heightOffset = 180; // compensate for header and navbar
const widthOffset = 40;

const backgroundImage = require('../assets/images/baby_book_inside_background.png');

class BabyBookItem extends Component {
  static WIDTH = width;

  shouldComponentUpdate(nextProps) {
    const subject = nextProps.registration.subject;
    const babybook = nextProps.babybook;
    if (subject.fetching || babybook.entries.fetching) {
      return false;
    }
    return true;
  }

  render() {
    const item = this.props.item;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          imageStyle={styles.backgroundImage}
          style={styles.imageBackground}
        >
          <BabyBookGetImage navigation={this.props.navigation} item={item} />
          <View style={styles.subtitle}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {moment(item.created_at).toISOString()}
            </Text>
            <Text style={styles.detail}>{item.detail}</Text>
          </View>
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
