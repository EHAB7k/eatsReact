import SetDeliveryLocation from './SetDeliveryLocation'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDeliveryAddressAPI } from '../../modules/AddDeliveryAddress';

const mapStateToProps = state => ({
    isBusy: state.AddDeliveryAddressReducer.isBusy,
    response: state.AddDeliveryAddressReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            addDeliveryAddressAPI: bindActionCreators(addDeliveryAddressAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(SetDeliveryLocation);            