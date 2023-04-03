import { NavigationActions } from 'react-navigation';
import ChangePasswordProfile from './ChangePasswordProfile';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeProfilePasswordAPI } from '../../modules/ChangeProfilePassword';



const mapStateToProps = state => ({
  isBusy: state.ChangeProfilePasswordReducer.isBusy,
  response: state.ChangeProfilePasswordReducer,

});



export default connect(
  mapStateToProps,
  dispatch => {
    return {
      changeProfilePasswordAPI: bindActionCreators(changeProfilePasswordAPI, dispatch),
      navigate: bindActionCreators(NavigationActions.navigate, dispatch)
    };
  }
)(ChangePasswordProfile);
