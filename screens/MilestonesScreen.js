import React, { Component } from 'react';
import { 
  ScrollView,
  View, 
  StyleSheet, 
  SectionList,
  Dimensions,
  TouchableOpacity 
} from 'react-native';
import { Text } from 'react-native-elements';

import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect} from 'react-redux';
import { fetchMilestoneGroups, fetchMilestoneTasks } from '../actions/milestone_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

const { width } = Dimensions.get('window');

const itemWidth = width - 60;

let tasksForList = [];

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups();
    this.props.fetchMilestoneTasks();
  }

  componentWillReceiveProps(nextProps) {
    const groups = filter(nextProps.milestones.groups.data, {visible: 1});
    const tasks = nextProps.milestones.tasks;
    const session = nextProps.session;
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
          acc.push({ key: index, title: group.title, data });
          return acc;
        },
        [],
      );
    }
  }

  renderItem = item => {
    const task = item.item;
    let checboxName = 'checkbox-blank-outline';
    const calendar = find(this.props.milestones.calendar.data, ['task_id', task.id])
    if (calendar && calendar.completed_at) {
      checboxName = 'checkbox-marked-outline';
    }

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('MilestoneQuestions', { task })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <MaterialCommunityIcons
              name={checboxName}
              style={styles.itemCheckBox}
            />
            <Text style={styles.item}>{`${task.milestone_title} - ${task.name}`}</Text>
          </View>
          <View style={styles.itemRight}>
            <Ionicons name="md-arrow-forward" style={styles.itemRightArrow} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSectionHeader = headerItem => {
    return <Text style={styles.section}>{headerItem.section.title}</Text>;
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <SectionList
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          sections={tasksForList}
          keyExtractor={item => item.id}
        />
      </ScrollView>
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
    padding: 5,
    paddingLeft: 10,
    color: Colors.tint,
    backgroundColor: Colors.lightGrey,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 5,
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
    fontSize: 24,
    color: Colors.grey,
  },
  itemRightArrow: {
    fontSize: 22,
    color: Colors.lightGrey,
  },
  item: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 5,
    color: Colors.tint,
  },
});

const mapStateToProps = ({ session, milestones }) => ({ session, milestones });
const mapDispatchToProps = { fetchMilestoneGroups, fetchMilestoneTasks };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestonesScreen);
