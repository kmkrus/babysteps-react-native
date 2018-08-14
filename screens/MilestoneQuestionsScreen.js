import React, { Component } from 'react';
import { 
  ScrollView,
  View, 
  StyleSheet, 
  FlatList,
  Dimensions,
  TouchableOpacity 
} from 'react-native';
import { 
  Text, 
  CheckBox,
  FormLabel,
  FormInput
} from 'react-native-elements';

import _ from 'lodash';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect} from 'react-redux';
import {
  fetchMilestoneSections, 
  resetMilestoneQuestions,
  fetchMilestoneQuestions, 
  resetMilestoneChoices,
  fetchMilestoneChoices 
} from '../actions/milestone_actions';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const itemWidth = width - 40

class MilestoneQuestionsScreen extends Component {

  state = {
    section: {}
  }

  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('section') ? navigation.getParam('section').title : ''
    return {
      title: title
    }
    
  };

  componentWillMount() {
    this.props.resetMilestoneQuestions()
    this.props.resetMilestoneChoices()
    const task = this.props.navigation.state.params.task
    this.props.fetchMilestoneSections({ task_id: task.id })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( nextProps.milestones.questions.fetching || 
      nextProps.milestones.choices.fetching ) {
      return false
    }
    return true
  }

  componentWillReceiveProps(nextProps, nextState) {

    if ( !nextProps.milestones.sections.fetching && nextProps.milestones.sections.fetched ) {
      if ( !_.isEmpty(nextProps.milestones.sections.data) ) {
        if ( _.isEmpty(this.state.section) ) {
          const section = nextProps.milestones.sections.data[0] 
          this.setState({ section: section })
          this.props.navigation.setParams({section: section})
          this.props.fetchMilestoneQuestions({ section_id: section.id })
          this.props.resetMilestoneChoices()
        } else {
          if ( !nextProps.milestones.questions.fetching ) {
            if ( _.isEmpty(nextProps.milestones.questions.data) || nextProps.milestones.questions.data[0].section_id != this.state.section.id ) {
              this.props.fetchMilestoneQuestions({ section_id: this.state.section.id })
              this.props.resetMilestoneChoices()
            }
          }
          if ( !nextProps.milestones.questions.fetching && nextProps.milestones.questions.fetched ) {
            if ( !nextProps.milestones.choices.fetching ) {
              if ( _.isEmpty(nextProps.milestones.choices.data) ) {
                const question_ids = _.map( nextProps.milestones.questions.data, 'id' )
                this.props.fetchMilestoneChoices({ question_ids: question_ids })
              }
            }

          } // questions.fetching
        } // isEmpty state.section 
      } // isEmpty sections.data
    } // sections.fetching
  }

  renderItem = (item) => {
    const question = item.item
    const question_number = _.isEmpty(question.question_number) ? String(question.position) : question_number

    return  (
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MilestoneQuestions', {task: item})}}> 

        <View style={ styles.questionContainer }>
          <View style={ styles.questionLeft }>
            <Text style={styles.question}>{ question_number + '. ' + question.title}</Text> 
          </View>
          <View>
            { this.renderChoices(question) }
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  renderChoices = (question) => {
    switch( question.rn_input_type ) {
      case 'check_box_multiple': {
        return this.renderCheckBoxMultiple( question )
        break;
      }
      case 'check_box_single': {
        return this.renderCheckBoxSingle( question )
        break;
      }
      case 'check_box_yes_no': {
        return this.renderCheckYesNo( question )
        break;
      }
      case 'text_short': {
        return this.renderTextShort( question )
        break;
      }
    }
  }

  renderCheckBoxMultiple = (question) => {
    const collection = _.map(question.choices, (choice) => {
      return (
        <CheckBox 
          key={ choice.id }
          title={ choice.body } 
          textStyle={ styles.checkBoxChoiceText } 
          containerStyle={ styles.checkBoxChoiceContainer }
          onPress={ () => this.setState({choice: true}) }
        />
      )
    })
    return (
      <View >
        { collection }
      </View>
    )
  }

  renderCheckBoxSingle = (question) => {
    const collection = _.map(question.choices, (choice) => {
      return (
        <CheckBox 
          key={ choice.id }
          title={ choice.body } 
          textStyle={ styles.checkBoxChoiceText } 
          containerStyle={ styles.checkBoxChoiceContainer }
          onPress={ () => this.setState({choice: true}) }
        />
       )
    })
    return (
      <View >
        { collection }
      </View>
    )
  }

  renderCheckYesNo = (question) => {
    const collection = _.map(question.choices, (choice) => {
      return (
        <CheckBox
          key={ choice.id }
          title={ choice.body } 
          textStyle={ styles.checkBoxChoiceText } 
          containerStyle={ styles.checkBoxChoiceContainer }
          onPress={ () => this.setState({choice: true}) }
        />
       )
    })
    return (
      <View style={{flexDirection: 'row'}}>
        { collection }
      </View>
    )
  }

  renderTextShort = (question) => {
    const choice = question.choices[0]
    if ( choice ) {
      return (
        <View>
          <FormLabel labelStyle={{fontSize: 12, fontWeight: '400'}}>{ choice.body }</FormLabel>
          <FormInput 
            key={ choice.id }
            inputStyle={{fontSize: 14, fontWeight: '600'}}
            onChangeText={ (value) => console.log(value) }
            containerStyle={ { borderBottomColor: Colors.lightGrey }}
            underlineColorAndroid={Colors.lightGrey}
          />
        </View>
      )
    }
  }

  render() {
    const data = _.map(this.props.milestones.questions.data, (question) => {
      return _.extend( {}, question, {choices: _.filter(this.props.milestones.choices.data, ['question_id', question.id ] )} )
    })

    return (
      <ScrollView style={ styles.container }>
        <FlatList
          renderItem={ this.renderItem }
          data={ data }
          keyExtractor={ (item) => String(item.id) }
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
  questionContainer: {
    flexDirection: 'column', 
    padding: 5,  
    justifyContent:'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.lightGrey,
  },
  questionLeft: {
    flexDirection:'row',
    justifyContent:'flex-start',
    width: itemWidth,
  },
  question: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 5,
    color: Colors.tint,
  },
  checkBoxChoiceContainer: {
    padding: 0,
    marginLeft: 20,
    backgroundColor: Colors.white,
    borderWidth: 0
  },
  checkBoxChoiceText: {
    fontSize: 12,
    fontWeight: '400',
  },
 
});

const mapStateToProps = ({ session, milestones }) => ({ session, milestones });
const mapDispatchToProps = { 
  fetchMilestoneSections, 
  resetMilestoneQuestions,
  fetchMilestoneQuestions,
  resetMilestoneChoices,
  fetchMilestoneChoices 
}

export default connect( mapStateToProps, mapDispatchToProps )( MilestoneQuestionsScreen );