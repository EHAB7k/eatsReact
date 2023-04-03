// @flow
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import axios from 'react-native-axios';
import {
  GET_RESTAURANT_LIST_REQUEST,
  GET_RESTAURANT_LIST_SUCCESS,
  GET_RESTAURANT_LIST_FAILURE,
} from './types';
import {postAPI} from '../../utils/api';
import {getConfiguration, setConfiguration} from '../../utils/configuration';

export const getRestaurantList =
  async (lat: string, long: string, sortBy: string, search: string) =>
  async (dispatch: ReduxDispatch) => {
    dispatch({
      type: GET_RESTAURANT_LIST_REQUEST,
    });

    try {
      let myLet = getConfiguration('latitude');
      let mylong = getConfiguration('longitude');
      let details = {
        customerLocation: {lat: myLet, lng: mylong},
        sortby: sortBy,
        page: 0,
        limit: 200,
        search: search,
      };
      console.log('deatils', details);

      if (
        myLet !== undefined &&
        myLet !== 'undefined' &&
        mylong !== undefined &&
        mylong !== 'undefined'
      ) {
        console.log('Restaurant API called');
        const user = await postAPI(
          '/api/v1/user/restaurant/nearby',
          JSON.stringify(details),
        );
        console.log(
          'Get Restaurant API response actions',
          '/api/v1/user/restaurant/nearby',
          details,
          user,
        );
        return dispatch({
          type: GET_RESTAURANT_LIST_SUCCESS,
          payload: user,
        });
      } else {
        console.log('failure null');
        dispatch({
          type: GET_RESTAURANT_LIST_FAILURE,
          payload: null,
        });
      }
    } catch (e) {
      dispatch({
        type: GET_RESTAURANT_LIST_FAILURE,
        payload: e && e.message ? e.message : e,
      });

      throw e;
    }
  };
