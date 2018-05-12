import React, { Component } from 'react';
import { ScrollView, StyleSheet, SectionList } from 'react-native';
import { Text } from 'react-native-elements';
import { connect} from 'react-redux';
import _ from 'lodash';
import Colors from '../constants/Colors';
import '@expo/vector-icons';
import fetchMilestones from '../database/fetch_milestones';
import { milestonesTable } from '../actions/milestone_actions'
import {
  FETCH_MILESTONES_PENDING,
  FETCH_MILESTONES_FULFILLED,
  FETCH_MILESTONES_REJECTED
} from '../actions/types';

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  componentWillMount() {

    if (this.props.milestones.data.length === 0) {
      
      // note redux doesn't actually change state until render
      this.props.milestonesTable(FETCH_MILESTONES_PENDING);
      fetchMilestones()
        .then( (response) => { 
          // dispatch milestones to redux
          this.props.milestonesTable(FETCH_MILESTONES_FULFILLED, response);
        })
        .catch( ( error ) => {
          this.props.milestonesTable(FETCH_MILESTONES_REJECTED, error)
        });
    } // if milestones.data.length
  }

  renderItem = (item) => {
    return <Text style={styles.text}>{item.item.name}</Text>
  }
  renderSectionHeader = (headerItem) => {
    return <Text style={styles.section}>{headerItem.section.key}</Text>
  }  

  render() {
    var milestones = [];

    if (this.props.milestones.fetched) {

      milestones = _.filter(this.props.milestones.data._array, function(m) {
        return m.always_visible;
      });
      
      milestones = _.groupBy(milestones, m => m.milestone_group );

      milestones = _.reduce(milestones, (acc, data, index) => {
        acc.push({
          key: index,
          data: data
        });
        return acc;
      }, []);

    }

    return (
      <ScrollView style={styles.container}>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
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
    padding: 20,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 16,
  },
  section: {
    fontSize: 20,
  }
});

const mapStateToProps = ({ milestones }) => ({ milestones });
const mapDispatchToProps = { milestonesTable }

export default connect( mapStateToProps, mapDispatchToProps )( MilestonesScreen );