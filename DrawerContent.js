import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Alert,
  SafeAreaView,
} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {getConfiguration, setConfiguration} from './src/utils/configuration';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const mapStateToProps = state => ({
  isBusyGetProfile: state.GetProfileReducer.isBusy,
  responseGetProfile: state.GetProfileReducer,
});

import Colors from './src/utils/Colors';
import Images from './src/utils/Images';
import {ImageBackground} from 'react-native';
import Fonts from './src/utils/Fonts';
import strings from './src/constants/lang';
import {Platform} from 'react-native';
import {postAPI} from './src/utils/api';

class DrawerContent extends Component {
  navigateToScreen = route => () => {
    if (route == 'Login') {
      try {
      } catch (e) {}
    }
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    if (route == 'BookingOrder') {
      this.props.navigation.navigate('BookingOrder');
    } else this.props.navigation.dispatch(navigateAction);
  };

  constructor(props) {
    super(props);
  }

  renderTopView() {
    return (
      <ImageBackground
        style={{
          height: hp('25%'),
          justifyContent: 'center',
          paddingHorizontal: '10%',
        }}
        source={Images.dummyDrawer}>
        <Image
          style={{
            height: 80,
            width: 60,
            position: 'absolute',
            zIndex: 2,
            top: Platform.OS === 'android' ? '8%' : '18%',
            right: '7%',
            tintColor: Colors.White,
          }}
          source={Images.loginLogo}
        />
        {this.props.responseGetProfile?.response?.data?.profileImage ==
          'none' ||
        this.props.responseGetProfile?.response?.data?.profileImage == '' ||
        this.props.responseGetProfile?.response?.data?.profileImage == 'null' ||
        this.props.responseGetProfile?.response?.data?.profileImage == null ? (
          <Image
            resizeMode="cover"
            style={{
              height: wp('15%'),
              width: wp('15%'),
              borderRadius: wp('7.5%'),
            }}
            source={Images.dummyUser}
          />
        ) : (
          <Image
            resizeMode="cover"
            style={{
              height: wp('15%'),
              width: wp('15%'),
              borderRadius: wp('7.5%'),
            }}
            source={{
              uri: this.props.responseGetProfile?.response?.data?.profileImage,
            }}
          />
        )}
        <Text
          style={{
            fontSize: 15,
            color: Colors.White,
            fontFamily: Fonts.primaryBold,
            alignSelf: 'flex-start',
          }}>
          {this.props.responseGetProfile?.response?.data?.name !== undefined
            ? this.props.responseGetProfile?.response?.data?.name
            : ''}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors.White,
            fontFamily: Fonts.primaryRegular,
            alignSelf: 'flex-start',
          }}>
          {this.props.responseGetProfile?.response?.data?.countryCode !==
            undefined &&
          this.props.responseGetProfile?.response?.data?.mobileNumber !==
            undefined
            ? this.props.responseGetProfile?.response?.data?.countryCode +
              '-' +
              this.props.responseGetProfile?.response?.data?.mobileNumber
            : ''}
        </Text>
      </ImageBackground>
    );
  }

  renderSideBar(titleName, icon, navigateScreen) {
    const language = getConfiguration('language');
    return (
      <View>
        <TouchableOpacity
          style={{
            padding: wp('2%'),
            borderBottomColor: 'black',
            borderBottomWidth: 0,
            justifyContent: 'center',
          }}
          onPress={this.navigateToScreen(navigateScreen)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: wp('1%'),
                marginLeft: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 25,
                  width: 25,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={icon}
              />
              <Text
                style={{
                  fontSize: 15,
                  alignSelf: 'center',
                  marginLeft: 10,
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryBold,
                }}>
                {' '}
                {titleName}{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.baseLine} />
      </View>
    );
  }

  async LogoutAction() {
    Alert.alert(strings.ALERT, strings.ALERT_LOGOUT, [
      {text: strings.OK, onPress: () => this.logOut()},
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  }
  async LoginAction() {
    this.props.navigation.navigate('Login');
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('ChooseLanguage');
  }

  renderLogin() {
    const language = getConfiguration('language');
    return (
      <View>
        <TouchableOpacity
          style={{
            padding: wp('2%'),
            borderBottomColor: 'black',
            borderBottomWidth: 0,
            justifyContent: 'center',
          }}
          onPress={() => this.LoginAction()}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: wp('1%'),
                marginLeft: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 25,
                  width: 25,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icMenuBarLogout}
              />
              <Text
                style={{
                  fontSize: 15,
                  alignSelf: 'center',
                  marginLeft: 10,
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryBold,
                }}>
                {' '}
                {strings.Login}{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.baseLine} />
      </View>
    );
  }
  renderLogout() {
    const language = getConfiguration('language');
    return (
      <View>
        <TouchableOpacity
          style={{
            padding: wp('2%'),
            borderBottomColor: 'black',
            borderBottomWidth: 0,
            justifyContent: 'center',
          }}
          onPress={() => this.LogoutAction()}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: wp('1%'),
                marginLeft: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 25,
                  width: 25,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icMenuBarLogout}
              />
              <Text
                style={{
                  fontSize: 15,
                  alignSelf: 'center',
                  marginLeft: 10,
                  color: Colors.textBlack,
                  fontFamily: Fonts.primaryBold,
                }}>
                {' '}
                {strings.MENU_LOGOUT}{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.baseLine} />
      </View>
    );
  }

  initiateDeleteAlert = () => {
    Alert.alert(
      strings.ALERT,
      strings.deleteACcount,
      [
        {
          text: 'Ok',
          onPress: () => this.onPressDelete(),
        },
        {
          text: 'Cancel',
        },
      ],
      {cancelable: false},
    );
  };

  async onPressDelete() {
    var details = null;
    const user = await postAPI('/api/v1/user/remove', details);
    console.log('remove user data-----', user);
    if (user.status == 'success') {
      try {
        setConfiguration('token', '');
        setConfiguration('user_id', '');

        await AsyncStorage.setItem('user_id', '');
        await AsyncStorage.setItem('token', '');
        await ('language', '');
        this.props.navigation.navigate('Login');
      } catch (e) {
        console.log('logout error-----', e);
      }
    }
  }

  render() {
    const user_id = getConfiguration('user_id');
    const language = getConfiguration('language');
    return (
      <View style={{flex: 1}}>
        {this.renderTopView()}
        <View style={{paddingTop: 0, marginBottom: 0}}>
          {user_id == '' ? (
            <ScrollView style={{width: '100%', height: '100%'}}>
              {this.renderSideBar(
                strings.MENU_HOME,
                Images.icMenuBarHome,
                'HomeTab',
              )}
              {this.renderLogin()}
            </ScrollView>
          ) : (
            <ScrollView style={{width: '100%', height: '100%'}}>
              {this.renderSideBar(
                strings.MENU_HOME,
                Images.icMenuBarHome,
                'HomeTab',
              )}
              {this.renderSideBar(
                strings.MENU_INVITE_FRIENDS,
                Images.icMenuBarInviteFriends,
                'Invite',
              )}
              {this.renderSideBar(
                strings.MENU_MY_ADDRESS,
                Images.icMenuBarMyAddress,
                'MenuAddress',
              )}
              {this.renderSideBar(
                strings.MENU_MY_WALLET,
                Images.icMenuBarMyWallet,
                'MyWallet',
              )}
              {this.renderSideBar(
                strings.MENU_GIFT_CARD,
                Images.icMenuBarGiftCard,
                'GiftCards',
              )}
              {/* {this.renderSideBar(
              strings.MENU_PAYMENT_METHOD,
              Images.icMenuBarPaymentMethod,
              'AccountDetail',
            )} */}
              {this.renderSideBar(
                strings.MENU_NOTIFICATIONS,
                Images.icMenuBarRefundPolicy,
                'Notifications',
              )}
              {this.renderSideBar(
                strings.MENU_LANGUAGE,
                Images.icMenuBarContactUs,
                'ChangeLanguage',
              )}

              <TouchableOpacity
                style={{
                  height: wp('9.66%'),
                  width: '100%',
                  marginLeft: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => this.initiateDeleteAlert()}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 25,
                    width: 25,
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  }}
                  source={Images.icMenuBarLogout}
                />
                <Text
                  style={{
                    fontSize: 15,
                    alignSelf: 'center',
                    marginLeft: 10,
                    color: Colors.textBlack,
                    fontFamily: Fonts.primaryBold,
                  }}>
                  {' '}
                  {strings.SC_DELETE_ACCOUNT}
                </Text>
              </TouchableOpacity>

              {/* {this.renderSideBar('REFUND POLICY', Images.icMenuBarRefundPolicy, 'RefundPolicy')} */}
              {/* {this.renderSideBar('ABOUT US', Images.icMenuBarAboutUs, 'AboutUs')} */}
              {/* {this.renderSideBar('CONTACT US', Images.icMenuBarContactUs, 'ContactUs')} */}
              {this.renderSideBar(
                strings.MENU_HELP_N_SUPPORT,
                Images.icMenuBarHelpNSupport,
                'HelpAndSupport',
              )}

              {this.renderLogout()}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, dispatch => {
  return {
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(DrawerContent);
