import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default class TabBarIcon extends Component {
  render() {
    const name = this.props.name;
    return (
      <Ionicons
        name={name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}