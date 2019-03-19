import React, { Component } from 'react';
import { Image } from 'react-native';

class AutoHeightImage extends Component {
  static defaultProps = {
    width: 0,
    source: '',
  };

  state = {
    width: 0,
    height: 0,
  };

  componentDidMount() {
    if (this.props.width > 0 && this.props.source !== '') {
      this.getImageSize();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.width !== prevProps.width && this.props.source !== prevProps.source) {
      this.getImageSize();
    }
  }

  getImageSize = async () => {
    const source = this.props.source;
    await Image.getSize(source.uri, (height, width) => {
      this.updateDimensionState(width, height);
    });
  };

  updateDimensionState = (xWidth, xHeight) => {
    const aspectRatio = xHeight / xWidth;
    //console.log(xWidth, xHeight);
    const width = this.props.width;
    const height = width * aspectRatio;
    this.setState({ width, height });
  };

  render = () => {
    const { width, height } = this.state;
    return (
      <Image
        source={this.props.source}
        style={[this.props.style, {width, height}]}
      />
    );
  };
};

export default AutoHeightImage;
