import React, { Component } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import _ from 'lodash';

import NumberConverter from 'number-to-words';

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
  apiCreateMilestoneAnswer,
  apiUpdateMilestoneAnswers,
  fetchMilestoneAttachments,
  updateMilestoneAttachment,
  fetchOverViewTimeline,
  updateMilestoneCalendar,
  apiUpdateMilestoneCalendar,
  fetchMilestoneCalendar,
} from '../actions/milestone_actions';
import {
  fetchUser,
  fetchRespondent,
  fetchSubject,
} from '../actions/registration_actions';

import { RenderChoices } from '../components/milestone_question_components';

import Colors from '../constants/Colors';
import States from '../actions/states';
import CONSTANTS from '../constants';
import VideoFormats from '../constants/VideoFormats';
import ImageFormats from '../constants/ImageFormats';
import AudioFormats from '../constants/AudioFormats';

const { width, height } = Dimensions.get('window');

const itemWidth = width - 40;
const twoButtonWidth = (width / 2) - 30;

class MilestonePregnancyHistoryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const section = navigation.getParam('section', {title: ''});
    return { title: section.title };
  };

  constructor(props) {
    super(props);
    this.state = {
      task_id: null,
      section: {},
      questionsFetched: false,
      questionIDs: [],
      answersFetched: false,
      attachmentsFetched: false,
      numberOfPregnancies: 0,
      currentPregnancy: 0,
      answers: [],
      attachments: [],
      errorMessage: '',
      showConfirm: false,
      confirmed: false,
    };

    this.saveResponse = this.saveResponse.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchRespondent();
    this.props.fetchSubject();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const task = nextProps.navigation.state.params.task;
    if (task.id !== this.state.task_id) {
      this.props.resetMilestoneQuestions();
      this.props.resetMilestoneChoices();
      this.props.resetMilestoneAnswers();
      this.props.fetchMilestoneSections({ task_id: task.id });
      this.setState({
        task_id: task.id,
        section: [],
        questionsFetched: false,
        questionIDs: [],
        answersFetched: false,
        attachmentsFetched: false,
        numberOfPregnancies: 0,
        currentPregnancy: 0,
        answers: [],
        attachments: [],
        showNextPregnancy: false,
        showConfirm: false,
        confirmed: false,
      });
      return;
    }
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
          //this.props.fetchMilestoneAttachments({ section_id: section.id });
        } else {
          if (!questions.fetching) {
            if (
              _.isEmpty(questions.data) ||
              questions.data[0].section_id !== this.state.section.id
            ) {
              this.props.fetchMilestoneQuestions({
                section_id: this.state.section.id,
              });
              this.props.resetMilestoneChoices();
            }
          }
          if (!questions.fetching && questions.fetched) {
            if (!nextProps.milestones.choices.fetching) {
              if (_.isEmpty(nextProps.milestones.choices.data)) {
                // question IDs for repeat questions
                const questionIDs = _.map(questions.data.slice(1), 'id');
                this.setState({ questionsFetched: true, questionIDs });
                const question_ids = _.map(questions.data, 'id');
                this.props.fetchMilestoneChoices({ question_ids });
              }
            }
          } // questions.fetching
        } // isEmpty state.section
      } // isEmpty sections.data
    } // sections.fetching

    const answers = nextProps.milestones.answers;
    if (!answers.fetching && answers.fetched) {
      if (_.isEmpty(this.state.answers) && !this.state.answersFetched) {
        this.setState({
          answers: answers.data,
          answersFetched: true,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.milestones.questions.fetching ||
      nextProps.milestones.choices.fetching
    ) {
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
    return (
      <View style={styles.questionContainer}>
        {question.attachment_url && (
          <Image
            style={styles.image}
            source={{ uri: question.attachment_url }}
            resizeMethod="scale"
            resizeMode="contain"
          />
        )}
        <View style={styles.questionLeft}>
          <Text style={styles.question}>{title}</Text>
        </View>
        <RenderChoices
          question={question}
          answers={this.state.answers}
          pregnancy={this.state.currentPregnancy}
          attachments={this.state.attachments}
          saveResponse={this.saveResponse}
          errorMessage={this.state.errorMessage}
        />
      </View>
    );
  };

  saveResponse = (choice, response, options = {}) => {
    let answer = {};
    const answers = [...this.state.answers];
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

    const user = this.props.registration.user;
    const subject = this.props.registration.subject;
    const apiSubject = this.props.registration.apiSubject;
    const respondent = this.props.registration.respondent;
    const firstQuestion = this.props.milestones.questions.data[0];
    const currentPregnancy = this.state.currentPregnancy;

    const index = _.findIndex(answers, { choice_id: choice.id, pregnancy: currentPregnancy });

    if (index === -1) {
      if (format === 'single' && !response.answer_boolean) {
        // Do not save response if only single response allowed and answer boolean false
        return null;
      }
      answer = {
        section_id: this.state.section.id,
        question_id: choice.question_id,
        choice_id: choice.id,
        score: choice.score,
        pregnancy: currentPregnancy,
      };
    } else {
      answer = _.find(answers, ['choice_id', choice.id]);
      _.remove(answers, ['choice_id', choice.id]);
    } // index = -1

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
    // first question
    if (choice.question_id === firstQuestion.id) {
      const numberOfPregnancies = Math.trunc(answer.answer_text);
      const currentPregnancy = 1;
      let showConfirm = false;
      let showNextPregnancy = true;
      if (numberOfPregnancies === 1) {
        showConfirm = true;
        showNextPregnancy = false;
      };
      this.setState({
        numberOfPregnancies,
        currentPregnancy,
        showNextPregnancy,
        showConfirm,
        answers,
      });
    } else {
      const answerQuestionIDs = _.map(answers, 'question_id');
      this.setState({ answers });
    }
  };

  handleConfirm = () => {
    const section = this.state.section;
    const answers = this.state.answers;
    const session = this.props.session;
    const inStudy = session.registration_state === States.REGISTERED_AS_IN_STUDY;
    // TODO validation
    // TODO move to next section if more than one section in this task
    // TOTO don't mark task complete if any sections are incomplete

    this.setState({ confirmed: true });

    this.props.updateMilestoneAnswers(section, answers);
    this.props.updateMilestoneCalendar(section.task_id);

    if (inStudy) {
      this.props.apiUpdateMilestoneAnswers(session, section.id, answers);
      const calendar = _.find(this.props.milestones.calendar.data, ['task_id', section.task_id]);
      if (calendar && calendar.id) {
        const date = new Date().toISOString();
        this.props.apiUpdateMilestoneCalendar(calendar.id, {milestone_trigger: {completed_at: date}});
      }
    }
    this.props.fetchMilestoneCalendar();
    this.props.navigation.navigate('MilestoneQuestionConfirm');
  };

  handleNextPregnancy = () => {
    const currentPregnancy = this.state.currentPregnancy + 1;
    const numberOfPregnancies = this.state.numberOfPregnancies;
    let showConfirm = false;
    let showNextPregnancy = true;
    if (currentPregnancy === numberOfPregnancies) {
      showConfirm = true;
      showNextPregnancy = false;
    };
    this.setState({ currentPregnancy, showConfirm, showNextPregnancy });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
  };

  render() {
    const questions = this.props.milestones.questions;
    const choices = this.props.milestones.choices;
    const numberOfPregnancies = this.state.numberOfPregnancies;
    const currentPregnancy = this.state.currentPregnancy;
    let currentQuestions = [];
    if (!_.isEmpty(questions.data) && numberOfPregnancies === 0) {
      currentQuestions = questions.data.slice(0, 1);
    } else {
      currentQuestions = questions.data.slice(1);
    }
    const data = _.map(currentQuestions, question => {
      return _.extend({}, question, {
        choices: _.filter(choices.data, ['question_id', question.id]),
      });
    });

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableResetScrollToCoords={false}
        enableAutomaticScroll
        enableOnAndroid
        extraScrollHeight={50}
        //stickyHeaderIndices={[0]}
        innerRef={ref => {this.scroll = ref}}
      >
        {numberOfPregnancies > 0 && (
          <Text style={styles.pregnancyTitle}>
            {_.capitalize(NumberConverter.toWordsOrdinal(currentPregnancy))} Pregnancy
          </Text>
        )}
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
              onPress={() => this.props.navigation.navigate('Overview')}
              title="Cancel"
            />
            {this.state.showNextPregnancy && (
              <Button
                color={Colors.pink}
                buttonStyle={styles.buttonTwoStyle}
                titleStyle={styles.buttonTitleStyle}
                onPress={() => this.handleNextPregnancy()}
                title="Next Pregnancy"
              />
            )}
            {this.state.showConfirm && (
              <Button
                color={Colors.pink}
                buttonStyle={styles.buttonTwoStyle}
                titleStyle={styles.buttonTitleStyle}
                onPress={() => this.handleConfirm()}
                title="Confirm"
                disabled={this.state.confirmed}
              />
            )}
          </View>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  pregnancyTitle: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    color: Colors.tint,
    backgroundColor: Colors.lightGrey,
    fontWeight: '900',
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
  image: {
    flex: 1,
    width: itemWidth,
    height: itemWidth * 0.66,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    //maxHeight: 95,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    flex: 1,
    width: twoButtonWidth,
    //maxHeight: 95,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    flex: 1,
    width: twoButtonWidth,
    //maxHeight: 95,
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
  apiCreateMilestoneAnswer,
  apiUpdateMilestoneAnswers,
  fetchMilestoneAttachments,
  updateMilestoneAttachment,
  fetchOverViewTimeline,
  updateMilestoneCalendar,
  apiUpdateMilestoneCalendar,
  fetchMilestoneCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestonePregnancyHistoryScreen);
