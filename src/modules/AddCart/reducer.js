// @flow
import { Map } from 'immutable';
import {
  ADDCART_REQUEST,
  ADDCART_SUCCESS,
  ADDCART_FAILURE
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
    case ADDCART_REQUEST:
    return {
        ...state,
        isBusy: true,
        response: null
      };
      //return state.update('isBusy', () => true);
    case ADDCART_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload
      };


    case ADDCART_FAILURE:
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
