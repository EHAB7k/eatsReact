import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {genericAlert} from '../../utils/genricUtils';
import Fonts from '../../utils/Fonts';
import Activity from '../../components/ActivityIndicator';
import moment from 'moment-timezone';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {ScrollView} from 'react-native-gesture-handler';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {postAPI} from '../../utils/api';
import {errorAlert, successAlert} from '../../utils/genricUtils';

export default class AccountDetail extends Component {
  constructor(props) {
       
    super(props);
    console.log("this.props.navigation.getParam('orderInfo', '')",this.props.navigation.getParam('orderInfo', '') );

    this.state = {
      dataSource: [],
      dataSourcePast: [],
      selTab: '0',
      underLineLeft: 0,
      isFromAddOrderScreen: false,
      addOrderInfo: {},
      isLoading: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {navigation, responseGetEverything} = this.props;
    const orderInfo = navigation.getParam('orderInfo', '');
    this.getOrderInfo();
    let newData = [];
    if (
      responseGetEverything.response.data != null &&
      responseGetEverything.response.data != 'null'
    ) {
      let data = responseGetEverything.response.data.userPaymentList;
      data.forEach(myFunction);
      function myFunction(item, index, arr) {
        if (item.type != 'Cash' && item.type !== 'Wallet') {
          newData.push(item);
        }
      }
      this.setState({
        dataSource: newData,
      });
    }
  };

  getOrderInfo() {
    var orderInfo = this.props.navigation.getParam('orderInfo', '');
    if (orderInfo && orderInfo.isFromAddOrder) {
      this.setState({
        addOrderInfo: orderInfo,
        isFromAddOrderScreen: orderInfo.isFromAddOrder,
      });
    }
  }

  goBack() {
    this.props.navigation.goBack();
  }

  openDrawerClick() {
    if (this.state.isFromAddOrderScreen == true) {
      this.props.navigation.navigate('AddCartDetails');
    } else {
      this.props.navigation.dispatch(DrawerActions.openDrawer());
    }
  }

  openDetail(item) {
    this.props.navigation.navigate('Detail', {selectedItem: item});
  }

  openDetailPast(item) {
    this.props.navigation.navigate('PastDetail', {selectedItem: item});
  }

  addCardAction() {
    this.props.navigation.navigate('AddCardScreen', {
      orderInfo: this.state.addOrderInfo,
    });
  }

  selectedItemForAddOrder(item) {
    if (this.state.isFromAddOrderScreen == true) {
      // this.addOrderApi("stripe", item._id)
      this.addOrderApi('card', item._id);
    }
  }

  addOrderApi(paymentMethod, paymentRefId) {
    let timezone = moment.tz.guess();
   
    this.props
      .addOrderAPI(
        this.state.addOrderInfo.addressId,
        this.state.addOrderInfo.storeId,
        paymentMethod,
        paymentRefId,
        this.state.addOrderInfo.promocode,
        this.state.addOrderInfo.tipAmount,
        this.state.addOrderInfo.cartItemsIds,
        this.state.addOrderInfo.date,
        this.state.addOrderInfo.time,
        this.state.addOrderInfo.isTip,
        timezone,
  
        this.state.addOrderInfo.tipType,
        this.state.addOrderInfo.orderInstructions,
        this.state.addOrderInfo.serviceType,
        this.state.addOrderInfo.giftCardBalanceUsed,
        this.state.addOrderInfo.pointsIntoBalance,
      )
      .then(() => {
        this.afterAddOrderApi();
      })
      .catch(e => this.showAlert(e.message, 300));
  }

  afterAddOrderApi() {
    let status = this.props.responseAddOrder.response.status;
    let message = this.props.responseAddOrder.response.message;
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
    if (status != 'failure') {
      this.setItemsDataInRedux();
      this.props.navigation.navigate('ThankyouScreen');
    } else {
      this.showAlert(this.props.responseAddOrder.response.message, 300);
    }
  }

  setItemsDataInRedux() {
    this.props
      .ItemRecordsApi([])
      .then(() => this.afterSetItemsDataInRedux())
      .catch(e => console.log(e.message));
  }

  afterSetItemsDataInRedux() {
    // this.getData();
  }

  // ******* Handle gift card purchase API ******* //

  handlePurchaseGiftCard = async (item, passedData) => {
    try {
      const details = {
        giftCardId: passedData.id,
        // "paymentMethod": "stripe",
        paymentMethod: 'card',
        paymentSourceRefNo: item._id,
        sendTo: passedData.email,
        sendFrom: passedData.name,
        message: passedData.msg,
        quantity: passedData.qty,
      };
      const res = await postAPI(
        '/api/v1/user/purchaseGiftCard',
        JSON.stringify(details),
      );
      if (res?.status === 'success') {
        this.props.navigation.navigate('GiftCardThanks');
      } else {
        errorAlert(res?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderItem(item, index) {
    const {navigation} = this.props;
    const {isFromAddOrderScreen} = this.state;
    const passedData = navigation.getParam('item');
    const orderInfo = this.props.navigation.getParam('orderInfo', '');

    if (item.type != 'Cash' && item.type !== 'Wallet') {
      if (item.lastd != 'lastd') {
        return (
          <TouchableOpacity
            style={styles.loadDetail}
            onPress={() =>
              passedData?.screenFlow === 'GiftCard'
                ? this.handlePurchaseGiftCard(item, passedData)
                : orderInfo?.insufficiantGiftBalance
                ? this.handleInsufficiantGiftCardPayment(item)
                : this.selectedItemForAddOrder(item)
            }>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 50,
                    marginHorizontal: 10,
                  }}
                  source={{uri: item.logo}}
                />
                <Text
                  style={{
                    color: Colors.textBlack,
                    marginLeft: 10,
                    alignSelf: 'center',
                    marginLeft: 10,
                    fontSize: 16,
                  }}>{`**** ${item.lastd}`}</Text>
              </View>
              {!isFromAddOrderScreen && (
                <TouchableOpacity
                  onPress={() => this.deleteCard(item._id)}
                  style={{
                    borderRadius: 20,
                    width: 80,
                    height: 30,
                    alignItems: 'center',
                    top: 10,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 10,
                      tintColor: Colors.primary,
                    }}
                    source={Images.icCardBin}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        );
      } else {
        return <View></View>;
      }
    }
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
    // var selectpaymentArray = this.props.responseGetEverything.response.data.userPaymentList;
    let newData = [];
    let data = this.props.responseGetEverything.response.data.userPaymentList;
    data.forEach(myFunction);
    function myFunction(item, index, arr) {
      if (item.type != 'Cash' && item.type != 'Wallet') {
        newData.push(item);
      }
    }
    //console.log("response", this.props.response.response.data.selectpayment)

    this.setState({
      dataSource: newData,
    });
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch(e => this.showAlert());
  }

  afterGetProfile() {
    this.setState({
      dataSource: this.props.response.response.data.selectpayment,
    });
  }

  deleteCard(cardId) {
    Alert.alert(strings.ALERT, strings.ALERT_DELETE, [
      {text: strings.OK, onPress: () => this.deleteCard1(cardId)},
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  }

  deleteCard1(cardId) {
    this.props
      .deleteCardAPI(cardId)
      .then(() => this.afterDeleteCard())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterDeleteCard() {
    let status = this.props.responseDelete.response.status;
    let message = this.props.responseDelete.response.message;
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
    this.getEverything();
    this.showAlert(strings.ALERT_CARD_DELETED, 300);
  }

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  handleCODPress = () => {
    this.addOrderApi('cash', 'cash');
  };
  handleCARDPress = () => {
    Alert.alert(strings.ALERT, strings.CARD_PAYMENT_ALERT, [
      {text: strings.OK, onPress: () => this.addOrderApi('card', 'card')},
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
    // alert(CARD_PAYMENT_ALERT);
    // this.addOrderApi('card', 'card');
  };

  handleGiftCardPayment = () => {
    this.addOrderApi('giftcard', 'giftcard');
  };

  handleInsufficiantGiftCardPayment = item => {
    this.addOrderApi('giftcard', item._id);
  };

  render() {
    const {isFromAddOrderScreen, isLoading} = this.state;
    const {navigation} = this.props;
    const passedData = navigation.getParam('item');
    const orderInfo = this.props.navigation.getParam('orderInfo', '');

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: Colors.secondary,
          }}></SafeAreaView>

        <View style={{flex: 1}}>
          <Header
            title={true ? strings.PAYMENT_METHOD : strings.PAYMENT_DETAILS}
            menu={
              passedData?.screenFlow === 'GiftCard'
                ? false
                : !isFromAddOrderScreen
            }
            navigation={navigation}
          />

          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              paddingTop: isFromAddOrderScreen ? '8%' : '3%',
              paddingBottom: '3%',
            }}>
            {isFromAddOrderScreen && !orderInfo.giftCardPayment ? (
              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={this.handleCODPress}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginHorizontal: '6%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}>
                  <View
                    style={{
                      width: 'auto',
                      height: 50,
                      flexDirection: 'row',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: Colors.textBlack,
                        marginLeft: 10,
                        alignSelf: 'center',
                        fontSize: 17,
                        fontFamily: Fonts.primaryRegular,
                      }}>
                      {strings.COD}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* CARD PAYMENT */}
                <TouchableOpacity
                  onPress={this.handleCARDPress}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginHorizontal: '6%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                    top: 20,
                  }}>
                  <View
                    style={{
                      width: 'auto',
                      height: 50,
                      flexDirection: 'row',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: Colors.textBlack,
                        marginLeft: 10,
                        alignSelf: 'center',
                        fontSize: 17,
                        fontFamily: Fonts.primaryRegular,
                      }}>
                      {strings.CARD_PAYMENT}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* CARD PAYMENT */}
              </View>
            ) : null}

            {orderInfo.giftCardPayment && !orderInfo.insufficiantGiftBalance ? (
              <TouchableOpacity
                onPress={this.handleGiftCardPayment}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  marginHorizontal: '6%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}>
                <View
                  style={{
                    width: 'auto',
                    height: 50,
                    flexDirection: 'row',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: Colors.textBlack,
                      marginLeft: 10,
                      alignSelf: 'center',
                      fontSize: 17,
                      fontFamily: Fonts.primaryRegular,
                    }}>
                    {strings.GIFT_CARD_PAYMENT}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  style={{flex: 1}}
                  contentContainerStyle={{
                    paddingVertical: '5%',
                  }}
                  data={this.state.dataSource}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => this.renderItem(item, index)}
                  keyExtractor={item => `${item.id}`}
                />
              </View>
            )}
          </ScrollView>
          {/* {orderInfo?.giftCardPayment === true &&
          orderInfo.insufficiantGiftBalance === false ? null : (
            <TouchableOpacity
              onPress={() => this.addCardAction()}
              style={{
                position: 'absolute',
                bottom: '10%',
                right: 35,
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 60,
                  width: 60,
                }}
                source={Images.plusIcon}
              />
            </TouchableOpacity>
          )} */}
        </View>

        {this.props.isBusy ||
        this.props.isBusyAddOrder ||
        this.props.isBusyDelete ||
        isLoading ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: Colors.navigationTitle,
    fontFamily: Fonts.primarySemibold,
  },
  loadDetail: {
    backgroundColor: 'white',
    marginHorizontal: '6%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: '3%',
  },
});
