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

import { 
  fetchMilestones,
  resetApiMilestones,
  apiFetchMilestones,
  fetchMilestoneGroups, 
  fetchMilestoneCalendar,
  apiFetchMilestoneCalendar
} from '../actions/milestone_actions';

import { fetchSubject } from '../actions/registration_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';
import milestoneGroupImages from'../constants/MilestoneGroupImages';

const { width, height } = Dimensions.get('window');

function wp (percentage, direction) {
    const value = (percentage * direction) / 100;
    return Math.round(value);
}

const sc_container_height = wp(30, height)
const sc_slider_width = width - 5
const sc_card_height = wp(70,  sc_container_height)
const sc_card_width = wp(80, width)
const sc_card_margin = ((width - sc_card_width) / 2)

const mg_container_height = wp(30, height)
const mg_slider_width = width - 7
const mg_image_height = wp(70,  mg_container_height)
const mg_image_width = wp(80, width)
const mg_image_margin = ((width - mg_image_width) / 2) 

class OverviewScreen extends React.Component {

  state = {
    apiFetchCalendarSubmitted: false,
    fetchCalendarCount: 0
  }

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups()
    this.props.fetchMilestoneCalendar()
    this.props.fetchSubject()
  }

  componentWillReceiveProps(nextProps, nextState) {
  
    if ( !nextProps.milestones.groups.fetching && nextProps.milestones.groups.fetched ) {
      if ( _.isEmpty(nextProps.milestones.groups.data) && !nextProps.milestones.api_milestones.fetching ) {
        this.props.apiFetchMilestones()
      }
    }

    if ( !nextProps.registration.subject.fetching && nextProps.registration.subject.fetched ) {
      if ( !nextProps.milestones.calendar.fetching && nextProps.milestones.calendar.fetched ) {

        if ( _.isEmpty(nextProps.milestones.calendar.data) ) {

          if  ( !nextProps.milestones.api_calendar.fetching && !this.state.apiFetchCalendarSubmitted ) {
            if ( nextProps.session.registration_state == States.REGISTERED_AS_IN_STUDY ) {
              this.props.apiFetchMilestoneCalendar({ subject_id: nextProps.registration.subject.data.api_id })
            } else {
              this.props.apiFetchMilestoneCalendar({ base_date: nextProps.registration.subject.expected_date_of_birth })
            }
            this.setState({ apiFetchCalendarSubmitted: true })
          }

          if ( !nextProps.milestones.api_calendar.fetching && nextProps.milestones.api_calendar.fetched  ) {
            if ( this.state.fetchCalendarCount < 10 ) {

              const wait = this.state.fetchCalendarCount * 2000
              this.timer = setTimeout( () => this.props.fetchMilestoneCalendar(), wait )
              this.setState({ fetchCalendarCount: this.state.fetchCalendarCount + 1 })
            }
          }

        } // isEmpty calendar data
      } // calendar fetcbhing
    } // subject fetching
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderScreeningItem(item) {
    const date = new Date(item.data.notify_at).toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    return(
      <View style={ styles.screening_slide_container }>
        <Text numberOfLines={1} style={ styles.screening_title } >{ item.data.title } </Text>
        <Text numberOfLines={1} style={ styles.screening_date }> { date }</Text>
        <Text numberOfLines={3} style={ styles.screening_text }>{ item.data.message } </Text>
        <View style={ styles.screening_slide_link }>
          <TouchableOpacity key={ item._pageIndex } style={ styles.screening_button }>
            <Text style={ styles.screening_button_text }> Get Started </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMilestoneItem(item) {
    let uri = milestoneGroupImages[item._pageIndex]
    return (
      <TouchableOpacity 
        style={ styles.mg_touchable }
        key={ item._pageIndex } 
        onPress={ ()=>this.props.navigation.navigate('Milestones') } >

        <View style={ styles.slide_item } >

          <Image source={ uri } style={ styles.slide_item_image } />
          <View style={ styles.slide_item_footer } >
            <Text style={ styles.slide_item_footer_text } > { item.data.title } </Text>
          </View>
        </View>
      
      </TouchableOpacity>
    )
  }

  render() {

    const milestoneGroups = _.sortBy( _.filter(this.props.milestones.groups.data, mg => (mg.visible > 0) ), mg => mg.position )

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
              data={ this.props.milestones.calendar.data }
              renderPage={ item => this.renderScreeningItem(item) }
              pageWidth={ sc_slider_width }
              renderAsCarousel={ false }
            />
          </View>
        </View>              
        
        <View style={styles.slider_container}>
          <View style={styles.slider_header} >
            <View style={styles.slider_title} >
              <Text style={styles.slider_title_text}>Developmental Milestones</Text>
            </View>
            <TouchableOpacity style={styles.opacityStyle} onPress={()=>{this.props.navigation.navigate('Milestones')}} >
              <Text style={ styles.slider_link_text } >View all</Text>
              <Ionicons name='md-arrow-forward' style={ styles.slider_link_icon } />
            </TouchableOpacity>
          </View>
          <View style={ styles.slider }>
            <ViewPager
              data={ milestoneGroups } //this.state.milestoneGroups }
              renderPage={ item => this.renderMilestoneItem(item) }
              pageWidth={ mg_slider_width }
              renderAsCarousel={ false }
            />
          </View>
        </View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingTop: 30,
  },
  opacityStyle: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center',
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
  slider_container: { 
    height: mg_container_height, 
    borderTopWidth: 2, 
    borderTopColor: Colors.lightGrey, 
  },
  slide_item:{
    flex: 1,
    width: mg_image_width,
    height: mg_image_height,
    borderRadius: 5,
    //overflow: 'hidden',
    marginLeft: mg_image_margin,
  },
  slide_item_image : {
    flex: 1,
    width: mg_image_width,
    height: mg_image_height,
  },
  slide_item_footer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  slide_item_footer_text : {
    color: '#fff',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 10,
    paddingLeft: 10,
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
    marginBottom: 10,
  },
  mg_touchable: {
    height: mg_image_height,
  },
  screening_slide_container:{
    width: sc_card_width,
    height: sc_card_height,
    marginLeft: sc_card_margin,  
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
  screening_date: {
    fontSize:10, 
    color: Colors.darkGrey,
  },
  screening_text: {
    fontSize: 12, 
    color: Colors.darkGrey,
  },
  screening_button: {
    padding: 3, 
    borderWidth: 1,
    borderColor: Colors.pink, 
    backgroundColor: Colors.lightPink, 
    borderRadius: 5,
  },
  screening_button_text: {
    fontSize: 12, 
    color: Colors.darkPink,
  },
});

const mapStateToProps = ({ session, milestones, registration }) => ({ session, milestones, registration });
const mapDispatchToProps = { 
  fetchMilestones, 
  resetApiMilestones, 
  apiFetchMilestones, 
  fetchMilestoneGroups, 
  fetchMilestoneCalendar,
  apiFetchMilestoneCalendar,
  fetchSubject,
}

export default connect( mapStateToProps, mapDispatchToProps )( OverviewScreen );