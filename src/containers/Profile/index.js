import Profile from './Profile';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfileAPI } from '../../modules/GetProfile';


const mapStateToProps = state => ({
    isBusyGetProfile: state.GetProfileReducer.isBusy,
    responseGetProfile: state.GetProfileReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(Profile);
