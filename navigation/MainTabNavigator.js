import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/tab_bar_icon';
import OverviewScreen from '../screens/OverviewScreen';
import OverviewBirthFormScreen from '../screens/OverviewBirthFormScreen';
import MilestonesScreen from '../screens/MilestonesScreen';
import MilestoneQuestionsScreen from '../screens/MilestoneQuestionsScreen';
import MilestonePregnancyHistoryScreen from '../screens/MilestonePregnancyHistoryScreen';
import MilestoneQuestionConfirmScreen from '../screens/MilestoneQuestionConfirmScreen';

//import TourScreen from '../screens/TourScreen';
import BabyBookScreen from '../screens/BabyBookScreen';
import BabyBookEntryScreen from '../screens/BabyBookEntryScreen';
import SettingsScreen from '../screens/SettingsScreen';

import Colors from '../constants/Colors';

const headerOptions = {
  headerStyle: {
    backgroundColor: Colors.headerBackground,
  },
  headerTintColor: Colors.headerTint,
  headerTitleStyle: {
    fontWeight: '400',
    fontSize: 20,
  },
};

const MilestonesStack = createStackNavigator(
  {
    Milestones: MilestonesScreen,
    MilestoneQuestions: MilestoneQuestionsScreen,
    MilestonePregnancyHistory: MilestonePregnancyHistoryScreen,
    MilestoneQuestionConfirm: MilestoneQuestionConfirmScreen,
    OverviewBirthForm: OverviewBirthFormScreen,
  },
  {
    navigationOptions: headerOptions,
  },
);

MilestonesStack.navigationOptions = {
  tabBarLabel: 'Milestones',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-list${focused ? '' : '-outline'}`
          : 'md-list'
      }
    />
  ),
};

const OverviewStack = createStackNavigator(
  {
    Overview: OverviewScreen,
    OverviewBirthForm: OverviewBirthFormScreen,
    MilestonesStack: MilestonesScreen,
    //MilestoneQuestions: MilestoneQuestionsScreen,
    // MilestoneQuestionConfirm: MilestoneQuestionConfirmScreen,
  },
  {
    navigationOptions: headerOptions,
  },
);

OverviewStack.navigationOptions = {
  tabBarLabel: 'Overview',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}` 
          : 'md-information-circle'
      }
    />
  ),
};

const BabyBookStack = createStackNavigator(
  {
    BabyBook: BabyBookScreen,
    BabyBookEntry: BabyBookEntryScreen,
  },
  {
    navigationOptions: headerOptions,
  },
);

BabyBookStack.navigationOptions = {
  tabBarLabel: 'BabyBook',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-book${focused ? '' : '-outline'}` 
          : 'md-book'
      }
    />
  ),
};

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  }, {
    navigationOptions: headerOptions,
  },
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  Overview: OverviewStack,
  Milestones: MilestonesStack,
  BabyBook: BabyBookStack,
  Settings: SettingsStack,
});
