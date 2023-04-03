// @flow
import {
  GET_PROMO_CODE_REQUEST,
  GET_PROMO_CODE_FAILURE,
  GET_PROMO_CODE_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false,
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROMO_CODE_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GET_PROMO_CODE_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
      };


    case GET_PROMO_CODE_FAILURE:
      return {
          ...state,
          isBusy: false,
          response: null,
        };
    default:
      return state;
  }
};

export default reducer;
