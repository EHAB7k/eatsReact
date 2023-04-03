// @flow

import {
  GET_GIFT_CARD_LIST_REQUEST,
  GET_GIFT_CARD_LIST_SUCCESS,
  GET_GIFT_CARD_LIST_FAILURE,
} from './types';
import {postAPI, get} from '../../utils/api';
import {getConfiguration, setConfiguration} from '../../utils/configuration';

export const getGiftCardList =
  async (userid: string) => async (dispatch: ReduxDispatch) => {
    dispatch({
      type: GET_GIFT_CARD_LIST_REQUEST,
    });
    try {
      let details = {
        userid,
      };
      console.log('deatils', details);
      const user = await get('/api/v1/admin/giftCard/getAllGiftCard');
      console.log('api/v1/admin/giftCard/getAllGiftCard res = ', user);
      return dispatch({
        type: GET_GIFT_CARD_LIST_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: GET_GIFT_CARD_LIST_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
