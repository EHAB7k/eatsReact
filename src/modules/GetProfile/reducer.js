// @flow
import {
  GETPROFILE_REQUEST,
  GETPROFILE_FAILURE,
  GETPROFILE_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: null,
  isBusy: false,
  name: '',
  mobileNumber: '',
  profileImage: '',
  email: '',
  commodity: ''
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  // console.log('action payload', action.payload)
  switch (action.type) {
    case GETPROFILE_REQUEST:
      return {
        ...state,
        isBusy: true

      };
    //return state.update('isBusy', () => true);
    case GETPROFILE_SUCCESS:
      return {
        ...state,
        isBusy: false,
        response: action.payload,
        name: action.payload.data.name,
        mobileNumber:
          action.payload.data.countryCode +
          ' ' +
          action.payload.data.mobileNumber,
        profileImage: action.payload.data.profileImage,
        email: action.payload.data.email,
        commodity: action.payload.data.commodity,
        address: action.payload.data.address,
      };


    case GETPROFILE_FAILURE:
      return {
        ...state,
        isBusy: false,
        response: null,
        name: '',
        mobileNumber: '',
        profileImage: '',
        email: '',
        commodity: '',
        address: ''
      };
    default:
      return state;
  }
};

export default reducer;
