// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const forgotPasswordAPI = async (mobileNumber: string, countryCode: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: FORGOT_PASSWORD_REQUEST
  });

  try {
     let details = {
       'mobileNumber': mobileNumber,
       'countryCode': countryCode
     };


      const user = await postAPI('/api/v1/user/forgotpassword', JSON.stringify(details));

     return dispatch({
       type: FORGOT_PASSWORD_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
