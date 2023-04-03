// @flow
import {ADDCART_REQUEST, ADDCART_SUCCESS, ADDCART_FAILURE} from './types';
import {postAPI} from '../../utils/api';

export const addCartAPI =
  async (
    items: [],
    storeId: string,
    serviceType: string,
    promocode,
    giftcardAmount,
    redeemPoint,
  ) =>
  async (dispatch: ReduxDispatch) => {
    dispatch({
      type: ADDCART_REQUEST,
    });

    try {
      var details;
      if (giftcardAmount && redeemPoint) {
        details = {
          items: items,
          restaurantId: storeId,
          promocode: 'none',
          tip: 'no',
          promocode,
          serviceType,
          giftcardAmount,
          redeemPoint,
        };
      } else if (giftcardAmount) {
        details = {
          items: items,
          restaurantId: storeId,
          promocode: 'none',
          tip: 'no',
          promocode,
          serviceType,
          giftcardAmount,
        };
      } else if (redeemPoint) {
        details = {
          items: items,
          restaurantId: storeId,
          promocode: 'none',
          tip: 'no',
          promocode,
          serviceType,
          redeemPoint,
        };
      } else {
        details = {
          items: items,
          restaurantId: storeId,
          promocode: 'none',
          tip: 'no',
          promocode,
          serviceType,
        };
      }
      console.log('DETAILS-------->   ', details);
      const user = await postAPI(
        'api/v1/user/usercarts',
        JSON.stringify(details),
      );
      console.log('Add Cart API response in action', user);
      return dispatch({
        type: ADDCART_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: ADDCART_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
