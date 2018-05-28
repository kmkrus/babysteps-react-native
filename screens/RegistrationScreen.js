import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';

import { connect} from 'react-redux';
import { createUser, fetchUser, apiCreateUser } from '../actions/registration_actions';

import RegistrationForm from '../components/registration_form';

class RegistrationScreen extends Component {

  static navigationOptions = {
    title: 'Registration',
  };

  render() {
    return (
      <View style={ styles.container }>
        <RegistrationForm 
          registration={this.props.registration}
          apiCreateUser={this.props.apiCreateUser}
          createUser={this.props.createUser}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  }
});

const mapStateToProps = ({ registration }) => ({ registration });
const mapDispatchToProps = { createUser, fetchUser, apiCreateUser };

export default connect( mapStateToProps, mapDispatchToProps )(RegistrationScreen);