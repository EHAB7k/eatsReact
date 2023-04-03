// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  GETEVERYTHING_REQUEST,
  GETEVERYTHING_SUCCESS,
  GETEVERYTHING_FAILURE,
} from './types';
import {get} from '../../utils/api';
import {requestAPI} from '../../utils/api';
import {getConfiguration} from '../../utils/configuration';
import {postAPI} from '../../utils/api';

export const getEverythingAPI =
  async (fireBaseToken: string, location: string) =>
  async (dispatch: ReduxDispatch) => {
    dispatch({
      type: GETEVERYTHING_REQUEST,
    });

    try {
      var path = '/api/v1/user/everything';
      const user = await requestAPI('get', path, '');
      console.log('API hit from action everything', user);
      return dispatch({
        type: GETEVERYTHING_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: GETEVERYTHING_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
