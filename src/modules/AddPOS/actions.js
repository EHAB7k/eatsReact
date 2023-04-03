// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  ADDPOS_REQUEST,
  ADDPOS_SUCCESS,
  ADDPOS_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const addCardAPI = async (customerId: string, type: string, name: string, token: string,lastd: string, cardNumber: string,
  expiryDate: string, cvv: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: ADDPOS_REQUEST
  });

  try {
     let details = {
       'customerId': customerId,
       'type': type,
       'name': name,
       'token': token,
       'detials': lastd,
       'lastd': lastd,
       'cardNumber': cardNumber,
       'cvv': cvv,
       'expiryDate': expiryDate
     };
     console.log("details", details)
    const user = await postAPI('/api/v1/payment/addpos', JSON.stringify(details));

     return dispatch({
       type: ADDPOS_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: ADDPOS_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
