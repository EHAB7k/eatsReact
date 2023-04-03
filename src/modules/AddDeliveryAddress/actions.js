// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  ADD_DELIVERY_ADDRESS_REQUEST,
  ADD_DELIVERY_ADDRESS_SUCCESS,
  ADD_DELIVERY_ADDRESS_FAILURE
} from './types';
import { postAPI } from '../../utils/api';


export const addDeliveryAddressAPI = async (address: string, long: string, lat: string, area: string, houseNo: string, landmark: string,    addressType: string, regionTypeId:string, cityTypeId:string) => async (
    dispatch: ReduxDispatch
  ) => {
    dispatch({
      type: ADD_DELIVERY_ADDRESS_REQUEST
    });

    try {
      let details = {
        'address': address,
        'addressLocation': { "long": long, 'lat': lat },
        'area': area,
        'houseNo': houseNo,
        'landmark': landmark,
        'addressType': addressType,
        'regionId':regionTypeId,
        'cityId':cityTypeId,
      };
      const user = await postAPI('/api/v1/user/addaddress', JSON.stringify(details));

      return dispatch({
        type: ADD_DELIVERY_ADDRESS_SUCCESS,
        payload: user
      });
    } catch (e) {
      dispatch({
        type: ADD_DELIVERY_ADDRESS_FAILURE,
        payload: e && e.message ? e.message : e
      });

      throw e;
    }
  };
