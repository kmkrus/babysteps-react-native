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
import { Button, Icon } from 'react-native-elements';
import SideSwipe from 'react-native-sideswipe';
import PageControl from 'react-native-page-control';

import { _ } from 'lodash';

import { connect } from 'react-redux';

import { resetBabyBookEntries, fetchBabyBookEntries } from '../actions/babybook_actions';
import { fetchSubject } from '../actions/registration_actions';

import BabyBookCoverItem from '../components/babybook_cover_item';
import BabyBookItem from '../components/babybook_item';
import BabyBookGetImage from '../components/babybook_get_image';

import Colors from '../constants/Colors';
import CONSTANTS from '../constants';
import '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const heightOffset = 180 // compensate for header and navbar
const contentOffset = (width - BabyBookItem.WIDTH) / 2;
const widthOffset = 40
const imageWidth = BabyBookGetImage.IMAGE_WIDTH

const babybookDir = Expo.FileSystem.documentDirectory + CONSTANTS.BABYBOOK_DIRECTORY + '/'

class BabyBookScreen extends Component {

  state = {
    currentIndex: 0,
    data: [{
      id: '0', 
      file_name: null,
      file_uri:  require('../assets/images/baby_book_timeline_incomplete_baby_profile_placeholder.png'),
      type: 'cover', 
      imageHeight: imageWidth
    }],
    shareAttributes: {
      content: {
        title: '',
        message: 'none',
        url: '' // ios only
      },
      options: {
        subject: 'Nothing to Share', // for email
        dialogTitle: 'Nothing to Share ' // Android only
      }
    }
  };

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'BabyBook',
      headerRight: (
        <View style={styles.headerButtonContainer}>

          <Button
            icon={
              {name:  (Platform.OS === 'android') ? 'md-share' : 'ios-share', type: 'ionicon', color: Colors.white, size:22 }
            }
            onPress={ () => navigation.state.params.Share() }
            backgroundColor={Colors.headerBackgroundColor}
            buttonStyle={styles.headerButton}
          />
          { false &&
            <Button
              icon={{name: 'timeline', size: 22, color: 'white'}}
              onPress={ () => navigation.navigate('BabyBookTimeline') }
              backgroundColor={Colors.headerBackgroundColor}
              buttonStyle={styles.headerButton}
            />
          }
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
    if (_.isEmpty(this.props.registration.subject.data) ) {
      this.props.fetchSubject()
    }
    if (_.isEmpty(this.props.babybook.entries.data) ) {
      this.props.fetchBabyBookEntries()
    }

    // bind function to navigation
    this.props.navigation.setParams({ Share: this.shareOpen.bind(this) })

    // set selected item from timeline
    const itemId = this.props.navigation.getParam('itemId', '0');
    if (itemId != '0') {
      
      const selectedIndex = _.indexOf(
        _.map(this.state.data, 'id'), 
        String( parseInt(itemId, 10) + 1 ) // increment by 1 to account for cover
      ) 

      this.setState({ currentIndex: selectedIndex })
     
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ( !nextProps.registration.subject.fetching && !nextProps.babybook.entries.fetching ) 
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.babybook.entries.fetching ) {
      this.restructureData()
    }
  }

  restructureData() {
    if (this.state.data[0].file_name == null ) {
      var data = []
      _.forEach(this.props.babybook.entries.data, (item) => {
        if (item.file_name) {
          const uri = babybookDir + item.file_name
          data.push( {...item, file_uri: {uri: uri} } )
        }
      })
      data = _.sortBy(data, i => i.created_at ).reverse()
      // add entry for cover
      data = [{...data[0], id: '0'}].concat( data )
      this.setState({data: data})
      // update share
      this.setShareAttributes(this.state.currentIndex)
    }
  }

  shareOpen() {
    if ( this.state.shareAttributes.content ) {
      Share.share(this.state.shareAttributes.content, this.state.shareAttributes.options)
    }
  }

  handleIndexChange(index) {
    this.setState({ currentIndex: index })
    this.setShareAttributes(index)
  }

  setShareAttributes(index) {
    // for share
    const item = this.state.data[index]
    const uri = babybookDir + item.file_name

    this.setState({
      shareAttributes: { 
        content: {
          title: item.title,
          message: item.detail,
          url: uri // ios only
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
          numberOfPages={this.state.data.length}
          currentPage={this.state.currentIndex}
          hidesForSinglePage
          pageIndicatorTintColor={Colors.lightGrey}
          currentPageIndicatorTintColor={Colors.headerBackgroundColor}
          indicatorStyle={{borderRadius: 0}}
          currentIndicatorStyle={{borderRadius: 0}}
          indicatorSize={{width:10, height:10}}
          onPageIndicatorPress={ index => this.handleIndexChange(index) }
        />
        <View style={styles.viewContainer}>

          <SideSwipe
            data={this.state.data}
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

        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
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