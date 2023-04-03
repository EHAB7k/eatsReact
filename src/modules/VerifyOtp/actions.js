// @flow

import {
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAILURE
} from './types';
import { postAPI } from '../../utils/api';
import Axios from 'axios';
var qs = require('qs');


export const verifyOtpAPI = async (
  mobileNumber,
  countryCode,
  otp
) => async (
  dispatch
) => {
    dispatch({
      type: VERIFY_REQUEST
    });

    try {
      let details = {
        mobileNumber,
        countryCode,
        otp
      
      };
      console.log("----details-------", details)
      const response = await postAPI(
        '/api/v1/user/verifyUserOtp',
        JSON.stringify(details),
      );
      return dispatch({
        type: VERIFY_SUCCESS,
        payload: response
      });
    } catch (e) {
      dispatch({
        type: VERIFY_FAILURE,
        payload: e && e.message ? e.message : e
      });

      throw e;
    }
  };
