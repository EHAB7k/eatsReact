import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import Activity from '../../components/ActivityIndicator';
import {Platform} from 'react-native';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {genericAlert} from '../../utils/genricUtils';
import {Header} from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';

export default class ChangePasswordProfile extends React.Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      oldPassword: '',
      fcmToken: '',
    };

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {params} = payload.action;
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      mainViewTop: -200,
    });
  }

  _keyboardDidHide() {
    this.setState({
      mainViewTop: 0,
    });
  }

  componentWillMount() {
    this.setState({autoLogin: true});
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  forgotPassword() {
    this.props.navigation.navigate('VerifyOTP', {
      mobileNumber: this.props.navigation.getParam('mobileNumber', ''),
      OTP: '',
      forgot: 'true',
      countryCode: this.props.navigation.getParam('countryCode', ''),
    });

    // this.props.navigation.navigate('ForgotPassword', {countryCode: this.state.countryCode} );
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  goBack() {
    this.props.navigation.navigate('Profile');
  }

  goToNextScreen() {
    if (this.state.password.length < 4) {
      this.showAlert(
        'New Password should be at least 4 digits or characters.',
        300,
      );
      return;
    }

    if (
      this.state.oldPassword != '' ||
      this.state.password != '' ||
      this.state.confirmPassword != ''
    ) {
      if (this.state.password == this.state.confirmPassword) {
        // this.props.navigation.navigate('Login');
        this.changePasswordAPI();
      } else {
        this.showAlert('Confirm password is not matched.', 300);
      }

      // this.checkPassword(this.props.navigation.getParam('mobileNumber', ''), this.state.password);
    } else {
      this.showAlert('Please fill all required fields.', 300);
    }

    // this.props.navigation.navigate('SideMenu');
  }

  changePasswordAPI() {
    const user_id = getConfiguration('user_id');

    this.props
      .changeProfilePasswordAPI(
        user_id,
        this.state.password,
        this.state.confirmPassword,
        this.state.oldPassword,
      )
      .then(() => this.afterChangePasswordAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterChangePasswordAPI() {
    let status = this.props.response.response.status;
    let message = this.props.response.response.message;
    if (status == 'failure') {
      if (message == 'Not Authorized') {
        Alert.alert(
          '',
          strings.ALERT_SESSION_EXP,
          [
            {
              text: strings.OK,

              onPress: () => this.logOut(),
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        this.showAlert(message, 300);
      }

      return;
    }
    if (status == 'success') {
      this.goBack();
    } else {
      this.showAlert(this.props.response.response.message, 300);
    }
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  render() {
    const {navigation} = this.props;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView
          style={{
            backgroundColor: Colors.secondary,
          }}
        />
        <Header
          title={strings.CHANGE_PASSWORD}
          navigation={navigation}
          screen="Profile"
        />

        <KeyboardAwareScrollView contentContainerStyle={styles.lowerView}>
          <Image
            style={{
              height: 180,
              width: '60%',
              resizeMode: 'contain',
              alignSelf: 'center',
              marginVertical: '8%',
            }}
            source={Images.loginLogo}
          />

          <View style={styles.tile}>
            <TextInput
              style={[
                styles.searchTextInput,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_OLD_PASSWORD}
              placeholderTextColor={Colors.Black}
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={oldPassword => {
                if (oldPassword.length == 1 && oldPassword == ' ') {
                } else {
                  this.setState({oldPassword});
                }
              }}
              value={this.state.oldPassword}
            />
          </View>

          <View style={styles.tile}>
            <TextInput
              style={[
                styles.searchTextInput,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_NEW_PASSWORD}
              placeholderTextColor={Colors.Black}
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={password => {
                if (password.length == 1 && password == ' ') {
                } else {
                  this.setState({password});
                }
              }}
              value={this.state.password}
            />
          </View>

          <View style={styles.tile}>
            <TextInput
              style={[
                styles.searchTextInput,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_CONFIRM_PASSWORD}
              placeholderTextColor={Colors.Black}
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={confirmPassword => {
                if (confirmPassword.length == 1 && confirmPassword == ' ') {
                } else {
                  this.setState({confirmPassword});
                }
              }}
              value={this.state.confirmPassword}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.arrowTile}>
          <TouchableOpacity onPress={() => this.goToNextScreen()}>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={Images.sucessIcon}
            />
          </TouchableOpacity>
        </View>

        {this.props.isBusy ||
        this.props.isBusySocial ||
        this.props.isBusyGetProfile ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchTextInput: {
    backgroundColor: 'transparent',
    width: '100%',
    padding: 0,
    margin: 0,
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
  },
  lowerView: {
    backgroundColor: 'transparent',
    width: wp('100%'),
    height: 'auto',
    justifyContent: 'center',
    marginTop: 0,
  },
  tile: {
    backgroundColor: 'transparent',
    width: 'auto',
    height: 50,
    marginTop: wp('3%'),
    marginHorizontal: '8%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1.0,
    borderColor: '#818e97',
  },
  arrowTile: {
    position: 'absolute',
    zIndex: 2,
    bottom: '15%',
    right: '8%',
  },
  arrowIcon: {
    width: wp('15%'),
    height: wp('15%'),
  },
  title: {
    fontSize: 18,
    color: Colors.navigationTitle,
  },
});
