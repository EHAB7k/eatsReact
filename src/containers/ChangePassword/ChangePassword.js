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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import axios from 'axios'
import Activity from '../../components/ActivityIndicator';
import {Platform} from 'react-native';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import {getConfiguration} from '../../utils/configuration';
import {genericAlert} from '../../utils/genricUtils';
import {Header} from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../../constants/lang';

export default class ChangePassword extends React.Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      fcmToken: '',
      hidePassword: true,
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
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  goToNextScreen() {
    if (this.state.password != '') {
      if (this.state.password.length >= 6) {
        this.changePassword(
          this.props.navigation.getParam('mobileNumber', ''),
          this.state.password,
          this.props.navigation.getParam('countryCode', ''),
        );
      } else {
        this.showAlert('Password should be of atleast six character.', 300);
      }
    } else {
      this.showAlert('Please enter password.', 300);
    }
  }

  changePassword(mobileNumber, password, countryCode) {
    this.props
      .changePasswordAPI(mobileNumber, password, countryCode)
      .then(() => this.afterChangePasswordAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterChangePasswordAPI() {
    let status = this.props.response.response.status;
    if (status == 'success') {
      this.props.navigation.navigate('Login');
      this.showAlert(this.props.response.response.message, 300);
    } else {
      this.showAlert(this.props.response.response.message, 300);
    }
  }

  render() {
    const {navigation} = this.props;
    const {password, hidePassword} = this.state;
    const language = getConfiguration('language');
    return (
      <View style={styles.mainView}>
        <SafeAreaView
          style={{
            backgroundColor: Colors.secondary,
          }}
        />

        <Header title={strings.FORGOT_PASSWORD} navigation={navigation} />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainer}>
          <Image
            style={{
              height: 150,
              width: '50%',
              resizeMode: 'contain',
              marginBottom: '5%',
              alignSelf: 'center',
            }}
            source={Images.loginLogo}
          />
          <Text style={styles.resetText}>{strings.RESET_YOUR_PASSWORD}</Text>
          <Text style={styles.descText}>{strings.ENTER_NEW_PASSWORD}</Text>

          <View style={styles.inputViewStyle}>
            <Image style={styles.inputIcon} source={Images.passwordIcon} />
            <TextInput
              style={[
                styles.inputStyle,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_PASSWORD}
              secureTextEntry={hidePassword}
              placeholderTextColor={Colors.textGrey}
              value={password}
              onChangeText={password =>
                this.setState({
                  password,
                })
              }
            />
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  hidePassword: !hidePassword,
                })
              }>
              <Image
                style={
                  !hidePassword ? styles.inputEyeOpenIcon : styles.inputEyeIcon
                }
                source={
                  !hidePassword ? Images.icEyeOpened : Images.icEyeCrossed
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.mustContainView}>
            <Text style={styles.mustContainText}>
              {strings.YOUR_PASS_MUST_CONTAIN}
            </Text>
            <View style={styles.mustItem}>
              <Image
                style={styles.roundTick}
                source={
                  password.length >= 6
                    ? Images.icCheckedRound
                    : Images.icUncheckedRound
                }
              />
              <Text
                style={[
                  styles.mustItemText,
                  {
                    color:
                      password.length >= 6 ? Colors.textBlack : Colors.textGrey,
                  },
                ]}>
                {strings.SIX_CHAR}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.tickButton}
          onPress={() => this.goToNextScreen()}>
          <Image
            style={[
              styles.tickIcon,
              {
                // transform: [{ scaleX: language === 'ar' ? -1 : 1 }]
              },
            ]}
            source={Images.sucessIcon}
          />
        </TouchableOpacity>

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
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: '8%',
    marginTop: '10%',
  },
  resetText: {
    fontSize: 22,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
    alignSelf: 'center',
  },
  descText: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textLightGrey,
    alignSelf: 'center',
  },
  inputViewStyle: {
    backgroundColor: Colors.inputBgGray,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: '8%',
    marginTop: '5%',
    borderWidth: 0.5,
    borderColor: Colors.borderGray,
  },
  inputIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: '5%',
  },
  inputEyeIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  inputEyeOpenIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: Fonts.primaryMedium,
    padding: 0,
    margin: 0,
    width: '80%',
  },
  mustContainView: {
    width: '100%',
    paddingVertical: '5%',
    alignItems: 'flex-start',
  },
  mustContainText: {
    fontFamily: Fonts.primarySemibold,
    color: Colors.textBlack,
    fontSize: 16,
  },
  mustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '3%',
  },
  roundTick: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  mustItemText: {
    fontSize: 15,
    fontFamily: Fonts.primarySemibold,
  },
  tickButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: '10%',
    right: '8%',
  },
  tickIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
});
