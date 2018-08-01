import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { AppLoading, Asset, Font } from 'expo';
import Sentry from 'sentry-expo';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import RootNavigation from './navigation/RootNavigation';
import checkMilestonesSchema from './database/check_milestones_schema';
import checkMilestoneTriggersSchema from './database/check_milestone_triggers_schema';
import checkRegistrationSchema from './database/check_registration_schema';
import checkBabyBookSchema from './database/check_babybook_schema';
import checkCustomDirectories from './components/check_custom_directories';

import store from './store';

import CONSTANTS from './constants';
import Colors from './constants/Colors';

Sentry.config(CONSTANTS.SENTRY_URL).install();

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
        require('./assets/images/baby_book_cover_background.png'),
        require('./assets/images/baby_book_inside_background.png'),
        require('./assets/images/baby_book_picture_frame_bottom_left.png'),
        require('./assets/images/baby_book_picture_frame_bottom_right.png'),
        require('./assets/images/baby_book_picture_frame_top_left.png'),
        require('./assets/images/baby_book_picture_frame_top_right.png'),
        require('./assets/images/background.png'),
        require('./assets/images/tour_no_study_confirm.png'),
        require('./assets/images/tour_slide_four_baby.png'),
        require('./assets/images/tour_slide_four_brain.png'),
        require('./assets/images/tour_slide_four_face.png'),
        require('./assets/images/tour_slide_four_video.png'),
        require('./assets/images/tour_slide_one.png'),
        require('./assets/images/tour_slide_three.png'),
        require('./assets/images/tour_slide_two.png'),
        require('./assets/images/uofi_logo.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
        'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
        'FontAwesome':  require('./assets/fonts/FontAwesome.ttf'),
      }),
      // async check of schemas
      checkRegistrationSchema(),
      checkMilestonesSchema(),
      checkMilestoneTriggersSchema(),
      checkBabyBookSchema(),
      checkCustomDirectories(),
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
