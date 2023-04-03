// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
//import serviceComponent from '../../containers/Password';
import {
  RATING_REQUEST,
  RATING_SUCCESS,
  RATING_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const ratingAPI = async (orderId: string,storeRating: int, driverRating: int) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: RATING_REQUEST
  });

  try {
     let details = {
       'orderId': orderId,
       'driverRating': driverRating,
       'restaurantRating': storeRating
     };
    const user = await postAPI('/api/v1/user/feedbackbycustomer', JSON.stringify(details));

     return dispatch({
       type: RATING_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: RATING_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
