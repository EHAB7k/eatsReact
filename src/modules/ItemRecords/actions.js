// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  ITEMRECORDS_REQUEST,
  ITEMRECORDS_SUCCESS,
  ITEMRECORDS_FAILURE,
} from './types';

export const ItemRecordsApi = async data => async (dispatch: ReduxDispatch) => {
  dispatch({
    type: ITEMRECORDS_REQUEST,
  });

  try {
    return dispatch({
      type: ITEMRECORDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ITEMRECORDS_FAILURE,
      payload: e && e.message ? e.message : e,
    });

    throw e;
  }
};
