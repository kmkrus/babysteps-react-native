import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Text, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { StackActions } from 'react-navigation';

import _ from 'lodash';

import { isIphoneX } from 'react-native-iphone-x-helper';

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
  createBabyBookEntry,
  fetchBabyBookEntries,
} from '../actions/babybook_actions';
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

const itemWidth = width - 30;
const twoButtonWidth = (width / 2) - 30;

class MilestoneQuestionsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const section = navigation.getParam('section', {title: ''});
    return { title: 'Screening Event' };
  };

  // Note that this component stores the active answers and questions in the state of
  // this component during the process of responding to the task.  Both are updated
  // and the local database (and remote api) are updated when the user confirms the answers.
  // That means any image or video attachments are kept in both the state of the answers
  // and a full list of attachments.

  constructor(props) {
    super(props);
    this.state = {
      task_id: null,
      task_name: '',
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
    // update the list of questions and choices on change of task.
    if (task.id !== this.state.task_id) {
      this.props.resetMilestoneQuestions();
      this.props.resetMilestoneChoices();
      this.props.resetMilestoneAnswers();
      this.props.fetchMilestoneSections({ task_id: task.id });
      this.setState({
        task_id: task.id,
        task_name: task.name,
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
      this.setState({
        attachments: this.props.milestones.attachments.data,
        attachmentsFetched: true,
      });
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
    const { answers, attachments, errorMessage } = this.state;
    return (
      <View key={question.id} style={styles.questionContainer}>
        {question.attachment_url &&
          this.renderAttachment(question.attachment_url)}
        <View style={styles.questionLeft}>
          <Text style={styles.question}>{title}</Text>
          {!!question.body && (
            <Text style={styles.questionBody}>{question.body}</Text>
          )}
        </View>
        <RenderChoices
          question={question}
          answers={answers}
          attachments={attachments}
          navigation={this.props.navigation}
          saveResponse={this.saveResponse}
          errorMessage={errorMessage}
        />
      </View>
    );
  };

  saveResponse = async (choice, response, options = {}) => {
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
        pregnancy: 0,
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
      answer.answer_boolean = true;
      answer.attachments = await this.mapAttachmentsAsync(choice, response);
    } // response.attachments

    answers.push(answer);
    this.updateAnswersState(answers);
  };

  updateAnswersState = answers => {
    console.log('Answers', answers);
    this.setState({ answers });
  };

  mapAttachmentsAsync = async (choice, response) => {
    const new_attachments = [...this.state.attachments];
    _.remove(new_attachments, ['choice_id', choice.id]);
    const attachmentDir = FileSystem.documentDirectory + CONSTANTS.ATTACHMENTS_DIRECTORY;
    await _.map(response.attachments, async att => {
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

      _.assign(attachment, {
        title: att.title,
        section_id: this.state.section.id,
        choice_id: choice.id,
        width: att.width,
        height: att.height,
      });
      new_attachments.push(attachment);
      this.updateAttachmentState(new_attachments);
    }); // map attachments
    return new_attachments;
  };

  updateAttachmentState = attachments => {
    console.log('Attachments', attachments);
    this.setState({ attachments });
  };

  handleConfirm = () => {
    const { section, answers } = this.state;
    const session = this.props.session;
    const questions = this.props.milestones.questions.data;
    const choices = this.props.milestones.choices.data;
    const inStudy = session.registration_state === States.REGISTERED_AS_IN_STUDY;

    // TODO validation
    // TODO move to next section if more than one section in this task
    // TOTO don't mark task complete if any sections are incomplete

    this.setState({ confirmed: true });

    this.props.updateMilestoneAnswers(section, answers);
    const completed_at = new Date().toISOString();
    this.props.updateMilestoneCalendar(section.task_id, { completed_at });

    // save attachments
    if (_.find(answers, a => {return !!a.attachments })) {
      _.map(answers, answer => {
        const choice = _.find(choices, ['id', answer.choice_id]);

        // cover of babybook will only be baby's face from overview timeline
        let cover = 0;
        if (choice && choice.overview_timeline === 'post_birth') {
          cover = true;
        }

        _.map(answer.attachments, attachment => {
          if (
            attachment.content_type &&
            (attachment.content_type.includes('video') ||
              attachment.content_type.includes('image'))
          ) {
            const data = {title: null, detail: null, cover};
            this.props.createBabyBookEntry(data, attachment);
            this.props.apiCreateBabyBookEntry(session, data, attachment);
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

    let message = '';

    const unansweredQuestions = _.filter(questions, question => {
      return _.find(answers, { question_id: question.id }) === undefined;
    });
    this.props.updateMilestoneCalendar(section.task_id, {
      questions_remaining: unansweredQuestions.length,
    });

    if (unansweredQuestions.length > 0) {
      message = 'Please note that not all questions were completed.';
    }
    // add condolences message to confirmation screen
    if (section.task_id === CONSTANTS.TASK_BIRTH_QUESTIONAIRE_ID) {
      const answer = _.find(answers, ['choice_id', CONSTANTS.CHOICE_BABY_ALIVE_ID]);
      if (answer && answer.answer_boolean) {
        message =
          "We're so sorry to hear of your loss. We appreciate the contribution you have made to BabySteps.";
      }
    }

    this.props.fetchMilestoneCalendar();
    this.props.fetchBabyBookEntries();

    this.props.navigation.navigate('MilestoneQuestionConfirm', {message});
  };

  renderImageAttachement = url => {
    return (
      <Image
        style={styles.image}
        source={{ url }}
        resizeMethod="scale"
        resizeMode="contain"
      />
    );
  };

  renderVideoAttachment = uri => {
    return (
      <Video
        source={{ uri }}
        resizeMode={Video.RESIZE_MODE_COVER}
        shouldPlay={false}
        isLooping={false}
        useNativeControls
        ref={ref => (this.videoPlayer = ref)}
        style={styles.video}
      />
    );
  };

  renderAttachment = attachment_url => {
    const fileExtension = attachment_url.split('.').pop();
    if (_.has(VideoFormats, fileExtension)) {
      return this.renderVideoAttachment(attachment_url);
    }
    return this.renderImageAttachement(attachment_url);
  };

  render() {
    const milestones = this.props.milestones;
    const section = this.state.section;
    const data = _.map(milestones.questions.data, question => {
      return _.extend({}, question, {
        choices: _.filter(milestones.choices.data, ['question_id', question.id]),
      });
    });
    return (
      <View style={{ height }}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          enableResetScrollToCoords={false}
          enableAutomaticScroll
          enableOnAndroid
          extraScrollHeight={50}
          innerRef={ref => {this.scroll = ref}}
        >
          <View style={styles.listContainer}>
            <Text style={styles.taskHeader}>{this.state.task_name}</Text>
            {!!section && !!section.body && (
              <View style={styles.instructions}>
                <Text style={styles.instructionsLabel}>Instructions: &nbsp;</Text>
                <Text>{section.body}</Text>
              </View>
            )}
            <FlatList
              renderItem={this.renderItem}
              data={data}
              keyExtractor={item => String(item.id)}
              extraData={this.state}
            />
          </View>
        </KeyboardAwareScrollView>

        {this.state.questionsFetched && (
          <View
            style={[
              styles.buttonContainer,
              Platform.OS === 'android'
                ? styles.buttonContainerAndroid
                : styles.buttonContainerIOS,
            ]}
          >
            <Button
              color={Colors.grey}
              buttonStyle={styles.buttonOneStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 300,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  taskHeader: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    color: Colors.white,
    width,
    backgroundColor: Colors.mediumGrey,
    textAlign: 'center',
  },
  instructions: {
    flex: 1,
    fontSize: 14,
    margin: 10,
  },
  instructionsLabel: {
    fontWeight: 'bold',
  },
  questionContainer: {
    flexDirection: 'column',
    padding: 5,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  questionLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: itemWidth,
  },
  question: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 5,
    color: Colors.tint,
    width: itemWidth,
  },
  questionBody: {
    fontSize: 12,
    paddingVertical: 2,
    paddingLeft: 20,
    color: Colors.tint,
  },
  image: {
    flex: 1,
    width: itemWidth,
    height: itemWidth * 0.66,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 10,
    marginBottom: 10,
  },
  video: {
    flex: 1,
    width: itemWidth,
    height: itemWidth * 0.66,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    backgroundColor: Colors.background,
    position: 'absolute',
  },
  buttonContainerAndroid: {
    bottom: 126,
  },
  buttonContainerIOS: {
    bottom: isIphoneX() ? 172 : 110,
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
  fetchBabyBookEntries,
  fetchOverViewTimeline,
  updateMilestoneCalendar,
  apiUpdateMilestoneCalendar,
  fetchMilestoneCalendar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilestoneQuestionsScreen);
