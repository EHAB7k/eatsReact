import AddCartDetails from './AddCartDetails';
import {NavigationActions} from 'react-navigation';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ItemRecordsApi} from '../../modules/ItemRecords';
import {getDeliveryAddressAPI} from '../../modules/GetDeliveryAddress';
import {addCartAPI} from '../../modules/AddCart';
import {getProfileAPI} from '../../modules/GetProfile/actions';

const mapStateToProps = state => ({
  isBusyAddCart: state.AddCartReducer.isBusy,
  responseAddCart: state.AddCartReducer,
  isBusy: state.ItemRecordsReducer.isBusy,
  response: state.ItemRecordsReducer,
  isBusyGetDeliveryAddress: state.GetDeliveryAddressReducer.isBusy,
  responseGetDeliveryAddress: state.GetDeliveryAddressReducer,
  profileData: state.GetProfileReducer?.response?.data,
  profileLoader: state.GetProfileReducer.isBusy,
});

export default connect(mapStateToProps, dispatch => {
  return {
    getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
    addCartAPI: bindActionCreators(addCartAPI, dispatch),
    getDeliveryAddressAPI: bindActionCreators(getDeliveryAddressAPI, dispatch),
    ItemRecordsApi: bindActionCreators(ItemRecordsApi, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(AddCartDetails);
