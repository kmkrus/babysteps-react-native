import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ImageBackground, 
  Dimensions
} from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import PageControl from 'react-native-page-control';

import { connect} from 'react-redux';
import { fetchBabyBookEntries } from '../actions/babybook_actions';

import BabyBookCoverItem from './babybook_cover_item';
import { BabyBookItem } from './babybook_item';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 // compensate for header and navbar

class BabyBookEntries extends Component {

  state = {
    currentIndex: 0,
  };

  componentWillMount() {
    this.props.fetchBabyBookEntries()
  }

  render() {

    var data = []
    if ( !this.props.babybook.entries.data.length ) {
      data = [{id: '1', uri: '../assets/images/baby_book_timeline_incomplete_baby_profile_placeholder.png'}]
    } else {
      data = this.props.babybook.entries.data
    }
    
    return (
      
      <ScrollView contentContainerStyle={styles.container}>

        <SideSwipe
          data={data}
          index={this.state.currentIndex}
          shouldCapture={() => true}
          style={[styles.carouselFill,  { width } ]}
          itemWidth={width}
          threshold={width / 2}
          extractKey={ item => item.id }
          onIndexChange={index =>
            this.setState(() => ({ currentIndex: index }))}
          renderItem={ ({ itemIndex, currentIndex, item, animatedValue }) => (
            (currentIndex === 0) ?
              <BabyBookCoverItem 
                item = {item}
                currentIndex = {currentIndex}
              />
            :
              <BabyBookItem 
                item = {item}
                currentIndex = {currentIndex}
              />
          )}
        />

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: height - heightOffset,
  },
  carouselFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pageControl: {
    flex: 1,
    position:'absolute',
    left:0, 
    right:0, 
    bottom:80,
  },
});

const mapStateToProps = ({ babybook }) => ({ babybook });
const mapDispatchToProps = { fetchBabyBookEntries };

export default connect( mapStateToProps, mapDispatchToProps )( BabyBookEntries );