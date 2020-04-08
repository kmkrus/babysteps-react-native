import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  resetBabyBookEntries,
  fetchBabyBookEntries,
} from '../actions/babybook_actions';
import { fetchUser } from '../actions/registration_actions';

import Colors from '../constants/Colors';

import BabyBookEntryForm from '../components/babybook_entry_form';

class BabyBookEntryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'BabyBook',
    headerRight: (
      <View style={styles.headerButtonContainer}>
        {false && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => () => navigation.navigate('BabyBookTimeline')}
          >
            <Ionicons name="timeline" size={26} color={Colors.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('BabyBook')}
        >
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-albums' : 'md-albums'}
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
    };

    this.props.resetBabyBookEntries();
    this.props.fetchUser();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.babybook.entry.fetching;
  }

  componentDidUpdate(prevProps, prevState) {
    const entry = this.props.babybook.entry;
    const submitted = this.state.submitted;
    if (!submitted && !entry.fetching && entry.fetched) {
      this.setState({ submitted: true });
      this.props.fetchBabyBookEntries();
      this.props.navigation.navigate('BabyBook', { babybookEntries: true });
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.container}>
          <BabyBookEntryForm />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  headerButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  headerButton: {
    paddingLeft: 20,
  },
});

const mapStateToProps = ({ babybook }) => ({ babybook });
const mapDispatchToProps = {
  resetBabyBookEntries,
  fetchBabyBookEntries,
  fetchUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BabyBookEntryScreen);
