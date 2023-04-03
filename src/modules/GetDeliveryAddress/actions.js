// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  GET_DELIVERY_ADDRESS_REQUEST,
  GET_DELIVERY_ADDRESS_SUCCESS,
  GET_DELIVERY_ADDRESS_FAILURE
} from './types';
import { postAPI } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getDeliveryAddressAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GET_DELIVERY_ADDRESS_REQUEST
  });

  try {
    const user_id = getConfiguration('user_id');
    const latitude = getConfiguration('latitude');
    const longitude = getConfiguration('longitude');


    let details = {
      'storeLocation': { "latitude": latitude, 'longitude': longitude },
    };
    const user = await postAPI('/api/v1/user/address', JSON.stringify(details));
    console.log("user address", user);
    return dispatch({
      type: GET_DELIVERY_ADDRESS_SUCCESS,
      payload: user
    });
  } catch (e) {
    dispatch({
      type: GET_DELIVERY_ADDRESS_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
