// @flow
import {
  GETEVERYTHING_REQUEST,
  GETEVERYTHING_SUCCESS,
  GETEVERYTHING_FAILURE
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false

}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETEVERYTHING_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GETEVERYTHING_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload

      };


      case GETEVERYTHING_FAILURE:
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
