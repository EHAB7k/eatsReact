// @flow
import {
  ITEMRECORDS_REQUEST,
  ITEMRECORDS_SUCCESS,
  ITEMRECORDS_FAILURE
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false

}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case ITEMRECORDS_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case ITEMRECORDS_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload

      };


    case ITEMRECORDS_FAILURE:
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
