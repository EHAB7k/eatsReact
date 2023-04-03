// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  GET_ITEM_BY_STORE_REQUEST,
  GET_ITEM_BY_STORE_SUCCESS,
  GET_ITEM_BY_STORE_FAILURE,
} from './types';
import {get} from '../../utils/api';

export const getItemByStoreApi =
  async storeId => async (dispatch: ReduxDispatch) => {
    dispatch({
      type: GET_ITEM_BY_STORE_REQUEST,
    });

    try {
      var path = 'api/v1/user/restaurant/details/' + storeId;
      const user = await get(path);
      console.log('user response', user);
      return dispatch({
        type: GET_ITEM_BY_STORE_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: GET_ITEM_BY_STORE_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
