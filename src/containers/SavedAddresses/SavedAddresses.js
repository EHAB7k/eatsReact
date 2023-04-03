import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Activity from '../../components/ActivityIndicator';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {genericAlert} from '../../utils/genricUtils';
import Fonts from '../../utils/Fonts';
//import { strings } from '../../Languages/StringsOfLanguages'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {postAPI} from '../../utils/api';
import {errorAlert, successAlert} from '../../utils/genricUtils';

export default class SavedAddresses extends Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      PossibleTrue: [],
      PossibleFalse: [],
      isLoading: false,
    };
    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    this.props
      .getDeliveryAddressAPI()
      .then(() => this.aftergetDeliveryAddress())
      .catch(e => this.showAlert(e.message, 300));
  };

  aftergetDeliveryAddress() {
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
    var data = this.props.response.response.data;
    var PossibleTrue = this.props.response.response.data;
    var PossibleFalse = PossibleTrue.filter((item, index) => index !== 0);

    if (PossibleTrue.length > 0) {
      this.setState({
        PossibleTrue: [PossibleTrue[0]],
        PossibleFalse,
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

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  selectAddresses(item) {
    this.props.navigation.state.params.onGoBack(item);
    this.props.navigation.goBack();
  }

  goBack() {
    this.props.navigation.goBack();
  }

  renderAddAddressTile() {
    return (
      <TouchableOpacity
        onPress={() => this.goToAddAddress()}
        style={{
          flexDirection: 'row',
          padding: wp('5%'),
          borderBottomColor: 'grey',
          borderBottomWidth: 0.5,
          marginTop: hp('2%'),
        }}>
        <Text
          style={{
            color: Colors.greenText,
            fontSize: wp('4%'),
          }}>
          {strings.ADD_ADDRESSES}
        </Text>
      </TouchableOpacity>
    );
  }

  goToAddAddress() {
    this.props.navigation.navigate('SetDeliveryLocation');
  }

  renderDeliversToTile() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: wp('3%'),
          paddingHorizontal: '7%',
          borderBottomColor: Colors.textLightGrey,
          borderBottomWidth: 0.5,
        }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: Fonts.primaryBold,
            color: Colors.textBlack,
          }}>
          {strings.DELIVER_TO}
        </Text>
      </View>
    );
  }

  rennderHomeTile() {
    const {navigation} = this.props;
    const flow = navigation.getParam('flow');
    const orderId = navigation.getParam('orderId');
    return (
      <View>
        {this.state.PossibleTrue && this.state.PossibleTrue.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={this.state.PossibleTrue}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  flow === 'OrderDetails'
                    ? this.handleChangeOrderAddress(item)
                    : this.selectAddresses(item)
                }>
                <View
                  style={{
                    paddingVertical: wp('5%'),
                    paddingHorizontal: '7%',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.primaryBold,
                        color: Colors.textBlack,
                        textAlign: 'left',
                      }}>
                      {item.addressType}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.primaryRegular,
                      color: Colors.textLightGrey,
                      textAlign: 'left',
                    }}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${index}_HomeAddressList`}
          />
        ) : (
          <View
            style={{
              padding: wp('5%'),
            }}>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primaryMedium,
                color: 'grey',
              }}>
              {strings.NO_ADDRESS_AVAILABLE}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderDoesNotDeliverTile() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp('7%'),
          paddingVertical: '3%',
          borderBottomColor: 'grey',
          borderBottomWidth: 0.5,
        }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: Fonts.primaryBold,
            color: Colors.textBlack,
          }}>
          {strings.PREVIOUS_DELIVERY_ADDRESSES}
        </Text>
      </View>
    );
  }

  renderOtherAddress() {
    const {navigation} = this.props;
    const flow = navigation.getParam('flow');
    return (
      <View>
        {this.state.PossibleFalse && this.state.PossibleFalse.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={this.state.PossibleFalse}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  flow === 'OrderDetails'
                    ? this.handleChangeOrderAddress(item)
                    : this.selectAddresses(item)
                }>
                <View
                  style={{
                    paddingVertical: wp('5%'),
                    paddingHorizontal: '7%',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.primaryBold,
                        color: Colors.textBlack,
                        textAlign: 'left',
                      }}>
                      {item.addressType}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.primaryRegular,
                      color: Colors.textLightGrey,
                      textAlign: 'left',
                    }}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${index}_OtherAddressList`}
          />
        ) : (
          <View style={{padding: wp('5%')}}>
            <Text
              style={{
                fontSize: wp('4%'),
                fontFamily: Fonts.primaryMedium,
                color: 'grey',
              }}>
              {strings.NO_ADDRESS_AVAILABLE}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ******* Handle Change Order Address ******* //

  handleLoader = isLoading => {
    this.setState({
      isLoading,
    });
  };

  handleChangeOrderAddress = async payload => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    this.handleLoader(true);
    try {
      const data = {
        orderId,
        addressId: payload?._id,
      };
      const res = await postAPI(
        '/api/v1/user/changelocation',
        JSON.stringify(data),
      );

      if (res?.status === 'success') {
        successAlert(res?.message);
        navigation.navigate('OrderDetailsScreen', {item: res?.data});
      } else {
        errorAlert(res?.message);
      }
      this.handleLoader(false);
    } catch (e) {
      this.handleLoader(false);
    }
  };

  render() {
    const {isLoading} = this.state;
    const {navigation} = this.props;
    const flow = navigation.getParam('flow');
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
          title={strings.SAVED_ADDRESS}
          navigation={navigation}
          screen={
            flow === 'OrderDetails' ? 'OrderDetailsScreen' : 'AddCartDetails'
          }
        />
        <KeyboardAwareScrollView>
          <Text
            onPress={() => this.goToAddAddress()}
            style={{
              fontFamily: Fonts.primaryMedium,
              fontSize: 16,
              color: Colors.primary,
              height: 60,
              width: '100%',
              paddingHorizontal: '8%',
              borderBottomColor: Colors.textLightGrey,
              borderBottomWidth: 0.5,
              textAlignVertical: 'center',
              alignSelf: 'flex-start',
              textAlign: 'left',
            }}>
            {strings.ADD_ADDRESSES}
          </Text>
          {this.renderDeliversToTile()}
          {this.rennderHomeTile()}
          {this.renderDoesNotDeliverTile()}
          {this.renderOtherAddress()}
        </KeyboardAwareScrollView>
        {this.props.isBusy || isLoading ? <Activity /> : null}
      </View>
    );
  }
}
