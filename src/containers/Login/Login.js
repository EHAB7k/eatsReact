import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  AsyncStorage,
  ImageBackground,
  PermissionsAndroid,
  Linking,
  TextInput,
  Alert,
  BackHandler,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Activity from '../../components/ActivityIndicator';
import PhoneInput from 'react-native-phone-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {genericAlert} from '../../utils/genricUtils';
import VersionCheck from 'react-native-version-check';
// import {
//   LoginButton,
//   AccessToken,
//   LoginManager,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import strings from '../../constants/lang';
import RNExitApp from 'react-native-exit-app';
import {get} from '../../utils/api';

Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

export default class Login extends React.Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      countryCode: '+966',
      phone: '',
      googleId: '',
      facebookId: '',
      aId: '',
      autoLogin: true,
      majorVersionIOS: '',
      forceUpdateVisible: false,
      appUrl: '',
      initialCountry: 'sa',
      curLatitude: null,
      curLongitude: null,
      socialStatus: false,
      locationPermission: false,
      keyboardHeight: null,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );

    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  _keyboardDidHide() {
    console.log('keyboard hide');
    this.setState({keyboardHeight: 0});
  }
  _keyboardDidShow(e) {
    this.setState({keyboardHeight: e.endCoordinates.height});
    console.log('asadfsadf', e.endCoordinates.height);
  }

  componentDidFocus = payload => {
    this.checkSocialStatus();
    this.getCurrentLocation();
  };

  checkSocialStatus = async () => {
    try {
      const res = await get('api/v1/adminSetting/getBasicsettinginfo');
      if (res?.status === 1) {
        this.setState({
          socialStatus: res?.data[0]?.App_Settings?.IS_SOCIAL_LOGIN,
        });
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  // componentWillMount() {
  //     //this.getAppLinksApi()

  //     let updateNeeded = DeviceInfo.getVersion();
  //     console.log("updateNeeded", updateNeeded)

  //     var apiRoot = "https://hungerbite-api.ondemandcreations.com"

  //     axios.get(apiRoot + '/api/v1/admin/getbasicinfo', {
  //     }).then((response) => {

  //         console.log("response", response)
  //         let iOSAppUrl = response.data.appUrl.IOS_App_URL.IOS_Client_App_URL
  //         let androidAppUrl = response.data.appUrl.Android_App_URL.Android_Client_App_URL
  //         let iosVersion = response.data.data.appVersion.IOS_User_App_Force_Version
  //         let iosForceUpdate = response.data.data.appForceUpdate.Android_User_App_Force_Update
  //         console.log("iosVersion", iosVersion)
  //         console.log("iosForceUpdate", iosForceUpdate)
  //         let androidVersion = response.data.data.appVersion.Android_User_App_Force_Version
  //         let androidForceUpdate = response.data.data.appForceUpdate.IOS_User_App_Force_Update
  //         console.log("androiVersion", androidVersion)
  //         console.log("androidForceUpdate", androidForceUpdate)
  //         setConfiguration('androidAppLink', androidAppUrl)
  //         setConfiguration('iOSAppLink', iOSAppUrl)
  //         if (Platform.OS != "android") {
  //             console.log("come in ios")
  //             if (iosForceUpdate && iosVersion > updateNeeded) {
  //                 console.log("come in ios")
  //                 this.setState({ forceUpdateVisible: true, appUrl: iOSAppUrl })
  //             }

  //         }
  //         else {
  //             if (androidForceUpdate && androidVersion > updateNeeded) {
  //                 this.setState({ forceUpdateVisible: true, appUrl: androidAppUrl })
  //             }
  //         }
  //     }).catch((error) => {
  //         console.log("axios error", error);
  //     });
  // }

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        this.setState(
          {
            curLatitude: position.coords.latitude,
            curLongitude: position.coords.longitude,
            locationPermission: true,
          },
          () => {
            this.setConfigurationForHome(position);
            // this.getCurrentAddress();

            Geocoder.from(position.coords.latitude, position.coords.longitude)
              .then(json => {
                const homePd = json.results[0].formatted_address;
                const place_id = json.results[0].place_id;
                setConfiguration('address', homePd);
                this.setState({
                  sourceLocation: homePd,
                  selSourcePlaceId: place_id,
                });
                this.getData();
              })
              .catch(error => console.log('ERRRR', error));
          },
        );
      },
      error => {
        // See error code charts below.
        this.setState({
          locationPermission: false,
        });
        setConfiguration('latitude', '30.7129');
        setConfiguration('longitude', '76.7079');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  setConfigurationForHome(position) {
    setConfiguration('latitude', position.coords.latitude);
    setConfiguration('longitude', position.coords.longitude);
  }

  getCurrentAddress() {
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
        this.getData();
      })
      .catch(error => console.log('ERRRR', error));
  }

  componentDidMount() {
    // if (Platform.OS != 'android') {
    //      this.requestCameraPermission();
    // }
    this.getCurrentLocation();
    setTimeout(() => SplashScreen.hide(), 6000);
    let fcmToken = getConfiguration('fcmToken');
    const majorVersionIOS = parseInt(Platform.Version, 10);
    this.setState({majorVersionIOS: majorVersionIOS});

    GoogleSignin.configure({
      webClientId:
        '730478115409-31gvbjhme6e3mscga7dcgsep5nhrtssq.apps.googleusercontent.com',
      androidClientId:
        '730478115409-o6tj1k16its54qu6v8vk1o5cldhcmpur.apps.googleusercontent.com',
      iosClientId:
        '730478115409-a5qa00tc73plc9687q6vomvlu3db67lm.apps.googleusercontent.com',
    });

    if (Platform.OS != 'android') {
      if (this.state.majorVersionIOS >= 13) {
        this.authCredentialListener = appleAuth.onCredentialRevoked(
          async () => {
            this.fetchAndUpdateCredentialState().catch(error =>
              this.setState({credentialStateForUser: `Error: ${error.code}`}),
            );
          },
        );

        this.fetchAndUpdateCredentialState()
          .then(res => this.setState({credentialStateForUser: res}))
          .catch(error =>
            this.setState({credentialStateForUser: `Error: ${error.code}`}),
          );
      }
    }

    this.keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '',
          message: 'Allow to access current location',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this.getCurrentLocation();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  }

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

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('token');

      if (value !== null) {
        // value previously stored
        setConfiguration('user_id', value);
        setConfiguration('token', token);

        this.setState({autoLogin: true});
        this.getProfile();
      } else {
        this.setState({autoLogin: false});
      }
    } catch (e) {
      this.setState({autoLogin: false});
      // error reading value
    }
  };

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  renderTopView() {
    return (
      <View style={styles.logoView}>
        <Image
          style={{
            height: 200,
            width: '100%',
            resizeMode: 'contain',
          }}
          source={Images.loginBanner}
        />
        <Image
          resizeMode="contain"
          style={styles.logoImage}
          source={Images.loginLogo}
        />
        <Text style={styles.screenHeading}>{strings.SIGN_IN}</Text>
        <Text style={styles.screenDesc}>
          {/* {('Penatibus feugiat at tempor pulvinar amet').toUpperCase()} */}
        </Text>
      </View>
    );
  }

  // ******************** Social Login Functions ******************** //

  renderSocialImage(image) {
    return (
      <Image
        resizeMode="contain"
        style={styles.socialButtonImage}
        source={image}
      />
    );
  }

  async googleAuth() {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();

      var fullname = user.user.givenName + ' ' + user.user.familyName;

      this.socialLogin('', user.user.id);
      this.setState({
        googleId: user.user.id,
        facebookId: '',
        name: fullname,
        email: user.user.email,
        photo: user.user.photo,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  handleFacebookLogin() {
    var that2 = this;
    if (Platform.OS == 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('resuttttttt', result);

          AccessToken.getCurrentAccessToken().then(data => {
            let accessToken = data.accessToken;

            const responseInfoCallback = (error, result) => {
              if (error) {
                alert('Error fetching data: ' + error.toString());
              } else {
                //alert('Success fetching data: ' + result.toString());

                // var user = data.credentials;
                var api = `https://graph.facebook.com/v2.3/${result.id}?fields=name,email,picture&access_token=${accessToken}`;

                fetch(api)
                  .then(response => response.json())
                  .then(responseData => {
                    that2.setState({
                      googleId: '',
                      facebookId: responseData.id,
                      name: responseData.name,
                      email: responseData.email,
                      photo: responseData.picture.data.url,
                    });
                    that2.socialLogin(responseData.id, '');
                  });
                // LoginManager.logout((data) => {
                //   //do something

                // })
              }
            };
            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: 'email,name,first_name,middle_name,last_name',
                  },
                },
              },
              responseInfoCallback,
            );

            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error) {
        LoginManager.logOut();
      },
    );
  }

  appleAuth = async () => {
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      this.setState({
        googleId: '',
        facebookId: '',
        appleId: appleAuthRequestResponse.user,
        name:
          appleAuthRequestResponse.fullName.givenName +
          ' ' +
          appleAuthRequestResponse.fullName.familyName,
        email: appleAuthRequestResponse.email,
        photo: '',
      });
      this.socialLogin('', '', appleAuthRequestResponse.user);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus,
      } = appleAuthRequestResponse;

      this.user = newUser;

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({credentialStateForUser: res}))
        .catch(error =>
          this.setState({credentialStateForUser: `Error: ${error.code}`}),
        );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
      } else {
        console.log(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({credentialStateForUser: 'N/A'});
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user,
      );
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        this.setState({credentialStateForUser: 'AUTHORIZED'});
      } else {
        this.setState({credentialStateForUser: credentialState});
      }
    }
  };

  socialLogin(fbId, gId, aId) {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    this.props
      .loginWithSocial(fbId, gId, aId)
      .then(() => this.afterSocialLogin(fbId, gId, aId))
      .catch(e => this.showAlert(e.message, 300));
  }

  updateApp() {
    Linking.openURL(this.state.appUrl);
  }

  storeData = async () => {
    try {
      const user_id = getConfiguration('user_id');
      await AsyncStorage.setItem('user_id', user_id);

      const token = getConfiguration('token');
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      // saving error
      console.log('error in storage', e);
    }
  };

  afterSocialLogin(fbId, gId, aId) {
    let isExist = this.props.responseSocial.response.exist;
    if (isExist) {
      var token = this.props.responseSocial.response.data.token;
      setConfiguration('token', token);
      var user_id = this.props.responseSocial.response.data._id;
      setConfiguration('user_id', user_id);
      this.storeData();
      // this.storeData2();
      this.getProfile();
    } else {
      this.props.navigation.navigate('Register', {
        googleId: gId,
        facebookId: fbId,
        name: this.state.name,
        email: this.state.email,
        photo: this.state.photo,
        social: true,
        appleId: aId,
        countryCode: +966,
      });
    }
    this.setState({
      googleId: '',
      facebookId: '',
      name: '',
      email: '',
    });
  }

  renderSocialButton() {
    const {navigation} = this.props;
    const {socialStatus} = this.state;
    return (
      <View>
        {socialStatus && (
          <>
            <View style={styles.socialTitle}>
              <View style={styles.horizontalLine} />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryBold,
                  marginHorizontal: '8%',
                }}>
                {strings.OR_SIGN_IN_WITH}
              </Text>
              <View style={styles.horizontalLine} />
            </View>
            <View style={styles.socialBtnContainer}>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: '100%',
                  flexDirection: 'row',
                }}
                onPress={() => this.handleFacebookLogin()}>
                {this.renderSocialImage(Images.fbLogo)}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '20%',
                  height: '100%',
                  flexDirection: 'row',
                }}
                onPress={() => this.googleAuth()}>
                {this.renderSocialImage(Images.gmailLogo)}
              </TouchableOpacity>
              {/* {Platform.OS != "android" && this.state.majorVersionIOS >= 13 ?
                        <TouchableOpacity
                            style={{
                                width: '20%',
                                height: '100%',
                                flexDirection: 'row'
                            }}
                            onPress={() => this.appleAuth()}
                        >
                            {this.renderSocialImage(Images.appleLogo)}
                        </TouchableOpacity>
                        : null} */}
            </View>
          </>
        )}
        <View
          style={[
            styles.signupWrapper,
            {
              marginTop: socialStatus ? 0 : '5%',
            },
          ]}>
          <Text style={styles.signupText}>{strings.DONT_HAVE_ACCOUNT}</Text>
          <Text
            onPress={() => {
              navigation.navigate('Register');
            }}
            style={[
              styles.signupText,
              {
                color: Colors.textBlue,
                marginHorizontal: '2%',
              },
            ]}>
            {strings.SIGN_UP}
          </Text>
        </View>
      </View>
    );
  }

  // ******************************************************** //
  // *************** Manual login Fuctions ***************** //
  // *******************************************************//

  renderLoginButton() {
    return (
      <View style={styles.arrowTile}>
        <TouchableOpacity
          style={styles.touchableArrow}
          onPress={() => this.goToNextScreen()}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: 20,
              color: Colors.secondary,
            }}>
            {strings.NEXT}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderGuestButton() {
    return (
      <View style={styles.arrowTile}>
        <TouchableOpacity
          style={styles.touchableArrow}
          onPress={() => {
            this.props.navigation.navigate('Home');
          }}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: 20,
              color: Colors.secondary,
            }}>
            {strings.GuestMode}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  goToNextScreen() {
    const phoneRegex = /^\d+$/;
    // if (!this.state.locationPermission) {
    //      Alert.alert(
    //           'Permission',
    //           'Location Permission Denied for this App. Please allow permission from your device App settings',
    //           [
    //                {
    //                     text: 'Exit App',
    //                     onPress: () => RNExitApp.exitApp(),
    //                },
    //           ],
    //      );
    // } else
    if (this.state.phone == '') {
      this.showAlert(strings.ALERT_ENTER_PHONE);
    } else if (!phoneRegex.test(this.state.phone)) {
      this.showAlert(strings.ALERT_VALID_PHONE);
    } else {
      this.login();
    }
  }

  login() {
    const {phone, countryCode} = this.state;
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    this.props
      .resendAPI(phone, countryCode)
      .then(() => this.afterResendOtp())
      .catch(e => this.showAlert(e.message, 300));
    // function Counter() {
    //   var counter = 0;
    //   function IncreaseCounter() {
    //     return (counter += 1);
    //   }
    //   return IncreaseCounter;
    // }
    // var counter = Counter();
  }

  afterLogin() {
    const {phone, countryCode, initialCountry} = this.state;
    setConfiguration('countryCode', this.state.countryCode);
    setConfiguration('findingDriver', false);
    var status = this.props.response.response.status;
    if (status == 'failure') {
      this.showAlert('Please enter valid Phone Number');
      return;
    }
    var userExist = false;
    if (status == 'success') {
      this.props
        .resendAPI(phone, countryCode)
        .then(() => this.afterResendOtp())
        .catch(e => this.showAlert(e.message, 300));
    } else {
    }
  }

  afterResendOtp = () => {
    const {responseResendOtp, navigation} = this.props;
    const {initialCountry} = this.state;
    if (responseResendOtp.response.status === 'success') {
      navigation.navigate('VerifyOTP', {
        data: {
          ...responseResendOtp.response.data,
          flow: 'Register',
          initialCountry,
        },
      });
      this.setState({
        phone: '',
      });
    } else {
      this.showAlert(responseResendOtp.response.error.message);
    }
  };
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

  getCountryCode() {
    var country = this.phone.getCountryCode();
    var initialCountry = this.phone.getISOCode();
    this.setState({
      countryCode: '+' + country,
      initialCountry,
    });
  }

  handleChooseLanguage = async () => {
    const {navigation} = this.props;
    await AsyncStorage.removeItem('language');
    navigation.navigate('ChooseLanguage');
  };

  render() {
    const language = getConfiguration('language');
    const {navigation} = this.props;
    const {countryCode, phone, initialCountry} = this.state;

    if (this.state.forceUpdateVisible) {
      return (
        <View style={styles.containerBlack}>
          <ImageBackground
            style={{height: '100%', width: '100%', justifyContent: 'center'}}
            source={Images.redBackgroundIcon}
            resizeMode="stretch">
            <View
              style={{
                width: '100%',
                height: 'auto',
                alignItems: 'center',
                marginBottom: 200,
              }}>
              <ImageBackground
                style={{
                  height: 200,
                  width: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={Images.EllipseIcon}>
                <Image
                  style={{height: 150, width: 150}}
                  source={Images.innovationIcon}
                  resizeMode="contain"
                />
              </ImageBackground>

              <Text
                style={{
                  color: 'white',
                  fontFamily: Fonts.primarySemibold,
                  fontSize: 30,
                }}>
                Better and faster
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: Fonts.primarySemibold,
                  fontSize: 30,
                  marginBottom: 5,
                }}>
                Version Available
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: Fonts.primaryRegular,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                An update with new features and fixes is available. it typically
                takes less then 1 minute.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.updateApp()}
              style={{
                backgroundColor: 'white',
                width: '80%',
                alignSelf: 'center',
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.primaryBold,
                  alignSelf: 'center',
                }}>
                Update Now
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View
          bounces={false}
          style={{
            flex: 1,
            backgroundColor: Colors.White,
          }}>
          <View style={styles.mainView}>
            <StatusBar
              backgroundColor={Colors.secondary}
              barStyle="dark-content"
            />

            <KeyboardAwareScrollView
              style={{marginBottom: this.state.keyboardHeight}}
              enableOnAndroid={true}>
              <TouchableOpacity
                onPress={this.handleChooseLanguage}
                style={{
                  position: 'absolute',
                  top: '7%',
                  left: '3%',
                  zIndex: 3,
                }}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    resizeMode: 'contain',
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  }}
                  source={Images.backImage}
                />
              </TouchableOpacity>
              {this.renderTopView()}
              <View style={styles.lowerView}>
                {/* form inputs */}

                {getConfiguration('language') === 'ar' ? (
                  <View style={styles.formWrapper}>
                    <View style={styles.inputViewStyle}>
                      <Text
                        onPress={() => this.phone.onPressFlag()}
                        style={{
                          marginLeft: 10,
                          position: 'absolute',
                          right: '3%',
                          marginTop: wp('2.5%'),
                          color: 'black',
                          fontFamily: Fonts.primaryRegular,
                          fontSize: 16,
                          top: Platform.OS === 'ios' ? 5 : 3,
                        }}>
                        {countryCode}
                      </Text>

                      <PhoneInput
                        ref={ref => {
                          this.phone = ref;
                        }}
                        returnKeyType={'done'}
                        textProps={{
                          returnKeyType: 'done',
                          placeholder: '',
                          placeholderTextColor: Colors.textGrey,
                          value: phone,
                          textAlign:
                            getConfiguration('language') === 'ar'
                              ? 'left'
                              : 'left',
                        }}
                        textStyle={styles.searchTextInput}
                        onChangePhoneNumber={phone => {
                          if (phone.length == 1 && phone == ' ') {
                          } else {
                            this.setState({phone});
                          }
                        }}
                        onSelectCountry={countryCode => this.getCountryCode()}
                        offset={getConfiguration('language') === 'ar' ? 80 : 50}
                        initialCountry={initialCountry}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.formWrapper}>
                    <View style={styles.inputViewStyle}>
                      <Text
                        onPress={() => this.phone.onPressFlag()}
                        style={{
                          marginLeft: '13%',
                          position: 'absolute',
                          left: 30,
                          color: 'black',
                          marginTop: wp('2.7%'),
                          fontFamily: Fonts.primaryBold,
                          fontSize: 14,
                        }}>
                        {countryCode}
                      </Text>

                      <PhoneInput
                        ref={ref => {
                          this.phone = ref;
                        }}
                        returnKeyType={'done'}
                        textProps={{
                          returnKeyType: 'done',
                          placeholder: '',
                          placeholderTextColor: Colors.textGrey,
                          value: phone,
                          textAlign:
                            getConfiguration('language') === 'ar'
                              ? 'right'
                              : 'left',
                        }}
                        textStyle={styles.searchTextInput}
                        onChangePhoneNumber={phone => {
                          if (phone.length == 1 && phone == ' ') {
                          } else {
                            this.setState({phone});
                          }
                        }}
                        onSelectCountry={countryCode => this.getCountryCode()}
                        offset={getConfiguration('language') === 'ar' ? 80 : 50}
                        initialCountry={initialCountry}
                      />
                    </View>
                  </View>
                )}

                {this.renderLoginButton()}
                {this.renderGuestButton()}
              </View>
            </KeyboardAwareScrollView>
          </View>

          {this.props.isBusy ||
          this.props.isBusySocial ||
          this.props.isBusyProfile ||
          this.props.isBusyResend ? (
            <Activity />
          ) : null}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  logoView: {
    width: wp('100%'),
    alignItems: 'center',
  },
  screenHeading: {
    fontFamily: Fonts.primaryBold,
    fontSize: 20,
    color: Colors.textBlack,
    marginVertical: '1%',
  },
  screenDesc: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    color: Colors.textBlack,
  },
  logoImage: {
    width: '50%',
    height: 150,
    resizeMode: 'contain',
  },
  lowerView: {
    width: wp('100%'),
    height: 'auto',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  formWrapper: {
    paddingHorizontal: '8%',
  },
  inputViewStyle: {
    backgroundColor: Colors.inputBgGray,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: '8%',
    marginTop: '5%',
  },
  inputIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: '5%',
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: Fonts.primaryMedium,
    padding: 0,
    margin: 0,
    width: '80%',
  },
  forgotText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 15,
    color: Colors.primary,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  countryCode: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: Fonts.primaryRegular,
  },
  searchTextInput: {
    height: 60,
    paddingHorizontal: 30,
    fontSize: 16,
    fontFamily: Fonts.primaryBold,
    color: Colors.Black,
  },

  socialBtnContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 50,
    marginTop: Platform.OS === 'ios' ? wp('4%') : wp('3%'),
    marginHorizontal: -10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  touchableArrow: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 25,
  },
  arrowTile: {
    marginHorizontal: '8%',
    marginTop: '5%',
  },
  socialButtonImage: {
    marginLeft: 0,
    marginTop: 10,
    width: '100%',
    height: '100%',
  },
  socialTitle: {
    width: 'auto',
    marginTop: wp('7%'),
    marginHorizontal: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    width: 'auto',
    backgroundColor: Colors.textLightGrey,
  },
  signupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '3%',
  },
  signupText: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textBlack,
  },
});
