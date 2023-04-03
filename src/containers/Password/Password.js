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
  AsyncStorage,
  Dimensions,
} from 'react-native';
import Activity from '../../components/ActivityIndicator';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {genericAlert} from '../../utils/genricUtils';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

const screenHeight = Dimensions.get('screen').height;
export default class Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      fcmToken: '',
      mobileNum: this.props.navigation.getParam('mobileNumber', ''),
      countryCode: this.props.navigation.getParam('countryCode', ''),
      curLongitude: null,
      curLatitude: null,
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
    this.getCurrentLocation();
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        this.setState(
          {
            curLatitude: position.coords.latitude,
            curLongitude: position.coords.longitude,
          },
          () => {
            this.setConfigurationForHome(position);
            // this.CurrnetgetAddress();
            Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              const homePd = json.results[0].formatted_address;
              const place_id = json.results[0].place_id;
              setConfiguration('address', homePd);
              this.setState({
                sourceLocation: homePd,
                selSourcePlaceId: place_id,
              });
            })
            .catch(error => console.log('ERRRR', error));
          },
        );
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }

  setConfigurationForHome(position) {
    setConfiguration('latitude', position.coords.latitude);
    setConfiguration('longitude', position.coords.longitude);
  }

  CurrnetgetAddress() {
    const {curLatitude, curLongitude} = this.state;
    Geocoder.from(curLatitude, curLongitude)
      .then(json => {
        const homePd = json.results[0].formatted_address;
        const place_id = json.results[0].place_id;
        setConfiguration('address', homePd);
        this.setState({
          sourceLocation: homePd,
          selSourcePlaceId: place_id,
        });
      })
      .catch(error => console.log('ERRRR', error));
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

  checkPassword(mobileNumber, password, countryCode) {
    let fcmToken = getConfiguration('fcmToken');
    this.props
      .checkPasswordAPI(mobileNumber, password, fcmToken, countryCode)
      .then(() => this.afterCheckPassword())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterCheckPassword() {
    if (this.props.response.response.status == 'success') {
      var token = this.props.response.response.data.token;
      setConfiguration('token', token);
      var user_id = this.props.response.response.data._id;
      setConfiguration('user_id', user_id);
      var countryCode = this.props.response.response.data.countryCode;
      setConfiguration('countryCode', countryCode);
      var email = this.props.response.response.data.email;
      setConfiguration('customer_email', email);

      this.storeData();
      this.getProfile();
      //
    } else {
      this.showAlert('Please enter correct Password', 300);
    }
  }

  storeData = async () => {
    try {
      const user_id = getConfiguration('user_id');
      await AsyncStorage.setItem('user_id', user_id);

      const token = getConfiguration('token');
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      // saving error
    }
  };

  afterGetProfile() {
    const {curLatitude, curLongitude, sourceLocation} = this.state;
    const item = {
      address: sourceLocation,
      lat: curLatitude,
      long: curLongitude,
    };
    this.props.navigation.navigate('Home', {isFromAddress: true, item: item});
  }

  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch(e => this.showAlert(e.message, 300));
  }

  forgotPassword() {
    this.forgotPasswordAPICall(
      this.props.navigation.getParam('mobileNumber', ''),
      this.props.navigation.getParam('countryCode', ''),
    );
  }

  forgotPasswordAPICall(mobileNumber, countryCode) {
    this.props
      .resendAPI(mobileNumber, countryCode)
      .then(() => this.afterForgotPasswordAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterForgotPasswordAPI() {
    const {responseResendOtp, isBusyResend, navigation} = this.props;
    this.props.navigation.navigate('VerifyOTP', {
      data: {
        ...responseResendOtp?.response?.data?.data,
        flow: 'ChangePassword',
        initialCountry: navigation.getParam('initialCountry', ''),
      },
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
    Keyboard.dismiss();
    if (this.state.password.length > 0) {
      this.checkPassword(
        this.state.mobileNum,
        this.state.password,
        this.state.countryCode,
      );
    } else {
      this.showAlert(strings.ENTER_PASSWORD, 300);
    }
  }

  login() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');
    var mob = this.state.countryCode + this.state.phone;
    this.props
      .checkPasswordAPI(mob, this.state.password, 'none')
      .then(() => this.afterLogin())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterLogin() {
    var status = this.props.response.response.status;
    var userExist = false;

    if (status == 'success') {
      userExist = this.props.response.response.exist;

      if (userExist == true) {
        this.props.navigation.navigate('Password', {
          mobileNumber: this.state.phone,
          countryCode: this.state.countryCode,
          fireBaseToken: 'none',
        });
      }
    } else {
      this.showAlert('Please enter correct Password', 300);
    }

    // var token =  this.props.response.response.data.token;
    // setConfiguration('token', token);
    //  var user_id =  this.props.response.response.data._id;
    //  setConfiguration('user_id', user_id);

    //     this.getProfile();
    //      this.setState({
    //        phone: ''
    //      });
  }

  render() {
    const {navigation, isBusyResend} = this.props;
    const {hidePassword, password} = this.state;
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
        <Header title={strings.ENTER_PASSWORD} navigation={navigation} />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <Image
            style={{
              height: 150,
              width: '50%',
              resizeMode: 'contain',
              marginVertical: '5%',
              alignSelf: 'center',
            }}
            source={Images.loginLogo}
          />

          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 15,
              color: Colors.textBlack,
              paddingHorizontal: '4%',
              alignSelf: 'flex-start',
            }}>
            {strings.PH_UC_PASSWORD}
          </Text>

          <View style={styles.inputViewStyle}>
            <Image style={styles.inputIcon} source={Images.passwordIcon} />
            <TextInput
              style={[
                styles.inputStyle,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={password => {
                this.setState({password});
              }}
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

          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
            }}
            onPress={() => this.forgotPassword()}>
            <Text
              style={{
                fontFamily: Fonts.primaryBold,
                fontSize: 15,
                color: Colors.textBlack,
                marginVertical: '8%',
              }}>
              {strings.UC_FORGOT_PASSWORD}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.goToNextScreen()}
            style={{
              position: 'absolute',
              zIndex: 2,
              bottom: '5%',
              right: '5%',
            }}>
            <Image
              style={{
                height: 60,
                width: 60,
                resizeMode: 'contain',
              }}
              source={Images.sucessIcon}
            />
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {this.props.isBusy ||
        this.props.isBusyForgot ||
        this.props.isBusyGetProfile ||
        isBusyResend ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '5%',
    minHeight: screenHeight / 1.2,
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
});
