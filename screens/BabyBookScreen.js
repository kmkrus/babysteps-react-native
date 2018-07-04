import React, { Component } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text } from 'react-native-elements';

import { connect} from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Colors from '../constants/Colors';
import '@expo/vector-icons';

import BabyBookEntryForm from '../components/babybook_entry_form';
import BabyBookEntries from '../components/babybook_entries';


class BabyBookScreen extends Component {
  static navigationOptions = {
    title: 'BabyBook',
  };

  render() {

    // <BabyBookEntryForm />

    return (
      <KeyboardAwareScrollView enableOnAndroid={true} >
        <View style={ styles.container }>
          <BabyBookEntries />
        </View>
      </KeyboardAwareScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
});

const mapStateToProps = ({ babybook }) => ({ babybook });

export default connect( mapStateToProps )( BabyBookScreen );