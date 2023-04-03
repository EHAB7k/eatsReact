import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
  Keyboard,
  Alert,
  BackHandler,
  RefreshControl,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Activity from '../../components/ActivityIndicator';
import Colors from '../../utils/Colors';
import AsyncImage from '../../utils/AsyncImage';
import Images from '../../utils/Images';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import SocketIOClient from 'socket.io-client';
import {AsyncStorage} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';
import {fcmService} from '../../components/Notification/FCMService';
import {localNotificationService} from '../../components/Notification/LocalNotificationService';
import Axios from 'axios';
import {errorAlert} from '../../utils/genricUtils';
import {get, getCustomHeader, getCustomHeaderApi} from '../../utils/api';

Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

const GOOGLE_MAPS_APIKEY = 'AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuggestion: false,
      predictions: [],
      curLatitude: 0.0,
      curLongitude: 0.0,
      sortBY: '',
      showBannerView: true,
      count: 0,
      searchString: '',
      selSourcePlaceId: '',
      storeList: [],
      banners: [],
      existingRestaurantId: '',
      isFromSearch: false,
      staterefreshing: true,
      isNameView: false,
      name: '',
    };

    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.responseGetProfile != this.props.responseGetProfile) {
      const userid = getConfiguration('user_id');
      if (userid.length > 0) {
        console.log('asdfsadfasdfasdf', this.props.responseGetProfile);

        if (
          this.props.responseGetProfile?.data?.name == null ||
          this.props.responseGetProfile?.data?.name == undefined ||
          this.props.responseGetProfile?.data?.name == 'undefined' ||
          this.props.responseGetProfile?.data?.name == 'null' ||
          this.props.responseGetProfile?.data?.name == ''
        ) {
          this.setState({isNameView: true});
        } else {
          this.setState({isNameView: false});
        }
      }
    }
  }

  componentDidFocus = payload => {
    let isFromAddress = this.props.navigation.getParam('isFromAddress', '');
    let isFromSearch = this.props.navigation.getParam('isFromSearch', '');
    this.setState({isFromSearch: isFromSearch});
    let isFromFilter = this.props.navigation.getParam('isFromFilter', '');
    console.log('isFromFilter', isFromAddress);
    if (isFromAddress == true) {
      let item = this.props.navigation.getParam('item', '');
      this.addressDetails(item);
    }
    if (isFromSearch == true) {
      let searchString = this.props.navigation.getParam('searchString', '');
      this.setState(
        {
          searchString: searchString,
          showBannerView: searchString.length > 0 ? false : true,
        },
        () => {
          this.getResturatntList();
          isFromSearch = false;
          searchString = '';
        },
      );
    } else {
      this.setState(
        {
          searchString: '',
          showBannerView: true,
        },
        () => {
          this.getResturatntList();
        },
      );
    }
    if (isFromFilter == true) {
      let selectSort = this.props.navigation.getParam('selectSort', '');
      this.setState({sortBY: selectSort}, () => {
        this.getResturatntList();
      });
    }

    let cartItems = this.props.responseItem.response;
    if (cartItems && cartItems.length > 0) {
      let firstValue = cartItems[0];
      let storeValue = firstValue.restaurantId;
      this.setState({existingRestaurantId: storeValue});
    } else {
      this.setState({
        existingRestaurantId: '',
      });
    }

    this.getEverything();
  };

  async componentDidMount(prop = this.props.navigation) {
    this.getCurrentLocation();
    // const userid =  getConfiguration('user_id');
    // console.log("userasdfasdf", this.props.responseGetProfile);
    // if(userid.length > 0  ){
    //      if(this.props.responseGetProfile.name==null ||
    //           this.props.responseGetProfile.name==undefined ||
    //           this.props.responseGetProfile.name=='undefined' ||
    //           this.props.responseGetProfile.name=='null' ||
    //           this.props.responseGetProfile.name==''
    //      ){
    //           console.log("asdfasdfasfasdsffd",);
    //           this.setState({isNameView:true})
    //      }
    //      console.log('this.props.responseGetProfile', this.props.responseGetProfile);

    // }
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
    //this.getAppLinksApi()
    var url = getConfiguration('API_ROOT');
    this.socket = SocketIOClient(url);
    let fcmToken = getConfiguration('fcmToken');
    var token = getConfiguration('token');
    const user_id = await AsyncStorage.getItem('user_id');
    const user_token = await AsyncStorage.getItem('token');
    if (user_id !== null && user_id.length > 0) {
      setConfiguration('user_id', user_id);
      this.getProfile();
    }
    if (token !== null && token.length > 0) {
    } else if (user_token !== null && user_token.length > 0) {
      setConfiguration('token', user_token);
      token = user_token;
    }

    this.socket.on('connect', () => {
      this.socket.emit(
        'customersocket',
        {customerId: getConfiguration('user_id'), firebase_token: fcmToken},
        data => {},
      );
    });
    setConfiguration('Socket', this.socket);

    fcmService.notificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('[App] onRegister: ', token);
    }

    if (getConfiguration('user_id') != '') this.getDuePayment(token);
    function onNotification(notify) {
      console.log('[App] onNotification:msg', notify);
      const options = {
        soundName: 'default',
        playSound: true,
      };
      const url = {
        url: notify.data.payment_url,
      };
      localNotificationService.showNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify,
        options,
        url,
      );
    }

    function onOpenNotification(notify) {
      console.log('<-------------onOpenNotification----------> ', notify);
      if (notify?.noti_type === 'order_payment') {
        prop.navigate('PaymentScreen', {
          duePayments: notify?.payment_url,
        });
      } else {
        console.log('Whatever');
      }
    }
  }

  getProfile() {
    this.props.getProfileAPI();
  }

  getDuePayment = async token => {
    try {
      const details = {
        customerid: getConfiguration('user_id'),
        token: token,
      };
      const res = await get(
        '/api/v1/user/getPaymentPendingTripList',
        JSON.stringify(details),
      );
      if (res?.status === 'success') {
        if (res.data.length > 0) {
          this.props.navigation.navigate('PaymentScreen', {
            duePayments: res.data ? res.data[0].paymentUrl : '',
          });
        } else {
        }
      } else {
        errorAlert(res?.message);
      }
    } catch (e) {
      console.log('error', e);
    }
    // var config = {
    //   method: 'get',
    //   url: 'https://api.eatsapps.com/api/v1/user/getPaymentPendingTripList',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     customerid: getConfiguration('user_id'),
    //     token: token,
    //   },
    //   timeout: 40000,
    // };

    // Axios(config)
    //   .then(function (response) {
    //     console.log('get due payments', JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     console.log('error', error);
    //   });
  };
  // shouldComponentUpdate() {
  //   if (this.props.key !== 'Initial' && this.props.key !== '') {
  //     this.props.navigation.navigate('ChatScreen');
  //     return false;
  //   }
  //   return false;
  // }

  handleNotification = () => {
    this.props.navigation.navigate('Items');
  };

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      fcmService.unRegister();
      localNotificationService.unregister();
    }
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    //return true;
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp();
      return true;
    } else {
      return false;
    }
  };

  async onChangeSource(sourceLocation) {
    this.setState({sourceLocation});
    this.setState({tentativePrice: '', showSuggestionDest: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      sourceLocation +
      '&key=' +
      GOOGLE_MAPS_APIKEY;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
        showSuggestion: true,
        //selectType: type
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

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  getResturatntList() {
    console.log(
      'get restaurant list',
      this.state.curLatitude,
      this.state.curLongitude,
    );
    this.props
      .getRestaurantList(
        this.state.curLatitude,
        this.state.curLongitude,
        this.state.sortBY,
        this.state.searchString,
      )
      .then(() => this.afterGetRestaurantListApi())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterGetRestaurantListApi() {
    let status = this.props.response.response
      ? this.props.response.response.status
      : 'failure';
    let message = this.props.response.response
      ? this.props.response.response.message
      : '';
    if (status === 'failure') {
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
      } else if (message !== '') {
        this.showAlert(message, 300);
      }

      return;
    }
    let banner = this.props.response.response.banner;
    let data = this.props.response.response.data;
    this.setState({
      banners: banner,
      storeList: data,
      searchString: '',
      isFromSearch: false,
    });
  }

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
            setConfiguration('latitude', position.coords.latitude);
            setConfiguration('longitude', position.coords.longitude);
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
                this.getResturatntList();
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
        setConfiguration('latitude', '');
        setConfiguration('longitude', '');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
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
        this.getResturatntList();
      })
      .catch(error => console.log('ERRRR', error));
  }

  getEverything() {
    this.props
      .getEverythingAPI('123', '123')
      .then(() => this.afterGetEverything())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterGetEverything() {
    let status = this.props.responseGetEverything.response.status;
    let message = this.props.responseGetEverything.response.message;
    if (status == 'failure') {
      if (message == 'Not Authorized') {
        // Alert.alert(
        //   '',
        //   strings.ALERT_SESSION_EXP,
        //   [
        //     {
        //       text: strings.OK,
        //       onPress: () => this.logOut(),
        //     },
        //   ],
        //   {
        //     cancelable: false,
        //   },
        // );
      } else {
        // this.showAlert(message, 300);
      }

      return;
    }
  }

  getAppLinksApi() {
    this.props
      .getAppLinksApi()
      .then(() => this.afterAppLinksApi())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterAppLinksApi() {
    let status = this.props.responseGetAppLinks.response.status;
    if (status == 'success') {
      let androidAppLinks =
        this.props.responseGetAppLinks.response.App_Url.Android_App_URL
          .Android_Client_App_URL;
      let iOSAppLinks =
        this.props.responseGetAppLinks.response.App_Url.IOS_App_URL
          .IOS_Client_App_URL;
      setConfiguration('androidAppLink', androidAppLinks);
      setConfiguration('iOSAppLink', iOSAppLinks);
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

  async setSourceLocation(placeId, description) {
    Keyboard.dismiss();
    this.setState({
      sourceLocation: description,
      showSuggestion: false,
      selSourcePlaceId: placeId,
    });
  }

  CurrnetgetAddress(lat, lng) {
    Geocoder.from(lat, lng)
      .then(json => {
        // var location = json.results[0].geometry.location;
        const homePd = json.results[0].formatted_address;
        const place_id = json.results[0].place_id;
        const address_components = json.results[0].address_components;

        this.setState({
          sourceLocation: json.results[0].formatted_address,
          selSourcePlaceId: place_id,
        });
      })
      .catch(error => console.log('ERRRR', error));
  }

  clickAddress() {
    this.props.navigation.navigate('ShippingAddress');
  }

  addressDetails(data) {
    this.setState({
      curLatitude: data.lat,
      curLongitude: data.long,
      sourceLocation: getConfiguration('address'),
    });
    this.getResturatntList();
  }

  openDrawerBox() {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  renderHeaderView() {
    const language = getConfiguration('language');
    return (
      <View style={styles.navigationView}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            zIndex: 1,
            left: 15,
          }}
          onPress={() => this.openDrawerBox()}>
          <Image
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              transform: [
                {
                  scaleX: language === 'ar' ? -1 : 1,
                },
              ],
            }}
            source={Images.menuIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backTouchable} activeOpacity={0.7}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginLeft: 10,
            }}>
            <Text
              onPress={() => this.clickAddress()}
              numberOfLines={1}
              style={{
                width: '85%',
                marginTop: 10,
                color: Colors.textBlack,
                fontFamily: Fonts.primaryMedium,
                textAlign: 'left',
              }}>
              {this.state.sourceLocation}
            </Text>
            <TouchableOpacity onPress={() => this.getCurrentLocation()}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  marginTop: 7,
                }}
                source={Images.icTargetLocation}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: wp('88%'),
          }}
          onPress={() => this.openFilterScreen()}>
          <Image
            style={{
              width: 23,
              height: 23,
              transform: [
                {
                  scaleX: language === 'ar' ? -1 : 1,
                },
              ],
            }}
            source={Images.filterIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  openFilterScreen() {
    this.props.navigation.navigate('Filter');
  }

  renderBannerViewItem(item, index) {
    return (
      <TouchableOpacity
        style={styles.bannerView}
        onPress={() => this.clickOnBannerItem(item)}>
        <View style={styles.bannerView}>
          <AsyncImage
            resizeMode="cover"
            style={styles.bannerImage}
            viewStyle={styles.bannerView}
            sourceUrl={{uri: item.item.promotionImage}}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderBannerView() {
    if (this.state.showBannerView == true && this.state.banners.length > 0) {
      return (
        <View
          style={{
            width: '100%',
            height: 'auto',
            backgroundColor: 'transparent',
          }}>
          <FlatList
            style={{
              width: 'auto',
              height: 'auto',
            }}
            contentContainerStyle={{
              marginHorizontal: 10,
              marginTop: '8%',
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={this.state.banners}
            keyExtractor={(item, index) => item._id}
            renderItem={(item, index) => this.renderBannerViewItem(item, index)}
          />
        </View>
      );
    }
  }

  renderStoreFlatlist() {
    return (
      <View
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: 'transparent',
          marginTop: 25,
        }}>
        <Text
          style={{
            color: Colors.textBlack,
            fontSize: 20,
            marginLeft: 10,
            marginBottom: 10,
            fontFamily: Fonts.primaryBold,
            alignSelf: 'flex-start',
          }}>
          {strings.RESTAURANT_NEAR}
        </Text>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: '3%',
            paddingBottom: '3%',
          }}
          data={this.state.storeList}
          keyExtractor={(item, index) => item._id}
          renderItem={(item, index) => this.renderStoreItem(item, index)}
          ListEmptyComponent={() => {
            return (
              <Text style={styles.txtNoLoads}>
                {' '}
                {strings.NO_ITEM_AVAILABLE}{' '}
              </Text>
            );
          }}
        />
      </View>
    );
  }

  clickOnBannerItem(item) {
    console.log('item banner', item);
    if (
      this.state.existingRestaurantId.length === 0 ||
      item.item.restaurantId == this.state.existingRestaurantId
    ) {
      this.props.navigation.navigate('Items', {
        item: item.item.restaurantRefId,
      });
    } else {
      Alert.alert(strings.ALERT, strings.CLEAR_CART, [
        {text: strings.OK, onPress: () => this.clearBannerCart(item)},
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  }

  clickOnStoreItem(item) {
    if (
      this.state.existingRestaurantId.length === 0 ||
      item.item._id == this.state.existingRestaurantId
    ) {
      this.props.navigation.navigate('Items', {item: item.item});
    } else {
      Alert.alert(strings.ALERT, strings.CLEAR_CART, [
        {text: strings.OK, onPress: () => this.clearCartItem(item)},
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
    //this.props.navigation.navigate('Items', { item: item.item });
  }

  clearCartItem(item) {
    this.setItemsDataInRedux();
    this.props.navigation.navigate('Items', {item: item.item});
  }

  clearBannerCart(item) {
    this.setItemsDataInRedux();
    this.props.navigation.navigate('Items', {item: item.item.restaurantRefId});
  }

  setItemsDataInRedux() {
    this.props
      .ItemRecordsApi([])
      .then(() => this.afterSetItemsDataInRedux())
      .catch(e => console.log(e.message));
  }

  afterSetItemsDataInRedux() {
    this.setState({existingRestaurantId: ''});
    // this.getData();
  }

  renderStoreItem(item, index) {
    const language = getConfiguration('language');
    let itemsName = [];

    item.item.category.forEach(myFunction);
    function myFunction(item, index, arr) {
      itemsName.push(language === 'ar' ? item.catName_ar : item.catName);
    }

    var itemsText = itemsName.toString();
    return (
      <TouchableOpacity
        style={styles.categoryView}
        disabled={item.item.restaurantStatus === 'Offline'}
        onPress={() => {
          this.clickOnStoreItem(item);
        }}>
        <View
          style={{
            width: '100%',
            height: 'auto',
            paddingVertical: 10,
            backgroundColor: Colors.White,
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 10,
            paddingTop: 20,
          }}>
          <AsyncImage
            resizeMode="stretch"
            style={styles.categoryImage}
            viewStyle={{
              backgroundColor: 'transparent',
              height: 80,
              width: 100,
              borderRadius: 10,
              marginTop: -10,
              marginLeft: 10,
            }}
            sourceUrl={
              item?.item?.restaurantLogo !== 'null'
                ? {uri: item.item.restaurantLogo}
                : Images.registerBGIcon
            }
          />
          <View
            style={{
              marginLeft: 10,
              width: '45%',
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                width: '100%',
                height: 'auto',
                marginTop: -10,
                color: Colors.textBlack,
                fontFamily: Fonts.primaryBold,
                textAlign: 'left',
              }}>
              {language === 'ar' ? item.item.name_ar : item.item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                width: '100%',
                color: Colors.Black,
                fontFamily: Fonts.primaryRegular,
                textAlign: 'left',
              }}>
              {`Distance: ${(item.item.distance * 0.000621371).toFixed(
                2,
              )} miles`}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                width: '100%',
                height: 30,
                marginTop: 2,
                color: Colors.Black,
                fontFamily: Fonts.primaryRegular,
                textAlign: 'left',
              }}>
              {itemsText}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
              marginTop: -8,
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'flex-start',
            }}>
            <Image
              style={{
                width: 15,
                height: 15,
              }}
              source={Images.starFilled}
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 16,
                marginTop: -1,
                fontFamily: Fonts.primaryRegular,
                color: Colors.textBlack,
              }}>
              {item.item.avgRating}
            </Text>
          </View>

          {item.item.restaurantStatus === 'Offline' && (
            <Text
              style={{
                color: Colors.textRed,
                position: 'absolute',
                zIndex: 1,
                right: '5%',
                bottom: '3%',
              }}>
              {strings.CLOSED}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  onRefresh() {
    this.setState({refreshing: false});
    this.getResturatntList();
  }

  renderNameView() {
    return (
      <View
        style={{
          position: 'absolute',
          elevation: 20,
          zIndex: 29,
          height: hp('100%') - 49,
          width: wp('100%'),
          backgroundColor: 'rgba(0,0,0, 0.9)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: wp('75%'),
            borderRadius: 5,
            backgroundColor: Colors.White,
          }}>
          <Text
            style={{
              padding: 10,
              fontSize: 17,
              color: 'black',
              fontFamily: Fonts.SemiBold,
            }}>
            {'Please enter your name to update your profile !!'}
          </Text>
          <TextInput
            placeholder="Enter your name"
            value={this.state.name}
            onChangeText={text => this.setState({name: text})}
            style={{paddingLeft: 10, width: wp('60%'), fontSize: 17}}
            returnKeyType={'done'}
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => this._onHandleOkay()}
              style={styles.buttonStyle}>
              <Text style={styles.cancelText}>{'Okay'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _onHandleOkay() {
    var {name} = this.state;
    if (name.length == 0) {
      alert('Please enter your name !!');
    } else {
      const data = {
        name: this.state.name,
      };
      this.props.EditProfileAPI(data).then(response => {
        console.log('====================================');
        console.log('responseasdf', response.payload.status);
        console.log('====================================');
        this.props.getProfileAPI().then(this.setState({isNameView: false}));
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1, color: Colors.White}}>
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: Colors.secondary,
          }}
        />
        {this.renderHeaderView()}
        {this.state.storeList.length > -1 ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: Colors.White,
            }}>
            {this.renderBannerView()}
            {this.renderStoreFlatlist()}
          </ScrollView>
        ) : (
          <Text style={styles.txtNoLoads}> {strings.NO_ITEM_AVAILABLE} </Text>
        )}

        {/* {this.state.isNameView && this.renderNameView()} */}
        {this.props.isBusy ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigationView: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: Colors.borderColor,
  },
  backTouchable: {
    position: 'absolute',
    width: wp('60%'),
    height: 40,
    top: 5,
    left: 60,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  bannerView: {
    backgroundColor: 'transparent',
    marginRight: 5,
  },
  bannerImage: {
    height: 140,
    width: 180,
    borderRadius: 10,
  },
  categoryView: {
    flex: 1,
    margin: 0,
    marginTop: 10,
    backgroundColor: 'transparent',
    height: 'auto',
  },
  categoryImage: {
    height: '100%',
    width: '100%',
    borderRadius: 16.0,
  },
  txtNoLoads: {
    marginTop: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: wp('5.86%'),
    fontFamily: Fonts.primaryRegular,
  },
  buttonStyle: {
    paddingVertical: 12,
    width: '100%',
  },
  cancelText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 17,
    color: 'black',
  },
  buttonView: {
    marginTop: 10,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
