// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  CHATHISTORY_REQUEST,
  CHATHISTORY_SUCCESS,
  CHATHISTORY_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getChatHistoroyAPI = async (driverId: started) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: CHATHISTORY_REQUEST
  });

 try {
    let details = {
      'driverId': driverId
    };
     const user = await postAPI('api/v1/user/chathistory', JSON.stringify(details));
     return dispatch({
       type: CHATHISTORY_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: CHATHISTORY_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
