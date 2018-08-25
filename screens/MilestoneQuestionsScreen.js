import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  CheckBox,
  FormLabel,
  FormInput,
} from 'react-native-elements';

import _ from 'lodash';

import { connect } from 'react-redux';
import {
  fetchMilestoneSections,
  resetMilestoneQuestions,
  fetchMilestoneQuestions,
  resetMilestoneChoices,
  fetchMilestoneChoices,
  resetMilestoneAnswers,
  fetchMilestoneAnswers,
  updateMilestoneAnswers,
  apiUpdateMilestoneAnswers,
} from '../actions/milestone_actions';
import {
  fetchUser,
  fetchRespondent,
  fetchSubject,
} from '../actions/registration_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

const { width, height } = Dimensions.get('window');

const itemWidth = width - 40;

class MilestoneQuestionsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('section')
      ? navigation.getParam('section').title
      : '';
    return { title };
  };

  state = {
    section: {},
    questionsFetched: false,
    answersFetched: false,
    answers: [],
  };

  componentWillMount() {
    this.props.resetMilestoneQuestions();
    this.props.resetMilestoneChoices();
    this.props.resetMilestoneAnswers();
    const task = this.props.navigation.state.params.task;
    this.props.fetchMilestoneSections({ task_id: task.id });
    this.props.fetchUser();
    this.props.fetchRespondent();
    this.props.fetchSubject();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const sections = nextProps.milestones.sections;
    const questions = nextProps.milestones.questions;
    if (!sections.fetching && sections.fetched) {
      if (!_.isEmpty(sections.data)) {
        if (_.isEmpty(this.state.section)) {
          const section = sections.data[0];
          this.setState({section: section});
          this.props.navigation.setParams({ section });
          this.props.fetchMilestoneQuestions({ section_id: section.id });
          this.props.resetMilestoneChoices();
          this.props.fetchMilestoneAnswers({ section_id: section.id });
        } else {
          if (!questions.fetching) {
            if (
              _.isEmpty(questions.data) || 
              questions.data[0].section_id !== this.state.section.id
            ) {
              this.props.fetchMilestoneQuestions({
                section_id: this.state.section.id
              });
              this.props.resetMilestoneChoices();
            }
          }
          if (!questions.fetching && questions.fetched) {
            if (!nextProps.milestones.choices.fetching) {
              if (_.isEmpty(nextProps.milestones.choices.data)) {
                this.setState({ questionsFetched: true });
                const question_ids = _.map(questions.data, 'id');
                this.props.fetchMilestoneChoices({ question_ids });
              }
            };

          } // questions.fetching
        } // isEmpty state.section
      } // isEmpty sections.data
    } // sections.fetching

    const answers = nextProps.milestones.answers;
    if (!answers.fetching && answers.fetched) {
      if (_.isEmpty(this.state.answers) && this.state.answersFetched) {
        this.setState({
          answers: this.props.milestones.answers.data,
          answersFetched: true,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.milestones.questions.fetching ||
      nextProps.milestones.choices.fetching) {
      return false;
    }
    return true;
  }

  renderItem = item => {
    const question = item.item;
    const question_number = _.isEmpty(question.question_number)
      ? String(question.position)
      : question.question_number;
    const title = `${question_number}. ${question.title}`;

    return  (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('MilestoneQuestions', { task: item });
        }}
      >
        <View style={styles.questionContainer}>
          <View style={styles.questionLeft}>
            <Text style={styles.question}>{title}</Text>
          </View>
          <View>{this.renderChoices(question)}</View>
        </View>
      </TouchableOpacity>
    );
  };

  renderChoices = question => {
    switch(question.rn_input_type) {
      case 'check_box_multiple': {
        return this.renderCheckBox(question, 'multiple');
      }
      case 'check_box_single': {
        return this.renderCheckBox(question, 'single');
      }
      case 'check_box_yes_no': {
        return this.renderCheckYesNo(question);
      }
      case 'text_short': {
        return this.renderTextShort(question);
      }
    }
  };

  saveResponse = (choice, response, options = {}) => {
    let answer = {};
    let answers = this.state.answers;
    const format = options.format;
    const preserve = options.preserve;

    if (format === 'single') {
      // delete all previous answers for this question if only one response allowed.
      _.remove(answers, ans => {
        if (preserve) {
          // preserve answer if adding attribute
          return (
            ans.question_id === choice.question_id &&
            ans.choice_id !== choice.id
          );
        }
        return ans.question_id === choice.question_id;
      });
    }

    const index = _.findIndex(answers, { choice_id: choice.id });
    const user = this.props.user;
    const subject = this.props.subject;
    const respondent = this.props.respondent;

    if (index === -1) {
      if (format === 'single' && !response.answer_boolean) {
        // Do not save response if only single response allowed and answer boolean false
      } else {
        answer = {
          section_id: this.state.section.id,
          question_id: choice.question_id,
          choice_id: choice.id,
          score: choice.score,
        };
        if (!_.isEmpty(user.data)) {
          answer.user_id = user.data.id;
          answer.user_api_id = user.data.api_id;
        }
        if (!_.isEmpty(respondent.data)) {
          answer.respondent_id = respondent.data.id;
          answer.respondent_api_id = respondent.data.api_id;
        }
        if (!_.isEmpty(subject.data)) {
          answer.subject_id = subject.data.id;
          answer.subject_api_id = subject.data.api_id;
        }

        _.assign(answer, response);

        answers.push(answer);
      } // format == single
    } else {
      answer = _.find(answers, ['choice_id', choice.id]);
      _.assign(answer, response);
    } // index = -1

    this.setState({ answers });
  };

  renderCheckBox = (question, format = 'multiple') => {
    const collection = _.map(question.choices, choice => {
      let checked = false;
      let text = '';
      const answer = _.find(this.state.answers, ['choice_id', choice.id]);

      if (answer) {
        checked = answer.answer_boolean;
        text = answer.answer_text;
      }
      const requireExplanation = (choice.require_explanation === 'if_true' && checked);

      return (
        <View key={choice.id} style={styles.checkBoxExplanationContainer}>
          <CheckBox
            title={choice.body}
            textStyle={styles.checkBoxChoiceText}
            containerStyle={styles.checkBoxChoiceContainer}
            checked={checked}
            onPress={() =>
              this.saveResponse(
                choice,
                { answer_boolean: !checked },
                { format },
              )
            }
          />
          {requireExplanation && (
            <FormInput 
              inputStyle={styles.textInput}
              defaultValue={text}
              onChangeText={value =>
                this.saveResponse(
                  choice,
                  { answer_text: value },
                  { preserve: true },
                )
              }
              containerStyle={{ borderBottomColor: Colors.lightGrey }}
              underlineColorAndroid={Colors.lightGrey}
            />
          )}
        </View>
      );
    });
    return <View>{collection}</View>;
  };

  renderCheckYesNo = question => {
    const collection = _.map(question.choices, choice => {
      let checked = false;
      const answer = _.find(this.state.answers, ['choice_id', choice.id]);
      if (answer) {
        checked = answer.answer_boolean;
      }
      return (
        <CheckBox
          key={choice.id}
          title={choice.body}
          textStyle={styles.checkBoxChoiceText}
          containerStyle={styles.checkBoxChoiceContainer}
          checked={checked}
          onPress={() =>
            this.saveResponse(
              choice,
              { answer_boolean: !checked },
              { format: "single" },
            )
          }
        />
      );
    });
    return <View style={{ flexDirection: 'row' }}>{collection}</View>;
  };

  renderTextShort = question => {
    const collection = _.map(question.choices, choice => {
      let text = '';
      const answer = _.find(this.state.answers, ['choice_id', choice.id]);
      if (answer) {
        text = answer.answer_text;
      }
      return (
        <View key={choice.id}>
          <FormLabel labelStyle={styles.textLabel}>{choice.body}</FormLabel>
          <FormInput
            inputStyle={styles.textInput}
            defaultValue={text}
            onChangeText={value =>
              this.saveResponse(choice, { answer_text: value })
            }
            containerStyle={{ borderBottomColor: Colors.lightGrey }}
            underlineColorAndroid={Colors.lightGrey}
          />
        </View>
      );
    });
    return <View>{collection}</View>;
  };

  handleConfirm = () => {
    // TODO validation
    // TODO move to next section if more than one section in this task
    // TODO update milestone_triggers completed_at if task complete
    this.props.updateMilestoneAnswers(this.state.section, this.state.answers);
    if (this.props.session.registration_state === States.REGISTERED_AS_IN_STUDY) {
      this.props.apiUpdateMilestoneAnswers(this.props.session, this.state.section.id, this.state.answers);
    }
    this.props.navigation.navigate('Milestones');
  };

  render() {
    const data = _.map(this.props.milestones.questions.data, question => {
      return _.extend({}, question, {choices: _.filter(this.props.milestones.choices.data, ['question_id', question.id ])})
    });

    return (
      <ScrollView style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            renderItem={this.renderItem}
            data={data}
            keyExtractor={item => String(item.id)}
          />
        </View>

        {this.state.questionsFetched && (
          <View style={styles.buttonContainer}>
            <Button
              color={Colors.grey}
              buttonStyle={styles.buttonOneStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => this.props.navigation.navigate('Milestones')}
              title="Cancel"
            />
            <Button
              color={Colors.pink}
              buttonStyle={styles.buttonTwoStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => this.handleConfirm()}
              title="Confirm"
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
  },
  questionContainer: {
    flexDirection: 'column',
    padding: 5,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  questionLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    borderWidth: 0,
  },
  checkBoxChoiceText: {
    fontSize: 12,
    fontWeight: '400',
  },
  checkBoxExplanationContainer: {
    flexDirection: 'column',
  },
  textInput: {
    fontSize: 14,
    fontWeight: '600',
  },
  textLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    width: 150,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    width: 150,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
});

const mapStateToProps = ({ session, milestones, registration }) => ({
  session,
  milestones,
  registration,
});
const mapDispatchToProps = {
  fetchUser,
  fetchRespondent,
  fetchSubject,
  fetchMilestoneSections,
  resetMilestoneQuestions,
  fetchMilestoneQuestions,
  resetMilestoneChoices,
  fetchMilestoneChoices,
  resetMilestoneAnswers,
  fetchMilestoneAnswers,
  updateMilestoneAnswers,
  apiUpdateMilestoneAnswers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestoneQuestionsScreen);
