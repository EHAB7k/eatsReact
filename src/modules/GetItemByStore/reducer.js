// @flow
import {
    GET_ITEM_BY_STORE_REQUEST,
    GET_ITEM_BY_STORE_SUCCESS,
    GET_ITEM_BY_STORE_FAILURE
} from './types';
import type State from './types';


const INITIAL_STATE = [{
    error: null,
    response: '',
    isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ITEM_BY_STORE_REQUEST:
            return {
                ...state,
                isBusy: true,
                response: ''

            };
        //return state.update('isBusy', () => true);
        case GET_ITEM_BY_STORE_SUCCESS:
            return {
                ...state,
                isBusy: false,
                response: action.payload


            };


        case GET_ITEM_BY_STORE_FAILURE:
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