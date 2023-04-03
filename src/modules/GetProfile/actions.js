// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
     GETPROFILE_REQUEST,
     GETPROFILE_SUCCESS,
     GETPROFILE_FAILURE
} from './types';
import { get } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getProfileAPI = async () => async (
     dispatch: ReduxDispatch
) => {
     dispatch({
          type: GETPROFILE_REQUEST
     });

     try {
          const user_id = getConfiguration('user_id');
          var path = 'api/v1/user/profile';
          const user = await get(path);
          console.log("response user data", user );
          return dispatch({
               type: GETPROFILE_SUCCESS,
               payload: user
          });
     } catch (e) {
          dispatch({
               type: GETPROFILE_FAILURE,
               payload: e && e.message ? e.message : e
          });

          throw e;
     }
};

export const updateGiftCardInProfile = async (userGiftCardBalance) => async (
     dispatch: ReduxDispatch,
     getState,
) => {

     console.log('state', userGiftCardBalance, getState().GetProfileReducer)
     const profileData = getState().GetProfileReducer
     const updatedProfile = {
          ...profileData,
          response: {
               ...profileData.response,
               data: {
                    ...profileData.response.data,
                    userGiftCardBalance
               }
          }
     }
     console.log('updated data', updatedProfile)
     return dispatch({
          type: GETPROFILE_SUCCESS,
          payload: updatedProfile
     });
};
