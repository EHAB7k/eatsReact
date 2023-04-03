// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import axios from 'react-native-axios';
import {
  LOGIN_WITH_PHONE_REQUEST,
  LOGIN_WITH_PHONE_SUCCESS,
  LOGIN_WITH_PHONE_FAILURE,
} from './types';
import {postAPI} from '../../utils/api';
import { getConfiguration} from '../../utils/configuration';

export const loginWithPhone =
  async (mobileNumber, countryCode) => async dispatch => {
    dispatch({
      type: LOGIN_WITH_PHONE_REQUEST,
    });

    try {
      let fcmToken = getConfiguration('fcmToken');
        console.log('FCM token Value', fcmToken)
      let details = {
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        fcmToken: fcmToken,
      };
      console.log('data login API', JSON.stringify(details));
      const user = await postAPI(
        '/api/v1/user/login',
        JSON.stringify(details),
      );
      console.log('user', user);
      return dispatch({
        type: LOGIN_WITH_PHONE_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: LOGIN_WITH_PHONE_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
