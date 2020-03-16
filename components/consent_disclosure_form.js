import React, { Component } from 'react';

import { connect } from 'react-redux';

import ConsentDisclosureContent from './consent_disclosure_content';

import IRBInformation from '../constants/IRB';

class ConsentDisclosureForm extends Component {

  render() {
    const tos_id = Object.keys(IRBInformation)[0];
    return (
      <ConsentDisclosureContent
        formState="edit"
        tosID={tos_id}
      />
    );
  }
}

const mapStateToProps = ({ session }) => ({ session });

export default connect(mapStateToProps)(ConsentDisclosureForm);
