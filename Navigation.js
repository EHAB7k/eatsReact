import React from 'react';
import {Image, View, Text} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Login from './src/containers/Login';
import VerifyOTP from './src/containers/VerifyOTP';
import Register from './src/containers/Register';
import Orders from './src/containers/Orders';
import Search from './src/containers/Search';
import Home from './src/containers/Home';
import Profile from './src/containers/Profile';
import Password from './src/containers/Password';
import ChangePassword from './src/containers/ChangePassword';
import Images from './src/utils/Images';
import Colors from './src/utils/Colors';
import Items from './src/containers/Items';
import ShippingAddress from './src/containers/ShippingAddress';
import SavedAddresses from './src/containers/SavedAddresses';
import SetDeliveryLocation from './src/containers/SetDeliveryLocation';
import AddCartDetails from './src/containers/AddCartDetails';
import AddCard from './src/containers/AddCard';
import AccountDetail from './src/containers/AccountDetail';
import CouponCode from './src/containers/Coupon';
import Invite from './src/containers/Invite';
import DrawerContent from './DrawerContent';
import Thankyou from './src/containers/Thankyou';
import TrackOrders from './src/containers/TrackOrders';
import Chat from './src/containers/Chat';
import OrderDetails from './src/containers/OrderDetails';
import Support from './src/containers/Support';
import SupportMessage from './src/containers/SupportMessage';
import Filter from './src/containers/Filter';
import EditProfile from './src/containers/EditProfile';
import MenuAddress from './src/containers/MenuAddress';
import ChangePasswordProfile from './src/containers/ChangePasswordProfile';
import PromoTermAndCondition from './src/containers/PromoTermAndCondition';
import 'react-native-gesture-handler';
import RefundPolicy from './src/containers/RefundPolicy';
import ContactUs from './src/containers/ConatactUs';
import MyWallet from './src/containers/MyWallet';
import GiftCards from './src/containers/GiftCards';
import GiftCardForm from './src/containers/GiftCardForm';
import HelpAndSupport from './src/containers/HelpAndSupport';
import GiftCardThanks from './src/containers/GiftCardThanks';
import strings from './src/constants/lang';
import {getConfiguration} from './src/utils/configuration';
import NotificationScreen from './src/containers/NotificationScreen';
import Dispute from './src/containers/Dispute';
import ChangeLanguage from './src/containers/ChangeLanguage';
import ChooseLanguage from './src/containers/ChooseLanguage';
import {Payment} from './src/containers/Payment/Payment';

const BookingOrder = createStackNavigator(
  {
    AddCartDetails: {
      screen: AddCartDetails,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    CouponCode: {
      screen: CouponCode,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    SavedAddresses: {
      screen: SavedAddresses,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    SetDeliveryLocation: {
      screen: SetDeliveryLocation,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    AccountDetailScreen: {
      screen: AccountDetail,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    PromoTermAndConditionScreen: {
      screen: PromoTermAndCondition,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    AddCardScreen: {
      screen: AddCard,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    ThankyouScreen: {
      screen: Thankyou,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const TrackOrderNavigator = createStackNavigator(
  {
    TrackOrders: {
      screen: TrackOrders,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    ChatScreen: {
      screen: Chat,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    PaymentScreen: {
      screen: Payment,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    OrderDetailsScreen: {
      screen: OrderDetails,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const FilterStack = createStackNavigator(
  {
    Filter: {
      screen: Filter,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const SupportMessageStack = createStackNavigator(
  {
    Support: {
      screen: Support,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    SupportMessage: {
      screen: SupportMessage,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Dispute: {
      screen: Dispute,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const SupportStack = createStackNavigator(
  {
    HelpAndSupport: {
      screen: HelpAndSupport,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const AccountStackk = createStackNavigator(
  {
    AccountDetail: {
      screen: AccountDetail,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const ProfileStackk = createStackNavigator(
  {
    EditProfileScreen: {
      screen: EditProfile,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    ChangePasswordProfile: {
      screen: ChangePasswordProfile,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const AddAddress = createStackNavigator(
  {
    SetDeliveryLocation: {
      screen: SetDeliveryLocation,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const AddressStackk = createStackNavigator(
  {
    MenuAddress: {
      screen: MenuAddress,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const GiftCardStack = createStackNavigator(
  {
    GiftCardForm: {
      screen: GiftCardForm,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    AccountDetailScreen: {
      screen: AccountDetail,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    AddCardScreen: {
      screen: AddCard,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    GiftCardThanks: {
      screen: GiftCardThanks,
      navigationOptions: {
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

// ************** App Tab Navigator **************** //

const tabBasedNavigation = createBottomTabNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          let color = focused ? Colors.primary : Colors.focusOff;
          const language = getConfiguration('language');
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  tintColor: color,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icTabBarSearch}
              />
              <Text style={{color: color}}>{strings.TAB_EXPLORE}</Text>
            </View>
          );
        },
      },
    },
    Orders: {
      screen: Orders,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          let color = focused ? Colors.primary : Colors.focusOff;
          const language = getConfiguration('language');
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  tintColor: color,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icTabBarOrder}
              />
              <Text style={{color: color}}>{strings.TAB_ORDERS}</Text>
            </View>
          );
        },
      },
    },
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          let color = focused ? Colors.primary : Colors.focusOff;
          const language = getConfiguration('language');
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                marginBottom: 30,
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: 60,
                  width: 60,
                }}
                source={
                  focused
                    ? Images.icTabBarActiveHome
                    : Images.icTabBarInactiveHome
                }
              />
              <Text style={{color: color}}>{strings.TAB_HOME}</Text>
            </View>
          );
        },
      },
    },
    Cart: {
      screen: AddCartDetails,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          let color = focused ? Colors.primary : Colors.focusOff;
          const language = getConfiguration('language');
          return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  tintColor: color,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icTabBarCart}
              />
              <Text style={{color: color}}>{strings.TAB_CART}</Text>
            </View>
          );
        },
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          let color = focused ? Colors.primary : Colors.focusOff;
          const language = getConfiguration('language');
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                style={{
                  height: wp('6%'),
                  width: wp('6%'),
                  tintColor: color,
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icTabBarProfile}
              />
              <Text style={{color: color}}>{strings.TAB_PROFILE}</Text>
            </View>
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 0,
        backgroundColor: '#FFFFFF',
        height: 60,
        paddingBottom: 5,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 3,
        shadowOpacity: 0.6,
        elevation: 3,
      },
    },
    initialRouteName: 'Home',
  },
);

const StoreNavigator = createStackNavigator(
  {
    Items: {
      screen: Items,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const ShippingAddressNavigator = createStackNavigator(
  {
    ShippingAddress: {
      screen: ShippingAddress,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

// ************** App Drawer Navigator **************** //

const DrawerNav = createDrawerNavigator(
  {
    HomeTab: {
      screen: tabBasedNavigation,
    },
    Invite: {
      screen: Invite,
    },
    AccountStackk: {
      screen: AccountStackk,
    },
    MyWallet: {
      screen: MyWallet,
    },
    GiftCards: {
      screen: GiftCards,
    },
    AddressStackk: {
      screen: AddressStackk,
    },
    Notifications: {
      screen: NotificationScreen,
    },
    ChangeLanguage: {
      screen: ChangeLanguage,
    },
    RefundPolicy: {
      screen: RefundPolicy,
    },
    ContactUs: {
      screen: ContactUs,
    },
    SupportStack: {
      screen: SupportStack,
    },
  },
  {
    contentComponent: DrawerContent,
    contentOptions: {
      tintColor: '#a6a5ab',
    },
    initialRouteName: 'HomeTab',
    tabBarVisible: false,
  },
);

// ************ Auth Stack ************* //

const LoginStack = createStackNavigator(
  {
    ChooseLanguage: {
      screen: ChooseLanguage,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    VerifyOTP: {
      screen: VerifyOTP,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    Password: {
      screen: Password,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    Home: {
      screen: DrawerNav,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

const MainStack = createStackNavigator(
  {
    LoginStack,
    ProfileStackk,
    BookingOrder,
    GiftCardStack,
    ShippingAddressNavigator,
    StoreNavigator,
    TrackOrderNavigator,
    FilterStack,
    AddAddress,
    SupportMessageStack,
  },
  {
    headerMode: 'none',
  },
);

export default createAppContainer(MainStack);
