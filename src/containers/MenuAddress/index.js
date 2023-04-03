import MenuAddress from './MenuAddress'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeliveryAddressAPI } from '../../modules/GetDeliveryAddress';
import { removeAddressAPI } from '../../modules/RemoveAddress';

const mapStateToProps = state => ({
    isBusy: state.GetDeliveryAddressReducer.isBusy,
    response: state.GetDeliveryAddressReducer,
    isBusyRemoveAddress: state.RemoveAddressReducer.isBusy,
    responseRemoveAddress: state.RemoveAddressReducer,
});


export default connect(
    mapStateToProps,
    dispatch => {
        return {
            getDeliveryAddressAPI: bindActionCreators(getDeliveryAddressAPI, dispatch),
            removeAddressAPI: bindActionCreators(removeAddressAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(MenuAddress);