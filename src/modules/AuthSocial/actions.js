// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  LOGIN_WITH_SOCIAL_REQUEST,
  LOGIN_WITH_SOCIAL_SUCCESS,
  LOGIN_WITH_SOCIAL_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const loginWithSocial = async (fbid: string, gid: string, aid:String) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: LOGIN_WITH_SOCIAL_REQUEST
  });

  try {
     let details = {
       'fbid': fbid,
       'gid': gid,
       'aid': aid
     };
      const user = await postAPI('/api/v1/user/acknowledgeSocialRegistration', JSON.stringify(details));

     return dispatch({
       type: LOGIN_WITH_SOCIAL_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: LOGIN_WITH_SOCIAL_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
