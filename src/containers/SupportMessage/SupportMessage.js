import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {DrawerActions} from 'react-navigation-drawer';
import moment from 'moment';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Activity from '../../components/ActivityIndicator';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//import { strings } from '../../Languages/StringsOfLanguages'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header} from '../../components/Header';
import {genericAlert} from '../../utils/genricUtils';
import strings from '../../constants/lang';
import Constants from '../../utils/Constants';

export default class SupportMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      msg: '',
      orderId: '',
      upcomingData: [],
      pastData: [],
      showPicker: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    this.setState(() => this.getOrderHistoryAPI());
  };
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

    if (
      pastData !== undefined &&
      pastData !== 'undefined' &&
      upcomingData !== undefined &&
      upcomingData !== 'undefined'
    ) {
      this.setState({
        upcomingData: upcomingData,
        pastData: pastData,
      });
    }
  }
  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  afterSupportAPI() {
    const {response} = this.props.response;

    if (response?.status) {
      this.showAlert(strings.ALERT_MSG_SENT, 300);
      this.props.navigation.navigate('Support');
    } else {
      this.showAlert(response?.message, 300);
    }
  }

  sendMessage() {
    this.props
      .supportAPI(this.state.name, this.state.msg, this.state.orderId)
      .then(() => this.afterSupportAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  goToNextScreen() {
    if (
      this.state.name != '' &&
      this.state.msg != '' &&
      this.state.orderId != ''
    ) {
      this.sendMessage();
    } else {
      this.showAlert(strings.ALERT_ALL_REQUIRED, 300);
    }
  }

  goBack() {
    this.props.navigation.navigate('Support');
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
  render() {
    const {navigation} = this.props;
    const {name, msg, orderId, showPicker} = this.state;
    const language = getConfiguration('language');
    let data = this.state.pastData.concat(this.state.upcomingData);

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
          title={strings.HELP_N_SUPPORT}
          navigation={navigation}
          screen="Support"
        />

        <KeyboardAwareScrollView>
          <Text style={styles.helpDescText}>{strings.FEEL_FREE}</Text>

          <View style={styles.inputView}>
            <TouchableOpacity
              onPress={() => this.setState({showPicker: true})}
              style={[styles.input]}>
              <Text
                style={[
                  styles.input,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}>
                {orderId !== '' ? orderId : strings.PH_ORDER_ID}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={[
                styles.input,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_ENTER_NAME}
              value={name}
              onChangeText={name =>
                this.setState({
                  name,
                })
              }
            />
          </View>

          <View
            style={[
              styles.inputView,
              {
                height: 150,
                justifyContent: 'flex-start',
                marginTop: '3%',
              },
            ]}>
            <TextInput
              style={[
                styles.input,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              placeholder={strings.PH_YOUR_MSG_HERE}
              value={msg}
              onChangeText={msg =>
                this.setState({
                  msg,
                })
              }
              multiline={true}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.goToNextScreen()}
            style={styles.updateDisputeButton}>
            <Text style={styles.updateText}>{strings.CREATE}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <View>
          {showPicker && data?.length > 0 && (
            <View style={styles.pickerView}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.setState({showPicker: false})}
                  style={{padding: 5}}>
                  <Text style={styles.buttonText}>{strings.CANCEL}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({showPicker: false})}
                  style={{padding: 5, position: 'absolute', right: 0}}>
                  <Text style={styles.buttonText}>{strings.CONFIRM}</Text>
                </TouchableOpacity>
              </View>
              <Picker
                style={{color: 'grey', overflowX: 'scroll'}}
                selectedValue={orderId}
                onValueChange={orderId =>
                  this.setState({
                    orderId,
                  })
                }>
                <Picker.Item
                  style={{color: 'grey'}}
                  label={strings.PH_ORDER_ID}
                />
                {data.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={
                      item?.customOrderId +
                      ' ' +
                      '(' +
                      moment(item?.orderCompletedAt).format('DD/MM/YYYY') +
                      ')' +
                      ' - ' +
                      strings.SAR +
                      item?.orderSubTotal
                    }
                    value={item?.customOrderId}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
        {this.props.isBusy ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenIcon: {
    height: 200,
    width: '60%',
    resizeMode: 'contain',
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  helpText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    color: Colors.textBlack,
    alignSelf: 'center',
  },
  helpDescText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    color: Colors.textBlack,
    alignSelf: 'center',
    marginVertical: '2%',
  },
  inputView: {
    height: 50,
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.inputBgGray,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    paddingHorizontal: '5%',
    alignSelf: 'center',
    marginTop: '2%',
  },
  input: {
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  updateDisputeButton: {
    width: '90%',
    backgroundColor: Colors.primary,
    paddingVertical: '4%',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: '30%',
  },
  updateText: {
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
    color: Colors.White,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
    color: Colors.Black,
  },
  pickerView: {
    width: '100%',
    height: 300,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.background,
  },
});
