import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {DrawerActions} from 'react-navigation-drawer';
import {ScrollView} from 'react-native-gesture-handler';
import {Header} from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../../constants/lang';
import {AsyncStorage} from 'react-native';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {Switch} from 'react-native';
import Activity from '../../components/ActivityIndicator';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touch: true,
      name: '',
      email: '',
      phone: '',
      address: '',
      guestMode: true,
      countryCode: '',
      loader: true,
    };

    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    if (
      this.props.responseGetProfile != null &&
      this.props.responseGetProfile != 'null' &&
      this.props.responseGetProfile.response != null &&
      this.props.responseGetProfile.response != 'null'
    ) {
      this.setState({guestMode: false, loader: false}, () => {
        const {data} = this.props.responseGetProfile.response;
        var mobileNumber = data.mobileNumber;
        var email = data.email;
        var address = data.address;
        var name = data.name;
        this.setState({
          name: name,
          phone: mobileNumber,
          email: email,
          address: address,
          countryCode: data.countryCode,
        });
      });
    } else {
      this.setState({guestMode: true, loader: false});
      //  Alert.alert(
      //    '',
      //    strings.ALERT_SESSION_EXP,
      //    [
      //      {
      //        text: strings.OK,

      //        onPress: () => this.logOut(),
      //      },
      //    ],
      //    {
      //      cancelable: false,
      //    },
      //  );
    }
  };

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');

    this.props.navigation.navigate('Login');
  }

  render() {
    const {navigation, responseGetProfile} = this.props;
    const language = getConfiguration('language');
    return this.state.loader ? (
      <Activity />
    ) : this.state.guestMode ? (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header navigation={navigation} title={strings.PROFILE} />
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
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header navigation={navigation} title={strings.PROFILE} />
        <View style={styles.editView}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfileScreen')}>
            <Image
              style={[
                styles.editIcon,
                {
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                },
              ]}
              source={Images.icEditProfile}
            />
          </TouchableOpacity>
        </View>

        <Image
          resizeMode="cover"
          style={{
            width: 90,
            height: 90,
            alignSelf: 'center',
            borderRadius: 45,
          }}
          source={
            responseGetProfile?.response?.data?.profileImage != null &&
            responseGetProfile?.response?.data?.profileImage != 'none' &&
            responseGetProfile?.response?.data?.profileImage != 'null' &&
            responseGetProfile?.response?.data?.profileImage != ''
              ? {uri: responseGetProfile?.response?.data?.profileImage}
              : require('../../../assets/icon/dummyUser.png')
          }
        />

        <Text style={styles.profileName}>{this.state.name}</Text>

        <KeyboardAwareScrollView contentContainerStyle={styles.lowerView}>
          <View style={styles.fieldsWrapper}>
            <View style={styles.tile}>
              <Image
                resizeMode="contain"
                style={[
                  styles.tileIcon,
                  {
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  },
                ]}
                source={require('../../../assets/icon/ic_phone.png')}
              />
              <Text numberOfLines={1} style={styles.searchTextInput}>
                {`${this.state.countryCode} ${this.state.phone}`}
              </Text>
            </View>

            <View style={styles.tile}>
              <Image
                resizeMode="contain"
                style={[
                  styles.tileIcon,
                  {
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  },
                ]}
                source={require('../../../assets/icon/ic_mail.png')}
              />
              <Text numberOfLines={1} style={styles.searchTextInput}>
                {this.state.email}
              </Text>
            </View>

            <View style={styles.tile}>
              <Image
                resizeMode="contain"
                style={[
                  styles.tileIcon,
                  {
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  },
                ]}
                source={require('../../../assets/icon/ic_facebook.png')}
              />
              <Text numberOfLines={1} style={styles.searchTextInput}>
                {this.state.address}
              </Text>
            </View>

            {/* <View style={styles.tile}>
              <Image
                resizeMode="contain"
                style={styles.tileIcon}
                source={language == "en" ? Images.icLangUsa: Images.icLangUae}
              />
              <Text numberOfLines={1} style={styles.searchTextInput}>
                {language == "en" ? "English" : "Arabic"}
              </Text>
            </View> */}
          </View>
        </KeyboardAwareScrollView>
        {/* <View style={styles.arrowTile}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.primary,
                            borderRadius: 25
                        }}
                        onPress={() => navigation.navigate('ChangePasswordProfile')}>
                        <Text style={[styles.title,
                        { color: Colors.White }]}> {strings.CHANGE_PASSWORD} </Text>
                    </TouchableOpacity>
                </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  profileName: {
    fontFamily: Fonts.primaryBold,
    fontSize: 20,
    color: Colors.textBlack,
    alignSelf: 'center',
  },
  fieldsWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: Colors.White,
    width: '80%',
    alignSelf: 'center',
    paddingBottom: '8%',
    paddingHorizontal: '5%',
    marginTop: '8%',
  },
  lowerView: {
    backgroundColor: 'white',
    width: wp('100%'),
    height: 'auto',
    marginTop: 0,
    paddingBottom: '5%',
  },
  tileIcon: {
    width: 30,
    height: 40,
    marginRight: 10,
  },
  tile: {
    backgroundColor: 'transparent',
    width: 'auto',
    height: 40,
    marginTop: wp('5.33%'),
    marginHorizontal: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchTextInput: {
    height: 40,
    width: '80%',
    borderColor: Colors.borderGray,
    borderBottomWidth: 1,
    fontSize: 16,
    color: Colors.textBlack,
    fontFamily: Fonts.primaryRegular,
    paddingTop: 10,
    textAlign: 'left',
  },
  arrowTile: {
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    bottom: '10%',
    paddingHorizontal: '8%',
  },
  title: {
    fontSize: 20,
    color: Colors.textBlack,
    fontFamily: Fonts.primaryBold,
  },
  editView: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: '3%',
    paddingHorizontal: '8%',
  },
  editIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },
});
