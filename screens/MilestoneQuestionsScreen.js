import React, { Component } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { FileSystem } from 'expo';
import { Text, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  apiCreateMilestoneAnswer,
  apiUpdateMilestoneAnswers,
  fetchMilestoneAttachments,
  updateMilestoneAttachment,
  fetchOverViewTimeline,
  updateMilestoneCalendar,
  apiUpdateMilestoneCalendar,
  fetchMilestoneCalendar,
} from '../actions/milestone_actions';
import { createBabyBookEntry } from '../actions/babybook_actions';
import {
  fetchUser,
  fetchRespondent,
  fetchSubject,
} from '../actions/registration_actions';

import {
  RenderCheckBox,
  RenderCheckYesNo,
  RenderTextShort,
  RenderTextLong,
  RenderTextNumeric,
  RenderDate,
  RenderFile,
  RenderExternalLink,
} from '../components/milestone_question_elements';

import Colors from '../constants/Colors';
import States from '../actions/states';
import CONSTANTS from '../constants';
import VideoFormats from '../constants/VideoFormats';
import ImageFormats from '../constants/ImageFormats';
import AudioFormats from '../constants/AudioFormats';

const { width } = Dimensions.get('window');

const itemWidth = width - 40;
const twoButtonWidth = (width / 2) - 30;

class MilestoneQuestionsScreen extends Component {
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
      answersFetched: false,
      attachmentsFetched: false,
      answers: [],
      attachments: [],
      errorMessage: '',
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
        answersFetched: false,
        attachmentsFetched: false,
        answers: [],
        attachments: [],
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
          this.props.fetchMilestoneAttachments({ section_id: section.id });
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
                this.setState({ questionsFetched: true });
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

    const attachments = nextProps.milestones.attachments;
    if (!attachments.fetching && attachments.fetched) {
      if (_.isEmpty(this.state.attachments) && !this.state.attachmentsFetched) {
        this.setState({
          attachments: this.props.milestones.attachments.data,
          attachmentsFetched: true,
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
            source={{uri: question.attachment_url}}
            resizeMethod="scale"
            resizeMode="contain"
          />
        )}
        <View style={styles.questionLeft}>
          <Text style={styles.question}>{title}</Text>
        </View>
        <View>{this.renderChoices(question)}</View>
      </View>
    );
  };

  renderChoices = question => {
    switch (question.rn_input_type) {
      case 'check_box_multiple': {
        return (
          <RenderCheckBox
            choices={question.choices}
            format="multiple"
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'check_box_single': {
        return (
          <RenderCheckBox
            choices={question.choices}
            format="single"
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'check_box_yes_no': {
        return (
          <RenderCheckYesNo
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'date_time_date': {
        return (
          <RenderDate
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'text_short': {
        return (
          <RenderTextShort
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'text_long': {
        return (
          <RenderTextLong
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'number': {
        return (
          <RenderTextNumeric
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
          />
        );
      }
      case 'file_audio':
      case 'file_image':
      case 'file_video': {
        return (
          <RenderFile
            question={question}
            choices={question.choices}
            answers={this.state.answers}
            attachments={this.state.attachments}
            saveResponse={this.saveResponse}
            errorMessage={this.state.errorMessage}
          />
        );
      }
      case 'external_link': {
        return (
          <RenderExternalLink
            question={question}
            choices={question.choices}
            answers={this.state.answers}
            saveResponse={this.saveResponse}
            errorMessage={this.state.errorMessage}
          />
        );
      }
    }
  };

  saveResponse = (choice, response, options = {}) => {
    let answer = {};
    const answers = [...this.state.answers];
    const attachments = [...this.state.attachments];
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

    const index = _.findIndex(answers, { choice_id: choice.id });

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

    if (response.attachments) {
      const attachmentDir =
        FileSystem.documentDirectory + CONSTANTS.ATTACHMENTS_DIRECTORY;
      answer.attachments = [];
      _.map(response.attachments, async att => {
        const attachment = {};
        if (response.id) {
          attachment.answer_id = response.id;
        }

        attachment.filename = att.uri.substring(
          att.uri.lastIndexOf('/') + 1,
          att.uri.length,
        );

        attachment.uri = attachmentDir + '/' + attachment.filename;

        const fileType = att.uri.substring(
          att.uri.lastIndexOf('.') + 1,
          att.uri.length,
        );

        switch (att.file_type) {
          case 'file_image':
            attachment.content_type = ImageFormats[fileType];
            break;
          case 'file_video':
            attachment.content_type = VideoFormats[fileType];
            break;
          case 'file_audio':
            attachment.content_type = AudioFormats[fileType];
            break;
          default:
            attachment.content_type = '';
        }

        await FileSystem.deleteAsync(attachment.uri, { idempotent: true });
        await FileSystem.copyAsync({ from: att.uri, to: attachment.uri });

        const resultFile = await FileSystem.getInfoAsync(attachment.uri);
        if (!resultFile.exists) {
          console.log('Error: attachment not saved: ', choice.id, attachment.filename);
          this.setState({errorMessage: 'Error: Attachment Not Saved'});
        }

        answer.answer_boolean = true;

        _.assign(attachment, {
          title: att.title,
          section_id: this.state.section.id,
          choice_id: choice.id,
          width: att.width,
          height: att.height,
        });

        _.remove(attachments, ['choice_id', choice.id]);
        attachments.push(attachment);
        this.setState({ attachments });
        answer.attachments.push(attachment);
      });
    } // response.attachments
    answers.push(answer);
    this.setState({ answers });
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

    // save attachments
    if (_.find(answers, a => {return !!a.attachments })) {
      _.map(answers, answer => {
        _.map(answer.attachments, attachment => {
          if (attachment.content_type.includes('video') || attachment.content_type.includes('image')) {
            this.props.createBabyBookEntry({title: null, detail: null}, attachment);
          }
          delete attachment.title;
          this.props.updateMilestoneAttachment(attachment);
          this.props.fetchOverViewTimeline();
        });
        // cannot bulk update answers with attachments
        if (inStudy) {
          this.props.apiCreateMilestoneAnswer(session, answer);
        }
      });
    } else if (inStudy) {
      this.props.apiUpdateMilestoneAnswers(session, section.id, answers);
    }
    // mark calendar entry as complete on api
    if (inStudy) {
      const calendar = _.find(this.props.milestones.calendar.data, ['task_id', section.task_id]);
      if (calendar && calendar.id) {
        const date = new Date().toISOString();
        this.props.apiUpdateMilestoneCalendar(calendar.id, {milestone_trigger: {completed_at: date}});
      }
    }
    this.props.fetchMilestoneCalendar();
    this.props.navigation.navigate('MilestoneQuestionConfirm');
  };

  render() {
    const milestones = this.props.milestones;
    const data = _.map(milestones.questions.data, question => {
      return _.extend({}, question, {
        choices: _.filter(milestones.choices.data, ['question_id', question.id]),
      });
    });

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableResetScrollToCoords={false}
        enableAutomaticScroll
        enableOnAndroid
        extraScrollHeight={50}
        innerRef={ref => {this.scroll = ref}}
      >
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
            <Button
              color={Colors.pink}
              buttonStyle={styles.buttonTwoStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => this.handleConfirm()}
              title="Confirm"
              disabled={this.state.confirmed}
            />
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
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTitleStyle: {
    fontWeight: '900',
  },
  buttonOneStyle: {
    flex: 1,
    width: twoButtonWidth,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    flex: 1,
    width: twoButtonWidth,
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
  createBabyBookEntry,
  fetchOverViewTimeline,
  updateMilestoneCalendar,
  apiUpdateMilestoneCalendar,
  fetchMilestoneCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestoneQuestionsScreen);
