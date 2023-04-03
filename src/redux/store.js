import AuthReducer from '../modules/auth';
import RegisterReducer from '../modules/Register';
import AuthPasswordReducer from '../modules/AuthPassword';
import AuthSocialReducer from '../modules/AuthSocial';
import GetProfileReducer from '../modules/GetProfile';
import EditProfileReducer from '../modules/EditProfile';
import ResendReducer from '../modules/Resend';
import VerifyOtpReducer from '../modules/VerifyOtp';
import ChangePasswordReducer from '../modules/ChangePassword';
import ForgotPasswordReducer from '../modules/ForgotPassword';
import GetRestaurantListReducer from '../modules/GetRestaurantList';
import GetEverythingReducer from '../modules/GetEverything';
import GetItemReducer from '../modules/GetItemByStore';
import AddPOSReducer from '../modules/AddPOS';
import AddDeliveryAddressReducer from '../modules/AddDeliveryAddress'
import GetDeliveryAddressReducer from '../modules/GetDeliveryAddress'
import AddCartReducer from '../modules/AddCart'
import AddOrderReducer from '../modules/AddOrder'
import GetOrderHistoryReducer from '../modules/GetOrderHistory'
import GetOrderDetailsReducer from '../modules/GetOrderDetails'
import GetPromoCodeReducer from '../modules/GetPromoCode'
import DeletePOSReducer from '../modules/DeletePOS';
import ItemRecordsReducer from '../modules/ItemRecords';
import SupportReducer from '../modules/HelpSupport';
import ChatHistoryReducer from '../modules/ChatHistory';
import RatingReducer from '../modules/Rating';
import RemoveAddressReducer from '../modules/RemoveAddress';
//import languageReducer from '../modules/ChooseLanguage';
import GiftCardListReducer from '../modules/GiftCardList';
import ChangeProfilePasswordReducer from '../modules/ChangeProfilePassword';
import GetAppsLinkReducer from '../modules/GetAppsLink';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import * as reduxLoop from 'redux-loop-symbol-ponyfill';
import middleware from './middleware';
import reducer from './reducer';


const enhancers = [
  applyMiddleware(...middleware),
  reduxLoop.install()
];



const rootReducer = combineReducers({
  AuthReducer,
  RegisterReducer,
  AuthPasswordReducer,
  ForgotPasswordReducer,
  ChangePasswordReducer,
  AuthSocialReducer,
  GetProfileReducer,
  GetEverythingReducer,
  GetItemReducer,
  EditProfileReducer,
  ResendReducer,
  VerifyOtpReducer,
  GetRestaurantListReducer,
  ChangeProfilePasswordReducer,
  AddPOSReducer,
  DeletePOSReducer,
  ItemRecordsReducer,
  RatingReducer,
  AddDeliveryAddressReducer,
  GetDeliveryAddressReducer,
  AddCartReducer,
  AddOrderReducer,
  GetOrderHistoryReducer,
  GetOrderDetailsReducer,
  GetPromoCodeReducer,
  SupportReducer,
  ChatHistoryReducer,
  RemoveAddressReducer,
  GetAppsLinkReducer,
  GiftCardListReducer,
  //languageReducer,
})


const store = createStore(rootReducer,
  applyMiddleware(...middleware));


console.log(store.getState());
// /* Enable redux dev tools only in development.
//  * We suggest using the standalone React Native Debugger extension:
//  * https://github.com/jhen0409/react-native-debugger
//  */
// /* eslint-disable no-undef */
const composeEnhancers = (
  __DEV__ &&
  typeof (window) !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;
// /* eslint-enable no-undef */
//
const enhancer = composeEnhancers(...enhancers);

export default store;
