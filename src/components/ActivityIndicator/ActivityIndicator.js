import React from 'react';
import {
  Container,
  ActivityIndicator,
  Content,
  Text,
  View,
  Image,
} from 'react-native';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Activity = props => (
  <View
    style={{
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000020',
    }}>
    <View
      style={{
        backgroundColor: Colors.White,
        paddingHorizontal: '15%',
        paddingVertical: '5%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 10,
        elevation: 5,
      }}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text
        style={{
          fontFamily: Fonts.primaryBold,
          color: Colors.textBlack,
          fontSize: 16,
          marginTop: '7%',
        }}>
        {strings.LOADING}
      </Text>
    </View>
  </View>
);

export default Activity;
