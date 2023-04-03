// @flow
import {
    GET_APP_LINKS_REQUEST,
    GET_APP_LINKS_SUCCESS,
    GET_APP_LINKS_FAILURE
} from './types';
import type State from './types';


const INITIAL_STATE = [{
    error: null,
    response: '',
    isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_APP_LINKS_REQUEST:
            return {
                ...state,
                isBusy: true,
                response: ''

            };
        //return state.update('isBusy', () => true);
        case GET_APP_LINKS_SUCCESS:
            return {
                ...state,
                isBusy: false,
                response: action.payload


            };


        case GET_APP_LINKS_FAILURE:
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