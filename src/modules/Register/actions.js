// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import axios from 'react-native-axios';
import {REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE} from './types';
import {postAPI} from '../../utils/api';

export const registerAPI =
  async (
    name,
    email,
    mobileNumber,
    customerId,
    password,
    address,
    otp,
    gid,
    fbid,
    aid,
    countryCode,
    lat,
    lng,
    languageId,
  ) =>
  async dispatch => {
    dispatch({
      type: REGISTER_REQUEST,
    });

    try {
      let details = {
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        customerId,
        password: password,
        address: address,
        gid: gid,
        fbid: fbid,
        // "OTP": otp,
        // "aid": aid,
        countryCode: countryCode,
        lat,
        lng,
        languageId,
      };

      const user = await postAPI(
        '/api/v1/user/register',
        JSON.stringify(details),
      );

      return dispatch({
        type: REGISTER_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: REGISTER_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
