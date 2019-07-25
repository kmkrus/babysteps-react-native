import React, { Component } from 'react';
import { Text, View, Button, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import { resetSession, apiFetchSignin } from '../actions/session_actions';

import States from '../actions/states';
import Colors from '../constants/Colors';
import AppStyles from '../constants/Styles';

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  };

  state = {
    email: '',
    password: '',
    isSubmitting: false,
    errorMessages: [],
  };

  componentWillMount() {
    this.props.resetSession();
  }

  componentWillReceiveProps(nextProps) {
    const session = nextProps.session;
    if (!session.fetching) {
      if (session.fetched) {
        console.log('fetched');
      }
      if (session.errorMessages) {
        this.setState({ isSubmitting: false, errorMessages: session.errorMessages });
      }
    }
  }

  handlePress = () => {
    const { email, password } = this.state;
    this.setState({ isSubmitting: true, errorMessages: [] });
    this.props.apiFetchSignin(email, password);
  };

  render() {
    const { email, password, errorMessages } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Sign In</Text>
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          placeholder="email"
          placeholderTextColor={Colors.grey}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={password => this.setState({ password })}
          placeholder="password"
          secureTextEntry
          placeholderTextColor={Colors.grey}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="SIGN IN"
            onPress={this.handlePress}
            buttonStyle={styles.button}
            titleStyle={{ fontWeight: 900 }}
            color={Colors.darkGreen}
            disabled={this.state.isSubmitting}
          />
        </View>
        <View styles={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessages.join('\r\n')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: 200,
    height: 40,
    marginBottom: 40,
    marginTop: 20,
  },
  button: {
    width: 200,
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green,
    borderWidth: 2,
    borderRadius: 5,
  },
  input: {
    width: 200,
    fontSize: 18,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorContainer: {
    justifyContent: 'center',
  },
  errorMessage: {
    color: Colors.red,
  },
});

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { resetSession, apiFetchSignin };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
