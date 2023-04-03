import OrderDetails from './OrderDetails'
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ratingAPI } from '../../modules/Rating';

const mapStateToProps = state => ({
    isBusy: state.RatingReducer.isBusy,
    response: state.RatingReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            ratingAPI: bindActionCreators(ratingAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(OrderDetails);