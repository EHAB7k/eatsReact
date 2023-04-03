import React from 'react';
import {
  Container,
  ActivityIndicator,
  Content,
  Text,
  View,
  Image,
} from 'react-native';

import Images from '../../utils/Images';

const DummySplash = props => (
  <View
    style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    }}>
    <Image
      resizeMode="cover"
      style={{width: '100%', height: '100%'}}
      source={Images.splashIcon}
    />
  </View>
);

export default DummySplash;
