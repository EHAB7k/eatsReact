import Orders from './Orders';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOrderHistoryAPI } from '../../modules/GetOrderHistory';


const mapStateToProps = state => ({
    isBusyOrderHistory: state.GetOrderHistoryReducer.isBusy,
    responseOrderHistory: state.GetOrderHistoryReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            getOrderHistoryAPI: bindActionCreators(getOrderHistoryAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(Orders);
