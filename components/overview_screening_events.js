import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import SideSwipe from 'react-native-sideswipe';
import { Ionicons } from '@expo/vector-icons';

import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import moment from 'moment';

import { connect } from 'react-redux';

import { apiCreateMilestoneCalendar } from '../actions/milestone_actions';
import { updateSession } from '../actions/session_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

const { width, height } = Dimensions.get('window');

const wp = (percentage, direction) => {
  const value = (percentage * direction) / 100;
  return Math.round(value);
};

const scContainerHeight = wp(30, height);
const scCardHeight = wp(70, scContainerHeight);
const scCardWidth = wp(80, width);
const scCardMargin = (width - scCardWidth) / 2;

class OverviewScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    currentIndexScreening: 0,
    sliderLoading: true,
    screeningEvents: [],
    apiCreateCalendarSubmitted: false,
  };

  componentWillReceiveProps(nextProps) {
    const subject = nextProps.registration.subject;
    if (!subject.fetching && subject.fetched) {
      let fetchCalendarParams = {};
      if (nextProps.session.registration_state === States.REGISTERED_AS_IN_STUDY) {
        fetchCalendarParams = { subject_id: subject.data.api_id };
      } else {
        fetchCalendarParams = { base_date: subject.data.expected_date_of_birth };
        if (subject.data.date_of_birth) {
          fetchCalendarParams = { base_date: subject.data.date_of_birth };
        }
      }
      const calendar = nextProps.milestones.calendar;
      if (!calendar.fetching && calendar.fetched) {
        if (isEmpty(calendar.data)) {
          if (
            !nextProps.milestones.api_calendar.fetching &&
            subject.data !== undefined &&
            !this.state.apiCreateCalendarSubmitted
          ) {
            // creates calendar on server, but only returns visible tasks
            // no notifications generated
            this.props.apiCreateMilestoneCalendar(fetchCalendarParams);
            this.setState({ apiCreateCalendarSubmitted: true });
            // reset last updated date to rebuild notifications
            this.props.updateSession({ notifications_updated_at: null });
          }
        } else {
          let screeningEvents = filter(calendar.data, s => {
            if (s.momentary_assessment) {
              return false;
            }
            if (s.completed_at) {
              return false;
            }
            return moment().isAfter(s.available_start_at) && moment().isBefore(s.available_end_at);
          });
          screeningEvents = sortBy(screeningEvents, s => {
            return moment(s.notify_at);
          });
          this.setState({
            screeningEvents,
            sliderLoading: false,
          });
        } // isEmpty calendar data
      } // calendar fetcbhing
    } // subject fetching
  }

  handleOnPress = task => {
    const navigate = this.props.navigation.navigate;
    if (task.task_type === 'pregnancy_history') {
      navigate('MilestonePregnancyHistory', { task });
    } else {
      navigate('MilestoneQuestions', { task });
    }
  };

  renderScreeningItem = data => {
    const task = { ...data.item };
    task.trigger_id = task.id;
    task.id = task.task_id;

    const longDate = moment(task.available_end_at).format('dddd, MMMM D, YYYY' );
    return (
      <View key={data.itemIndex} style={styles.screening_slide_container}>
        <TouchableOpacity onPress={() => this.handleOnPress(task)}>
          <Text numberOfLines={1} style={styles.screening_title}>{task.message}</Text>
          <Text numberOfLines={1} style={styles.screening_date}>Due by {longDate}</Text>
          <Text numberOfLines={3} style={styles.screening_text}>{task.name}</Text>
        </TouchableOpacity>
        <View style={styles.screening_slide_link}>
          <TouchableOpacity
            onPress={() => this.handleOnPress(task)}
            style={styles.screening_button}
          >
            <Text style={styles.screening_button_text}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.slider_header}>
          <View style={styles.slider_title}>
            <Text style={styles.slider_title_text}>Screening Events</Text>
          </View>
          <TouchableOpacity 
            onPress={() => this.props.navigation.navigate('Milestones')}
            style={styles.opacityStyle}>
            <Text style={styles.slider_link_text}>View all</Text>
            <Ionicons name='md-arrow-forward' style={styles.slider_link_icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.slider}>
          {this.state.sliderLoading && (
            <ActivityIndicator size="large" color={Colors.tint} />
          )}
          {!this.state.sliderLoading && 
            isEmpty(this.state.screeningEvents) && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You've completed all the tasks for this stage. We'll notify
                  you when there are new tasks to complete.
                </Text>
              </View>
            )}
          {!isEmpty(this.state.screeningEvents) && (
            <SideSwipe
              index={this.state.currentIndexScreening}
              data={this.state.screeningEvents}
              renderItem={item => this.renderScreeningItem(item)}
              itemWidth={scCardWidth + scCardMargin}
              contentOffset={scCardMargin - 2}
              useVelocityForIndex={false}
              onIndexChange={index =>
                this.setState(() => ({ currentIndexScreening: index }))
              }
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  opacityStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    fontSize: 16,
    color: Colors.darkGrey,
    fontWeight: '600',
  },
  screening_date: {
    fontSize: 12,
    color: Colors.green,
  },
  screening_text: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  screening_button: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: Colors.pink,
    backgroundColor: Colors.lightPink,
    borderRadius: 5,
  },
  screening_button_text: {
    fontSize: 12,
    color: Colors.pink,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scCardMargin,
    height: scCardHeight,
    width: scCardWidth,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 5,
  },
  emptyText: {
    justifyContent: 'center',
    textAlign: 'center',
    color: Colors.pink,
    fontSize: 14,
  },
});

const mapStateToProps = ({ session, milestones, registration }) => ({
  session,
  milestones,
  registration,
});

const mapDispatchToProps = {
  updateSession,
  apiCreateMilestoneCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewScreen);
