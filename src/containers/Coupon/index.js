import Coupon from './Coupon';

import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPromoCodeAPI } from '../../modules/GetPromoCode';

const mapStateToProps = state => ({
  isBusy: state.GetPromoCodeReducer.isBusy,
  response: state.GetPromoCodeReducer
});



export default connect(
  mapStateToProps,
  dispatch => {
    return {
      getPromoCodeAPI: bindActionCreators(getPromoCodeAPI, dispatch),
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(Coupon);