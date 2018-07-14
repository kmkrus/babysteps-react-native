import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import MilestonesScreen from '../screens/MilestonesScreen';
import TourScreen from '../screens/TourScreen';
import BabyBookScreen from '../screens/BabyBookScreen';

export default TabNavigator(
  {
    Overview: {
      screen: HomeScreen,
    },
    Milestones: {
      screen: MilestonesScreen,
    },
    BabyBook: {
      screen: BabyBookScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Overview':
            iconName = Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-ionic';
            break;
          case 'BabyBook':
            iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-book';
            break;
          case 'Milestones':
            iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-list';
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3, width: 25 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
