import { NavigationActions } from 'react-navigation';
import Login from './Login';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginWithPhone } from '../../modules/auth';
import { loginWithSocial } from '../../modules/AuthSocial';
import { getAppLinksApi } from '../../modules/GetAppsLink';
import { getProfileAPI } from '../../modules/GetProfile';
import { resendAPI } from '../../modules/Resend/actions';

const mapStateToProps = state => ({
    isBusy: state.AuthReducer.isBusy,
    response: state.AuthReducer,
    isBusySocial: state.AuthSocialReducer.isBusy,
    responseSocial: state.AuthSocialReducer,
    isBusyGetProfile: state.GetProfileReducer.isBusy,
    responseGetProfile: state.GetProfileReducer,
    isBusyGetAppLinks: state.GetAppsLinkReducer.isBusy,
    responseGetAppLinks: state.GetAppsLinkReducer,
    isBusyResend: state.ResendReducer.isBusy,
    responseResendOtp: state.ResendReducer
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            loginWithPhone: bindActionCreators(loginWithPhone, dispatch),
            resendAPI: bindActionCreators(resendAPI, dispatch),
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            loginWithSocial: bindActionCreators(loginWithSocial, dispatch),
            getAppLinksApi: bindActionCreators(getAppLinksApi, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(Login);