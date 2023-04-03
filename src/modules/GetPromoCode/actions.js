// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  GET_PROMO_CODE_REQUEST,
  GET_PROMO_CODE_SUCCESS,
  GET_PROMO_CODE_FAILURE
} from './types';
import { get } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getPromoCodeAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GET_PROMO_CODE_REQUEST
  });

  try {
    const user_id = getConfiguration('user_id');
    var path = 'api/v1/promo/visibleList';
    const user = await get(path);

    return dispatch({
      type: GET_PROMO_CODE_SUCCESS,
      payload: user
    });
  } catch (e) {
    dispatch({
      type: GET_PROMO_CODE_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
