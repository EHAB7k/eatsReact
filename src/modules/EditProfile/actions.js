// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  EDITPROFILE_REQUEST,
  EDITPROFILE_SUCCESS,
  EDITPROFILE_FAILURE
} from './types';
import { postAPI } from '../../utils/api';


export const EditProfileAPI = async (
  data
) => async (
  dispatch: ReduxDispatch
) => {
    dispatch({
      type: EDITPROFILE_REQUEST
    });

    try {
      console.log('details', data);

      const user = await postAPI('/api/v1/user/updateprofile', JSON.stringify(data));

      return dispatch({
        type: EDITPROFILE_SUCCESS,
        payload: user
      });
    } catch (e) {
      dispatch({
        type: EDITPROFILE_FAILURE,
        payload: e && e.message ? e.message : e
      });

      throw e;
    }
  };
