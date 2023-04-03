// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  CHANGE_PROFILE_PASSWORD_REQUEST,
  CHANGE_PROFILE_PASSWORD_SUCCESS,
  CHANGE_PROFILE_PASSWORD_FAILURE
} from './types';
import { postAPI } from '../../utils/api';


export const changeProfilePasswordAPI = async (customerid: string, password: string, confirmPassword: string, currentPassword: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: CHANGE_PROFILE_PASSWORD_REQUEST
  });

  try {
    let details = {
      //  'customerid': customerid,
      'password': password,
      'confirmPassword': confirmPassword,
      'currentPassword': currentPassword
    };
    const user = await postAPI('/api/v1/user/changepassword', JSON.stringify(details));

    return dispatch({
      type: CHANGE_PROFILE_PASSWORD_SUCCESS,
      payload: user
    });
  } catch (e) {
    dispatch({
      type: CHANGE_PROFILE_PASSWORD_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
