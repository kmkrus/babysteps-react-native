import React from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Notifications } from 'expo';

import SideSwipe from 'react-native-sideswipe';
import { Ionicons } from '@expo/vector-icons';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import forEach from 'lodash/forEach';

import moment from 'moment';

import { connect } from 'react-redux';

import {
  fetchMilestones,
  resetApiMilestones,
  apiFetchMilestones,
  fetchMilestoneGroups,
  fetchMilestoneTasks,
  resetApiMilestoneCalendar,
  fetchMilestoneCalendar,
  apiCreateMilestoneCalendar,
  fetchOverViewTimeline,
} from '../actions/milestone_actions';

import { fetchSubject } from '../actions/registration_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';
import CONSTANTS from '../constants';
import milestoneGroupImages from '../constants/MilestoneGroupImages';

const { width, height } = Dimensions.get('window');

const wp = (percentage, direction) => {
  const value = (percentage * direction) / 100;
  return Math.round(value);
};

const tlPhotoSize = 65;
const tlCardHeight = tlPhotoSize + 30;
const tlCardWidth = tlPhotoSize + 10;
const tlCardMargin = (width - (tlCardWidth * 5)) / 6;

const scContainerHeight = wp(30, height);
const scCardHeight = wp(70, scContainerHeight);
const scCardWidth = wp(80, width);
const scCardMargin = (width - scCardWidth) / 2;

const mgContainerHeight = wp(30, height);
const mgImageHeight = wp(80, mgContainerHeight);
const mgImageWidth = wp(80, width);
const mgImageMargin = (width - mgImageWidth) / 2;

class OverviewScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    currentIndexTimeline: 0,
    currentIndexScreening: 0,
    currentIndexMilestones: 0,
    apiFetchCalendarSubmitted: false,
    testNotificationCreated: false,
    phSliderLoading: true,
    scSliderLoading: true,
    mgSliderLoading: true,
    overviewTimelines: [],
    currentTimeline: {},
    milestoneGroups: [],
    screeningEvents: [],
  };

  componentWillMount() {
    this.props.resetApiMilestones();
    this.props.resetApiMilestoneCalendar();
    this.props.fetchMilestoneGroups();
    this.props.fetchMilestoneCalendar();
    this.props.fetchOverViewTimeline();
    this.props.fetchSubject();
  }

  componentWillReceiveProps(nextProps) {
    const subject = nextProps.registration.subject;
    if (!subject.fetching && subject.fetched) {
      const overview_timeline = nextProps.milestones.overview_timeline;
      if (!overview_timeline.fetching && overview_timeline.fetched) {
        const base_date = subject.data.date_of_birth
          ? subject.data.date_of_birth
          : subject.data.expected_date_of_birth;
        const overviewTimelines = [ ...overview_timeline.data ];
        forEach(overviewTimelines, item => {
          if (item.overview_timeline === 'during_pregnancy') {
            item.weeks = 40 - moment(base_date).diff(item.notify_at, 'weeks');
          } else {
            item.weeks = Math.abs(moment(base_date).diff(item.notify_at, 'weeks'));
          }
        });
        // find current task
        let last_item = overviewTimelines[0];
        let currentTimeline = overviewTimelines[0];
        const current_date = new Date();
        let currentIndexTimeline = 0;
        if (moment(current_date).isAfter(last_item.notify_at)) {
          currentTimeline = find(overviewTimelines, (item, index) => {
            const startDate = moment(last_item.notify_at);
            const endDate = moment(item.notify_at);
            last_item = item;
            currentIndexTimeline = Number(index - 2);
            return moment(current_date).isBetween(startDate, endDate);
          });
        }
        this.setState({
          overviewTimelines,
          currentTimeline,
          currentIndexTimeline,
          phSliderLoading: false,
        });
      }
    }

    const groups = nextProps.milestones.groups;
    if (!groups.fetching && groups.fetched) {
      if (isEmpty(groups.data)) {
        const api_milestones = nextProps.milestones.api_milestones;
        if (!api_milestones.fetching && !api_milestones.fetched) {
          this.props.apiFetchMilestones();
        }
      } else {
        const milestoneGroups = filter(groups.data, {visible: 1});
        milestoneGroups = sortBy(milestoneGroups, ['position']);
        milestoneGroups.forEach((group, index) => {
          group.uri = milestoneGroupImages[index];
        });
        this.setState({
          milestoneGroups: milestoneGroups,
          mgSliderLoading: false,
        });
      } // isEmpty groups
    }

    const calendar = nextProps.milestones.calendar;
    if (!subject.fetching && subject.fetched) {
      if (!calendar.fetching && calendar.fetched) {
        if (isEmpty(calendar.data)) {
          const api_calendar = nextProps.milestones.api_calendar;
          if (
            !api_calendar.fetching &&
            subject.data !== undefined &&
            !this.state.apiFetchCalendarSubmitted
          ) {
            if (nextProps.session.registration_state === States.REGISTERED_AS_IN_STUDY) {
              this.props.apiCreateMilestoneCalendar({
                subject_id: subject.data.api_id,
              });
            } else {
              this.props.apiCreateMilestoneCalendar({
                base_date: subject.data.expected_date_of_birth,
              });
            }
            this.setState({ apiFetchCalendarSubmitted: true });
          }
        } else {
          const timeNow = new Date();
          const screeningEvents = filter(calendar.data, function(s) {
            return (new Date(s.notify_at) > timeNow) && !s.momentary_assessment;
          });
          screeningEvents = sortBy(screeningEvents, function(s) {
            return (new Date(s.notify_at));
          });
          this.setState({
            screeningEvents: screeningEvents,
            scSliderLoading: false,
          });
        } // isEmpty calendar data
      } // calendar fetcbhing
    } // subject fetching
  }

  testNotification(noticeType = null) {
    const tasks = this.props.milestones.tasks;
    const milestones = this.props.milestones.milestones;
    console.log(milestones);
    console.log("testNotification",arguments)
    if (!tasks.fetching && isEmpty(tasks.data)) {
      this.props.fetchMilestoneTasks();
      return;
    }
    let task, milestone = {};
    let filteredMilestones = filter(milestones.data, {
      momentary_assessment: noticeType.momentary_assessment,
    });
    let index = Math.floor(Math.random() * filteredMilestones.length);
    milestone = filteredMilestones[index];

    task = find(tasks.data,{milestone_id: milestone.id});

    console.log("Task", task);
    console.log("Milestone", milestone);

    if (milestone && task) {
      Notifications.presentLocalNotificationAsync({
        title: milestone.title,
        body: task.name,
        data: {
          task_id: task.id,
          title: milestone.title,
          body: task.name,
          momentary_assessment: task.momentary_assessment,
          response_scale: task.response_scale,
          type: 'info',
        },
      });
      this.setState({testNotificationCreated: true});
    } // task
  };

  renderOverviewTimeline = item => {
    const photo = item.item;
    const timelineTitle =
      photo.overview_timeline === 'during_pregnancy'
        ? 'Belly Bulge'
        : "Baby's Face";
    let currentStyle = {};
    if (this.state.currentTimeline.choice_id === photo.choice_id) {
      currentStyle = styles.timelineCurrentItem;
    }
    const task = find(this.props.milestones.tasks.data, ['id', photo.task_id])
    return (
      <View key={item.currentIndex} style={styles.timeline_slide_container}>
        {photo.uri && (
          <Image source={{uri: photo.uri}} style={[styles.timelineImage, currentStyle]} />
        )}
        {!photo.uri && (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('MilestoneQuestions', { task })}
          >
            <Text style={[styles.timelineCircle, currentStyle]} />
          </TouchableOpacity>
        )}
        <Text style={styles.timelineTitle}>{timelineTitle}</Text>
        <Text style={styles.timelineSubtitle}>Week {photo.weeks}</Text>
      </View>
    );
  };

  renderScreeningItem = item => {
    const task = item.item;
    const longDate = new Date(task.notify_at).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <View style={styles.screening_slide_container}>
        <Text numberOfLines={1} style={styles.screening_title}>{ task.title }</Text>
        <Text numberOfLines={1} style={styles.screening_date}> { longDate }</Text>
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
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slider_container}>
          <View style={[styles.slider, styles.timeline]}>
            {this.state.phSliderLoading && (
              <ActivityIndicator size="large" color={Colors.tint} />
            )}
            <Text style={styles.timelineHeader}>Developmental Timeline</Text>
            <SideSwipe
              index={this.state.currentIndexTimeline}
              data={this.state.overviewTimelines}
              renderItem={item => this.renderOverviewTimeline(item)}
              itemWidth={tlCardWidth + tlCardMargin}
              contentOffset={tlCardMargin - 2}
              onIndexChange={index =>
                this.setState(() => ({ currentIndexTimeline: index }))
              }
            />
          </View>
        </View>

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
            {this.state.scSliderLoading && (
              <ActivityIndicator size="large" color={Colors.tint} />
            )}
            <SideSwipe
              index={this.state.currentIndexScreening}
              data={this.state.screeningEvents}
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
            {this.state.mgSliderLoading &&
              <ActivityIndicator size="large" color={Colors.tint} />
            }
            <SideSwipe
              index={this.state.currentIndexMilestones}
              data={this.state.milestoneGroups}
              renderItem={item => this.renderMilestoneItem(item)}
              itemWidth={mgImageWidth + mgImageMargin}
              threshold={mgImageWidth}
              contentOffset={mgImageMargin - 2}
              onIndexChange={index =>
                this.setState({ currentIndexMilestones: index })
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
  opacityStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  timeline_slide_container: {
    width: tlCardWidth,
    height: tlCardHeight,
    marginRight: tlCardMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeline: {
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 10,
    color: Colors.grey,
  },
  timelineSubtitle: {
    fontSize: 9,
    color: Colors.pink,
  },
  timelineCircle: {
    width: tlPhotoSize,
    height: tlPhotoSize,
    borderRadius: tlPhotoSize / 2,
    backgroundColor: Colors.lightGrey,
  },
  timelineImage: {
    width: tlPhotoSize,
    height: tlPhotoSize,
    borderRadius: tlPhotoSize / 2,
  },
  timelineCurrentItem: {
    borderWidth: 2,
    borderColor: Colors.pink,
  },
  timelineBackgroundImage: {
    width: '100%',
    opacity: 0.2,
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
  fetchMilestoneTasks,
  fetchMilestoneCalendar,
  resetApiMilestoneCalendar,
  apiCreateMilestoneCalendar,
  fetchSubject,
  fetchOverViewTimeline,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewScreen);
