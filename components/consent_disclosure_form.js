import React, { Component } from 'react';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';

import ConsentDisclosureContent from './consent_disclosure_content';

import States from '../actions/states';

class ConsentDisclosureForm extends Component {
  state = {
    screeningBlood: null,
    errorMessage: '',
  };

  handleSubmit = action => {
    const screening_blood = this.state.screeningBlood;
    if (screening_blood === null && action === 'agree') {
      const errorMessage =
        "You must select whether or not you will allow collection of your baby's bloodspot.";
      this.setState({ errorMessage });
      return;
    }
    const registration_state =
      action === 'agree'
        ? States.REGISTERING_SIGNATURE
        : States.REGISTERING_AS_NO_STUDY;
    this.props.updateSession({
      screening_blood,
      registration_state,
    });
  };

  handleScreeningBlood = (screeningBlood, errorMessage) => {
    this.setState({ screeningBlood, errorMessage });
  };

  render() {
    return (
      <ConsentDisclosureContent
        formState="edit"
        handleSubmit={this.handleSubmit}
        handleScreeningBlood={(screeningBlood, errorMessage) =>
          this.handleScreeningBlood(screeningBlood, errorMessage)
        }
        errorMessage={this.state.errorMessage}
        screeningBlood={this.state.screeningBlood}
      />
    );
  }
}

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentDisclosureForm);
