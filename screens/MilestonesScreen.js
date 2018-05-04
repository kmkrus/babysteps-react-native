import React, { Component } from 'react';
import { ScrollView, StyleSheet, SectionList } from 'react-native';
import { Text } from 'react-native-elements';
import { connect} from 'react-redux';

class MilestonesScreen extends Component {
  static navigationOptions = {
    title: 'Milestones',
  };

  render() {

    //const milestones  = [
    //  {id: '1', milestoneGroup: 'Enrollment', title: 'Demographics Questionaire' },
    //  {id: '2', milestoneGroup: 'Pregnancy - 1st Trimester', title: 'First Prenatal Check Up'},
    //  {id: '3', milestoneGroup: 'Pregnancy - 1st Trimester', title: "Bi-weekly Query r: Mother's Feelings"}
    //]

    const milestones = this.props.milestones;
    return (
      <ScrollView style={styles.container}>
        <MilestoneTable milestones={milestones.data} />
      </ScrollView>
    )
  }

}

class MilestoneTable extends Component {

  render() {
    var rows = [];
    var lastMilestoneGroup = null;

    this.props.milestones.forEach((milestone) => {
      
      if (milestone.milestoneGroup !== lastMilestoneGroup) {
        rows.push(
          <MilestoneGroupRow
            milestone={milestone}
            key={milestone.milestoneGroup} />
        )
      }

      rows.push(
        <MilestoneRow
          milestone={milestone}
          key={milestone.id} />

      )
      lastMilestoneGroup = milestone.milestoneGroup;
      
    });

    return (
      <ScrollView>
        {[rows]}
      </ScrollView>
    );
  }
}

class MilestoneGroupRow extends Component {
  render() {
    return (
      <Text h4>{ this.props.milestone.milestoneGroup }</Text>
    );
  }
}

class MilestoneRow extends Component {
  render() {
    return (
      <Text h5>{ this.props.milestone.title }</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = ({ milestones }) => ({ milestones });

export default connect( mapStateToProps )( MilestonesScreen );