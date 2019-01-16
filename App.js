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
import checkNotificationsSchema from './database/check_notifications_schema';
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
      require('./assets/images/camera_accept_media_icon.png'),
      require('./assets/images/camera_belly_position.png'),
      require('./assets/images/camera_cancel_camera_icon.png'),
      require('./assets/images/camera_delete_media_save_video.png'),
      require('./assets/images/camera_face_position.png'),
      require('./assets/images/camera_flip_direction_icon.png'),
      require('./assets/images/camera_toggle_flash_icon.png'),
      require('./assets/images/camera_toggle_flash_icon_active.png'),
      require('./assets/images/milestones_checkbox.png'),
      require('./assets/images/milestones_checkbox_complete.png'),
      require('./assets/images/milestones_checkbox_in_progress.png'),
      require('./assets/images/milestones_checkbox_skipped.png'),
      require('./assets/images/milestones_right_arrow.png'),
      require('./assets/images/overview_camera.png'),
      require('./assets/images/overview_baby_icon.png'),
      require('./assets/images/timeline.png'),
      require('./assets/images/tour_no_study_confirm.png'),
      require('./assets/images/tour_slide_four_baby.png'),
      require('./assets/images/tour_slide_four_brain.png'),
      require('./assets/images/tour_slide_four_face.png'),
      require('./assets/images/tour_slide_four_video.png'),
      require('./assets/images/tour_slide_one.png'),
      require('./assets/images/tour_slide_three.png'),
      require('./assets/images/tour_slide_two.png'),
      require('./assets/images/uofi_logo.png'),
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

    //Fix on iOS for missing font error
    //https://github.com/react-native-training/react-native-elements/issues/1005#issuecomment-405408180
    await Font.loadAsync("Material Icons", require("@expo/vector-icons/fonts/MaterialIcons.ttf"));

    // async check of schemas
    await checkRegistrationSchema();
    await checkMilestonesSchema();
    await checkMilestoneTriggersSchema();
    await checkAnswersSchema();
    await checkNotificationsSchema();
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
          onLayout={() => console.log('*** layout changed')}
        >
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
