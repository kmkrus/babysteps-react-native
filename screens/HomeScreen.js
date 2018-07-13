import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Button

} from 'react-native';
 
import { WebBrowser } from 'expo';
import { ViewPager } from 'react-native-viewpager-carousel'

import { connect } from 'react-redux';

import _ from 'lodash';

import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';

import { cardsData } from '../data/cards';

import { fetchMilestoneGroups } from '../actions/milestone_actions';

import Colors from '../constants/Colors';
import milestoneGroupImages from'../constants/MilestoneGroupImages';

const { width, height } = Dimensions.get('window');

function wp (percentage, direction) {
    const value = (percentage * direction) / 100;
    return Math.round(value);
}

const mg_container_height = wp(30, height)
const mg_slider_width = width - 4
const mg_image_height = wp(75,  mg_container_height)
const mg_image_width = wp(75, width)

const sc_container_height = wp(30, height)
const sc_slider_width = width - 4
const sc_card_height = wp(75,  sc_container_height)
const sc_card_width = wp(90, width)

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ( !this.props.milestones.groups.fetching )
  }

  renderScreeningItem(item) {
    return(
      <View style={ styles.screening_slide_container }>
        <Text numberOfLines={1} style={ styles.screening_title } >{ item.data.title } </Text>
        <Text numberOfLines={1} style={ styles.screening_text }> { item.data.date }</Text>
        <Text numberOfLines={3} style={ styles.screening_number }>{ item.data.number } </Text>
        <View style={ styles.screening_slide_link }>
          <TouchableOpacity key={item._pageIndex} style={ styles.screening_button }>
            <Text style={ styles.screening_button_text }> Get Started </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMilestoneItem(item) {
    return (
      <TouchableOpacity key={item.data.id} onPress={()=>{this.props.navigation.navigate('Milestones')}} >
        <View style={styles.slideItem} >
          <Image source={milestoneGroupImages[item._pageIndex]} style={styles.slideItemImage}  />
          <View style={styles.slideItemFooter} >
            <Text style={styles.slideItemFooterText} > {item.data.title} </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {

   let milestoneGroups = _.sortBy( _.filter(this.props.milestones.groups.data, m => m.visible ), m => m.position )

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              {
                //<Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={ styles.slider_container }>
          <View style={ styles.slider_header } >
            <View style={ styles.slider_title } >
              <Text style={ styles.slider_title_text } >Screening Events</Text>
            </View>
            <TouchableOpacity style={ styles.opacityStyle } >
              <Text style={ styles.slider_link_text } >View all</Text>
              <Ionicons name='md-arrow-forward' style={ styles.slider_link_icon } />
            </TouchableOpacity>
          </View>
          <View style={ styles.slider } >
            <ViewPager
              data={ cardsData }
              renderPage={ item => this.renderScreeningItem(item) }
              pageWidth={ sc_slider_width }
              renderAsCarousel={ false }
            />
          </View>
        </View>              
        
        <View style={styles.slider_container}>
          <View style={styles.slider_header} >
            <View style={styles.slider_title} >
              <Text style={styles.slider_title_text} >Developmentals Milestone</Text>
            </View>
            <TouchableOpacity style={styles.opacityStyle} onPress={()=>{this.props.navigation.navigate('Milestones')}} >
              <Text style={ styles.slider_link_text } >View all</Text>
              <Ionicons name='md-arrow-forward' style={ styles.slider_link_icon } />
            </TouchableOpacity>
          </View>
          <View style={ styles.slider }>
            <ViewPager
              data={ milestoneGroups }
              renderPage={ item => this.renderMilestoneItem(item) }
              pageWidth={ mg_slider_width }
              renderAsCarousel={ false }
            />
          </View>
        </View>

      </ScrollView>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled...
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          App not in development mode.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  slider_container: { 
    height: mg_container_height, 
    borderTopWidth: 2, 
    borderTopColor: Colors.lightGrey, 
  },
  slideItem:{
     width: mg_image_width,
     height: mg_image_height,
     borderRadius: 5,
     overflow: 'hidden',
     marginLeft: 30
  },
  slideItemImage : {
    width: null,
    height: null,
    flex: 1
  },
  slideItemFooter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  slideItemFooterText : {
    color: '#fff',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  screening_slide_container:{
    width: sc_card_width,
    height: sc_card_height,
    marginLeft: 10,  
    borderRadius: 5,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    padding: 10,
  },
  screening_slide_link: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  screening_title: {
    fontSize: 14,
    color: Colors.darkGrey, 
    fontWeight: '900',
  },
  screening_text: {
    fontSize:15, 
    color: Colors.darkGrey,
  },
  screening_number: {
    fontSize: 12, 
    color: Colors.darkGrey,
  },
  screening_button: {
    padding: 5, 
    borderWidth: 1,
    borderColor: Colors.pink, 
    backgroundColor: Colors.lightPink, 
    borderRadius: 5,
    marginBottom: 3, 
  },
  screening_button_text: {
    fontSize: 14, 
    color: Colors.darkPink,
  },
  slider_header: { 
    width: '90%', 
    alignSelf: 'center', 
    flexDirection: 'row', 
    paddingVertical: 10 
  },
  slider_title: {
    flex: 2
  },
  slider_title_text: {
    fontSize: 15
  },
  slider_link_text: { 
    marginRight: 5, 
    fontSize: 15, 
    color: Colors.darkGreen, 
  },
  slider_link_icon: { 
    fontSize: 15, 
    color: Colors.darkGreen, 
  },
  slider: {
    flex: 1, 
    paddingLeft: 5, 
    marginBottom: 10 
  },
  opacityStyle: { 
    flexDirection: 'row', 
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center' 
  }
});

const mapStateToProps = ({ session, milestones }) => ({ session, milestones });
const mapDispatchToProps = { fetchMilestoneGroups }

export default connect( mapStateToProps, mapDispatchToProps )( HomeScreen );