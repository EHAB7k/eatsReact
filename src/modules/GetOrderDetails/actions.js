// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
    GET_ORDER_DETAILS_REQUEST,
    GET_ORDER_DETAILS_SUCCESS,
    GET_ORDER_DETAILS_FAILURE
} from './types';
import { get } from '../../utils/api';



export const getOrderDetailsAPI = async (orderId) => async (
    dispatch: ReduxDispatch
) => {
    dispatch({
        type: GET_ORDER_DETAILS_REQUEST
    });
    console.log("orderId", orderId);

    try {
        var path = 'api/v1/user/orderdetail/' + orderId;
        const user = await get(path);
        console.log("get order", user);

        return dispatch({
            type: GET_ORDER_DETAILS_SUCCESS,
            payload: user
        });
    } catch (e) {
        dispatch({
            type: GET_ORDER_DETAILS_FAILURE,
            payload: e && e.message ? e.message : e
        });

        throw e;
    }
};