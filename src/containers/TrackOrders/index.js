import TrackOrders from './TrackOrders'
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOrderDetailsAPI } from '../../modules/GetOrderDetails';
import { ratingAPI } from '../../modules/Rating';

const mapStateToProps = state => ({
    isBusyOrderDetails: state.GetOrderDetailsReducer.isBusy,
    responseOrderDetails: state.GetOrderDetailsReducer,
    isBusy: state.RatingReducer.isBusy,
    response: state.RatingReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            ratingAPI: bindActionCreators(ratingAPI, dispatch),
            getOrderDetailsAPI: bindActionCreators(getOrderDetailsAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(TrackOrders);
