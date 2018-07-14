import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground, 
  Dimensions,
  Platform,
} from 'react-native';

import SideSwipe from 'react-native-sideswipe';

import PageControl from 'react-native-page-control';

import Colors from '../constants/Colors';
import '@expo/vector-icons';
import { TourItem } from '../components/tour_item';
import { TourItemFour } from '../components/tour_item_four';
import TourButtons from '../components/tour_buttons';

const { width } = Dimensions.get('window');

const items = [
  {key: '1'}, 
  {key: '2'}, 
  {key: '3'},
  {key: '4'},
];

export default class TourScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      scrollEnabled: true,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  handleNestedScrollEvent(value) {
    this.setState({ scrollEnabled: value });
  }

  updateIndex() {
    this.setState({currentIndex: 3 })
  }

  renderItem(page) {
    if (page.item.key != '4') { 
      return (
        <TourItem 
          item = {page.item}
          index = {page.itemIndex}
          currentIndex = {page.currentIndex}
          animatedValue = {page.animatedValue}
        />
      )
    } else {
      return (
        <TourItemFour
          item = {page.item}
          index = {page.itemIndex}
          currentIndex = {page.currentIndex}
          animatedValue = {page.animatedValue}
          handleNestedScrollEvent={ (value) => this.handleNestedScrollEvent(value) }
        />
      )
    }
  }

  render() {

    const offset = (width - TourItem.WIDTH) / 6;
    
    return (
      
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>
        
        <SideSwipe
          data={ items }
          index={ this.state.currentIndex }
          shouldCapture={ () => this.state.scrollEnabled }
          style={ styles.sideSwipe }
          itemWidth={ TourItem.WIDTH }
          threshold={ TourItem.WIDTH / 4 }
          extractKey={ item => item.key }
          contentOffset={ offset }
          onIndexChange={index =>
            this.setState( () => ({ currentIndex: index }) )}
          renderItem={ (page) => this.renderItem(page) }
        />

        <PageControl
          style={styles.pageControl}
          numberOfPages={items.length}
          currentPage={this.state.currentIndex}
          hidesForSinglePage
          pageIndicatorTintColor={Colors.lightGrey}
          currentPageIndicatorTintColor={Colors.grey}
          indicatorStyle={{borderRadius: 5}}
          currentIndicatorStyle={{borderRadius: 5}}
          indicatorSize={{width:8, height:8}}
          onPageIndicatorPress={this.onItemTap}
        />

        <TourButtons  
          {...this.state} 
          updateIndex = {this.updateIndex} 
          navigation = {this.props.navigation}
        />

      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  pageControl: {
    flex: 1,
    position:'absolute', 
    left:0, 
    right:0, 
    bottom:80,
  },
  imageBackground: {
    flex: 1,
    marginTop: 20,
  },    
  container: {    
    flex: 1,    
    alignItems: 'stretch',    
    justifyContent: 'center',
  },
  sideSwipe: {
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});