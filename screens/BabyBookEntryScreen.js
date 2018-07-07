import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { connect} from 'react-redux';
import { resetBabyBookEntries } from '../actions/babybook_actions';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Colors from '../constants/Colors';
import '@expo/vector-icons';

import BabyBookEntryForm from '../components/babybook_entry_form';

class BabyBookEntryScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'BabyBook',
      headerRight: (
        <View style={styles.headerButtonContainer}>
          <Button
            icon={{name: 'timeline', size: 22, color: 'white'}}
            onPress={ () => navigation.navigate('BabyBookTimeline') }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
          <Button
            icon={{name: 'photo-album', size: 22, color: 'white'}}
            onPress={ () => navigation.navigate('BabyBook') }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
        </View>
      )
    })
  }
  
  componentWillMount() {
    this.props.resetBabyBookEntries()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (!this.props.babybook.entries.fetching) 
  }

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} >
        <View style={ styles.container }>
          <BabyBookEntryForm navigation={this.props.navigation} />
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
  headerButtonContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 0,
    margin: -5,
  }
});

const mapStateToProps = ({ babybook }) => ({ babybook });
const mapDispatchToProps = { resetBabyBookEntries };

export default connect( mapStateToProps,  mapDispatchToProps )( BabyBookEntryScreen );