import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  SectionList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import { showMessage } from 'react-native-flash-message';

import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';

import moment from 'moment';

import { connect } from 'react-redux';
import {
  fetchMilestoneGroups,
  fetchMilestoneTasks,
} from '../actions/milestone_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';
import CONSTANTS from '../constants';

const { width } = Dimensions.get('window');

const itemWidth = width - 60;

let sectionRenderCount = 0;

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  state = {
    tasksForList: [],
    sectionIndex: 0,
    sectionID: null,
    scrollToComplete: false,
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups();
    this.props.fetchMilestoneTasks();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const groups = filter(nextProps.milestones.groups.data, {visible: 1});
    const tasks = nextProps.milestones.tasks;
    const session = nextProps.session;
    let tasksForList = [...this.state.tasksForList];

    if (!tasks.fetching && tasks.fetched) {
      tasksForList = filter(tasks.data, task => {
        if (
          session.registration_state === States.REGISTERED_AS_NO_STUDY &&
          task.study_only === 1
        ) {
          return false;
        }
        if (findIndex(groups, ['id', task.milestone_group_id]) === -1) {
          return false;
        }
        return true;
      });

      tasksForList = groupBy(tasksForList, task => task.milestone_group_id);

      tasksForList = reduce(
        tasksForList,
        (acc, data, index) => {
          const group = find(groups, ['id', data[0].milestone_group_id]);
          acc.push({ key: index, id: group.id, title: group.title, data });
          return acc;
        },
        [],
      );
      this.setState({ tasksForList });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.scrollToComplete &&  nextState.tasksForList.length !== 0) {
      const milestone = this.props.navigation.getParam('milestone', null);
      if (milestone) {
        const sectionIndex = findIndex(this.state.tasksForList, ['id', milestone.id])
        if (sectionIndex !== -1) {
          this.sectionList.scrollToLocation({ sectionIndex, itemIndex: 0 });
          this.setState({ scrollToComplete: true });
        }
      }
    }
    // trap section header render - don't update view
    if (nextState.sectionID !== this.state.sectionID) {
      return false;
    }
    return true;
  }

  getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) =>
      sectionIndex === 0 ? 68 : 34,
    // These three properties are optional
    //getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
    getSectionHeaderHeight: () => 31.7, // The height of your section headers
    getSectionFooterHeight: () => 10, // The height of your section footers
  });

  handleOnPress = (task, calendar) => {
    if (!CONSTANTS.TESTING_ENABLE_ALL_TASKS) {
      if (moment().isBefore(calendar.available_start_at)) {
        showMessage({
          message: 'Sorry, this task is not available yet.',
          type: 'warning',
        });
        return null;
      }
      if (moment().isAfter(calendar.available_end_at) && !calendar.completed_at) {
        showMessage({
          message: 'Sorry, this task is no longer available.',
          type: 'warning',
        });
        return null;
      }
    }
    this.props.navigation.navigate('MilestoneQuestions', { task });
  };

  renderItem = item => {
    const task = item.item;
    let checkboxSource = require('../assets/images/milestones_checkbox.png');
    let color = Colors.grey;
    const calendar = find(this.props.milestones.calendar.data, ['task_id', task.id]);
    if (calendar) {
      if (calendar.completed_at) {
        checkboxSource = require('../assets/images/milestones_checkbox_complete.png');
      }
      if (!CONSTANTS.TESTING_ENABLE_ALL_TASKS) {
        if (moment().isBefore(calendar.available_start_at) || moment().isAfter(calendar.available_end_at)) {
          color = Colors.lightGrey;
        }
      }
    } else {
      // if no calendar entry, don't show the task
      return null;
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => this.handleOnPress(task, calendar)}>
          <View style={styles.itemLeft}>
            <Image source={checkboxSource} style={styles.itemCheckBox} />
            <Text style={[styles.item, { color }]}>{task.name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.itemRight}>
          <Image
            source={require('../assets/images/milestones_right_arrow.png')}
            style={styles.itemRightArrow}
          />
        </View>
      </View>
    );
  };

  handleComponentUpdate = () => {
    sectionRenderCount += 1;
    this.setState({ sectionID: sectionRenderCount });
  };

  renderSectionHeader = headerItem => {
    return (
      <View onLayout={this.handleComponentUpdate}>
        <Text style={styles.section}>{headerItem.section.title}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          //debug={true}
          ref={ref => this.sectionList = ref}
          //initialNumToRender={this.state.tasksForList.length}
          initialScrollIndex={this.state.sectionIndex}
          onScrollToIndexFailed={info => console.log(info)}
          getItemLayout={this.getItemLayout}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          sections={this.state.tasksForList}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    fontSize: 16,
    padding: 10,
    paddingLeft: 10,
    color: Colors.tint,
    backgroundColor: Colors.lightGrey,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  itemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: itemWidth,
  },
  itemRight: {
    marginRight: 5,
  },
  itemCheckBox: {
    width: 16,
    height: 16,
  },
  itemRightArrow: {
    width: 14,
    height: 14,
  },
  item: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 10,
    color: Colors.tint,
  },
});

const mapStateToProps = ({ session, milestones }) => ({ session, milestones });
const mapDispatchToProps = { fetchMilestoneGroups, fetchMilestoneTasks };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestonesScreen);
