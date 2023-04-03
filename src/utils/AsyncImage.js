import React, {Component, PureComponent} from 'react';
import {View, Image, ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

export default class AsyncImage extends PureComponent {
  static propTypes = {
    resizeMode: PropTypes.string,
    style: PropTypes.any,
    sourceUrl: PropTypes.any,
    viewStyle: PropTypes.any,
  };

  static defaultProps = {
    resizeMode: 'contain',
    style: {},
    viewStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loadded: false,
    };
  }

  onLoad = this.onLoad.bind(this);

  onLoadEnd() {
    this.setState({loaded: false});
  }

  onLoadStart() {
    this.setState({loaded: true});
  }

  onLoad() {
    this.setState({loaded: true});
  }

  render() {
    const {resizeMode, style, sourceUrl, viewStyle} = this.props;
    return (
      <View style={viewStyle}>
        <Image
          source={sourceUrl}
          resizeMode={resizeMode}
          style={style}
          onLoad={this.onLoad}
        />
        {!this.state.loaded && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
              top: '50%',
              marginHorizontal: '50%',
            }}>
            <ActivityIndicator style={{}} />
          </View>
        )}
      </View>
    );
  }
}
