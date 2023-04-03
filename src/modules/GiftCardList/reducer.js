// @flow

import {
  GET_GIFT_CARD_LIST_REQUEST,
  GET_GIFT_CARD_LIST_SUCCESS,
  GET_GIFT_CARD_LIST_FAILURE
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
    case GET_GIFT_CARD_LIST_REQUEST:
      return {
        ...state,
        isBusy: true,
        response: null
      };

    case GET_GIFT_CARD_LIST_SUCCESS:
      return {
        ...state,
        isBusy: false,
        response: action.payload
      };


    case GET_GIFT_CARD_LIST_FAILURE:
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
