import Search from './Search';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRestaurantList } from '../../modules/GetRestaurantList';

const mapStateToProps = state => (
    {
        isBusy: state.GetRestaurantListReducer.isBusy,
        response: state.GetRestaurantListReducer,
        responseItem: state.ItemRecordsReducer,
    });

export default connect(
    mapStateToProps,
)(Search);