import {NavigationActions} from 'react-navigation';
import SupportMessage from './SupportMessage';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {supportAPI} from '../../modules/HelpSupport';
import {getOrderHistoryAPI} from '../../modules/GetOrderHistory';

const mapStateToProps = state => ({
  isBusy: state.SupportReducer.isBusy,
  response: state.SupportReducer,
  isBusyOrderHistory: state.GetOrderHistoryReducer.isBusy,
  responseOrderHistory: state.GetOrderHistoryReducer,
});

export default connect(mapStateToProps, dispatch => {
  return {
    getOrderHistoryAPI: bindActionCreators(getOrderHistoryAPI, dispatch),

    supportAPI: bindActionCreators(supportAPI, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(SupportMessage);
//export default SupportMessage
