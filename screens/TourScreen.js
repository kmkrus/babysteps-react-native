import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground, 
  Dimensions,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements'
import SideSwipe from 'react-native-sideswipe';
import PageControl from 'react-native-page-control';

import Colors from '../constants/Colors';
import '@expo/vector-icons';
import { TourItem } from '../components/tour_item';
import { TourItemFour } from '../components/tour_item_four';

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
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex() {
    this.setState({currentIndex: 3 })
  }

  render() {

    const offset = (width - TourItem.WIDTH) / 2;
    
    return (
      
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>

        <View style={styles.container}>

          <SideSwipe
            data={items}
            index={this.state.currentIndex}
            shouldCapture={() => true}
            style={[styles.carouselFill,  { width } ]}
            itemWidth={TourItem.WIDTH}
            threshold={TourItem.WIDTH / 4}
            extractKey={ item => item.key}
            contentOffset={offset}
            onIndexChange={index =>
              this.setState(() => ({ currentIndex: index }))}
            renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
        
                (item.key != '4') ? 
                  <TourItem 
                    item = {item}
                    index = {itemIndex}
                    currentIndex = {currentIndex}
                    animatedValue = {animatedValue}
                  />
                :
                  <TourItemFour
                    item = {item}
                    index = {itemIndex}
                    currentIndex = {currentIndex}
                    animatedValue = {animatedValue}
                  />

            )}
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

          <Buttons  {...this.state} updateIndex = {this.updateIndex} navigation = {this.props.navigation} />

        </View>

      </ImageBackground>
    )
  }
}

class Buttons extends Component {

  handleClick = (routeName) => {
    console.log(routeName);
    console.log(this.props.navigation);
    this.props.navigation.navigate(routeName);
  }

  render() { 
    if (this.props.currentIndex < 3) {
      
      var updateIndex = this.props.updateIndex;
      return (
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonThreeStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.props.updateIndex}
            title="Let's Get Started" />
        </View>
      )

    } else {

      return (
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonOneStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => this.handleClick('Registration') }
            title='No Thanks' />
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonTwoStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => this.handleClick('Registration') }
            title='Join Study' />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    width: 200,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
   width: 200,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonThreeStyle: {
   width: 400,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
  pageControl: {
    flex: 1,
    position:'absolute', 
    left:0, 
    right:0, 
    bottom:100,
  },
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  carouselFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});