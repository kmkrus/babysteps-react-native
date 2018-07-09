import React, { Component } from 'react';
import { 
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Share,
  ImageBackground, 
  Dimensions,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import SideSwipe from 'react-native-sideswipe';
import PageControl from 'react-native-page-control';

import { _ } from 'lodash';

import { connect } from 'react-redux';

import { resetBabyBookEntries, fetchBabyBookEntries } from '../actions/babybook_actions';
import { fetchSubject } from '../actions/registration_actions';

import BabyBookCoverItem from '../components/babybook_cover_item';
import BabyBookItem from '../components/babybook_item';

import Colors from '../constants/Colors';
import CONSTANTS from '../constants';
import '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 // compensate for header and navbar
const contentOffset = (width - BabyBookItem.WIDTH) / 2;

class BabyBookScreen extends Component {

  state = {
    currentIndex: 0,
    shareAttributes: {content: {}, options: {}}
  };

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'BabyBook',
      headerRight: (
        <View style={styles.headerButtonContainer}>
          <Button
            icon={{name: 'share', size: 22, color: 'white'}}
            onPress={ () => navigation.state.params.Share() }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
          <Button
            icon={{name: 'timeline', size: 22, color: 'white'}}
            onPress={ () => navigation.navigate('BabyBookTimeline') }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
          <Button
            icon={{name: 'add-a-photo', size: 22, color: 'white'}}
            onPress={ () => navigation.navigate('BabyBookEntry') }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
        </View>
      )
    })
  }

  componentWillMount() {
    if ( !this.props.registration.subject.data.length ) {
      this.props.fetchSubject()
    }
    if ( !this.props.babybook.entries.data.length ) {
      this.props.fetchBabyBookEntries()
    }

    // bind function to navigation
    this.props.navigation.setParams({ Share: this.shareOpen.bind(this) })

    // set selected item from timeline
    const itemId = this.props.navigation.getParam('itemId', '0');
    if (itemId != '0') {
      const selectedIndex = _.indexOf(_.map(this.props.babybook.entries.data, 'id'), itemId)
      this.handleIndexChange(selectedIndex) 
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.registration.subject.fetching || this.props.babybook.entries.fetching ) {
      return false 
    }
    return true
  }

  shareOpen() {
    if ( this.state.shareAttributes.content ) {
      Share.share(this.state.shareAttributes.content, this.state.shareAttributes.options)
    }
  }

  handleIndexChange(index) {
    this.setState({ currentIndex: index })
  
    // for share
    const item = this.props.babybook.entries.data[index]
    const babybookDir = Expo.FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY 
    const babybookUri = babybookDir + '/' + item.file_name

    this.setState({
      shareAttributes: { 
        content: {
          title: item.title,
          message: item.detail,
          url: babybookUri // ios only
        },
        options: {
          subject: item.title, // for email
          dialogTitle: 'Share ' + item.title // Android only
        }
      }
    })

  }

  render() {

    return (
      <View style={styles.container}>
        <PageControl
          style={styles.pageControl}
          numberOfPages={this.props.babybook.entries.data.length}
          currentPage={this.state.currentIndex}
          hidesForSinglePage
          pageIndicatorTintColor={Colors.lightGrey}
          currentPageIndicatorTintColor={Colors.headerBackgroundColor}
          indicatorStyle={{borderRadius: 0}}
          currentIndicatorStyle={{borderRadius: 0}}
          indicatorSize={{width:10, height:10}}
          onPageIndicatorPress={ index => this.handleIndexChange(index) }
        />
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>

          <SideSwipe
            data={this.props.babybook.entries.data}
            index={this.state.currentIndex}
            shouldCapture={() => true}
            style={[styles.carouselFill,  { width } ]}
            itemWidth={BabyBookItem.WIDTH}
            threshold={BabyBookItem.WIDTH / 2}
            contentOffset={contentOffset}
            extractKey={ item => item.id }
            onIndexChange={ (index) => this.handleIndexChange(index) }
            renderItem={ ({ itemIndex, currentIndex, item, animatedValue }) => (
              (currentIndex === 0) ?
                <BabyBookCoverItem 
                  item={item}
                  navigation={this.props.navigation}
                />
              :
                <BabyBookItem 
                  item={item}
                  navigation={this.props.navigation}
                />
            )}
          />

        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    flexGrow: 1,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: height - heightOffset,
    backgroundColor: Colors.background,
  },
 carouselFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pageControl: {
    height: 20,
    marginTop: 12,
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

const mapStateToProps = ({ babybook, registration }) => ({ babybook, registration });
const mapDispatchToProps = { resetBabyBookEntries, fetchBabyBookEntries, fetchSubject };

export default connect( mapStateToProps, mapDispatchToProps )( BabyBookScreen );