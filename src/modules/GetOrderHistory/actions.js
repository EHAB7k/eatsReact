// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
} from './types';
import {get} from '../../utils/api';
import {getConfiguration} from '../../utils/configuration';

export const getOrderHistoryAPI =
  async () => async (dispatch: ReduxDispatch) => {
    dispatch({
      type: GET_ORDER_HISTORY_REQUEST,
    });

    try {
      const user_id = getConfiguration('user_id');
      var path = 'api/v1/user/orderhistory';
      const user = await get(path);
      console.log("order history", user);
      return dispatch({
        type: GET_ORDER_HISTORY_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: GET_ORDER_HISTORY_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
