import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

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

  componentDidUpdate(prevProps) {
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
    let aspectRatio = xHeight / xWidth;
    if (Platform.OS === 'ios') {
      // android and ios are returning width & height in reverse
      aspectRatio = xWidth / xHeight;
    }
    const width = this.props.width;
    const height = width * aspectRatio;
    this.setState({ width, height });
  };

  render = () => {
    const { width, height } = this.state;
    const { source, style } = this.props;
    return (
      <Image
        source={source}
        style={[style, { width, height }]}
      />
    );
  };
}

export default AutoHeightImage;
