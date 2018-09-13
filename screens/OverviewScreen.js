import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Notifications } from 'expo';

import SideSwipe from 'react-native-sideswipe';
import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  fetchMilestones,
  resetApiMilestones,
  apiFetchMilestones,
  fetchMilestoneGroups,
  resetApiMilestoneCalendar,
  fetchMilestoneCalendar,
  apiCreateMilestoneCalendar,
} from '../actions/milestone_actions';

import { fetchSubject } from '../actions/registration_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';
import milestoneGroupImages from '../constants/MilestoneGroupImages';

const { width, height } = Dimensions.get('window');

const wp = (percentage, direction) => {
  const value = (percentage * direction) / 100;
  return Math.round(value);
};

const scContainerHeight = wp(30, height);
const scCardHeight = wp(70, scContainerHeight);
const scCardWidth = wp(80, width);
const scCardMargin = (width - scCardWidth) / 2;

const mgContainerHeight = wp(30, height);
const mgImageHeight = wp(70, mgContainerHeight);
const mgImageWidth = wp(80, width);
const mgImageMargin = (width - mgImageWidth) / 2;

class OverviewScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    currentIndexScreening: 0,
    currentIndexMilestones: 0,
    calendarRefreshed: false,
    apiFetchCalendarSubmitted: false,
  };

  componentWillMount() {
    this.props.resetApiMilestones();
    this.props.resetApiMilestoneCalendar();
    this.props.fetchMilestoneGroups();
    this.props.fetchMilestoneCalendar();
    this.props.fetchSubject();

    Notifications.presentLocalNotificationAsync({
      title: 'Test - Reminder',
      body: 'This is an important reminder!!!!',
      data: {
        title: 'Test - Reminder',
        body: 'Test - Reminder',
        type: 'info',
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const groups = nextProps.milestones.groups;
    if (!groups.fetching && groups.fetched) {
      if (_.isEmpty(groups.data)) {
        const api_milestones = nextProps.milestones.api_milestones;
        if (!api_milestones.fetching && !api_milestones.fetched) {
          this.props.apiFetchMilestones();
        }
      }
    }

    const subject = nextProps.registration.subject;
    const calendar = nextProps.milestones.calendar;
    if (!subject.fetching && subject.fetched) {
      if (!calendar.fetching && calendar.fetched) {
        if (_.isEmpty(calendar.data)) {
          const api_calendar = nextProps.milestones.api_calendar;
          if (!api_calendar.fetching && !this.state.apiFetchCalendarSubmitted) {
            if (nextProps.session.registration_state === States.REGISTERED_AS_IN_STUDY) {
              this.props.apiCreateMilestoneCalendar({ subject_id: subject.data.api_id });
            } else {
              this.props.apiCreateMilestoneCalendar({ base_date: subject.expected_date_of_birth });
            }
            this.setState({ apiFetchCalendarSubmitted: true });
          }
        } else {
          this.setState({ calendarRefreshed: true });
        } // isEmpty calendar data
      } // calendar fetcbhing
    } // subject fetching
  }

  renderScreeningItem = item => {
    const task = item.item;
    const date = new Date(task.notify_at).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <View style={styles.screening_slide_container}>
        <Text numberOfLines={1} style={styles.screening_title}>{ task.title }</Text>
        <Text numberOfLines={1} style={styles.screening_date}> { task.date }</Text>
        <Text numberOfLines={3} style={styles.screening_text}>{ task.message }</Text>
        <View style={styles.screening_slide_link}>
          <TouchableOpacity key={item.currentIndex} style={styles.screening_button}>
            <Text style={styles.screening_button_text}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderMilestoneItem = item => {
    const milestone = item.item;
    return (
      <TouchableOpacity
        style={styles.mg_touchable}
        key={item._pageIndex}
        onPress={() => this.props.navigation.navigate('Milestones')}
      >
        <View style={styles.slide_item}>
          <Image source={milestone.uri} style={styles.slide_item_image} />
          <View style={styles.slide_item_footer}>
            <Text style={styles.slide_item_footer_text}>{milestone.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const calendarRefreshed = this.state.calendarRefreshed;

    const milestoneGroups = _.sortBy(
      _.filter(this.props.milestones.groups.data, mg => (mg.visible > 0) ), mg => mg.position 
    );
    milestoneGroups.forEach( (group, index) => {
      group.uri = milestoneGroupImages[index];
    });


    const timeNow = new Date();
    let screeningEvents = _.filter(this.props.milestones.calendar.data, c => {
      const notify_at = new Date(c.notify_at)
      return notify_at > timeNow;
    });
    screeningEvents = _.sortBy(screeningEvents, s => {
      return new Date(s.notify_at);
    });

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
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

        <View style={styles.slider_container}>
          <View style={styles.slider_header}>
            <View style={styles.slider_title}>
              <Text style={styles.slider_title_text}>Screening Events</Text>
            </View>
            <TouchableOpacity style={styles.opacityStyle}>
              <Text style={styles.slider_link_text}>View all</Text>
              <Ionicons name='md-arrow-forward' style={styles.slider_link_icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.slider}>
            <SideSwipe
              index={this.state.currentIndexScreening}
              data={screeningEvents}
              renderItem={item => this.renderScreeningItem(item)}
              itemWidth={scCardWidth + scCardMargin}
              contentOffset={scCardMargin - 2}
              onIndexChange={index =>
                this.setState(() => ({ currentIndexScreening: index }))
              }
            />
          </View>
        </View>

        <View style={styles.slider_container}>
          <View style={styles.slider_header}>
            <View style={styles.slider_title}>
              <Text style={styles.slider_title_text}>Developmental Milestones</Text>
            </View>
            <TouchableOpacity
              style={styles.opacityStyle} 
              onPress={()=>{this.props.navigation.navigate('Milestones')}} >
              <Text style={styles.slider_link_text}>View all</Text>
              <Ionicons name='md-arrow-forward' style={styles.slider_link_icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.slider}>
            <SideSwipe
              index={this.state.currentIndexMilestones}
              data={milestoneGroups}
              renderItem={item => this.renderMilestoneItem(item)}
              itemWidth={mgImageWidth + mgImageMargin}
              threshold={mgImageWidth}
              contentOffset={mgImageMargin - 2}
              onIndexChange={index =>
                this.setState(() => ({ currentIndexMilestones: index }))
              }
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
  slider_container: {
    height: mgContainerHeight,
    borderTopWidth: 2,
    borderTopColor: Colors.lightGrey,
  },
  slide_item: {
    flex: 1,
    width: mgImageWidth,
    height: mgImageHeight,
    borderRadius: 5,
    marginRight: mgImageMargin,
  },
  slide_item_image: {
    flex: 1,
    width: mgImageWidth,
    height: mgImageHeight,
  },
  slide_item_footer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  slide_item_footer_text: {
    color: Colors.white,
    width: '100%',
    backgroundColor: Colors.lightGrey,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  slider_header: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  slider_title: {
    flex: 2,
  },
  slider_title_text: {
    fontSize: 15,
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
    height: mgImageHeight,
  },
  screening_slide_container: {
    width: scCardWidth,
    height: scCardHeight,
    marginRight: scCardMargin,
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
    fontSize: 10,
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

const mapStateToProps = ({ session, milestones, registration }) => ({
  session,
  milestones,
  registration,
});
const mapDispatchToProps = {
  fetchMilestones,
  resetApiMilestones,
  apiFetchMilestones,
  fetchMilestoneGroups,
  fetchMilestoneCalendar,
  resetApiMilestoneCalendar,
  apiCreateMilestoneCalendar,
  fetchSubject,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewScreen);
