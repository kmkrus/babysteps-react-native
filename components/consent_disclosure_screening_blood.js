import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { connect } from 'react-redux';

// eslint-disable-next-line react/prefer-stateless-function
class ConsentDisclosureScreeningBlood extends Component {
  render() {
    const {
      screening_blood,
      screening_blood_other,
      formState,
    } = this.props;

    if (formState === 'edit') {
      return (
        <View style={styles.checkboxView}>
          <Text style={styles.header}>
            Please indicate Yes or No for each of the questions below:
          </Text>

          <Text style={styles.text}>
            My child’s blood samples may be stored/shared for future gene
            research in Autism and other developmental disorders.
          </Text>

          <CheckBox
            title="Yes"
            textStyle={styles.checkboxText}
            checked={screening_blood === true}
            onPress={() => this.props.handleScreeningBlood('screening_blood', true)}
          />

          <CheckBox
            title="No"
            textStyle={styles.checkboxText}
            checked={screening_blood === false}
            onPress={() => this.props.handleScreeningBlood('screening_blood', false)}
          />

          <Text style={styles.text}>
            My child’s blood samples may be stored/shared for future research
            for any other purpose.
          </Text>

          <CheckBox
            title="Yes"
            textStyle={styles.checkboxText}
            checked={screening_blood_other === true}
            onPress={() => this.props.handleScreeningBlood('screening_blood_other', true)}
          />

          <CheckBox
            title="No"
            textStyle={styles.checkboxText}
            checked={screening_blood_other === false}
            onPress={() => this.props.handleScreeningBlood('screening_blood_other', false)}
          />
        </View>
      );
    }

    const subject_screening_blood = this.props.registration.subject.data.screening_blood;
    const subject_screening_blood_other = this.props.registration.subject.data.screening_blood_other;
    return (
      <View>
        {subject_screening_blood && (
          <Text style={styles.header}>
            You have agreed that your child’s blood samples may be stored/shared
            for future gene research in Autism and other developmental disorders.
          </Text>
        )}
        {!subject_screening_blood && (
          <Text style={styles.header}>
            You have not agreed that your child’s blood samples may be
            stored/shared for future gene research in Autism and other
            developmental disorders.
          </Text>
        )}
        {subject_screening_blood_other && (
          <Text style={styles.header}>
            You have agreed that your child’s blood samples may be stored/shared
            for future research for any other purpose.
          </Text>
        )}
        {!subject_screening_blood_other && (
          <Text style={styles.header}>
            You have not agreed that your child’s blood samples may be
            stored/shared for future research for any other purpose.
          </Text>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    //textAlign: 'center',
    fontSize: 12,
    padding: 5,
  },
  checkboxView: {
    marginBottom: 0,
  },
  checkboxText: {
    fontSize: 11,
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});

export default connect(mapStateToProps)(ConsentDisclosureScreeningBlood);