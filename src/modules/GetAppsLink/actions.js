// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
    GET_APP_LINKS_REQUEST,
    GET_APP_LINKS_SUCCESS,
    GET_APP_LINKS_FAILURE
} from './types';
import { get } from '../../utils/api';



export const getAppLinksApi = async () => async (
    dispatch: ReduxDispatch
) => {
    dispatch({
        type: GET_APP_LINKS_REQUEST
    });

    try {
        var path = 'api/v1/admin/getbasicinfo';
        const user = await get(path);

        return dispatch({
            type: GET_APP_LINKS_SUCCESS,
            payload: user
        });
    } catch (e) {
        dispatch({
            type: GET_APP_LINKS_FAILURE,
            payload: e && e.message ? e.message : e
        });

        throw e;
    }
};