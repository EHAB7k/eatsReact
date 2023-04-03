import VerifyOTP from './VerifyOTP';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resendAPI } from '../../modules/Resend';
import { getProfileAPI } from '../../modules/GetProfile';
import { verifyOtpAPI } from '../../modules/VerifyOtp';

const mapStateToProps = state => ({
    isBusy: state.ResendReducer.isBusy,
    response: state.ResendReducer,
    isBusyVerifyOtp: state.VerifyOtpReducer.isBusy,
    responseVerifyOtp: state.VerifyOtpReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            resendAPI: bindActionCreators(resendAPI, dispatch),
            verifyOtpAPI: bindActionCreators(verifyOtpAPI, dispatch),
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(VerifyOTP);


//export default VerifyOTP;
