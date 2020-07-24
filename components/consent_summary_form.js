import React, { Component } from 'react';

import { connect } from 'react-redux';

import ConsentSummaryContent from './consent_summary_content';

import IRBInformation from '../constants/IRB';

class ConsentSummaryForm extends Component {

  render() {
    const tos_id = Object.keys(IRBInformation)[0];
    return (
      <ConsentSummaryContent
        formState="edit"
        tosID={tos_id}
      />
    );
  }
}

const mapStateToProps = ({ session }) => ({ session });

export default connect(mapStateToProps)(ConsentSummaryForm);