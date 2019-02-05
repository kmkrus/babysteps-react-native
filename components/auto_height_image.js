import React, { Component } from 'react';
import {
  Image,
  Dimensions
} from 'react-native';

export default class AutoHeightImage extends React.Component {

  static defaultProps = {
    width: 0,
    source: ''
  }

  state = {
    width: 0,
    height: 0,
  };

  componentDidMount(){
    if(this.props.width > 0 && this.props.source != ''){
      this.getImageSize();
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.width != prevProps.width && this.props.source != prevProps.source){
      this.getImageSize();
    }
  }

  getImageSize(){
    Image.getSize(this.props.source, (width, height) => {
      const aspectRatio =  height / width;
      this.setState({width: this.props.width, height: this.props.width * aspectRatio});
    });
  }


  render = () => {
    console.log('AutoSizeImage',this.props, this.state);
    return (
      <Image
        source={this.props.source}
        style={[this.props.style, {width: this.state.width, height: this.state.height}]}
      />
    )
  }



}
