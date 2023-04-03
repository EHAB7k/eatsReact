// @flow
import { Map } from 'immutable';
import {
  GET_RESTAURANT_LIST_REQUEST,
  GET_RESTAURANT_LIST_SUCCESS,
  GET_RESTAURANT_LIST_FAILURE
} from './types';
import type State from './types';
import { setAuthenticationToken } from './actions';




const INITIAL_STATE = [{
  error: null,
  response: null,
  isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_RESTAURANT_LIST_REQUEST:
      return {
        ...state,
        isBusy: true,
        response: null
      };
    case GET_RESTAURANT_LIST_SUCCESS:
      return {
        ...state,
        isBusy: false,
        response: action.payload
      };


    case GET_RESTAURANT_LIST_FAILURE:
      return {
        ...state,
        isBusy: false,
        response: null
      };
    default:
      return state;
  }
};

export default reducer;
