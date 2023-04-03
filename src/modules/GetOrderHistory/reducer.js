// @flow
import {
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false,
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ORDER_HISTORY_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GET_ORDER_HISTORY_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
      };


    case GET_ORDER_HISTORY_FAILURE:
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
