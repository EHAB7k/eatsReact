import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import Activity from '../../components/ActivityIndicator';
//import { strings } from '../../Languages/StringsOfLanguages'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {TextInput} from 'react-native-gesture-handler';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {AsyncStorage} from 'react-native';
import {errorAlert} from '../../utils/genricUtils';
import {genericAlert} from '../../utils/genricUtils';
import {set} from 'immutable';

const serviceArray = [
  {
    value: 'dineIn',
    name: 'dineIn',
    name_ar: 'أكل في',
  },
  {
    value: 'pickUp',
    name: 'pickUp',
    name_ar: 'يلتقط',
  },
  {
    value: 'delivery',
    name: 'delivery',
    name_ar: 'توصيل',
  },
];

export default class AddCartDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      time: '',
      address: '',
      addressId: '',
      addressType: '',
      deliveryFee: 0.0,
      salesTax: 0.0,
      serviceTax: 0.0,
      localSalesTax: 0.0,
      subTotalValue: 0,
      totalValue: 0.0,
      cartItemsIds: '',
      paymentRefId: '',
      refreshing: false,
      promocode: 'none',
      tip: 'no',
      storeId: '',
      tipAmount: 0,
      custom: false,
      customTip: 0,
      tipSelection: 0,
      tipType: 'percentage',
      percentageTipSelectedAmount: 0,
      showSmallOrder: false,
      smallOrderFee: 0.0,
      isComingFromPromo: false,
      serviceType: 'delivery',
      redeemPoints: '',
      orderInstructions: '',
      giftCardBalance: false,
      insufficiantGiftBalance: false,
      redeemPoints: 0,
      userGiftCardBalance: 0,
      userPointsBalance: 0,
      usedGiftCardBalance: 0,
      payableAmount: 0,
      showRedeemPoints: false,
      redeemPointAmount: 0,

      // Previous Data

      cartItem: [],
      totalValue: 0,
      showTotalView: true,
      itemsCount: 0,
      storeImage: '',
      storeName: '',
      storeId: '',
      isBusyForClear: false,
      user_id: '',
    };
    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    console.log(
      'this.props?.response?.response',
      this.props?.response?.response,
    );
    const user_id = getConfiguration('user_id');
    this.setState({user_id});
    if (user_id) {
      const language = getConfiguration('language');
      let response = this.props?.response?.response || [];
      //  let response = [];

      this.setState({cartItem: response});
      const {profileData, getProfileAPI} = this.props;

      getProfileAPI()
        .then(() =>
          this.setState({
            userGiftCardBalance: profileData.userGiftCardBalance,
            userPointsBalance: profileData.userPointsBalance,
          }),
        )
        .catch(e => console.log('Error', e));
      if (response && response.length > 0) {
        let item = response[0];
        let image = item.restaurantImage;
        let storeName =
          language === 'ar' ? item.restaurantName_ar : item.restaurantName;
        let storeId = item.restaurantId;
        this.setState(
          {
            cartItem: response,
            storeImage: image,
            storeName: storeName,
            storeId: storeId,
            restaurantAddress: item.restaurantAddress,
          },
          () => {
            this.updateValueItemAndTotal(response);
          },
        );
      } else {
      }
      if (this.state.isComingFromPromo == false) {
        this.getData();
      }
    }
  };

  componentDidMount() {
    this.props
      .getDeliveryAddressAPI()
      .then(() => this.aftergetDeliveryAddress())
      .catch(e => this.showAlert(e.message, 300));
  }
  onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidFocus();
    this.props
      .getDeliveryAddressAPI()
      .then(() => this.aftergetDeliveryAddress())
      .catch(e => this.showAlert(e.message, 300));
    this.setState({refreshing: false});
  };
  aftergetDeliveryAddress() {
    let status = this.props.responseGetDeliveryAddress.response.status;
    let message = this.props.responseGetDeliveryAddress.response.message;
    if (status == 'failure') {
      if (message == 'Not Authorized') {
        //    Alert.alert(
        //      '',
        //      strings.ALERT_SESSION_EXP,
        //      [
        //        {
        //          text: strings.OK,
        //          onPress: () => this.logOut(),
        //        },
        //      ],
        //      {
        //        cancelable: false,
        //      },
        //    );
      } else {
        this.showAlert(message, 300);
      }

      return;
    }
    if (this.props.responseGetDeliveryAddress.response.data.length > 0) {
      var data = this.props.responseGetDeliveryAddress.response.data[0];

      this.setState({
        address: data.address,
        addressId: data._id,
        addressType: data.addressType,
      });
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

  getData() {
    let cartData = this.props?.responseAddCart?.response;
    if (cartData && cartData.status === 'success') {
      let showSmallOrder = false;
      var total = 0;
      console.log('get cart data ====', cartData);
      if (cartData?.itemSubTotal < cartData?.minOrderAmount) {
        total =
          cartData.itemSubTotal +
          cartData.deliveryFee +
          cartData.salesTaxAmount +
          cartData.serviceFeeAmount +
          cartData.smallOrderFee;
        showSmallOrder = true;
      } else {
        total =
          cartData.itemSubTotal +
          cartData.deliveryFee +
          cartData.salesTaxAmount +
          cartData.serviceFeeAmount;
        showSmallOrder = false;
      }
      total = Math.round(total * 100) / 100;
      this.setState({
        storeId: cartData.data[0].restaurantId,
        cartItemsIds: cartData.cartItemsIds,
        serviceTax: cartData.serviceFeeAmount,
        localSalesTax: cartData.salesTaxAmount,
        subTotalValue: cartData.itemSubTotal,
        totalValue: total,
        deliveryFee: cartData.deliveryFee,
        showSmallOrder: showSmallOrder,
        smallOrderFee: cartData.smallOrderFee,
      });
    }
  }

  goBack() {
    this.props.navigation.navigate('Cart');
  }

  addressDetails = data => {
    this.setState({
      address: data.address,
      addressId: data._id,
      addressType: data.addressType,
    });
  };

  addPromoCode = (myValue, isFormPromo) => {
    this.setState({isComingFromPromo: isFormPromo});
    this.setState(
      {
        promocode: myValue.promocode,
      },
      () => {
        this.clickOnContinueButton();
      },
    );
  };

  ChangeAddresses() {
    this.props.navigation.navigate('SavedAddresses', {
      onGoBack: this.addressDetails,
    });
  }

  renderHomeTile() {
    const language = getConfiguration('language');
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 0.5,
          paddingVertical: wp('5%'),
          paddingHorizontal: '5%',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{
              height: wp('10%'),
              width: wp('10%'),
              transform: [
                {
                  scaleX: language === 'ar' ? -1 : 1,
                },
              ],
            }}
            source={Images.homeTickIcon}
          />
          <View style={{marginLeft: '3%'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontFamily: Fonts.primaryBold,
                textAlign: 'left',
              }}>
              {strings.DELIVERY_TO} {this.state.addressType}
            </Text>
            <Text
              style={{
                width: wp('50%'),
                fontFamily: Fonts.primaryRegular,
                fontSize: 14,
                textAlign: 'left',
              }}>
              {this.state.address}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.ChangeAddresses()}>
          <Text
            style={{
              color: Colors.primary,
              fontSize: wp('4%'),
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.CHANGE}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderScheduleTile() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: hp('3%'),
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 0.5,
        }}>
        <Text style={{fontSize: wp('4%')}}>Scheduled:</Text>
        <Text
          style={{
            fontSize: wp('4%'),
            color: 'black',
            fontFamily: Fonts.primaryBold,
          }}>
          {this.state.date} {this.state.time}
        </Text>
      </View>
    );
  }

  clickOnCoupon() {
    const {promocode} = this.state;
    if (promocode !== 'none') {
      this.setState(
        {
          promocode: 'none',
        },
        () => {
          this.clickOnContinueButton();
        },
      );
    } else {
      this.props.navigation.navigate('CouponCode', {
        isFromAddOrder: true,
        itemAmount: this.state.subTotalValue,
        onGoBack: this.addPromoCode,
      });
    }
  }

  renderApplyCoupanTile() {
    const {promocode} = this.state;
    const language = getConfiguration('language');
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: hp('2%'),
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 1,
          paddingHorizontal: '5%',
        }}
        onPress={() => this.clickOnCoupon()}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{
              height: 22,
              width: 22,
              transform: [
                {
                  scaleX: language === 'ar' ? -1 : 1,
                },
              ],
            }}
            source={Images.discountIcon}
          />
          <View
            style={{
              marginLeft: '5%',
              width: wp('60%'),
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                marginLeft: wp('1%'),
                fontSize: 17,
              }}>
              {strings.APPLY_COUPON}
            </Text>
          </View>
        </View>

        <Image
          resizeMode="contain"
          style={{
            height: promocode !== 'none' ? wp('8%') : 15,
            width: promocode !== 'none' ? wp('8%') : 15,
            alignSelf: 'center',
            transform: [
              {
                scaleX: language === 'ar' ? -1 : 1,
              },
            ],
          }}
          source={promocode !== 'none' ? Images.crossIcon : Images.rightarrow}
        />
      </TouchableOpacity>
    );
  }

  tipAmount(tip, notChange) {
    if (tip == this.state.tipSelection && notChange == false) {
      this.setState({
        custom: false,
        customTip: 0,
        tipAmount: 0,
        tip: 'No',
        tipSelection: 0,
      });
      return;
    }
    var percent =
      (tip / 100) * (this.state.subTotalValue - this.state.promoCodeAmount);
    let value = Math.round(percent * 100) / 100;

    this.setState({
      custom: false,
      customTip: 0,
      tipAmount: value,
      tip: 'Yes',
      tipSelection: tip,
      tipType: 'percentage',
    });
  }

  calCulateOrderTotal() {
    let cartData = this.props.responseAddCart.response;
    let saleTax = this.calculateSalesTax(cartData);
    let serviceTax = this.calculateServiceTax(cartData);
    var totalValue = 0.0;
    let showSmallOrder = false;

    if (
      cartData.itemSubTotal - this.state.promoCodeAmount <
      cartData.minOrderAmount
    ) {
      totalValue =
        cartData.itemSubTotal +
        cartData.deliveryFee +
        saleTax +
        serviceTax +
        cartData.smallOrderFee;
      showSmallOrder = true;
    } else {
      totalValue =
        cartData.itemSubTotal + cartData.deliveryFee + saleTax + serviceTax;
      showSmallOrder = false;
    }

    totalValue = Math.round(totalValue * 100) / 100;

    //totalValue = (cartData.itemSubTotal) + cartData.deliveryFee + saleTax + serviceTax,
    this.setState({
      storeId: cartData.data[0].restaurantId,
      cartItemsIds: cartData.cartItemsIds,
      serviceTax: serviceTax,
      localSalesTax: saleTax,
      subTotalValue: cartData.itemSubTotal,
      totalValue: totalValue,
      deliveryFee: cartData.deliveryFee,
      showSmallOrder: showSmallOrder,
      smallOrderFee: cartData.smallOrderFee,
    });
  }

  calculateSalesTax(response) {
    let salesTaxPer = response.salesTax;
    var percent = (salesTaxPer / 100) * this.state.subTotalValue;
    let value = Math.round(percent * 100) / 100;
    return value;
  }

  calculateServiceTax(response) {
    let salesTaxPer = response.serviceFeeAmount;
    return salesTaxPer;
  }

  renderTipTile() {
    const {tipSelection} = this.state;
    return (
      <View
        style={{
          paddingVertical: hp('2%'),
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 10,
          paddingHorizontal: '5%',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: Fonts.primaryBold,
              color: 'black',
            }}>
            Select a tip amount
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: wp('4%'),
                color: 'black',
              }}>
              {/* {`${tipSelection}%  `} */}
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                color: Colors.Black,
              }}>
              $ {this.state.tipAmount}
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingVertical: hp('2%'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '60%',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: tipSelection == 5 ? Colors.primary : null,
                borderRadius: 5,
                borderColor: Colors.primary,
                borderWidth: 2,
              }}
              onPress={() => this.tipAmount(5, false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  color: tipSelection == 5 ? Colors.White : Colors.Black,
                }}>
                5%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: tipSelection == 10 ? Colors.primary : null,
                borderRadius: 5,
                borderColor: Colors.primary,
                borderWidth: 2,
              }}
              onPress={() => this.tipAmount(10, false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  color: tipSelection == 10 ? Colors.White : Colors.Black,
                }}>
                10%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: tipSelection == 15 ? Colors.primary : null,
                borderRadius: 5,
                borderColor: Colors.primary,
                borderWidth: 2,
              }}
              onPress={() => this.tipAmount(15, false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  color: tipSelection == 15 ? Colors.White : Colors.Black,
                }}>
                15%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: tipSelection == 20 ? Colors.primary : null,
                borderRadius: 5,
                borderColor: Colors.primary,
                borderWidth: 2,
              }}
              onPress={() => this.tipAmount(20, false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  color: tipSelection == 20 ? Colors.White : Colors.Black,
                }}>
                20%
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => this.enterTip()}>
            {this.state.custom ? (
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={{
                    marginRight: 10,
                    marginTop: -8,
                    color: Colors.placeholderColor,
                    height: 38,
                    width: 60,
                    textAlign: 'center',
                    fontSize: 13,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.lineViewColor,
                  }}
                  placeholder="Add Tip"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={customTip =>
                    this.setState({customTip: customTip})
                  }
                  value={this.state.customTip}></TextInput>
                <TouchableOpacity onPress={() => this.addCustomTip()}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: wp('4%'),
                      width: wp('4%'),
                      tintColor: 'black',
                      alignSelf: 'center',
                    }}
                    source={Images.greenTick}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    borderWidth: 2,
                    borderColor:
                      this.state.customTip > 0
                        ? Colors.primary
                        : Colors.lineViewColor,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                  }}>
                  Custom
                </Text>
                {this.state.customTip > 0 ? (
                  <TouchableOpacity
                    onPress={() => this.clearCutomTip()}
                    style={{paddingLeft: 10}}>
                    <Image
                      resizeMode="contain"
                      style={{
                        paddingLeft: 10,
                        top: 5,
                        height: wp('4%'),
                        width: wp('4%'),
                        alignSelf: 'center',
                      }}
                      source={Images.crossIcon}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  clearCutomTip() {
    this.setState({
      custom: false,
      customTip: 0,
      tipAmount: 0,
      tip: 'No',
      tipSelection: 0,
      tipType: 'percentage',
    });
  }

  addCustomTip() {
    if (this.state.customTip.length == 0) {
      this.setState({
        custom: false,
        customTip: 0,
        tipAmount: 0,
        tip: 'No',
        tipSelection: 0,
        tipType: 'percentage',
      });

      return;
    }
    let ct = parseInt(this.state.customTip);
    var total =
      this.state.subTotalValue +
      this.state.deliveryFee +
      ct +
      this.state.salesTax;
    this.setState({tipAmount: ct, custom: false, tipType: 'flat'});
  }

  enterTip() {
    this.setState({custom: true, tipSelection: 0});
  }

  renderBillDetails() {
    let newTotalValue = this.state.totalValue;
    newTotalValue = Math.round(newTotalValue * 100) / 100;
    const {
      serviceType,
      redeemPoints,
      giftCardBalance,
      usedGiftCardBalance,
      payableAmount,
      showRedeemPoints,
      redeemPointAmount,
      promocode,
    } = this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          paddingTop: hp('2%'),
          paddingHorizontal: '5%',
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontFamily: Fonts.primaryBold,
            fontSize: 20,
            color: Colors.textBlack,
            textAlign: 'left',
          }}>
          {strings.BILL_DETAILS}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
          }}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: wp('4%'),
            }}>
            {strings.ITEM_TOTAL}
          </Text>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: Fonts.primarySemibold,
            }}>
            {this.state.subTotalValue} {strings.SAR}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
          }}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: wp('4%'),
            }}>
            {strings.TAX_N_FEES}
          </Text>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: Fonts.primarySemibold,
            }}>
            {this.state.localSalesTax + this.state.serviceTax} {strings.SAR}
          </Text>
        </View>

        {serviceType === 'delivery' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text
              style={{
                fontFamily: Fonts.primarySemibold,
                fontSize: wp('4%'),
              }}>
              {strings.DELIVERY_FEE}
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
              }}>
              {this.state.deliveryFee} {strings.SAR}
            </Text>
          </View>
        )}

        {showRedeemPoints && redeemPointAmount ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              {strings.REDEEM}
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              -{redeemPointAmount} {strings.SAR}
            </Text>
          </View>
        ) : null}

        {giftCardBalance && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              {strings.GIFT_CARD}
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              -{usedGiftCardBalance.toFixed(2)} {strings.SAR}
            </Text>
          </View>
        )}

        {giftCardBalance || redeemPointAmount ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              {strings.PAYABLE_AMOUNT}
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
              }}>
              {payableAmount} {strings.SAR}
            </Text>
          </View>
        ) : null}

        {this.state.showSmallOrder == true ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: hp('2%'),
            }}>
            <Text style={{fontSize: wp('4%'), color: 'grey'}}>
              {strings.SMALL_ORDER_FEE}
            </Text>
            <Text style={{fontSize: wp('4%'), color: 'grey'}}>
              {this.state.smallOrderFee} {strings.SAR}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp('2%'),
            borderBottomColor: Colors.lineViewColor,
            borderBottomWidth: 0.5,
          }}>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.TOTAL}
          </Text>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: Fonts.primaryBold,
            }}>
            {newTotalValue} {strings.SAR}
          </Text>
        </View>
      </View>
    );
  }

  renderPlaceOrderButton() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.addOrderApi()}
          style={{
            width: '80%',
            height: 60,
            marginVertical: '10%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            borderRadius: 30,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: Fonts.primaryBold,
            }}>
            {strings.PROCESS_TO_PAY}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  addOrderApi() {
    if (this.state.addressId.length == 0) {
      this.showAlert('Please select Address', 300);
      return;
    } else if (this.state.serviceType.length === 0) {
      this.showAlert(strings.ALERT_SELECT_SERVICE_TYPE, 300);
      return;
    }
    let tip = this.state.tipAmount > 0 ? 'yes' : 'no';
    let orderDict = {
      isFromAddOrder: true,
      addressId: this.state.addressId,
      storeId: this.state.storeId,
      promocode: this.state.promocode,
      tipAmount:
        this.state.tipType == 'percentage'
          ? this.state.tipSelection
          : this.state.tipAmount,
      cartItemsIds: this.state.cartItemsIds,
      date: this.state.date,
      time: this.state.time,
      isTip: tip,
      tipType: this.state.tipType,
      serviceType: this.state.serviceType,
      orderInstructions: this.state.orderInstructions,
      giftCardPayment: this.state.giftCardBalance,
      insufficiantGiftBalance: this.state.insufficiantGiftBalance,
      giftCardBalanceUsed: this.state.usedGiftCardBalance,
      pointsIntoBalance: this.state.redeemPointAmount,
    };
    this.props.navigation.navigate('AccountDetailScreen', {
      orderInfo: orderDict,
    });
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  // ******** Handle Service Type ******** //

  handleServiceTypeChange = item => () => {
    this.setState(
      {
        serviceType: item.value,
      },
      () => this.clickOnContinueButton(),
    );
  };

  renderServiceType = () => {
    const {serviceType} = this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          paddingHorizontal: '5%',
          paddingVertical: '3%',
        }}>
        <Text
          style={{
            fontFamily: Fonts.primaryBold,
            fontSize: 17,
            color: Colors.textBlack,
            textAlign: 'left',
          }}>
          {strings.SELECT_SERVICE_TYPE}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '5%',
          }}>
          {serviceArray.map(item => (
            <TouchableOpacity
              onPress={this.handleServiceTypeChange(item)}
              style={{
                width: '30%',
                paddingVertical: '2.5%',
                alignItems: 'center',
                backgroundColor:
                  serviceType === item.value ? Colors.primary : Colors.White,
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryRegular,
                }}>
                {language === 'ar' ? item.name_ar : item.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // ******** Handle Redeem Points ******** //

  handleAddRedeemPoints = () => {
    const {redeemPoints, userPointsBalance, giftCardBalance, payableAmount} =
      this.state;
    const {profileData} = this.props;
    if (redeemPoints < 100) {
      errorAlert(strings.ALERT_REDEEM_POINTS_VALUE_LIMIT);
    } else if (giftCardBalance && payableAmount === 0) {
      errorAlert(strings.ALERT_NO_AMOUNT_TO_REDEEM);
    } else if (userPointsBalance >= redeemPoints) {
      this.setState(
        {
          showRedeemPoints: true,
        },
        () => this.clickOnContinueButton(),
      );
    } else {
      errorAlert(strings.ALERT_INSUFFICIANT_POINTS);
    }
  };

  renderRedeemPoints = () => {
    const {redeemPoints} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: '3%',
          paddingHorizontal: '5%',
          justifyContent: 'space-between',
          borderBottomColor: Colors.lineViewColor,
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontFamily: Fonts.primaryRegular,
            fontSize: 15,
            color: Colors.textBlack,
          }}>
          {strings.REDEEM_POINTS}
        </Text>
        <View
          style={{
            alignItems: 'center',
          }}>
          <View
            style={{
              paddingHorizontal: '8%',
              paddingVertical: '3%',
              backgroundColor: Colors.bgColor,
              borderRadius: 20,
            }}>
            <TextInput
              style={{
                fontFamily: Fonts.primaryLight,
                fontSize: 14,
                color: Colors.textBlack,
                width: 100,
                padding: 0,
              }}
              keyboardType="phone-pad"
              onChangeText={redeemPoints =>
                this.setState({
                  redeemPoints,
                })
              }
              value={redeemPoints}
            />
          </View>
          <Text
            style={{
              fontFamily: Fonts.primaryRegular,
              fontSize: 13,
              color: Colors.textLightGrey,
            }}>
            {strings.RP_CONVERSION}
          </Text>
        </View>
        <TouchableOpacity onPress={this.handleAddRedeemPoints}>
          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 18,
              color: Colors.primary,
            }}>
            {strings.REDEEM}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ******** Handle Gift Card Balance ******** //

  handleUseGiftCard = () => {
    const {profileData} = this.props;
    const {totalValue, giftCardBalance} = this.state;
    if (giftCardBalance === true) {
      this.setState(
        {
          giftCardBalance: false,
          insufficiantGiftBalance: false,
          userGiftCardBalance: profileData.userGiftCardBalance,
          usedGiftCardBalance: 0,
        },
        () => this.clickOnContinueButton(),
      );
    } else if (
      profileData.userGiftCardBalance > 0 &&
      profileData.userGiftCardBalance < totalValue
    ) {
      this.setState(
        {
          insufficiantGiftBalance: true,
          giftCardBalance: !giftCardBalance,
        },
        () => this.clickOnContinueButton(),
      );
    } else if (profileData.userGiftCardBalance > 0) {
      this.setState(
        {
          giftCardBalance: !giftCardBalance,
        },
        () => this.clickOnContinueButton(),
      );
    } else {
      errorAlert(strings.ALERT_INSUFFICIANT_GIFT_BALANCE);
    }
  };

  renderGiftCardView = () => {
    const {giftCardBalance, userGiftCardBalance} = this.state;
    const {profileData} = this.props;
    return (
      <View
        style={{
          paddingHorizontal: '5%',
          paddingVertical: '4%',
          borderBottomWidth: 1,
          borderColor: Colors.lineViewColor,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={this.handleUseGiftCard}>
            <Image
              style={{
                height: 25,
                width: 25,
                resizeMode: 'contain',
              }}
              source={
                giftCardBalance ? Images.icGiftCheck : Images.icGiftUncheck
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: Fonts.primaryRegular,
              fontSize: 16,
              color: Colors.textLightGrey,
              marginLeft: '4%',
            }}>
            {strings.USE_GIFT_CARD_BALANCE}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontFamily: Fonts.primaryRegular,
            color: Colors.primary,
            width: '40%',
            textAlign: 'right',
          }}>
          {userGiftCardBalance.toFixed(2)} {strings.SAR}
        </Text>
      </View>
    );
  };

  // ******* Handle qty change function & render  ******** //

  renderItemHeaderView() {
    return (
      <View style={styles.itemHeaderView}>
        <Image
          resizeMode="cover"
          style={styles.headerImageView}
          source={
            this.state.storeImage !== 'null'
              ? {uri: this.state.storeImage}
              : Images.registerBGIcon
          }
        />
        <View
          style={{
            width: '80%',
          }}>
          <Text style={styles.headerTitle}>{this.state.storeName}</Text>
          <Text numberOfLines={3} style={styles.addressStyle}>
            {this.state.restaurantAddress}
          </Text>
        </View>
      </View>
    );
  }

  renderItemFlatlist() {
    return (
      <FlatList
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            titleColor={Colors.primary}
            onRefresh={this.onRefresh}
          />
        }
        style={{
          marginTop: 0,
          backgroundColor: 'transparent',
          height: 'auto',
          marginHorizontal: 0,
        }}
        data={this.state.cartItem}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => this.renderItem(item, index)}
      />
    );
  }

  renderItem(item, index) {
    const language = getConfiguration('language');
    if (item.qty > 0) {
      return (
        <View
          style={{
            width: '100%',
            marginTop: 0,
            flexDirection: 'row',
            backgroundColor: Colors.White,
          }}>
          <View
            style={{
              width: '60%',
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {language === 'ar' ? item.itemName_ar : item.itemName}
            </Text>
            <Text style={styles.priceText}>
              {language === 'ar' ? item.itemDesc_ar : item.itemDesc}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                flexWrap: 'wrap',
              }}>
              {item.addons.map((itm, ind) =>
                itm.items.map((i, index) =>
                  i.isSelected ? (
                    <Text style={styles.priceText}>
                      {language === 'ar' ? i.name_ar : i.name}
                      {item.addons.length === ind + 1 &&
                      itm.items.filter(i => i.isSelected).length === index + 1
                        ? ''
                        : ','}
                    </Text>
                  ) : null,
                ),
              )}
            </View>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              width: '30%',
              marginLeft: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                height: 30,
              }}>
              {/* + , -  */}
              <View
                style={{
                  flexDirection: 'row',
                  width: 'auto',
                  borderColor: Colors.green,
                  borderWidth: 1,
                  borderRadius: 12,
                  height: 24,
                }}>
                <TouchableOpacity
                  onPress={() => this.decreaseQuantity(item, index)}>
                  <View
                    style={{
                      width: 22,
                      backgroundColor: 'transparent',
                      height: 'auto',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginBottom: 5,
                        color: Colors.green,
                        fontSize: 15,
                        fontFamily: Fonts.primaryRegular,
                      }}>
                      -
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    width: 'auto',
                    backgroundColor: Colors.green,
                    height: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: Fonts.primaryRegular,
                      marginLeft: 5,
                      marginRight: 5,
                    }}>
                    {item.qty}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.increaseQuantity(item)}>
                  <View
                    style={{
                      width: 22,
                      backgroundColor: 'transparent',
                      height: 'auto',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginBottom: 5,
                        color: Colors.green,
                        fontSize: 15,
                        fontFamily: Fonts.primaryRegular,
                      }}>
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: Colors.textLightGrey,
                fontSize: 15,
                fontFamily: Fonts.primaryRegular,
              }}>
              {item.qty * (item.price + item.addOnTotalValue)} {strings.SAR}
            </Text>
          </View>
        </View>
      );
    }
  }

  increaseQuantity(item) {
    var qtyValue = item.qty;
    item.qty = qtyValue + 1;
    const some_array = this.state.cartItem;
    this.setState({cartItem: some_array, showTotalView: true}, () => {
      this.updateValueItemAndTotal(some_array);
      this.clickOnContinueButton();
    });
  }

  decreaseQuantity(item, index) {
    const {cartItem} = this.state;
    const updatedArray = cartItem.map((itm, idx) =>
      itm._id === item._id && idx === index
        ? {
            ...itm,
            qty: itm.qty - 1,
          }
        : itm,
    );
    const filterArray = updatedArray.filter(itm => !itm.qty == 0);
    this.setState(
      {
        cartItem: filterArray,
      },
      () => {
        this.updateValueItemAndTotal(filterArray);
        this.clickOnContinueButton();
      },
    );
  }

  updateValueItemAndTotal(cartItem) {
    this.setItemsDataInRedux(cartItem);
  }

  setItemsDataInRedux(item) {
    this.props
      .ItemRecordsApi(item)
      .then(() => this.afterSetItemsDataInRedux())
      .catch(e => console.log(e.message));
  }

  afterSetItemsDataInRedux() {
    this.setState({isBusyForClear: false});
    // this.getData();
  }

  clickOnContinueButton() {
    var items = [];
    this.state.cartItem.forEach(myFunction);
    function myFunction(item, arr) {
      let newItem = {};
      newItem.itemId = item._id;
      newItem.qty = item.qty;
      newItem.itemName = item.itemName;
      newItem.itemName_ar = item.itemName_ar;
      newItem.price = item.price;
      newItem.categoryId = item.categoryId;
      if (item?.selectedSize) {
        newItem.selectedSize = item?.selectedSize;
      }
      newItem.addons = item.addons
        .map(it => it.items.filter(itm => itm.isSelected))
        .flat()
        .map(data => ({
          _id: data._id,
          name: data.name,
          price: data.price,
          name_ar: data.name_ar,
        }));

      if (item.qty > 0) {
        items.push(newItem);
      }
    }
    this.addCartAPI(items);
  }

  addCartAPI(items) {
    const {
      serviceType,
      giftCardBalance,
      userGiftCardBalance,
      userPointsBalance,
      showRedeemPoints,
      redeemPoints,
      promocode,
    } = this.state;
    this.props
      .addCartAPI(
        items,
        this.state.storeId,
        serviceType,
        promocode,
        giftCardBalance ? userGiftCardBalance : null,
        showRedeemPoints ? redeemPoints : null,
      )
      .then(() => this.afterAddCartAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterAddCartAPI() {
    const {status, message} = this.props.responseAddCart.response;
    const {showRedeemPoints} = this.state;
    const {response} = this.props.responseAddCart;
    if (status == 'success') {
      this.setState({
        totalValue: response.finalTotal,
        subTotalValue: response.itemSubTotal,
        localSalesTax: response.salesTax,
        serviceTax: response.serviceFeeAmount,
        deliveryFee: response.deliveryFee,
      });
      this.calCulateOrderTotal();
      if (response.giftCardBalUsed > 0) {
        this.setState(
          {
            usedGiftCardBalance: response.giftCardBalUsed,
            // userGiftCardBalance: response.pendingGiftCardBal,
            payableAmount: response.paybalAmount,
          },
          () => {
            if (response.paybalAmount > 0) {
              this.setState({
                insufficiantGiftBalance: true,
              });
            } else {
              this.setState({
                insufficiantGiftBalance: false,
              });
            }
          },
        );
      }
      if (showRedeemPoints) {
        this.setState({
          redeemPointAmount: response?.redeemPointAmount,
          redeemPoints: 0,
          payableAmount: response.paybalAmount,
        });
      }
    } else if (status == 'failure') {
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
    const {navigation, isBusyGetDeliveryAddress, isBusyAddCart, profileLoader} =
      this.props;
    const {orderInstructions} = this.state;
    const flow = navigation.getParam('flow');
    const language = getConfiguration('language');
    return this.state.user_id == '' &&
      !isBusyGetDeliveryAddress &&
      !isBusyAddCart &&
      !profileLoader ? (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <Header
          title={strings.ADD_CART}
          navigation={navigation}
          screen={flow ? flow : ''}
          hideLeftButton={flow ? false : true}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text style={{textAlign: 'center'}}>
            You are in Guest Mode if you want to create your profile you need to
            login first.
          </Text>
          <View style={styles.arrowTile2}>
            <TouchableOpacity
              style={styles.touchableArrow}
              onPress={() => this.logOut()}>
              <Text
                style={{
                  fontFamily: Fonts.primarySemibold,
                  fontSize: 20,
                  color: Colors.secondary,
                }}>
                {strings.Login}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : isBusyGetDeliveryAddress || isBusyAddCart || profileLoader ? (
      <Activity />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <Header
          title={strings.ADD_CART}
          navigation={navigation}
          screen={flow ? flow : ''}
          hideLeftButton={flow ? false : true}
        />
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              titleColor={Colors.primary}
              onRefresh={this.onRefresh}
            />
          }
          style={{
            flex: 1,
            backgroundColor: Colors.White,
          }}>
          {this.state.cartItem && this.state.cartItem.length > 0 ? (
            <>
              {/* Item Qty chnages data rendering */}

              {this.renderItemHeaderView()}
              {this.renderItemFlatlist()}

              {/* Special Instruction Input */}

              <View
                style={{
                  marginHorizontal: '5%',
                  marginVertical: '6%',
                  paddingVertical: '2%',
                  paddingHorizontal: '5%',
                  backgroundColor: Colors.inputBgGray,
                  borderRadius: 30,
                }}>
                <TextInput
                  style={{
                    padding: 0,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textBlack,
                    fontSize: 16,
                    textAlign: language === 'ar' ? 'right' : 'left',
                  }}
                  placeholder={strings.PH_SPECIAL_INSTRUCTIONS}
                  placeholderTextColor={Colors.textBlack}
                  value={orderInstructions}
                  onChangeText={orderInstructions =>
                    this.setState({
                      orderInstructions,
                    })
                  }
                />
              </View>

              {this.renderApplyCoupanTile()}
              {this.renderRedeemPoints()}
              {this.renderBillDetails()}
              {this.renderGiftCardView()}
              {this.renderServiceType()}
              {this.renderHomeTile()}
              {this.renderPlaceOrderButton()}
            </>
          ) : (
            <Text style={styles.txtNoLoads}> {strings.NO_CART_AVAILABLE} </Text>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: Fonts.primarySemibold,
    color: Colors.White,
  },
  touchableArrow: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 25,
  },
  arrowTile2: {
    marginHorizontal: '8%',
    width: '90%',
    marginTop: '5%',
  },
  itemHeaderView: {
    marginTop: 0,
    height: 100,
    width: '100%',
    backgroundColor: Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImageView: {
    height: 70,
    width: 70,
    borderRadius: 10,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
    marginLeft: 10,
    width: '90%',
    textAlign: 'left',
  },
  addressStyle: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textGrey,
    marginLeft: 10,
    width: '50%',
    textAlign: 'left',
  },
  txtNoLoads: {
    marginTop: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: wp('5.86%'),
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: Fonts.primaryBold,
    color: Colors.Black,
    marginLeft: 10,
    textAlign: 'left',
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
    color: Colors.Black,
    marginLeft: 10,
    textAlign: 'left',
  },
});
