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

import {
  apiCreateMilestoneCalendar,
  apiFetchMilestoneCalendar,
} from '../actions/milestone_actions';
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
    apiFetchCalendarSubmitted: false,
  };

  componentWillReceiveProps(nextProps, nextState) {
    const subject = nextProps.registration.subject;
    if (!subject.fetching && subject.fetched) {
      let fetchCalendarParams = {};
      if (nextProps.session.registration_state === States.REGISTERED_AS_IN_STUDY) {
        fetchCalendarParams = { subject_id: subject.data.api_id };
      } else {
        fetchCalendarParams = { base_date: subject.data.expected_date_of_birth };
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
            this.props.apiCreateMilestoneCalendar( fetchCalendarParams );
            this.setState({ apiCreateCalendarSubmitted: true });
          }
        } else {
          let screeningEvents = filter(calendar.data, s => {
            return moment().isBefore(s.notify_at) && !s.momentary_assessment;
          });
          screeningEvents = sortBy(screeningEvents, s => {
            return moment(s.notify_at);
          });
          this.setState({
            screeningEvents,
            sliderLoading: false,
          });
          // Fetch full calendar and create notifications
          if (
            !nextProps.session.full_calendar_fetched &&
            !this.state.apiFetchCalendarSubmitted
          ) {
            this.props.apiFetchMilestoneCalendar( fetchCalendarParams );
            this.setState({ apiFetchCalendarSubmitted: true });
            this.props.updateSession({ full_calendar_fetched: true });
          }
        } // isEmpty calendar data
      } // calendar fetcbhing
    } // subject fetching
  }

  renderScreeningItem = data => {
    const task = { ...data.item };
    task.trigger_id = task.id;
    task.id = task.task_id;

    const navigate = this.props.navigation.navigate;
    const longDate = new Date(task.notify_at).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return (
      <View key={data.itemIndex} style={styles.screening_slide_container}>
        <TouchableOpacity
          onPress={() => navigate('MilestoneQuestions', { task })}
        >
          <Text numberOfLines={1} style={styles.screening_title}>{ task.message }</Text>
          <Text numberOfLines={1} style={styles.screening_date}> { longDate }</Text>
          <Text numberOfLines={3} style={styles.screening_text}>{ task.name }</Text>
        </TouchableOpacity>
        <View style={styles.screening_slide_link}>
          <TouchableOpacity
            onPress={() => navigate('MilestoneQuestions', { task })}
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
});

const mapStateToProps = ({ session, milestones, registration }) => ({
  session,
  milestones,
  registration,
});

const mapDispatchToProps = {
  updateSession,
  apiCreateMilestoneCalendar,
  apiFetchMilestoneCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewScreen);
