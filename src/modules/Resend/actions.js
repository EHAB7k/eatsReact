// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  RESEND_REQUEST,
  RESEND_SUCCESS,
  RESEND_FAILURE
} from './types';
import { postAPI } from '../../utils/api';
var qs = require('qs');
import { getConfiguration} from '../../utils/configuration';


export const resendAPI = async (mobileNumber: string, countryCode: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: RESEND_REQUEST
  });

  try {
    let fcmToken = getConfiguration('fcmToken');
    let details = {
      'mobileNumber': mobileNumber,
      'countryCode': countryCode,
      'fcmToken': fcmToken,
    };
    console.log("----details-------", details)
    const response = await postAPI(
      '/api/v1/user/login',
      JSON.stringify(details),
    );
    console.log("login success response", response);
    
    return dispatch({
      type: RESEND_SUCCESS,
      payload: response
    });
  } catch (e) {
    dispatch({
      type: RESEND_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
