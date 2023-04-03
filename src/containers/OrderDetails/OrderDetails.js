import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import Activity from '../../components/ActivityIndicator';
import Constants from '../../utils/Constants';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Clipboard from '@react-native-clipboard/clipboard';
import {successAlert} from '../../utils/genricUtils';
import {genericAlert} from '../../utils/genricUtils';
import {postAPI} from '../../utils/api';

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item', ''),
      isShowBillDetails: false,
      showRatingView: false,
      isLoading: false,
      ratingValue: 0,
      ratingText: '',
      isFromOrderScreen: this.props.navigation.getParam(
        'isFromOrderScreen',
        '',
      ),
    };
    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    let item = this.props.navigation.getParam('item', '');
    if (
      item.orderStatus == Constants.OrderStatusCompleted &&
      item.review.driverRating === 0
    ) {
      this.setState({
        showRatingView: true,
      });
    } else {
      this.setState({
        showRatingView: false,
      });
    }

    if (this.state.isFromOrderScreen == true) {
      this.setState({
        item: this.props.navigation.getParam('item', ''),
      });
    } else {
      this.setState({
        item: this.props.navigation.getParam('item', ''),
      });
    }
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
    if (this.state.isFromOrderScreen == true) {
      this.props.navigation.navigate('Orders');
    } else {
      this.props.navigation.goBack();
    }
  }

  submitReview() {
    this.props
      .ratingAPI(this.state.item._id, this.state.ratingValue)
      .then(() => this.afterRating())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterRating() {
    this.setState({
      showRatingView: false,
    });
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  renderItemHeaderView() {
    const {item} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.itemHeaderView}>
        <View
          style={{
            paddingVertical: '3%',
          }}>
          <View style={styles.pickupCircle} />
          <View style={styles.dashedLine} />
          <View style={styles.pickupCircle}></View>
        </View>

        <View
          style={{
            paddingHorizontal: '10%',
            position: 'relative',
            width: '95%',
          }}>
          {/* {item.serviceType === 'delivery' &&
                        item?.orderStatus !== 'cancelled' &&
                        item?.orderStatus !== 'pending' &&
                        item.driverAssigned === 'yes'
                        ? <TouchableOpacity
                            onPress={() => navigation.navigate('ChatScreen')}
                            style={{
                                position: 'absolute',
                                right: 0,
                            }}
                        >
                            <Image
                                style={{
                                    height: 30,
                                    width: 30,
                                    resizeMode: 'contain',
                                }}
                                source={Images.icChat}
                            />
                        </TouchableOpacity> : null} */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.primaryBold,
              color: Colors.textBlack,
              textAlign: 'left',
            }}>
            {strings.PICKUP}
          </Text>
          <Text
            style={{
              fontSize: 13,
              maxWidth: wp('90%'),
              fontFamily: Fonts.primaryRegular,
              color: Colors.textBlack,
              textAlign: 'left',
            }}
            >
            {item.restaurantAddress}
          </Text>

          <View
            style={{
              marginTop: '8%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.primaryBold,
                color: Colors.textBlack,
                textAlign: 'left',
              }}>
              {strings.DROPOFF}
            </Text>

            {item?.serviceType === 'delivery' &&
            (item.orderStatus == 'pending' ||
              item.orderStatus == 'confirmed') &&
            item.driverStatus === 'FindingTrips' ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SavedAddresses', {
                    flow: 'OrderDetails',
                    orderId: item._id,
                  })
                }>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.primary,
                  }}>
                  {strings.CHANGE_ADDRESS}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: Fonts.primaryRegular,
              color: Colors.textBlack,
              textAlign: 'left',
              width:wp('79%')
            }}
            >
            {item.billingDetails && item.billingDetails.address
              ? item.billingDetails.address
              : ''}
          </Text>
        </View>
      </View>
    );
  }

  clickOnArrowButton() {
    let newState = this.state.isShowBillDetails;
    this.setState({
      isShowBillDetails: !newState,
    });
  }

  renderBillDetailsView() {
    let showSmallOrder =
      this.state.item.orderSubTotal < this.state.item.minOrderAmount
        ? true
        : false;
    let taxValue =
      this.state.item.serviceFeeAmount + this.state.item.salesTaxAmount;
    //taxValue = Math.round((taxValue) * 100) / 100
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
          }}>
          <Text style={{fontSize: wp('4%')}}>{strings.ITEMS_TOTAL}</Text>
          <Text style={{fontSize: wp('4%')}}>
            {this.state.item.orderSubTotal} {strings.SAR}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
          }}>
          <Text style={{fontSize: wp('4%')}}>{strings.SERVICE_TAXES}</Text>
          <Text style={{fontSize: wp('4%')}}>
            {this.state.item.serviceFeeAmount} {strings.SAR}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
          }}>
          <Text style={{fontSize: wp('4%')}}>{strings.DELIVERY_FEE}</Text>
          <Text style={{fontSize: wp('4%')}}>
            {this.state.item.deliveryFee ? this.state.item.deliveryFee : 0}{' '}
            {strings.SAR}
          </Text>
        </View>

        {showSmallOrder == true ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text style={{fontSize: wp('4%')}}>{strings.SMALL_ORDER_FEE}</Text>
            <Text style={{fontSize: wp('4%')}}>
              {this.state.item.smallOrderFee} {strings.SAR}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
            borderColor: Colors.lineViewColor,
            borderBottomWidth: 1,
            borderTopWidth: 1,
          }}>
          <Text style={{fontSize: wp('4%')}}>{strings.TOTAL_AMOUNT}</Text>
          <Text style={{fontSize: wp('4%')}}>
            {this.state.item.orderTotal} {strings.SAR}
          </Text>
        </View>
      </View>
    );
  }

  renderBillDetails() {
    const {item} = this.state;
    return (
      <View
        style={{
          paddingVertical: hp('2%'),
          paddingHorizontal: '5%',
        }}>
        {this.renderBillDetailsView()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: '5%',
          }}>
          <Text
            style={{
              fontSize: 17,
            }}>
            {strings.PAYMENT}
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}>
            {item.paymentMethod === 'stripe' || item.paymentMethod === 'card'
              ? strings.CARD
              : item.paymentMethod === 'cash'
              ? strings.COD
              : strings.GIFT_CARD}
          </Text>
        </View>

        {/* <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: '5%',

                }}>
                    <Text style={{
                        fontSize: 17
                    }}>
                        {strings.DATE}
                    </Text>
                    <Text style={{
                        fontSize: 16
                    }}>
                        {item?.readableDate}
                    </Text>
                </View> */}
      </View>
    );
  }

  handleCancelOrder = async () => {
    const {navigation} = this.props;
    const {item} = this.state;
    this.setState({
      isLoading: true,
    });
    const data = {
      orderId: item._id,
      cancelationReasonId:"NV25GlPuOnQ=",
    };
    try {
      const res = await postAPI(
        '/api/v1/user/cancelorder',
        JSON.stringify(data),
      );
      console.log("cancel orders", res);
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

  renderItemFlatlist() {
    const {item} = this.state;
    return (
      <View>
        <View
          style={{
            paddingVertical: '2%',
            backgroundColor: Colors.bgColor,
            paddingHorizontal: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.primaryRegular,
            }}>
            {strings.DETAILS}
          </Text>

          {item.orderStatus === 'pending' ||
          (item.paymentStatus === 'pending' &&
            item.paymentMethod === 'card') ? (
            <TouchableOpacity onPress={this.handleCancelOrder}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.primaryRegular,
                  color: Colors.textRed,
                }}>
                {strings.CANCEL_ORDER}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <FlatList
          style={{
            backgroundColor: 'transparent',
            height: 'auto',
          }}
          data={item.items}
          keyExtractor={(item, index) => item._id}
          renderItem={(item, index) => this.renderItem(item, index)}
        />
      </View>
    );
  }

  rating(value) {
    this.setState({ratingValue: value});
  }

  renderItem(item) {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: '5%',
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
        }}>
        <Text numberOfLines={1} style={styles.itemTitle}>
          {item.item.itemName}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
          }}>
          {item.item.itemTotal} {strings.SAR}
        </Text>
      </View>
    );
  }

  // ********* handle copy Order Id ********* //

  handleCopyOrderId = id => () => {
    Clipboard.setString(id);
    successAlert(strings.ALERT_COPIED);
  };

  // *********** Render & Handle Rating View ************ //

  showRatingView() {
    if (this.state.showRatingView == true) {
      return (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: wp('100%'),
            height: hp('100%'),
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#000000',
              opacity: 0.9,
            }}></View>

          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 5,
              width: wp('80%'),
              height: wp('100%'),
              alignItems: 'center',
            }}>
            <Text
              style={{
                width: 'auto',
                fontFamily: 'Arial',
                color: 'gray',
                textAlign: 'center',
                marginHorizontal: 25,
                marginTop: 20,
                fontSize: wp('5.33%'),
              }}>
              {'Rate Your Experience.'}
            </Text>

            <Text
              style={{
                width: 'auto',
                fontFamily: 'Arial',
                textAlign: 'center',
                marginHorizontal: 15,
                marginTop: 10,
                color: Colors.PrimaryColor,
                fontSize: wp('5.86%'),
              }}>
              {'Total'}
            </Text>

            <Text
              style={{
                width: 'auto',
                textAlign: 'center',
                marginHorizontal: 5,
                marginTop: 5,
                color: Colors.textBlack,
                fontSize: wp('8%'),
                fontFamily: Fonts.primaryBold,
              }}>
              $ {this.state.item.orderTotal}
            </Text>

            <View
              style={{
                height: 35,
                backgroundColor: 'transparent',
                marginTop: wp('2%'),
                width: 'auto',
                flexDirection: 'row',
              }}>
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
                    source={Images.starEmpty}
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
                    source={Images.starEmpty}
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
                    source={Images.starEmpty}
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
                    source={Images.starEmpty}
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
                    source={Images.starEmpty}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '90%',
                height: 70,
                marginTop: 20,
                borderColor: 'gray',
                borderBottomWidth: 0.0,
                backgroundColor: 'white',
              }}>
              <TextInput
                style={{
                  backgroundColor: 'white',
                  width: '100%',
                  height: 70,
                  borderWidth: 0.5,
                  borderColor: Colors.lineViewColor,
                  marginTop: 0,
                }}
                placeholder="Typing..."
                placeholderTextColor={'#818e97'}
                autoCorrect={false}
                onChangeText={ratingText => this.setState({ratingText})}
                value={this.state.ratingText}
              />
            </View>

            <TouchableOpacity
              onPress={() => this.submitReview()}
              style={{
                width: '80%',
                height: wp('13%'),
                borderRadius: 10,
                marginTop: wp('8%'),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.primary,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: 'white',
                }}>
                {'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render() {
    const {item} = this.state;
    const {navigation} = this.props;
    const {isLoading} = this.state;
    const screen = navigation.getParam('isFromOrderScreen');
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
          title={strings.ORDERS}
          navigation={navigation}
          screen={screen ? 'Orders' : 'TrackOrders'}
        />
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: Colors.White,
          }}>
          <View
            style={{
              marginTop: 0,
              backgroundColor: Colors.White,
              paddingBottom: '5%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.primaryBold,
                color: Colors.textBlack,
                paddingHorizontal: '5%',
                textAlign: 'left',
              }}>
              {strings.THIS_ORDER_WAS}{' '}
              {item?.orderStatus === Constants.TRIP_NOT_FOUND ||
              item?.orderStatus === Constants.TRIP_REQUESTED_ASSIGN_DRIVER
                ? strings.CONFIRMED
                : item?.orderStatus === 'cancelled'
                ? strings.CANCELLED
                : item?.orderStatus === 'declined'
                ? strings.DECLINED
                : item?.orderStatus === 'completed'
                ? strings.COMPLETED
                : item?.orderStatus}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: '5%',
                marginVertical: '3%',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.primaryBold,
                  color: Colors.textBlack,
                  textAlign: 'left',
                }}>
                {strings.ORDER_ID} {item?.customOrderId}
              </Text>

              <TouchableOpacity
                onPress={this.handleCopyOrderId(item?.customOrderId)}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                  source={Images.icCopy}
                />
              </TouchableOpacity>
            </View>

            {this.renderItemHeaderView()}
            {this.renderItemFlatlist()}
            {this.renderBillDetails()}
            {/* {this.showRatingView()} */}
            <Image
              style={{
                height: 70,
                width: 60,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
              }}
              source={Images.loginLogo}
            />
          </View>
        </ScrollView>

        {this.props.isBusy && isLoading ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    height: Platform.OS == 'android' ? 60 : 60,
    width: '100%',
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.primarySemibold,
    color: Colors.White,
  },
  itemHeaderView: {
    width: '100%',
    backgroundColor: Colors.White,
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    paddingTop: '5%',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
  },
  pickupCircle: {
    borderRadius: 25 / 2,
    backgroundColor: Colors.disableDotColor,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedLine: {
    height: 52,
    width: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignSelf: 'center',
    borderColor: Colors.disableDotColor,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    color: 'black',
  },
});
