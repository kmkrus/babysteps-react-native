import React, { Component } from 'react';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';
import { saveScreenBlood } from '../actions/registration_actions';

import ConsentDisclosureContent from './consent_disclosure_content';

import States from '../actions/states';

class ConsentDisclosureForm extends Component {
  state = {
    screeningBlood: null,
    errorMessage: '',
  };

  handleSubmit = () => {
    const screeningBlood = this.state.screeningBlood;
    const errorMessage =
      "You must select whether or not you will allow collection of your baby's bloodspot.";
    if (screeningBlood === null) {
      this.setState({ errorMessage });
    } else {
      this.props.saveScreenBlood({ screeningBlood });
      this.props.updateSession({
        registration_state: States.REGISTERING_SIGNATURE,
      });
    }
  };

  handleScreeningBlood = (screeningBlood, errorMessage) => {
    this.setState({ screeningBlood, errorMessage });
  };

  render() {
    return (
      <ConsentDisclosureContent
        formState="edit"
        handleSubmit={this.handleSubmit}
        handleScreeningBlood={this.handleScreeningBlood}
        errorMessage={this.state.errorMessage}
        screeningBlood={this.state.screeningBlood}
      />
    );
  }
}

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession, saveScreenBlood };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentDisclosureForm);
