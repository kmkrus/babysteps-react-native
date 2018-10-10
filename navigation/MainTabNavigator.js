import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/tab_bar_icon';
import OverviewScreen from '../screens/OverviewScreen';
import MilestonesScreen from '../screens/MilestonesScreen';
import MilestoneQuestionsScreen from '../screens/MilestoneQuestionsScreen';
import MilestoneQuestionConfirmScreen from '../screens/MilestoneQuestionConfirmScreen';
import TourScreen from '../screens/TourScreen';
import BabyBookScreen from '../screens/BabyBookScreen';
import BabyBookEntryScreen from '../screens/BabyBookEntryScreen';

import Colors from '../constants/Colors';

const headerOptions = {
  headerStyle: {
    backgroundColor: Colors.headerBackground,
  },
  headerTintColor: Colors.headerTint,
  headerTitleStyle: {
    fontWeight: '900',
  },
};

const OverviewStack = createStackNavigator({
  Overview: OverviewScreen,
});

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

const MilestonesStack = createStackNavigator(
  {
    Milestones: MilestonesScreen,
    MilestoneQuestions: MilestoneQuestionsScreen,
    MilestoneQuestionConfirm: MilestoneQuestionConfirmScreen,
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

export default createBottomTabNavigator({
  Overview: OverviewStack,
  Milestones: MilestonesStack,
  BabyBook: BabyBookStack,
});
