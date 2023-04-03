import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {genericAlert} from '../../utils/genricUtils';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';
export default class Thankyou extends React.Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {};

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {params} = payload.action;
  };

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    //return true;
    if (this.props.navigation.isFocused()) {
      this.goBack();
      return true;
    } else {
      return false;
    }
  };

  goBack() {
    this.props.navigation.navigate('Home');
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: wp('60%'),
            height: wp('60%'),
            marginTop: '15%',
          }}
          source={Images.thankYouIcon}
        />
        <View style={styles.headingBG}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: 24,
              color: Colors.Black,
              textAlign: 'center',
              width: '70%',
            }}>
            {strings.ORDER_ACCEPTED}
          </Text>
          <Text
            style={{
              paddingHorizontal: wp('2%'),
              fontFamily: Fonts.primaryRegular,
              color: Colors.textGrey,
              fontSize: 16,
              textAlign: 'center',
              width: '70%',
              marginTop: '5%',
            }}>
            {strings.ITEMS_PLACED}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Orders')}
          style={{
            height: 60,
            width: '86%',
            borderRadius: 30,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '8%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 17,
              color: Colors.White,
            }}>
            {strings.TRACK_ORDER}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchableArrow}
          onPress={() => this.goBack()}>
          <Text
            style={{
              color: Colors.Black,
              fontSize: 17,
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.BACK_TO_HOME}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingBG: {
    marginTop: wp('8%'),
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableArrow: {
    marginTop: '5%',
  },
});
