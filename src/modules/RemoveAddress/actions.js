// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  REMOVE_ADDRESS_REQUEST,
  REMOVE_ADDRESS_SUCCESS,
  REMOVE_ADDRESS_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const removeAddressAPI = async (addressId: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: REMOVE_ADDRESS_REQUEST
  });

  try {
     let details = {
       'addressId': addressId
     };
    const user = await postAPI('/api/v1/user/removeaddress', JSON.stringify(details));

     return dispatch({
       type: REMOVE_ADDRESS_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: REMOVE_ADDRESS_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
