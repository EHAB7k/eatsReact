// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import axios from 'react-native-axios';
import {ADD_ORDER_REQUEST, ADD_ORDER_SUCCESS, ADD_ORDER_FAILURE} from './types';
import {postAPI} from '../../utils/api';

export const addOrderAPI =
  async (
    addressId: string,
    storeId: string,
    paymentMethod: string,
    paymentSourceRefNo: string,
    promocode: string,
    tipAmount: string,
    cartItemsIds: [],
    scheduleDate: string,
    scheduleTime: string,
    tip: String,
    timezone: string,
    tipType: string,
    orderInstructions: string,
    serviceType: string,
    giftCardBalanceUsed,
    pointsIntoBalance,

  ) =>
  async (dispatch: ReduxDispatch) => {
    dispatch({
      type: ADD_ORDER_REQUEST,
    });

    try {
      let details = {
        addressId: addressId,
        restaurantId: storeId,
        paymentMethod: paymentMethod,
        authorityId:"NV25GlPuOnQ=",
        newCategoryId:'NV25GlPuOnQ=',
        paymentSourceRefNo: paymentSourceRefNo,
        promocode: promocode,
        tip: tip,
        cartItemsIds: cartItemsIds,
        tipAmount: parseInt(tipAmount),
        timezone: timezone,
        tipType: tipType,
        orderInstructions: orderInstructions,
        serviceType: serviceType,
        pointsUsed: pointsIntoBalance * 100,
        pointsIntoBalance,
        giftCardBalanceUsed,
      };
      console.log('before api hit ::::::', details);
      const user = await postAPI(
        'api/v1/user/addorder',
        JSON.stringify(details),
      );

      console.log("after api hit", user);

      return dispatch({
        type: ADD_ORDER_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: ADD_ORDER_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
