import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Activity from '../../components/ActivityIndicator';
import PhoneInput from 'react-native-phone-input';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../../constants/lang';
import {FlatList} from 'react-native';
import {genericAlert} from '../../utils/genricUtils';
import MapView, {Callout, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

const GOOGLE_MAPS_APIKEY = 'AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY';
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.getParam('name', ''),
      phone: this.props.navigation.getParam('mobileNumber', ''),
      email: this.props.navigation.getParam('email', ''),
      password: '',
      countryCode:
        this.props.navigation.getParam('countryCode', '').length > 0
          ? this.props.navigation.getParam('countryCode', '')
          : '+966',
      city: 'india',
      address: '',
      fcmToken: '',
      scrollPadding: 0,
      check: false,
      initialCountry:
        this.props.navigation.getParam('intialcountry', '').length > 0
          ? this.props.navigation.getParam('intialcountry', '')
          : 'sa',
      social: this.props.navigation.getParam('social', ''),
      hidePassword: true,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      lat: null,
      lng: null,
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

  _keyboardDidShow() {
    this.setState({
      scrollPadding: 0,
    });
  }

  _keyboardDidHide() {
    this.setState({
      scrollPadding: 0,
    });
  }

  componentWillMount() {
    this.setState({autoLogin: true});
  }

  isValidEmail(string) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(string) === true) {
      return true;
    }
    return false;
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
    this.setState({
      region: {
        latitude: getConfiguration('latitude'),
        longitude: getConfiguration('longitude'),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  goBack() {
    this.props.navigation.navigate('Login');
  }

  goToNextScreen() {
    if (
      this.state.name != '' &&
      this.state.phone != '' &&
      this.state.email != '' &&
      this.state.password != '' &&
      this.state.phone != ''
    ) {
      if (this.isValidEmail(this.state.email) == false) {
        this.showAlert(strings.ALERT_VALID_EMAIL, 300);
        return;
      }
      this.register();
    } else {
      this.showAlert('Please fill all required fields.', 300);
    }
  }

  afterRegister() {
    if (this.props.response.response.status == 'success') {
      this.props.navigation.navigate('Login');
    } else {
      this.showAlert(this.props?.response?.response?.message, 300);
    }
  }

  register() {
    var languageId = AsyncStorage.getItem('languageId');
    this.props
      .registerAPI(
        this.state.name,
        this.state.email,
        this.state.phone,
        this.state.customerId,
        this.state.password,
        this.state.address,
        this.props.navigation.getParam('OTP', ''),
        this.props.navigation.getParam('googleId', ''),
        this.props.navigation.getParam('facebookId', ''),
        this.props.navigation.getParam('appleId', ''),
        this.state.countryCode,
        this.state.lat,
        this.state.lng,
        languageId,
      )
      .then(() => this.afterRegister())
      .catch(e => this.showAlert(e.message, 300));
  }

  selectCountry(country) {
    this.phone.selectCountry(country.iso2);
  }

  getCountryCode() {
    var country = this.phone.getCountryCode();
    this.setState({countryCode: '+' + country});
  }

  checkDeclaration() {
    this.setState({check: !this.state.check});
  }

  openTermAndConditions() {
    this.props.navigation.navigate('TermAndConditionsScreen');
  }

  renderSocialImage(image) {
    return (
      <Image
        resizeMode="contain"
        style={styles.socialButtonImage}
        source={image}
      />
    );
  }

  // ********* set location ********* //

  selectAddressAction(item) {
    Geocoder.from(item.description)
      .then(json => {
        var location = json.results[0].geometry.location;
        const {lat, lng} = location;
        this.setState({
          address: item.description,
          predictions: [],
          lat,
          lng,
        });
        //this.openDetail(description, location.lat, location.lng);
      })
      .catch(error => console.warn(error));
  }

  async onChangeSource(address) {
    this.setState({address});
    this.setState({showSuggestionDest: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      address +
      '&key=' +
      GOOGLE_MAPS_APIKEY;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
        showSuggestion: true,
      });
      var adress_data = json.predictions;
      this.setState({
        myaddress_list: adress_data,
      });
      if (json.predictions.length == 0) {
        this.setState({
          showSuggestion: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ******* Render & Handle Map ******* //

  renderMapView() {
    const {region} = this.state;
    return (
      <View
        style={{
          height: 180,
          width: wp('85%'),
          alignSelf: 'center',
          borderRadius: 10,
          overflow: 'hidden',
          marginTop: '2%',
        }}>
        <MapView
          style={{flex: 1}}
          region={region}
          onRegionChangeComplete={region => {
            this.setState({
              region,
            });
            this.handleDragFinish(region);
          }}>
          <MapView.Marker
            onDragEnd={e => this.handleDragFinish(e.nativeEvent.coordinate)}
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            draggable
          />
        </MapView>
      </View>
    );
  }

  handleDragFinish = payload => {
    const {latitude, longitude} = payload;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY`,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          address: responseJson.results[0].formatted_address,
          lat: latitude,
          lng: longitude,
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  render() {
    const {
      email,
      password,
      phone,
      name,
      address,
      customerId,
      hidePassword,
      countryCode,
    } = this.state;
    const disablePhone = this.props.navigation.getParam('mobileNumber', '');
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />

        {/* ********** Header and Logo ********** */}

        <View style={styles.logoView}>
          <Text style={styles.screenHeading}>{strings.SIGN_UP}</Text>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: '8%',
          }}>
          {/* form inputs */}

          <View style={styles.formWrapper}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputHeading}>{strings.PH_UC_NAME}</Text>
              <View style={styles.inputViewStyle}>
                <Image style={styles.inputIcon} source={Images.nameIcon} />
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign:
                        getConfiguration('language') === 'ar'
                          ? 'right'
                          : 'left',
                    },
                  ]}
                  autoCapitalize="words"
                  placeholderTextColor={Colors.textGrey}
                  value={name}
                  onChangeText={name =>
                    this.setState({
                      name,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputHeading}>{strings.PH_UC_EMAIL}</Text>
              <View style={styles.inputViewStyle}>
                <Image style={styles.inputIcon} source={Images.mailIcon} />
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign:
                        getConfiguration('language') === 'ar'
                          ? 'right'
                          : 'left',
                    },
                  ]}
                  autoCapitalize="none"
                  value={email}
                  onChangeText={email =>
                    this.setState({
                      email,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputHeading}>{strings.PH_UC_PASSWORD}</Text>
              <View style={styles.inputViewStyle}>
                <Image style={styles.inputIcon} source={Images.passwordIcon} />
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign:
                        getConfiguration('language') === 'ar'
                          ? 'right'
                          : 'left',
                    },
                  ]}
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
                      !hidePassword
                        ? styles.inputEyeOpenIcon
                        : styles.inputEyeIcon
                    }
                    source={
                      !hidePassword ? Images.icEyeOpened : Images.icEyeCrossed
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            {getConfiguration('language') === 'ar' ? (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHeading}>
                  {strings.PH_UC_ENTER_NUMBER}
                </Text>
                <View style={styles.inputViewStyle}>
                  <Text
                    onPress={() =>
                      disablePhone ? null : this.phone.onPressFlag()
                    }
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
                    disabled={disablePhone ? true : false}
                    returnKeyType={'done'}
                    textProps={{
                      returnKeyType: 'done',
                      placeholder: '',
                      placeholderTextColor: Colors.textGrey,
                      value: phone,
                      textAlign:
                        getConfiguration('language') === 'ar' ? 'left' : 'left',
                    }}
                    textStyle={styles.searchTextInput}
                    onChangePhoneNumber={phone => {
                      if (phone.length == 1 && phone == ' ') {
                      } else {
                        this.setState({phone});
                      }
                    }}
                    onSelectCountry={countryCode => this.getCountryCode()}
                    offset={50}
                    initialCountry={this.state.initialCountry}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHeading}>
                  {strings.PH_UC_ENTER_NUMBER}
                </Text>
                <View style={styles.inputViewStyle}>
                  <Text
                    onPress={() =>
                      disablePhone ? null : this.phone.onPressFlag()
                    }
                    style={{
                      marginLeft: '13%',
                      position: 'absolute',
                      left: 30,
                      color: 'black',
                      marginTop: wp('2.5%'),
                    }}>
                    {countryCode}
                  </Text>

                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                    disabled={disablePhone ? true : false}
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
                    offset={50}
                    initialCountry={this.state.initialCountry}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputHeading}>{strings.PH_UC_ADDRESS}</Text>
              {this.renderMapView()}

              <View style={styles.inputViewStyle}>
                <Image style={styles.inputIcon} source={Images.icLocation} />
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign:
                        getConfiguration('language') === 'ar'
                          ? 'right'
                          : 'left',
                    },
                  ]}
                  returnKeyType="done"
                  value={address}
                  onChangeText={address => this.onChangeSource(address)}
                />
              </View>
            </View>

            <FlatList
              style={{
                marginTop: wp('3%'),
                marginBottom: 5,
                marginHorizontal: wp('5%'),
                backgroundColor: 'white',
              }}
              data={this.state.predictions}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.loadDetail}
                  onPress={() => this.selectAddressAction(item)}>
                  <View
                    style={{
                      width: 'auto',
                      justifyContent: 'center',
                      height: 'auto',
                      borderBottomWidth: 0.7,
                      borderBottomColor: 'transparent',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('100%'),
                        backgroundColor: 'transparent',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp('100%'),
                          height: 50,
                        }}>
                        <View
                          style={{
                            width: wp('100%'),
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            alignItems: 'flex-start',
                          }}>
                          <Text
                            style={{
                              height: 20,
                              // width: '100%',
                              paddingHorizontal: 10,
                              fontSize: 16,
                              fontFamily: Fonts.primaryRegular,
                            }}>
                            {item.structured_formatting.main_text}
                          </Text>
                          <Text
                            style={{
                              height: 20,
                              // width: '100%',
                              paddingHorizontal: 10,
                              fontSize: 13,
                              fontFamily: Fonts.primaryRegular,
                            }}>
                            {item.structured_formatting.secondary_text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}></FlatList>
          </View>

          <View style={styles.arrowTile}>
            <TouchableOpacity
              style={styles.touchableArrow}
              onPress={() => this.goToNextScreen()}>
              <Image
                style={{
                  height: 60,
                  width: 60,
                  resizeMode: 'contain',
                }}
                source={Images.sucessIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 20}}>
            <View style={styles.signupWrapper}>
              <Text style={styles.signupText}>
                {strings.ALREADY_HAVE_ACCOUNT}
              </Text>
              <Text
                onPress={() => this.goBack()}
                style={[
                  styles.signupText,
                  {
                    color: Colors.textBlue,
                    marginHorizontal: '2%',
                  },
                ]}>
                {strings.SIGN_IN}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {this.props.isBusy || this.props.isBusyGetProfile ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  logoView: {
    width: wp('100%'),
    alignItems: 'center',
  },
  screenHeading: {
    fontFamily: Fonts.primaryBold,
    fontSize: 20,
    color: Colors.textBlack,
    height: 60,
    textAlignVertical: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginTop: '3%',
    paddingHorizontal: '8%',
    alignItems: 'flex-start',
  },
  inputHeading: {
    fontSize: 16,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
  },
  inputViewStyle: {
    backgroundColor: Colors.inputBgGray,
    borderWidth: 1,
    borderColor: Colors.borderGray,
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
  searchTextInput: {
    height: wp('10.33%'),
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    width: '100%',
    fontFamily: Fonts.primaryRegular,
  },
  touchableArrow: {
    alignSelf: 'flex-end',
  },
  arrowTile: {
    marginHorizontal: '8%',
    marginTop: '10%',
  },
  socialButtonImage: {
    marginLeft: 0,
    marginTop: 10,
    width: '100%',
    height: '100%',
  },
  signupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textBlack,
  },
});
