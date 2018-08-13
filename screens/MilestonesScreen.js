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
import { fetchMilestoneGroups, fetchMilestones } from '../actions/milestone_actions';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const itemWidth = width - 60

var milestones = [];

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  componentWillMount() {
    this.props.fetchMilestoneGroups()
    this.props.fetchMilestones()
  }

  componentWillReceiveProps(nextProps, nextState) {
   
    if ( !nextProps.milestones.milestones.fetching && nextProps.milestones.milestones.fetched ) {

      milestones = _.filter(nextProps.milestones.milestones.data, function(m) {
        return m.always_visible == 1
      });

      milestones = _.sortBy(milestones, ["milestone_group_id", "position"]);
      
      milestones = _.groupBy(milestones, m => m.milestone_group_id );

      milestones = _.reduce(milestones, (acc, data, index) => {
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
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MilestoneDetailScreen',{item:item})}}> 

        <View style={ styles.itemContainer }>
          <View style={ styles.itemLeft }>
            <MaterialCommunityIcons name='checkbox-blank-outline' style={ styles.itemCheckBox } />
            <Text style={styles.item}>{item.item.title}</Text> 
          </View>
          <View style={ styles.itemRight}>               
            <Ionicons name='md-arrow-forward' style={ styles.itemRightArrow } />
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  renderSectionHeader = (headerItem) => {
    return <Text style={styles.section}>{ headerItem.section.title }</Text>
  }  

  render() {
    return (
      <ScrollView style={styles.container}>
        <SectionList
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          sections={milestones}
          keyExtractor={(item) => item.id}
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
const mapDispatchToProps = { fetchMilestoneGroups, fetchMilestones }

export default connect( mapStateToProps, mapDispatchToProps )( MilestonesScreen );