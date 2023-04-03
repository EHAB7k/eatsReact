// @flow
import { Map } from 'immutable';
import {
  REMOVE_ADDRESS_REQUEST,
  REMOVE_ADDRESS_SUCCESS,
  REMOVE_ADDRESS_FAILURE
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
    case REMOVE_ADDRESS_REQUEST:
    return {
        ...state,
        isBusy: true,
        response: null
      };
      //return state.update('isBusy', () => true);
    case REMOVE_ADDRESS_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload
      };


    case REMOVE_ADDRESS_FAILURE:
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
