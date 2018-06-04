import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { AppLoading, Asset, Font } from 'expo';
import Sentry from 'sentry-expo';

import { Ionicons } from '@expo/vector-icons';
import Colors from './constants/Colors';
import RootNavigation from './navigation/RootNavigation';
import checkMilestonesSchema from './database/check_milestones_schema';
import checkRegistrationSchema from './database/check_registration_schema';
import store from './store';

Sentry.config('https://193d4a8c3e6b4b3d974a3f4d1d6f598c@sentry.io/1204085').install();

export default class App extends Component {

  state = {
    isLoadingComplete: false,
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );

    } else {
      
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'android' && <StatusBar barStyle="default" />}
            <RootNavigation />
          </View>
        </Provider>
      )

    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
      }),
      // async check of schemas
      checkRegistrationSchema(),
      checkMilestonesSchema(),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
