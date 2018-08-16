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

import _ from 'lodash';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect} from 'react-redux';
import { fetchMilestoneGroups, fetchMilestoneTasks } from '../actions/milestone_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

const { width, height } = Dimensions.get('window');

const itemWidth = width - 60

var tasks = [];

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups()
    this.props.fetchMilestoneTasks()
  }

  componentWillReceiveProps(nextProps, nextState) {
   
    if ( !nextProps.milestones.tasks.fetching && nextProps.milestones.tasks.fetched ) {

      tasks = _.filter(nextProps.milestones.tasks.data, function(task) {
        if ( nextProps.session.registration_state == States.REGISTERED_AS_NO_STUDY && task.study_only == 1 ) { 
          return false
        }
        return true
      });

      tasks = _.groupBy(tasks, task => task.milestone_group_id );

      tasks = _.reduce(tasks, (acc, data, index) => {
        const group = _.find(this.props.milestones.groups.data, ['id', data[0].milestone_group_id])
        acc.push({
          key: index,
          title: group.title,
          data: data
        });
        return acc;
      }, []);

    }
  }

  renderItem = (item) => {
    return  (
      <TouchableOpacity onPress={ ()=>{ this.props.navigation.navigate('MilestoneQuestions', {task: item.item} ) } }> 

        <View style={ styles.itemContainer }>
          <View style={ styles.itemLeft }>
            <MaterialCommunityIcons name='checkbox-blank-outline' style={ styles.itemCheckBox } />
            <Text style={styles.item}>{`${item.item.milestone_title} - ${item.item.name}`}</Text> 
          </View>
          <View style={ styles.itemRight}>               
            <Ionicons name='md-arrow-forward' style={ styles.itemRightArrow } />
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  renderSectionHeader = (headerItem) => {
    return <Text style={ styles.section }>{ headerItem.section.title }</Text>
  }  

  render() {
    return (
      <ScrollView style={ styles.container }>
        <SectionList
          renderSectionHeader={ this.renderSectionHeader }
          renderItem={ this.renderItem }
          sections={ tasks }
          keyExtractor={ (item) => item.id }
        />
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    fontSize: 16,
    padding:5,
    paddingLeft: 10,
    color: Colors.tint,
    backgroundColor: Colors.lightGrey,
  },
  itemContainer: {
    flexDirection: 'row', 
    padding: 5,  
    justifyContent:'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.lightGrey,
  },
  itemLeft: {
    flexDirection:'row',
    justifyContent:'flex-start',
    width: itemWidth,
  },
  itemRight: {
    marginRight: 5
  },
  itemCheckBox: { 
    fontSize: 22, 
    color: Colors.lightGrey,
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
const mapDispatchToProps = { fetchMilestoneGroups, fetchMilestoneTasks }

export default connect( mapStateToProps, mapDispatchToProps )( MilestonesScreen );