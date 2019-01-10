import React, { PureComponent } from 'react';

import {
  RenderCheckBox,
  RenderCheckYesNo,
  RenderTextShort,
  RenderTextLong,
  RenderTextNumeric,
  RenderDate,
  RenderFile,
  RenderExternalLink,
} from './milestone_question_elements';

export class RenderChoices extends PureComponent {

  render() {
    const question = this.props.question;
    const answers = this.props.answers;
    const attachments = this.props.attachments;
    const errorMessage = this.props.errorMessage;
    const saveResponse = this.props.saveResponse;

    switch (question.rn_input_type) {
      case 'check_box_multiple': {
        return (
          <RenderCheckBox
            choices={question.choices}
            format="multiple"
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'check_box_single': {
        return (
          <RenderCheckBox
            choices={question.choices}
            format="single"
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'check_box_yes_no': {
        return (
          <RenderCheckYesNo
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'date_time_date': {
        return (
          <RenderDate
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'text_short': {
        return (
          <RenderTextShort
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'text_long': {
        return (
          <RenderTextLong
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
          />
        );
      }
      case 'number': {
        return (
          <RenderTextNumeric
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
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
            answers={answers}
            attachments={attachments}
            saveResponse={saveResponse}
            errorMessage={errorMessage}
          />
        );
      }
      case 'external_link': {
        return (
          <RenderExternalLink
            question={question}
            choices={question.choices}
            answers={answers}
            saveResponse={saveResponse}
            errorMessage={errorMessage}
          />
        );
      }
    }
  }
};

