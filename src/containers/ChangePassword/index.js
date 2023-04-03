import { NavigationActions } from 'react-navigation';
import ChangePassword from './ChangePassword';
 import { connect } from 'react-redux';
 import { bindActionCreators } from 'redux';
 import { changePasswordAPI } from '../../modules/ChangePassword';


 const mapStateToProps = state => ({
    isBusy: state.ChangePasswordReducer.isBusy,
   response: state.ChangePasswordReducer
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
       changePasswordAPI: bindActionCreators(changePasswordAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
 )(ChangePassword);

//export default ChangePassword;
