// @flow
import { Map } from 'immutable';
import {
  VERIFY_REQUEST,
  VERIFY_FAILURE,
  VERIFY_SUCCESS
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
    case VERIFY_REQUEST:
      return {
        ...state,
        isBusy: true,
        response: null
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isBusy: false,
        response: action.payload
      };


    case VERIFY_FAILURE:
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
