import AccountDetail from './AccountDetail';
import {NavigationActions} from 'react-navigation';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getEverythingAPI} from '../../modules/GetEverything';
//import { paymentAPI } from '../../modules/Payment';
import {deleteCardAPI} from '../../modules/DeletePOS';
import {addOrderAPI} from '../../modules/AddOrder';
import {ItemRecordsApi} from '../../modules/ItemRecords';

const mapStateToProps = state => ({
  isBusyGetEverything: state.GetEverythingReducer.isBusy,
  responseGetEverything: state.GetEverythingReducer,
  //isBusyPayment: state.PaymentReducer.isBusy,
  //responsePayment: state.PaymentReducer,
  isBusyDelete: state.DeletePOSReducer.isBusy,
  responseDelete: state.DeletePOSReducer,
  isBusyAddOrder: state.AddOrderReducer.isBusy,
  responseAddOrder: state.AddOrderReducer,
  isBusyItem: state.ItemRecordsReducer.isBusy,
  responseItem: state.ItemRecordsReducer,
});

export default connect(mapStateToProps, dispatch => {
  return {
    getEverythingAPI: bindActionCreators(getEverythingAPI, dispatch),
    deleteCardAPI: bindActionCreators(deleteCardAPI, dispatch),
    addOrderAPI: bindActionCreators(addOrderAPI, dispatch),
    ItemRecordsApi: bindActionCreators(ItemRecordsApi, dispatch),
    //paymentAPI: bindActionCreators(paymentAPI, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(AccountDetail);
// export default AccountDetail;
