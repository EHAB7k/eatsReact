import SavedAddresses from './SavedAddresses'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeliveryAddressAPI } from '../../modules/GetDeliveryAddress';

const mapStateToProps = state => ({
    isBusy: state.GetDeliveryAddressReducer.isBusy,
    response: state.GetDeliveryAddressReducer,
});


export default connect(
    mapStateToProps,
    dispatch => {
        return {
            getDeliveryAddressAPI: bindActionCreators(getDeliveryAddressAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(SavedAddresses);

//export default SavedAddresses