// @flow
import {
  GET_DELIVERY_ADDRESS_REQUEST,
  GET_DELIVERY_ADDRESS_FAILURE,
  GET_DELIVERY_ADDRESS_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false,
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DELIVERY_ADDRESS_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GET_DELIVERY_ADDRESS_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
      };


    case GET_DELIVERY_ADDRESS_FAILURE:
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
