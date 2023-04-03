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
import {DrawerActions} from 'react-navigation-drawer';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {genericAlert} from '../../utils/genricUtils';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
//import { strings } from '../../Languages/StringsOfLanguages'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';

export default class MenuAddress extends Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      PossibleTrue: [],
      PossibleFalse: [],
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
    } else {
      this.setState({
        PossibleTrue: [],
        PossibleFalse,
      });
    }
    return;
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

  selectAddresses(item) {}

  openDrawerBox() {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  goToAddAddress(item) {
    this.props.navigation.navigate('SetDeliveryLocation', {
      isFromMenu: true,
      item,
    });
  }

  rennderHomeTile() {
    const {PossibleTrue} = this.state;
    return (
      <View>
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            paddingHorizontal: '5%',
            paddingVertical: '3%',
            borderColor: Colors.textLightGrey,
          }}>
          <Text
            style={{
              color: Colors.textBlack,
              fontSize: 18,
              fontFamily: Fonts.primaryBold,
              textAlign: 'left',
            }}>
            {strings.DELIVER_TO}
          </Text>
        </View>
        {PossibleTrue && PossibleTrue.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={PossibleTrue}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.goToAddAddress(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                  }}>
                  <View
                    style={{
                      padding: wp('5%'),
                      width: '85%',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: wp('4%'),
                          fontFamily: Fonts.primaryBold,
                          color: Colors.textBlack,
                          textAlign: 'left',
                        }}>
                        {item.addressType}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: wp('4%'),
                        fontFamily: Fonts.primarySemibold,
                        color: Colors.textBlack,
                        textAlign: 'left',
                      }}>
                      {item.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.deleteAddress(item._id)}
                    style={{
                      alignSelf: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: Colors.primary,
                      }}
                      source={Images.icCardBin}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.txtNoLoads}>{strings.NO_ADDRESS_AVAILABLE}</Text>
        )}
      </View>
    );
  }

  rennderPreviousTile() {
    const {PossibleFalse} = this.state;
    return (
      <View>
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            paddingHorizontal: '5%',
            paddingVertical: '3%',
            borderColor: Colors.textLightGrey,
          }}>
          <Text
            style={{
              color: Colors.textBlack,
              fontSize: 18,
              fontFamily: Fonts.primaryBold,
              textAlign: 'left',
            }}>
            {strings.PREVIOUS_DELIVERY_ADDRESSES}
          </Text>
        </View>
        {PossibleFalse.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={PossibleFalse}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.goToAddAddress(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                  }}>
                  <View
                    style={{
                      padding: wp('5%'),
                      width: '85%',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: wp('4%'),
                          fontFamily: Fonts.primaryBold,
                          color: Colors.textBlack,
                          textAlign: 'left',
                        }}>
                        {item.addressType}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: wp('4%'),
                        fontFamily: Fonts.primarySemibold,
                        color: Colors.textBlack,
                        textAlign: 'left',
                      }}>
                      {item.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.deleteAddress(item._id)}
                    style={{
                      alignSelf: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: Colors.primary,
                      }}
                      source={Images.icCardBin}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.txtNoLoads}>{strings.NO_ADDRESS_AVAILABLE}</Text>
        )}
      </View>
    );
  }

  deleteAddress(addressId) {
    Alert.alert(strings.ALERT, strings.ALERT_DELETE, [
      {text: strings.OK, onPress: () => this.deleteAddressAPI(addressId)},
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  }

  deleteAddressAPI(addressId) {
    this.props
      .removeAddressAPI(addressId)
      .then(() => {
        this.afterDeleteAddressAPI();
      })
      .catch(e => this.showAlert(e.message, 300));
  }

  afterDeleteAddressAPI() {
    let status = this.props.responseRemoveAddress.response.status;
    let message = this.props.responseRemoveAddress.response.message;
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
    this.props
      .getDeliveryAddressAPI()
      .then(() => this.aftergetDeliveryAddress())
      .catch(e => this.showAlert(e.message, 300));
    return;
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <SafeAreaView style={{backgroundColor: Colors.navigationColor}} />
        <Header menu title={strings.SAVED_ADDRESS} navigation={navigation} />

        <KeyboardAwareScrollView>
          <Image
            style={{
              height: 150,
              width: '60%',
              resizeMode: 'contain',
              alignSelf: 'center',
              marginVertical: '5%',
            }}
            source={Images.loginLogo}
          />

          <Text
            onPress={() => this.goToAddAddress(null)}
            style={{
              fontSize: 17,
              fontFamily: Fonts.primaryBold,
              color: Colors.primary,
              marginLeft: '5%',
              marginVertical: '3%',
              textAlign: 'left',
            }}>
            {strings.ADD_ADDRESSES}
          </Text>
          {this.rennderHomeTile()}
          {this.rennderPreviousTile()}
        </KeyboardAwareScrollView>
        {this.props.isBusy || this.props.isBusyRemoveAddress ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtNoLoads: {
    marginVertical: 15,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Fonts.primaryMedium,
    color: Colors.textBlack,
  },
  title: {
    fontSize: 18,
    color: Colors.textBlack,
    fontFamily: Fonts.primarySemibold,
  },
});
