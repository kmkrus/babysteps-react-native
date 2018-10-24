import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { AppLoading, Asset, Font } from 'expo';
import FlashMessage from 'react-native-flash-message';
import Sentry from 'sentry-expo';

import { Ionicons } from '@expo/vector-icons';

import RootNavigator from './navigation/RootNavigator';

import checkMilestonesSchema from './database/check_milestones_schema';
import checkMilestoneTriggersSchema from './database/check_milestone_triggers_schema';
import checkRegistrationSchema from './database/check_registration_schema';
import checkAnswersSchema from './database/check_answers_schema';
import checkBabyBookSchema from './database/check_babybook_schema';
import checkCustomDirectories from './components/check_custom_directories';

import MomentaryAssessment from './components/momentary_assessment_modal';

import store from './store';

import CONSTANTS from './constants';
import Colors from './constants/Colors';

Sentry.config(CONSTANTS.SENTRY_URL).install();

export default class App extends Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    await Asset.loadAsync([
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
      require('./assets/images/timeline.png'),
    ]);
    await Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      MaterialIcons: require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
      FontAwesome: require('./assets/fonts/FontAwesome.ttf'),
    });
    // async check of schemas
    await checkRegistrationSchema();
    await checkMilestonesSchema();
    await checkMilestoneTriggersSchema();
    await checkAnswersSchema();
    await checkBabyBookSchema();
    await checkCustomDirectories();
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <View
          style={styles.container}
          onLayout={() => console.log('*** layout changed')}>
          {Platform.OS === 'android' && <StatusBar barStyle="default" />}
          <RootNavigator />
          <FlashMessage position="top" />
          <MomentaryAssessment />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
