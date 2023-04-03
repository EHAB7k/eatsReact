import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Images from '../../utils/Images';
import {genericAlert} from '../../utils/genricUtils';
import Activity from '../../components/ActivityIndicator';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from 'react-native';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

const screenHeight = Dimensions.get('screen').height;
export default class VerifyOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      serverOTP: '',
      curLongitude: null,
      curLatitude: null,

      passedItem: props.navigation.getParam('data', ''),
    };
    this.pinInput = React.createRef();
  }

  componentDidMount() {
    this.getCurrentLocation();
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
      error => {
        console.log(error.code, error.message);
      },
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

  goBack() {
    this.props.navigation.goBack();
  }

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  resendOTP() {
    this.resendAPICall();
  }

  resendAPICall() {
    this.setState({code: ''});
    const {passedItem} = this.state;
    this.props
      .resendAPI(passedItem.mobileNumber, passedItem.countryCode)
      .then(() => this.afterResend())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterResend() {
    const {isBusy, response} = this.props;
    const {passedItem} = this.state;
    if (response.response.status === 'success') {
      this.showAlert(strings.ALERT_OTP_RESEND_SUCCESS, 300);
      this.setState({
        passedItem: {
          ...response.response.data,
          flow: passedItem.flow,
          initialCountry: passedItem.initialCountry,
        },
      });
    } else {
      this.showAlert(response?.response?.data?.message, 300);
    }
  }

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  _checkCode = code => {
    this.goToNextScreen(code);
  };

  // *********** Verify OTP Functions ************* //

  goToNextScreen() {
    this.verifyOtp();
  }

  verifyOtp = () => {
    const {passedItem, code} = this.state;
    this.props
      .verifyOtpAPI(passedItem.mobileNumber, passedItem.countryCode, code)
      .then(() => this.afterVerify())
      .catch(e => {
        console.log('e', e), this.showAlert(e.message, 300);
      });
  };

  afterVerify = () => {
    const {passedItem, code} = this.state;
    const {isBusyVerifyOtp, responseVerifyOtp, navigation} = this.props;
    if (responseVerifyOtp?.response?.status === 'success') {
      // navigation.navigate(passedItem.flow, {
      //   OTP: code,
      //   mobileNumber: passedItem.mobileNumber,
      //   countryCode: passedItem.countryCode,
      //   intialcountry: passedItem.initialCountry,
      // });

      var token = responseVerifyOtp.response.data.token;
      setConfiguration('token', token);
      var user_id = responseVerifyOtp.response.data._id;
      setConfiguration('user_id', user_id);
      var countryCode = responseVerifyOtp.response.data.countryCode;
      setConfiguration('countryCode', countryCode);
      this.storeData();
      this.getProfile();
    } else {
      alert(responseVerifyOtp?.response?.message);
    }
  };

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
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

  render() {
    const {passedItem} = this.state;
    const language = getConfiguration('language');
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: Colors.secondary,
          }}></SafeAreaView>
        <View style={styles.headerView}>
          <TouchableOpacity
            style={styles.backTouchable}
            onPress={() => this.goBack()}>
            <Image
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  transform: [{scaleX: language === 'ar' ? -1 : 1}],
                },
              ]}
              source={Images.backImage}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{strings.VERIFY_CODE}</Text>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={{
            minHeight: screenHeight / 1.2,
          }}>
          <View style={styles.gridViewBackground}>
            <Image
              style={{
                height: 150,
                width: '50%',
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={Images.loginLogo}
            />
            <Text style={styles.mailText}>
              {strings.A_CODE_SENT} {passedItem.mobileNumber} {strings.VIA_SMS}
            </Text>

            <View
              style={{
                width: 'auto',
                height: 50,
                marginTop: 30,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <SmoothPinCodeInput
                ref={this.pinInput}
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: Colors.textBlack,
                }}
                cellStyleFocused={{
                  borderColor: Colors.primary,
                }}
                textStyle={{
                  color: Colors.primary,
                  fontFamily: Fonts.primaryBold,
                  fontSize: 22,
                }}
                textStyleFocused={{
                  color: Colors.primary,
                  fontFamily: Fonts.primaryBold,
                  fontSize: 22,
                }}
                codeLength={4}
                keyboardType="numeric"
                returnkey="done"
                placeholder=" "
                value={this.state.code}
                onTextChange={code => this.setState({code})}
              />
            </View>

            <TouchableOpacity
              disabled={false}
              onPress={() => this.resendOTP()}
              style={styles.resendTile}>
              <Text style={styles.txtResend}>{strings.RESEND_CODE}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.arrowTile}>
            <TouchableOpacity
              style={styles.touchableArrow}
              onPress={() => this.goToNextScreen()}>
              <Image
                resizeMode="contain"
                style={[
                  styles.arrowIcon,
                  {
                    transform: [{scaleX: language === 'ar' ? -1 : 1}],
                  },
                ]}
                source={Images.nextIcon}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        {this.props.isBusy || this.props.isBusyVerifyOtp ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: Colors.textBlack,
    fontFamily: Fonts.primaryBold,
  },
  gridViewBackground: {
    width: '100%',
    marginTop: 10,
  },
  mailText: {
    fontSize: 15,
    color: Colors.textLightGrey,
    fontFamily: Fonts.primaryRegular,
    width: '60%',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '5%',
  },
  backTouchable: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 0,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  arrowIcon: {
    width: wp('13%'),
    height: wp('13%'),
  },
  touchableArrow: {
    backgroundColor: Colors.White,
    height: wp('13%'),
    width: wp('13%'),
    borderRadius: wp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  arrowTile: {
    width: '100%',
    paddingHorizontal: '8%',
    position: 'absolute',
    zIndex: 1,
    bottom: '10%',
  },
  resendTile: {
    justifyContent: 'center',
    marginTop: '10%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.textRed,
    alignSelf: 'center',
  },
  txtResend: {
    color: Colors.textRed,
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
  },
});
