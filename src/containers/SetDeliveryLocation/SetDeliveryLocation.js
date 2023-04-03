import React, {Component} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
  Keyboard,
  PermissionsAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from 'react-native-geolocation-service';
import Activity from '../../components/ActivityIndicator';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Constants from '../../utils/Constants';
import Fonts from '../../utils/Fonts';
//import { strings } from '../../Languages/StringsOfLanguages'
import Geocoder from 'react-native-geocoding';
import {genericAlert} from '../../utils/genricUtils';
import MapView, {Callout, Marker} from 'react-native-maps';
import {color} from 'react-native-reanimated';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import strings from '../../constants/lang';
import {postAPI} from '../../utils/api';
import {errorAlert} from '../../utils/genricUtils';
Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');
import Config from '../../utils/Config';
import DropDown from '../../components/Popups/DropDown';
import {API_ROOT} from '../../../env';

export default class SetDeliveryLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      area: '',
      houseNo: '',
      landmark: '',
      addressType: '',
      showSuggestion: false,
      predictions: [],
      predictionsdest: [],
      selSourcePlaceId: '',
      showSuggestionDest: false,
      destinationPlaceID: '',
      finalSourceCordinates: {
        latitude: 30.76356,
        longitude: 76.458723,
      },
      region: {
        latitude: getConfiguration('latitude'),
        longitude: getConfiguration('longitude'),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      isFromMenu: false,
      addressId: '',

      regionList: [],
      isRegionType: false,
      regionTypeName: '',
      regionTypeId: '',

      cityList: [],
      isCityType: false,
      cityTypeName: '',
      cityTypeId: '',
    };
  }

  componentWillMount() {
    this.getCurrentLocation();
  }

  goBack() {
    if (this.state.isFromMenu === true) {
      this.props.navigation.navigate('MenuAddress');
    } else {
      this.props.navigation.goBack();
    }
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  saveAddress() {
    // if (this.state.area.length === 0) {
    //   this.showAlert('Area is required', 300);
    //   return;
    // } else if (this.state.houseNo.length === 0) {
    //   this.showAlert('House Number is required', 300);
    //   return;
    // } else if (this.state.landmark.length === 0) {
    //   this.showAlert('Landmark is required', 300);
    //   return;
    // } else

    if (
      this.state.finalSourceCordinates.latitude == 0 ||
      this.state.finalSourceCordinates.longitude == 0 ||
      this.state.location.length == 0
    ) {
      this.showAlert('Please add location', 300);
      return;
    }
    if (this.state.addressType.length == 0) {
      this.showAlert('Please select address type', 300);
      return;
    }
    if (this.state.regionTypeId.length == 0) {
      this.showAlert('Please select region type', 300);
      return;
    }
    if (this.state.cityTypeId.length == 0) {
      this.showAlert('Please select city', 300);
      return;
    } else {
      this.props
        .addDeliveryAddressAPI(
          this.state.location,
          this.state.finalSourceCordinates.latitude,
          this.state.finalSourceCordinates.longitude,
          this.state.area,
          this.state.houseNo,
          this.state.landmark,
          this.state.addressType,
          this.state.regionTypeId,
          this.state.cityTypeId,
        )
        .then(() => this.afteraddDeliveryAddress())
        .catch(e => this.showAlert(e.message, 300));
    }
  }

  updateAddress = async () => {
    const {
      location,
      addressType,
      landmark,
      area,
      houseNo,
      addressId,
      finalSourceCordinates: {latitude, longitude},
    } = this.state;
    try {
      let details = {
        address: location,
        addressLocation: {long: longitude, lat: latitude},
        area,
        houseNo,
        landmark,
        addressType,
        addressId,
      };
      const res = await postAPI(
        '/api/v1/user/updateaddress',
        JSON.stringify(details),
      );
      if (res?.status === 'success') {
        this.goBack();
      } else {
        errorAlert(res?.message);
      }
    } catch (e) {
      errorAlert(e.message);
    }
  };

  afteraddDeliveryAddress() {
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
    this.goBack();
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  renderHeaderTile() {
    const language = getConfiguration('language');
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          top: Platform.OS == 'ios' ? 40 : 0,
          height: 60,
          marginLeft: 20,
        }}
        onPress={() => this.goBack()}>
        <Image
          resizeMode="contain"
          style={{
            height: 40,
            width: 40,
            transform: [
              {
                scaleX: language === 'ar' ? -1 : 1,
              },
            ],
          }}
          source={Images.backImage}
        />
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    this.requestCameraPermission();
    let isFromMenu = this.props.navigation.getParam('isFromMenu', '');
    let item = this.props.navigation.getParam('item', '');
    if (isFromMenu == true) {
      this.setState({
        isFromMenu: true,
      });
    }
    if (item) {
      this.setState({
        location: item.address,
        addressType: item.addressType,
        landmark: item.landmark,
        area: item.area,
        houseNo: item.houseNo,
        addressId: item._id,
        finalSourceCordinates: {
          latitude: item?.addressLocation?.coordinates[0],
          longitude: item?.addressLocation?.coordinates[1],
        },
      });
    }

    this.onGetRegionList();

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
    if (this.props.navigation.isFocused()) {
      this.goBack();
      return true;
    } else {
      return false;
    }
  };

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

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          curLatitude: position.coords.latitude,
          curLongitude: position.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  // ******* Render & Handle Map ******* //

  renderMapView() {
    const {region} = this.state;
    return (
      <View style={{height: '35%', width: wp('100%')}}>
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
          location: responseJson.results[0].formatted_address,
          finalSourceCordinates: {
            latitude,
            longitude,
          },
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  // *********************************** //

  async onChangeSource(location) {
    this.setState({location});
    this.setState({showSuggestionDest: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      location +
      '&key=' +
      Constants.GOOGLE_MAPS_APIKEY;

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

  async setSourceLocation(placeId, description) {
    Keyboard.dismiss();
    this.setState({
      location: description,
      showSuggestion: false,
      selSourcePlaceId: placeId,
    });

    Geocoder.from(description)
      .then(json => {
        var location = json.results[0].geometry.location;
        const newdestination = {
          latitude: location.lat,
          longitude: location.lng,
        };
        this.setState({
          finalSourceCordinates: newdestination,
        });
        //this.openDetail(description, location.lat, location.lng);
      })
      .catch(error => console.warn(error));

    if (this.destinationPlaceID.length > 0 && placeId.length > 0) {
    }
  }

  clearPickUpAddress() {
    this.setState({location: ''});
  }

  renderDeliveryLocation() {
    const language = getConfiguration('language');
    const {isFromMenu} = this.state;
    let item = this.props.navigation.getParam('item', '');
    const predictions = this.state.predictions.map(prediction => (
      <TouchableHighlight
        style={{
          paddingVertical: 5,
          borderBottomWidth: 1.0,
          borderColor: 'gray',
          alignItems: 'flex-start',
        }}
        onPress={() =>
          this.setSourceLocation(prediction.place_id, prediction.description)
        }>
        <Text
          allowFontScaling={false}
          style={{
            margin: 10,
            textAlign: 'left',
          }}
          key={prediction.id}>
          {prediction.description}
        </Text>
      </TouchableHighlight>
    ));

    return (
      <View
        style={{
          backgroundColor: Colors.White,
          padding: wp('5%'),
        }}>
        <Text
          style={{
            fontFamily: Fonts.primaryBold,
            fontSize: 20,
            color: Colors.textBlack,
            textAlign: 'left',
          }}>
          {strings.SET_DELIVERY_LOCATION}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            marginTop: wp('3%'),
            borderBottomColor: 'grey',
            width: 'auto',
          }}>
          <TextInput
            placeholder={strings.PH_LOCATION}
            placeholderTextColor={Colors.textBlack}
            keyboardType="default"
            autoCapitalize="none"
            numberOfLines={1}
            onChangeText={location => this.onChangeSource(location)}
            value={this.state.location}
            style={{
              paddingBottom: 5,
              borderRadius: 0,
              color: Colors.Black,
              fontSize: 16,
              fontFamily: Fonts.primaryRegular,
              height: wp('10%'),
              width: wp('80%'),
              fontSize: wp('4%'),
              borderBottomWidth: 0.5,
              marginTop: wp('3%'),
              marginHorizontal: 5,
              borderBottomColor: Colors.lineViewColor,
              textAlign: language === 'ar' ? 'right' : 'left',
            }}></TextInput>

          {this.state.location.length == 0 ? null : (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                marginTop: 15,
              }}
              onPress={() => this.clearPickUpAddress()}>
              <Image
                resizeMode="contain"
                style={styles.searchIcon}
                source={Images.crossIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* <TextInput
          placeholder={strings.PH_AREA}
          placeholderTextColor={Colors.textBlack}
          onChangeText={area => this.setState({area})}
          value={this.state.area}
          style={[
            styles.searchTextInput,
            {
              textAlign: language === 'ar' ? 'right' : 'left',
            },
          ]}></TextInput>

        <TextInput
          placeholder={strings.PH_HOUSE_NO}
          placeholderTextColor={Colors.textBlack}
          onChangeText={houseNo => this.setState({houseNo})}
          value={this.state.houseNo}
          style={[
            styles.searchTextInput,
            {
              textAlign: language === 'ar' ? 'right' : 'left',
            },
          ]}></TextInput>

        <TextInput
          placeholder={strings.PH_LANDMARK}
          placeholderTextColor={Colors.textBlack}
          onChangeText={landmark => this.setState({landmark})}
          value={this.state.landmark}
          style={[
            styles.searchTextInput,
            {
              textAlign: language === 'ar' ? 'right' : 'left',
            },
          ]}></TextInput> */}

        {this.renderAddressType()}
        {this.renderRegionCity()}

        <TouchableOpacity
          style={{paddingVertical: 50}}
          onPress={() => (item ? this.updateAddress() : this.saveAddress())}>
          <View
            style={{
              backgroundColor: Colors.primary,
              height: 50,
              width: wp('90%'),
              alignSelf: 'center',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.White,
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.primaryBold,
              }}>
              {strings.SAVE_ADDRESS}
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.showSuggestion ? (
          <View
            style={{
              height: 'auto',
              width: wp('90%'),
              backgroundColor: 'white',
              borderLeftWidth: 2.0,
              borderRightWidth: 2.0,
              borderBottomWidth: 2.0,
              borderBottomLeftRadius: 8.0,
              borderBottomRightRadius: 8.0,
              position: 'absolute',
              top: 100,
              left: wp('5%'),
              borderColor: 'grey',
            }}>
            {predictions}
          </View>
        ) : null}
      </View>
    );
  }

  selectAddressType(type) {
    this.setState({addressType: type});
  }

  renderAddressType() {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: 'auto',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              width: 80,
              height: 30,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor:
                this.state.addressType === 'Home'
                  ? Colors.primary
                  : 'transparent',
              borderColor:
                this.state.addressType === 'Home'
                  ? Colors.primary
                  : Colors.textBlack,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}
            onPress={() => this.selectAddressType('Home')}>
            <Text
              style={{
                color:
                  this.state.addressType === 'Home'
                    ? Colors.White
                    : Colors.textBlack,
                fontFamily: Fonts.primaryRegular,
                fontSize: 13,
              }}>
              {strings.HOME}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 80,
              height: 30,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor:
                this.state.addressType === 'Office'
                  ? Colors.primary
                  : 'transparent',
              borderColor:
                this.state.addressType === 'Office'
                  ? Colors.primary
                  : Colors.textBlack,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}
            onPress={() => this.selectAddressType('Office')}>
            <Text
              style={{
                color:
                  this.state.addressType === 'Office'
                    ? Colors.White
                    : Colors.textBlack,
                fontFamily: Fonts.primaryRegular,
                fontSize: 13,
              }}>
              {strings.OFFICE}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 80,
              height: 30,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor:
                this.state.addressType === 'Other'
                  ? Colors.primary
                  : 'transparent',
              borderColor:
                this.state.addressType === 'Other'
                  ? Colors.primary
                  : Colors.textBlack,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this.selectAddressType('Other')}>
            <Text
              style={{
                fontFamily: Fonts.primaryRegular,
                color:
                  this.state.addressType === 'Other'
                    ? Colors.White
                    : Colors.textBlack,
                fontSize: 13,
              }}>
              {strings.OTHER}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderRegionCity() {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: wp('100%'),
          height: 'auto',
          marginTop: 20,
          alignSelf: 'center',
        }}>
        {/* region type fields********************************** */}

        <TouchableOpacity
          onPress={() => this.setState({isRegionType: true})}
          style={{
            marginTop: wp('5.33%'),
          }}>
          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 16,
              color: Colors.textBlack,
              marginLeft: 20,
              marginBottom: 5,
              textAlign: 'left',
            }}>
            {'Region Type'}
          </Text>
          <View style={[styles.tile, {justifyContent: 'space-between'}]}>
            <Text>
              {' '}
              {this.state.regionTypeName != ''
                ? this.state.regionTypeName
                : 'Select'}
            </Text>
            <Image
              resizeMode="contain"
              style={styles.tileIcon}
              source={Images.downArrow}
            />
          </View>
        </TouchableOpacity>

        {/* cities type fields********************************** */}

        {this.state.regionTypeName != '' ? (
          <TouchableOpacity
            onPress={() => this.setState({isCityType: true})}
            style={{
              marginTop: wp('5.33%'),
            }}>
            <Text
              style={{
                fontFamily: Fonts.primaryBold,
                fontSize: 16,
                color: Colors.textBlack,
                marginLeft: 20,
                marginBottom: 5,
                textAlign: 'left',
              }}>
              {'City'}
            </Text>
            <View style={[styles.tile, {justifyContent: 'space-between'}]}>
              <Text>
                {this.state.cityTypeName != ''
                  ? this.state.cityTypeName
                  : 'Select'}
              </Text>
              <Image
                resizeMode="contain"
                style={styles.tileIcon}
                source={Images.downArrow}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  onGetRegionList() {
    console.log('regionList region');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = '';
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    console.log('url', API_ROOT + '/' + Config.getRegionList);
    console.log('requestOptions', requestOptions);
    fetch(API_ROOT + '/' + Config.getRegionList, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('response region', result);
        this.setState({regionList: result.data});
      })
      .catch(error => console.log('error asdf', error));
  }

  onGetCitisList(region_id) {
    console.log('get cities list region****');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      regionId: region_id,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(API_ROOT + '/' + Config.getCitieList, requestOptions)
      .then(response => response.json())
      .then(result => this.setState({cityList: result.data}))
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        {/* <SafeAreaView backgroundColor='transparent' /> */}

        {this.renderMapView()}
        {this.renderHeaderTile()}
        <KeyboardAwareScrollView style={{height: 'auto', width: wp('100%')}}>
          {this.renderDeliveryLocation()}
        </KeyboardAwareScrollView>
        {this.props.isBusy ? <Activity /> : null}
        {this.state.isRegionType ? (
          <DropDown
            heading={'Please select Region type'}
            onOuterPress={() => {
              this.setState({isRegionType: false});
            }}
            onSelect={item => {
              this.setState({
                regionTypeName: item.nameEn,
                regionTypeId: item.id,
                isRegionType: false,
              });
              this.onGetCitisList(item.id);
            }}
            data={this.state.regionList}
          />
        ) : null}
        {this.state.isCityType ? (
          <DropDown
            heading={'Please select City'}
            onOuterPress={() => {
              this.setState({isCityType: false});
            }}
            onSelect={item => {
              this.setState({
                cityTypeName: item.nameEn,
                cityTypeId: item.id,
                isCityType: false,
              });
            }}
            data={this.state.cityList}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchIcon: {
    padding: 10,
    width: 10,
    height: 10,
  },
  searchTextInput: {
    paddingBottom: 5,
    borderRadius: 0,
    color: Colors.placeholderColor,
    fontSize: wp('4%'),
    fontFamily: Fonts.primaryRegular,
    height: wp('10%'),
    width: wp('90%'),
    fontSize: 16,
    borderBottomWidth: 0.5,
    marginTop: wp('3%'),
    marginHorizontal: 5,
    borderBottomColor: Colors.lineViewColor,
  },
  tile: {
    backgroundColor: Colors.bgGray,
    width: 'auto',
    height: 40,
    marginHorizontal: 20,
    alignItems: 'center',

    flexDirection: 'row',
    borderWidth: 1.0,
    borderColor: Colors.borderGray,
    borderRadius: 10,
    paddingHorizontal: '3%',
  },
  tileIcon: {
    width: 20,
    height: 25,
    marginRight: 5,
  },
});
