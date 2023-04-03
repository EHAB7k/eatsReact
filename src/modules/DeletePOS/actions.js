// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  DELETEPOS_REQUEST,
  DELETEPOS_SUCCESS,
  DELETEPOS_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const deleteCardAPI = async (posID: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: DELETEPOS_REQUEST
  });

  try {
     let details = {
       '_id': posID
     };
      const user = await postAPI('/api/v1/payment/deletepos', JSON.stringify(details));

     return dispatch({
       type: DELETEPOS_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: DELETEPOS_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
