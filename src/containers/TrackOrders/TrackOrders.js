import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Linking,
  Alert,
  AsyncStorage,
} from 'react-native';
import Colors from '../../utils/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Images from '../../utils/Images';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Activity from '../../components/ActivityIndicator';
import Constants from '../../utils/Constants';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import BackgroundTimer from 'react-native-background-timer';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';
import {postAPI} from '../../utils/api';
import {genericAlert} from '../../utils/genricUtils';
import {errorAlert, successAlert} from '../../utils/genricUtils';

export default class TrackOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      selectedItem: this.props.navigation.getParam('item', ''),
      driverLatitude: 0.0,
      driverLongitude: 0.0,
      customerLat: 0.0,
      customerLong: 0.0,
      restaturantLat: 0.0,
      rrestaturantLong: 0.0,
      driverStatus: '',
      orderId: this.props.navigation.getParam('orderId', ''),
      showRatingView: false,
      ratingValue: 0,
      ratingValueBoy: 0,
      driverAngle: 0.0,
      paymentUrl: '',
      driverMobileNumber: '',
      isStateBusy: false,
      hideOrderServed: false,
    };
    this.intervalId = '';
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    this.intervalId = BackgroundTimer.runBackgroundTimer(() => {
      this.getOrderDetailsAPI(this.state.orderId);
    }, 7000);
  };

  handleLoader = isStateBusy => {
    this.setState({
      isStateBusy,
    });
  };

  stopBackgroundTimer = async intervalId => {
    await BackgroundTimer.stopBackgroundTimer(intervalId);
  };

  componentWillUnmount = () => {
    this.stopBackgroundTimer(this.intervalId);
  };

  componentDidMount() {
    this.setState({isStateBusy: true});
    this.getOrderDetailsAPI(this.state.orderId);
  }

  // ****** Render & Handle Rating ****** //

  showRatingView() {
    const {selectedItem} = this.state;
    if (this.state.showRatingView == true) {
      return (
        <View
          style={{
            padding: 10,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{height: 20, width: 20}}
              resizeMode="contain"
              source={Images.greenSucessIcon}></Image>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  color: Colors.textBlack,
                  fontFamily: Fonts.primarySemibold,
                }}>
                {strings.LIVE_STATUS}
              </Text>
              <Text
                style={{
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryRegular,
                }}>
                {strings.FOOD_DELIVERED}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: hp('5%')}}>
            <Image
              style={{height: 30, width: 30, marginTop: -5}}
              resizeMode="contain"
              source={Images.StarSmile}></Image>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryRegular,
                }}>
                {strings.FEEDBACK_RESTAURANT}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => this.rating(1)}>
                  {this.state.ratingValue >= 1 ? (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starFilled}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starBlank}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.rating(2)}>
                  {this.state.ratingValue >= 2 ? (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starFilled}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starBlank}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.rating(3)}>
                  {this.state.ratingValue >= 3 ? (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starFilled}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starBlank}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.rating(4)}>
                  {this.state.ratingValue >= 4 ? (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starFilled}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starBlank}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.rating(5)}>
                  {this.state.ratingValue >= 5 ? (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starFilled}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: wp('8%'), height: wp('8%')}}
                      source={Images.starBlank}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {selectedItem?.serviceType === 'delivery' ? (
            <View style={{flexDirection: 'row', marginTop: hp('5%')}}>
              <Image
                style={{height: 30, width: 30, marginTop: -5}}
                resizeMode="contain"
                source={Images.StarSmile}></Image>
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    color: Colors.textBlack,
                    fontFamily: Fonts.primaryRegular,
                  }}>
                  {strings.FEEDBACK_DRIVER}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => this.ratingBoy(1)}>
                    {this.state.ratingValueBoy >= 1 ? (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starFilled}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starBlank}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.ratingBoy(2)}>
                    {this.state.ratingValueBoy >= 2 ? (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starFilled}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starBlank}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.ratingBoy(3)}>
                    {this.state.ratingValueBoy >= 3 ? (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starFilled}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starBlank}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.ratingBoy(4)}>
                    {this.state.ratingValueBoy >= 4 ? (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starFilled}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starBlank}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.ratingBoy(5)}>
                    {this.state.ratingValueBoy >= 5 ? (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starFilled}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: wp('8%'), height: wp('8%')}}
                        source={Images.starBlank}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => this.closeButtonAction()}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 25,
              height: 50,
              justifyContent: 'center',
              marginTop: '3%',
              width: '90%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.White,
                alignSelf: 'center',
                fontSize: 18,
                fontFamily: Fonts.primaryBold,
              }}>
              {strings.SUBMIT}
            </Text>
          </TouchableOpacity>

          <View style={{marginTop: hp('5%')}}></View>
        </View>
      );
    }
  }

  closeButtonAction() {
    const {selectedItem, ratingValue, ratingValueBoy} = this.state;
    if (ratingValue == 0) {
      this.showAlert('Please add restaurant rating');
      return;
    }
    if (ratingValueBoy == 0 && selectedItem?.serviceType === 'delivery') {
      this.showAlert('Please add driver rating');
      return;
    }

    this.props
      .ratingAPI(
        this.state.selectedItem._id,
        this.state.ratingValue,
        this.state.ratingValueBoy,
      )
      .then(() => this.afterRating())
      .catch(e => this.showAlert(e.message, 300));
  }

  handleCancelOrder = async () => {
    const {navigation} = this.props;
    const {selectedItem} = this.state;
    this.setState({
      isLoading: true,
    });
    const data = {
      orderId: selectedItem._id,
      cancelationReasonId: 'NV25GlPuOnQ=',
    };
    try {
      const res = await postAPI(
        '/api/v1/user/cancelorder',
        JSON.stringify(data),
      );
      console.log('cancel orders from track', res);

      if (res?.status === 'success') {
        this.setState({
          isLoading: false,
        });
        if (res?.message == 'YOU_CANNOT_CANCEL_THIS_ORDER') {
          Alert.alert(strings.ALERT, strings.ALERT_CANNOT_CANCEL_ORDER, [
            {text: strings.OK, onPress: () => navigation.navigate('Orders')},
          ]);
        } else {
          navigation.navigate('Orders');
        }
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  afterRating() {
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
    this.setState({
      ratingValue: 0,
      ratingValueBoy: 0,
      showRatingView: false,
    });

    this.props.navigation.navigate('Orders');
  }

  rating(value) {
    this.setState({ratingValue: value});
  }

  ratingBoy(value) {
    this.setState({ratingValueBoy: value});
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  getOrderDetailsAPI(orderId) {
    this.props
      .getOrderDetailsAPI(orderId)
      .then(() => this.afterGetOrderDetailsAPI())
      .catch(e => this.myState(e.message));
  }

  myState(message) {
    this.setState({isStateBusy: false});
    //this.showAlert(message, 300)
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');
    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  afterGetOrderDetailsAPI() {
    this.setState({isStateBusy: false});
    let status = this.props.responseOrderDetails.response.status;
    let message = this.props.responseOrderDetails.response.message;
    if (status == 'failure') {
      this.setState({isStateBusy: false});
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
        this.setState({isStateBusy: false});
        this.showAlert(message, 300);
      }

      return;
    }

    let fetchItem = this.props.responseOrderDetails.response.data;

    if (
      fetchItem?.orderStatus == 'cancelled' ||
      fetchItem?.orderStatus == 'declined'
    ) {
      this.props.navigation.navigate('Home');
      this.stopBackgroundTimer(this.intervalId);
      return;
    }
    this.setState({
      selectedItem: this.props.responseOrderDetails.response.data,
      status: fetchItem.orderStatus,
      paymentUrl: fetchItem.paymentUrl,
      customerLat: fetchItem.billingDetails.addressLocation.coordinates[0],
      customerLong: fetchItem.billingDetails.addressLocation.coordinates[1],
      driverLatitude:
        typeof fetchItem.driverRefId !== undefined &&
        fetchItem.driverRefId !== 'undefined' &&
        fetchItem.driverRefId
          ? fetchItem.driverRefId.driverLocation.coordinates[1]
          : 0.0,
      driverLongitude:
        typeof fetchItem.driverRefId !== undefined &&
        fetchItem.driverRefId !== 'undefined' &&
        fetchItem.driverRefId
          ? fetchItem.driverRefId.driverLocation.coordinates[0]
          : 0.0,
      driverStatus: fetchItem.driverStatus,
      driverMobileNumber: fetchItem.driverMobileNumber
        ? fetchItem.driverMobileNumber
        : '',
      driverAngle: fetchItem.driverRefId ? fetchItem.driverRefId.angle : 0.0,
      restaturantLat: fetchItem.restaurantDetails
        ? fetchItem.restaurantDetails.restaurantLocation.coordinates[1]
        : 0.0,
      restaturantLong: fetchItem.restaurantDetails
        ? fetchItem.restaurantDetails.restaurantLocation.coordinates[0]
        : 0.0,
    });
  }

  renderHeaderTile() {
    const language = getConfiguration('language');
    return (
      <TouchableOpacity
        style={{
          padding: wp('5%'),
          backgroundColor: 'transparent',
          position: 'absolute',
          top: Platform.OS == 'ios' ? wp('10%') : 0,
        }}
        onPress={() => this.props.navigation.navigate('Orders')}>
        <Image
          resizeMode="contain"
          style={{
            height: 30,
            width: 30,
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

  // ************ Render & Handle Map View ************ //

  renderFreshView() {
    return (
      <View style={{height: 'auto', width: wp('100%'), flex: 100}}>
        <MapView
          style={{width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          zoomEnabled={true}
          region={{
            latitude: this.state.customerLat,
            longitude: this.state.customerLong,
            latitudeDelta: 0.009,
            longitudeDelta: 0.001,
          }}>
          <MapView.Marker
            style={{backgroundColor: 'transparent'}}
            ref={marker => {
              this.markerdriver = marker;
            }}
            flat={false}
            rotation={this.state.angle}
            coordinate={{
              latitude: this.state.customerLat,
              longitude: this.state.customerLong,
            }}>
            <Animated.Image
              resizeMode="contain"
              source={Images.locationIcon}
              style={{height: 35, width: 35}}
            />
          </MapView.Marker>
        </MapView>
      </View>
    );
  }

  renderMapView() {
    return (
      <View
        style={{
          height: 'auto',
          width: wp('100%'),
          flex: 100,
        }}>
        {(this.state.status == Constants.OrderStatusConfirmed &&
          this.state.driverStatus == Constants.TRIP_ARRIVED) ||
        this.state.driverStatus == Constants.TRIP_DESTINATION_INROUTE ||
        this.state.driverStatus == Constants.TRIP_ARRIVED_RESTAURANT ||
        this.state.driverStatus == Constants.TRIP_PICKUP_INROUTE ? (
          <MapView
            style={{
              width: '100%',
              height: '100%',
            }}
            showsMyLocationButton={true}
            zoomEnabled={true}
            region={{
              latitude: this.state.driverLatitude,
              longitude: this.state.driverLongitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.001,
            }}>
            <MapView.Marker
              identifier={'Source'}
              style={{backgroundColor: 'transparent'}}
              ref={marker => {
                this.markerdriver = marker;
              }}
              flat={false}
              rotation={this.state.angle}
              coordinate={{
                latitude: this.state.driverLatitude,
                longitude: this.state.driverLongitude,
              }}>
              <Animated.Image
                resizeMode="contain"
                source={Images.driverTopIcon}
                style={{
                  height: 35,
                  width: 35,
                }}
              />
            </MapView.Marker>
            {this.state.driverStatus == Constants.TRIP_PICKUP_INROUTE ? (
              <MapView.Marker
                identifier={'Destination'}
                style={{backgroundColor: 'transparent'}}
                ref={marker => {
                  this.marker = marker;
                }}
                flat={false}
                coordinate={{
                  latitude: this.state.restaturantLat,
                  longitude: this.state.restaturantLong,
                }}>
                <Animated.Image
                  resizeMode="contain"
                  source={Images.locationIcon}
                  style={{
                    height: 35,
                    width: 35,
                  }}
                />
              </MapView.Marker>
            ) : null}

            {this.state.driverStatus == Constants.TRIP_DESTINATION_INROUTE ||
            this.state.driverStatus == Constants.TRIP_ARRIVED_RESTAURANT ? (
              <MapView.Marker
                identifier={'Destination'}
                style={{backgroundColor: 'transparent'}}
                ref={marker => {
                  this.markerdriver = marker;
                }}
                flat={false}
                coordinate={{
                  latitude: this.state.customerLat,
                  longitude: this.state.customerLong,
                }}>
                <Animated.Image
                  resizeMode="contain"
                  source={Images.locationIcon}
                  style={{
                    height: 35,
                    width: 35,
                  }}
                />
              </MapView.Marker>
            ) : null}

            {this.state.driverStatus == Constants.TRIP_PICKUP_INROUTE ? (
              <MapViewDirections
                origin={{
                  latitude: this.state.driverLatitude,
                  longitude: this.state.driverLongitude,
                }}
                destination={{
                  latitude: this.state.restaturantLat,
                  longitude: this.state.restaturantLong,
                }}
                apikey={Constants.GOOGLE_MAPS_APIKEY}
                strokeColor="black"
                strokeWidth={2.5}
                resetOnChange={false}

                //onReady={distance => this.calculateDistance(distance)}
              />
            ) : null}
            {this.state.driverStatus == Constants.TRIP_DESTINATION_INROUTE ||
            this.state.driverStatus == Constants.TRIP_ARRIVED_RESTAURANT ||
            this.state.driverStatus == Constants.TRIP_ARRIVED ? (
              <MapViewDirections
                origin={{
                  latitude: this.state.driverLatitude,
                  longitude: this.state.driverLongitude,
                }}
                destination={{
                  latitude: this.state.customerLat,
                  longitude: this.state.customerLong,
                }}
                apikey={Constants.GOOGLE_MAPS_APIKEY}
                strokeColor="black"
                strokeWidth={2.5}
                resetOnChange={true}
                //onReady={distance => this.calculateDistance(distance)}
              />
            ) : null}
            {this.state.driverStatus == Constants.TRIP_COMPLETED ? (
              <MapViewDirections
                origin={{
                  latitude: this.state.driverLatitude,
                  longitude: this.state.driverLongitude,
                }}
                destination={{
                  latitude: this.state.customerLat,
                  longitude: this.state.customerLong,
                }}
                apikey={Constants.GOOGLE_MAPS_APIKEY}
                strokeColor="black"
                strokeWidth={2.5}
                resetOnChange={true}
                //onReady={distance => this.calculateDistance(distance)}
              />
            ) : null}
          </MapView>
        ) : null}
      </View>
    );
  }

  handleOpenMaps = () => {
    const {restaturantLat, restaturantLong} = this.state;
    if (Platform.OS === 'android') {
      Linking.openURL(`geo:0,0?q=${restaturantLat},${restaturantLong}`).catch(
        err => console.error('An error occurred', err),
      );
    } else {
      Linking.openURL(
        `http://maps.apple.com/?ll=${restaturantLat},${restaturantLong}`,
      ).catch(err => console.error('An error occurred', err));
    }
  };

  renderRestaurantMapView = () => {
    const {restaturantLat, restaturantLong} = this.state;
    return (
      <View
        style={{
          height: 'auto',
          width: wp('100%'),
          flex: 100,
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            zIndex: 3,
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: Colors.White,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <TouchableOpacity onPress={this.handleOpenMaps}>
            <Image
              style={{
                height: 40,
                width: 40,
                resizeMode: 'contain',
              }}
              source={Images.nearByIcon}
            />
          </TouchableOpacity>
        </View>
        {restaturantLat !== 0 && restaturantLong !== 0 ? (
          <MapView
            style={{
              width: '100%',
              height: '100%',
            }}
            showsMyLocationButton={true}
            zoomEnabled={true}
            region={{
              latitude: restaturantLat,
              longitude: restaturantLong,
              latitudeDelta: 0.009,
              longitudeDelta: 0.001,
            }}>
            <MapView.Marker
              identifier={'Destination'}
              style={{backgroundColor: 'transparent'}}
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={{
                latitude: restaturantLat,
                longitude: restaturantLong,
              }}>
              <Image
                resizeMode="contain"
                source={Images.locationIcon}
                style={{
                  height: 35,
                  width: 35,
                }}
              />
            </MapView.Marker>
          </MapView>
        ) : null}
      </View>
    );
  };

  // ******** Render & Handle Tiles Functions ******** //

  handleOrderRecieved = payload => async () => {
    this.handleLoader(true);
    try {
      const res = await postAPI(
        'api/v1/user/confirmation',
        JSON.stringify(payload),
      );
      if (res?.status === 'success') {
        this.setState({
          hideOrderServed: true,
        });
        successAlert(res?.message);
      } else {
        errorAlert(res?.message);
      }
      this.handleLoader(false);
    } catch (e) {
      this.handleLoader(false);
    }
  };

  renderPaymentPage = () => {
    this.props.navigation.navigate('PaymentScreen', {
      duePayments: this.state.selectedItem.paymentUrl,
    });
  };

  renderOrderStatusTile(type) {
    const {status, driverStatus, selectedItem, hideOrderServed} = this.state;
    const language = getConfiguration('language');
    let driverImage = selectedItem?.driverImage
      ? {uri: selectedItem.driverImage}
      : Images.dummyUser;
    var type = type;
    switch (status) {
      case Constants.OrderStatusPanding:
        type = 1;
        break;
      case Constants.OrderStatusConfirmed:
        if (
          driverStatus == Constants.TRIP_PICKUP_INROUTE ||
          driverStatus == Constants.TRIP_ARRIVED ||
          selectedItem.serviceType !== 'delivery'
        ) {
          type = 2;
        }
        break;
      case Constants.OrderStatusPicked:
        if (driverStatus == Constants.TRIP_DESTINATION_INROUTE) {
          type = 4;
        } else {
          type = 3;
        }
        break;
      case Constants.OrderStatusCompleted:
        type = 5;
        break;
      default:
        type = 1;
    }
    return (
      <View
        style={{
          backgroundColor: Colors.White,
          padding: wp('5%'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.ORDER_STATUS}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: wp('3%'),
          }}>
          <Image
            style={{
              height: wp('6%'),
              width: wp('6%'),
              borderRadius: wp('3%'),
            }}
            source={
              type >= 1
                ? Images.icTabBarActiveHome
                : Images.icTabBarInactiveHome
            }
          />
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              marginHorizontal: wp('5%'),
            }}>
            {strings.ORDER_PLACED}
          </Text>
          {(this.state.selectedItem.paymentStatus === 'pending' &&
            this.state.selectedItem.paymentMethod === 'card') ||
          this.state.selectedItem.orderStatus === 'pending' ||
          this.state.selectedItem.orderStatus === 'driverNotFound' ? (
            <TouchableOpacity
              onPress={() => {
                this.handleCancelOrder();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: wp('3%'),
                  height: wp('7%'),
                  alignContent: 'flex-end',
                  width: wp('50%'),
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textRed,
                    width: wp('50%'),
                    textAlign: 'right',
                  }}>
                  {strings.CANCEL_ORDER}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={{
            width: wp('1%'),
            height: wp('5%'),
            backgroundColor: Colors.textBlack,
            marginHorizontal: wp('2.5%'),
          }}></View>

        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              height: wp('6%'),
              width: wp('6%'),
              borderRadius: wp('3%'),
            }}
            source={
              type >= 2
                ? Images.icTabBarActiveHome
                : Images.icTabBarInactiveHome
            }
          />
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              marginHorizontal: wp('5%'),
            }}>
            {strings.ORDER_ACCEPT}
          </Text>
        </View>

        {type >= 2 &&
        selectedItem.serviceType !== 'delivery' &&
        selectedItem.paymentStatus === 'pending' &&
        selectedItem.paymentMethod === 'card' ? (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: wp('1%'),
                height: 'auto',
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>
            <TouchableOpacity
              onPress={() => {
                this.renderPaymentPage();
              }}
              style={{
                backgroundColor: Colors.green,
                borderRadius: wp('5%'),
                flexDirection: 'row',
                paddingHorizontal: wp('3%'),
                height: wp('7%'),
                alignSelf: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: wp('4%'),
                  width: wp('4%'),
                  alignSelf: 'center',
                  tintColor: Colors.White,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.cardIcon}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: wp('4%'),
                  color: Colors.White,
                  paddingHorizontal: wp('2%'),
                }}>
                {strings.PROCESS_TO_PAY}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {type >= 2 &&
        selectedItem.serviceType !== 'delivery' &&
        selectedItem?.serviceStatus === 'served' &&
        !hideOrderServed ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: wp('1%'),
                height: wp('10%'),
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>
            <TouchableOpacity
              onPress={this.handleOrderRecieved({orderId: selectedItem?._id})}
              style={{
                paddingHorizontal: '5%',
                paddingVertical: '3%',
                borderRadius: 25,
                backgroundColor: Colors.primary,
                marginLeft: '5%',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.primaryRegular,
                  fontSize: 15,
                  color: Colors.White,
                }}>
                {strings.ORDER_RECEIVED}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {type == 2 && selectedItem.serviceType === 'delivery' ? (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp('1%'),
                height: 'auto',
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: wp('3%'),
                paddingHorizontal: wp('3%'),
                width: '90%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="stretch"
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    alignSelf: 'center',
                  }}
                  source={driverImage}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: wp('3%'),
                    fontSize: wp('4%'),
                    textAlign: 'left',
                  }}>
                  {this.state.selectedItem.driverName
                    ? this.state.selectedItem.driverName
                    : ''}
                </Text>
              </View>
              {this.state.selectedItem.paymentStatus === 'pending' &&
              this.state.selectedItem.paymentMethod === 'card' ? (
                <TouchableOpacity
                  onPress={() => {
                    this.renderPaymentPage();
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.green,
                      borderRadius: wp('5%'),
                      flexDirection: 'row',
                      paddingHorizontal: wp('3%'),
                      height: wp('7%'),
                      alignSelf: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: wp('4%'),
                        width: wp('4%'),
                        alignSelf: 'center',
                        tintColor: Colors.White,
                        transform: [
                          {
                            scaleX: language === 'ar' ? -1 : 1,
                          },
                        ],
                      }}
                      source={Images.cardIcon}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: wp('4%'),
                        color: Colors.White,
                        paddingHorizontal: wp('2%'),
                      }}>
                      {strings.PROCESS_TO_PAY}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {this.state.selectedItem.paymentStatus !== 'pending' &&
              this.state.selectedItem.paymentMethod === 'card' ? (
                <View
                  style={{
                    backgroundColor: Colors.bgGray,
                    borderRadius: wp('5%'),
                    flexDirection: 'row',
                    paddingHorizontal: wp('3%'),
                    height: wp('7%'),
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: wp('4%'),
                      width: wp('4%'),
                      alignSelf: 'center',
                      tintColor: Colors.White,
                      transform: [
                        {
                          scaleX: language === 'ar' ? -1 : 1,
                        },
                      ],
                    }}
                    source={Images.cardIcon}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: wp('4%'),
                      color: Colors.White,
                      paddingHorizontal: wp('2%'),
                    }}>
                    {strings.PAID}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <View
            style={{
              width: wp('1%'),
              height: wp('5%'),
              backgroundColor: Colors.textBlack,
              marginHorizontal: wp('2.5%'),
            }}></View>
        )}

        {selectedItem.serviceType === 'delivery' && (
          <>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  borderRadius: wp('3%'),
                }}
                source={
                  type >= 3
                    ? Images.icTabBarActiveHome
                    : Images.icTabBarInactiveHome
                }
              />
              <Text
                style={{
                  fontSize: wp('4%'),
                  alignSelf: 'center',
                  marginHorizontal: wp('5%'),
                }}>
                {strings.ORDER_PICKED_UP}
              </Text>
            </View>

            <View
              style={{
                width: wp('1%'),
                height: wp('5%'),
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>
          </>
        )}

        {type >= 3 && selectedItem.serviceType === 'delivery' ? (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp('1%'),
                height: 'auto',
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: wp('3%'),
                paddingHorizontal: wp('3%'),
                width: '90%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="stretch"
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    alignSelf: 'center',
                  }}
                  source={driverImage}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: wp('3%'),
                    fontSize: wp('4%'),
                    textAlign: 'left',
                  }}>
                  {this.state.selectedItem.driverName
                    ? this.state.selectedItem.driverName
                    : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.makeDriverCall(this.state.driverMobileNumber)
                }>
                <View
                  style={{
                    backgroundColor: Colors.green,
                    borderRadius: wp('5%'),
                    flexDirection: 'row',
                    paddingHorizontal: wp('3%'),
                    height: wp('7%'),
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: wp('4%'),
                      width: wp('4%'),
                      alignSelf: 'center',
                      tintColor: Colors.White,
                      transform: [
                        {
                          scaleX: language === 'ar' ? -1 : 1,
                        },
                      ],
                    }}
                    source={Images.listCall}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: wp('4%'),
                      color: Colors.White,
                      paddingHorizontal: wp('2%'),
                    }}>
                    {strings.CALL}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              width: wp('1%'),
              height: wp('5%'),
              backgroundColor: Colors.textBlack,
              marginHorizontal: wp('2.5%'),
            }}></View>
        )}

        {selectedItem.serviceType === 'delivery' && (
          <>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  borderRadius: wp('3%'),
                }}
                source={
                  type >= 4
                    ? Images.icTabBarActiveHome
                    : Images.icTabBarInactiveHome
                }
              />
              <Text
                style={{
                  fontSize: wp('4%'),
                  alignSelf: 'center',
                  marginHorizontal: wp('5%'),
                }}>
                {strings.OUT_FOR_DELIVERY}
              </Text>
            </View>

            <View
              style={{
                width: wp('1%'),
                height: wp('5%'),
                backgroundColor: Colors.textBlack,
                marginHorizontal: wp('2.5%'),
              }}></View>
          </>
        )}

        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              height: wp('6%'),
              width: wp('6%'),
              borderRadius: wp('3%'),
            }}
            source={
              type >= 5
                ? Images.icTabBarActiveHome
                : Images.icTabBarInactiveHome
            }
          />
          <Text
            style={{
              fontSize: wp('4%'),
              alignSelf: 'center',
              marginHorizontal: wp('5%'),
            }}>
            {strings.ORDER_RECEIVED}
          </Text>
        </View>

        {type >= 5 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: wp('3%'),
              marginLeft: wp('10%'),
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                resizeMode="contain"
                style={{
                  height: wp('10%'),
                  width: wp('10%'),
                  alignSelf: 'center',
                }}
                source={Images.rateIcon}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: wp('3%'),
                  fontSize: wp('3%'),
                }}>
                {strings.RATE_YOUR_EXPERIENCE}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => this.setState({showRatingView: true})}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: wp('5%'),
                flexDirection: 'row',
                paddingHorizontal: wp('3%'),
                height: wp('8%'),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: wp('4%'),
                  color: Colors.White,
                  paddingHorizontal: wp('2%'),
                }}>
                {strings.FEEDBACK}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={() => this.goToViewOrder()}
          style={{
            backgroundColor: Colors.primary,
            padding: wp('4%'),
            marginTop: hp('2%'),
            width: wp('80%'),
            alignSelf: 'center',
            marginBottom: '5%',
            borderRadius: 30,
          }}>
          <Text
            style={{
              color: Colors.White,
              alignSelf: 'center',
              fontSize: 18,
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.VIEW_ORDER}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  makeDriverCall(driverMobileNumber) {
    let phoneNumber = driverMobileNumber;
    if (driverMobileNumber.length == 0) {
      this.showAlert(strings.ALERT_PHONE_NOT_AVAILABLE);
      return;
    }
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:0${driverMobileNumber}`;
    } else {
      phoneNumber = `tel:0${driverMobileNumber}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
    // Linking.openURL(`tel:${driverMobileNumber}`)
  }

  goToViewOrder() {
    this.props.navigation.navigate('OrderDetailsScreen', {
      isFromOrderScreen: false,
      item: this.state.selectedItem,
    });
    this.stopBackgroundTimer(this.intervalId);
  }

  render() {
    const {status, driverStatus, selectedItem, isStateBusy} = this.state;
    console.log('driverStatus', driverStatus);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        {selectedItem?.serviceType !== 'delivery'
          ? this.renderRestaurantMapView()
          : status === Constants.OrderStatusPanding ||
            status === Constants.OrderStatusCompleted ||
            status === Constants.TRIP_NOT_FOUND ||
            status === Constants.TRIP_REQUESTED_ASSIGN_DRIVER ||
            (status === Constants.OrderStatusConfirmed &&
              driverStatus === Constants.DRIVER_FINDING_TRIPS)
          ? this.renderFreshView()
          : this.renderMapView()}

        {this.renderHeaderTile()}
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.primaryBold,
            color: Colors.textBlack,
            position: 'absolute',
            top: Platform.OS === 'ios' ? 60 : 20,
            alignSelf: 'center',
          }}>
          {strings.RIDE_OPTIONS}
        </Text>

        <View
          style={{
            height: 'auto',
            width: wp('100%'),
          }}>
          {this.state.showRatingView
            ? this.showRatingView()
            : this.renderOrderStatusTile(1)}
        </View>

        {isStateBusy || this.props.isBusy ? <Activity /> : null}
      </View>
    );
  }
}
