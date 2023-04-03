import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Activity from '../../components/ActivityIndicator';
import Fonts from '../../utils/Fonts';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Constants from '../../utils/Constants';
import {Header} from '../../components/Header';
import {genericAlert} from '../../utils/genricUtils';
import strings from '../../constants/lang';

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selTab: '0',
      underLineLeft: 0,
      upcomingData: [],
      pastData: [],
      user_id: '',
    };

    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const user_id = getConfiguration('user_id');
    this.setState({user_id});
    if (user_id) {
      this.setState(
        {
          underLineLeft: wp(0),
          selTab: '0',
        },
        () => this.getOrderHistoryAPI(),
      );
    }
  };

  componentDidMount() {
    const user_id = getConfiguration('user_id');
    this.setState({user_id});
    if (user_id) {
      this.socket = getConfiguration('Socket', '');
      this.socket.on('order_customer_socket', data => {
        var status = data.type;
        if (
          status == Constants.OrderStatusCompleted ||
          status == 'declined' ||
          status == 'orderDeclined' ||
          status == 'orderCancelled' ||
          status == 'orderCompleted'
        ) {
          this.getOrderHistoryAPI();
        }
      });
    }
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }
  // use
  getOrderHistoryAPI() {
    this.props
      .getOrderHistoryAPI()
      .then(() => this.afterGetOrderHistoryAPI())
      .catch(e => this.showAlert(e.message, 300));
  }
  //use
  afterGetOrderHistoryAPI() {
    let upcomingData = this.props.responseOrderHistory.response.data.upcoming;
    let pastData = this.props.responseOrderHistory.response.data.past;

    this.setState({
      upcomingData: upcomingData,
      pastData: pastData,
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

  tab1Click() {
    this.setState({
      underLineLeft: wp(0),
      selTab: '0',
    });
    this.getOrderHistoryAPI();
  }

  tab2Click() {
    this.setState({
      underLineLeft: wp('50%'),
      selTab: '1',
    });
    this.getOrderHistoryAPI();
  }

  renderUpcomingAndPastView(item, index) {
    if (this.state.selTab == '0') {
      return (
        <View
          style={{
            width: wp('100%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {this.renderUpcomingList(item, index)}
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: wp('100%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {this.renderPastList(item, index)}
        </View>
      );
    }
  }

  renderUpcomingPastHeadingTile() {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          backgroundColor: Colors.White,
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.White,
            height: wp('10%'),
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{
              width: wp('50%'),
              alignItems: 'center',
            }}
            onPress={() => this.tab1Click()}>
            <Text
              style={{
                fontSize: 19,
                fontFamily: Fonts.primaryBold,
                color: Colors.textBlack,
              }}>
              {strings.UPCOMING}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: wp('50%'), alignItems: 'center'}}
            onPress={() => this.tab2Click()}>
            <Text
              style={{
                fontSize: 19,
                fontFamily: Fonts.primaryBold,
                color: Colors.textBlack,
              }}>
              {strings.PAST}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: Colors.borderColor,
            height: 2,
            left: 0,
            width: wp('100%'),
          }}>
          <View
            style={{
              width: wp('50%'),
              backgroundColor: 'grey',
              left: this.state.underLineLeft,
              height: 2,
            }}>
            <View
              style={{
                backgroundColor: Colors.Black,
                width: 'auto',
                height: '100%',
              }}></View>
          </View>
        </View>
      </View>
    );
  }
  // use
  renderUpcomingItems() {
    let data =
      this.state.selTab == '0' ? this.state.upcomingData : this.state.pastData;
    if (data?.length > 0) {
      return (
        <FlatList
          style={{width: wp('100%'), height: 'auto'}}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => item._id}
          renderItem={(item, index) =>
            this.renderUpcomingAndPastView(item, index)
          }
        />
      );
    } else {
      return (
        <Text style={styles.txtNoLoads}> {strings.NO_ORDERS_AVAILABLE} </Text>
      );
    }
  }
  //use
  renderUpcomingList(item, index) {
    let itemsName = [];
    item.item.items.forEach(myFunction);
    function myFunction(item, index, arr) {
      itemsName.push(item.itemName);
    }
    var itemsText = itemsName.toString();
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: wp('80%'),
          marginTop: wp('5%'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 'auto',
            paddingBottom: wp('2%'),
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={styles.headerImage}
              source={
                item?.item?.restaurantDetails?.restaurantLogo === 'null' ||
                item?.item?.restaurantDetails?.restaurantLogo === null ||
                item?.item?.restaurantDetails?.restaurantLogo === 'undefined' ||
                item?.item?.restaurantDetails?.restaurantLogo === undefined
                  ? Images.profileBackground
                  : {uri: item.item.restaurantDetails.restaurantLogo}
              }
            />
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.primarySemibold,
                  marginLeft: wp('2%'),
                  width: wp('40%'),
                  textAlign: 'left',
                }}>
                {item.item.restaurantName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.primaryRegular,
                  marginLeft: wp('2%'),
                  width: wp('40%'),
                  textAlign: 'left',
                }}>
                {item.item.restaurantAddress}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: Colors.primary,
              height: 30,
              alignItems: 'center',
              paddingHorizontal: 10,
              borderRadius: 15,
            }}
            onPress={() => this.clickOnTrack(item)}>
            <Text
              style={{
                color: Colors.White,
                fontFamily: Fonts.primarySemibold,
              }}>
              {strings.TRACK_ORDER}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp('3%'),
            paddingVertical: wp('2%'),
          }}>
          <View
            style={{
              width: '87%',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: Fonts.primaryBold,
                fontSize: 16,
                color: Colors.textBlack,
                textAlign: 'left',
              }}>
              {strings.UC_ITEMS}
            </Text>
            <Text
              style={{
                width: wp('70%'),
                fontSize: 14,
                height: 'auto',
                color: Colors.textBlack,
                fontFamily: Fonts.primaryRegular,
                textAlign: 'left',
              }}>
              {itemsText}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.clickOnViewOrder(item)}>
            <Text
              style={{
                fontFamily: Fonts.primaryBold,
                fontSize: 16,
                color: Colors.primary,
              }}>
              {strings.PICKUP}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp('3%'),
            paddingVertical: wp('2%'),
          }}>
          <View
            style={{
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                color: Colors.textBlack,
                fontFamily: Fonts.primaryBold,
                fontSize: 16,
              }}>
              {strings.UC_DATE}
            </Text>
            <Text
              style={
                {
                  /*fontFamily: Fonts.Bold */
                }
              }>
              {item.item.readableDate}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                color: Colors.textBlack,
                fontFamily: Fonts.primaryBold,
                fontSize: 16,
              }}>
              {strings.TOTAL}
            </Text>
            <Text
              style={{
                color: Colors.textBlack,
                fontFamily: Fonts.primaryRegular,
              }}>
              {item.item.orderTotal} {strings.SAR}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: wp('1%'),
            borderBottomColor: Colors.lineViewColor,
            borderBottomWidth: 1,
            width: wp('100%'),
            marginLeft: -40,
          }}></View>
      </View>
    );
  }

  clickOnPast(item) {
    this.props.navigation.navigate('OrderDetailsScreen', {
      isFromOrderScreen: true,
      item: item.item,
    });
  }

  clickOnTrack(item) {
    this.props.navigation.navigate('TrackOrders', {
      orderId: item.item._id,
      item: item,
    });
  }

  clickOnViewOrder(item) {
    this.props.navigation.navigate('OrderDetailsScreen', {
      isFromOrderScreen: true,
      item: item.item,
    });
  }

  renderPastList(item, index) {
    let itemsName = [];
    item.item.items.forEach(myFunction);
    function myFunction(item, index, arr) {
      itemsName.push(item.itemName);
    }
    var itemsText = itemsName.toString();
    return (
      <TouchableOpacity
        onPress={() => this.clickOnViewOrder(item)}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'transparent',
          width: wp('90%'),
          marginTop: wp('5%'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 'auto',
            paddingBottom: wp('2%'),
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={styles.headerImage}
              source={
                item?.item?.restaurantDetails?.restaurantLogo !== 'null' &&
                item?.item?.restaurantDetails?.restaurantLogo !== null &&
                item?.item?.restaurantDetails?.restaurantLogo !== 'undefined' &&
                item?.item?.restaurantDetails?.restaurantLogo !== undefined
                  ? {uri: item.item.restaurantDetails.restaurantLogo}
                  : Images.profileBackground
              }
            />
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.primarySemibold,
                  marginLeft: wp('2%'),
                  width: wp('40%'),
                  textAlign: 'left',
                }}>
                {item.item.restaurantName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.primaryRegular,
                  marginLeft: wp('2%'),
                  width: wp('40%'),
                  textAlign: 'left',
                }}>
                {item.item.restaurantAddress}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                marginRight: 5,
                tintColor: Colors.primary,
              }}
              source={Images.starFilled}
            />
            <Text
              style={{
                fontFamily: Fonts.primarySemibold,
                color: Colors.primary,
                fontSize: 17,
              }}>
              {item?.item?.review?.customerRating === 0
                ? strings.RATE
                : item?.item?.review?.customerRating}
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: wp('3%'),
            paddingVertical: wp('2%'),
          }}>
          <Text
            style={{
              fontFamily: Fonts.primarySemibold,
              fontSize: 17,
              alignSelf: 'flex-start',
            }}>
            {strings.UC_ITEMS}
          </Text>
          <Text
            style={{
              width: wp('70%'),
              fontSize: 14,
              fontFamily: Fonts.primaryRegular,
              height: 'auto',
              textAlign: 'left',
            }}>
            {itemsText}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp('3%'),
            paddingVertical: wp('2%'),
          }}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={{
                fontFamily: Fonts.primarySemibold,
                fontSize: 17,
              }}>
              {strings.UC_DATE}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.primaryRegular,
              }}>
              {item.item.readableDate}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={{
                fontFamily: Fonts.primarySemibold,
                fontSize: 17,
              }}>
              {strings.TOTAL}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.primarySemibold,
              }}>
              {item.item.orderTotal} {strings.SAR}
            </Text>
          </View>
        </View>

        {/* commented reorder feature */}

        {/* <TouchableOpacity
                    style={{
                        width: 90,
                        alignSelf: 'flex-end',
                        marginBottom: 10
                    }}
                    onPress={() => alert('In development')}
                >
                    <Image
                        style={{
                            height: 25,
                            width: 90
                        }}
                        source={Images.icReorder}
                    />
                </TouchableOpacity> */}
        <View
          style={{
            height: wp('1%'),
            borderBottomColor: Colors.lineViewColor,
            borderBottomWidth: 1,
            width: wp('100%'),
            marginLeft: -20,
          }}></View>
      </TouchableOpacity>
    );
  }

  render() {
    const {navigation} = this.props;
    return this.props.isBusyOrderHistory ? (
      <Activity />
    ) : this.state.user_id == '' ? (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <Header title={strings.ORDERS} screen="Home" navigation={navigation} />
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
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <Header title={strings.ORDERS} screen="Home" navigation={navigation} />
        {this.renderUpcomingPastHeadingTile()}
        {this.renderUpcomingItems()}
        {this.props.isBusyOrderHistory ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtNoLoads: {
    marginTop: 50,
    width: '100%',
    textAlign: 'center',

    fontSize: wp('5.86%'),
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
  headerImage: {
    height: wp('12%'),
    width: wp('12%'),
    marginLeft: 5,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 8,
  },
});
