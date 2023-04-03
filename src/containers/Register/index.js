import { NavigationActions } from 'react-navigation';
import Register from './Register';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerAPI } from '../../modules/Register';
import { getProfileAPI } from '../../modules/GetProfile';

const mapStateToProps = state => ({
    isBusy: state.RegisterReducer.isBusy,
    response: state.RegisterReducer,
    isBusyGetProfile: state.GetProfileReducer.isBusy,
    responseGetProfile: state.GetProfileReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            registerAPI: bindActionCreators(registerAPI, dispatch),
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(Register);

//export default Register;