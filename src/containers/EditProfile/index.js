import EditProfile from './EditProfile'
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfileAPI } from '../../modules/GetProfile';
import { EditProfileAPI } from '../../modules/EditProfile';


const mapStateToProps = state => ({
    isBusyGetProfile: state.GetProfileReducer.isBusy,
    responseGetProfile: state.GetProfileReducer,
    isBusy: state.EditProfileReducer.isBusy,
    response: state.EditProfileReducer
});


export default connect(
    mapStateToProps,
    dispatch => {
        return {
            EditProfileAPI: bindActionCreators(EditProfileAPI, dispatch),
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(EditProfile);