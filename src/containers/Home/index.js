import { NavigationActions } from 'react-navigation';
import Home from './Home'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRestaurantList } from '../../modules/GetRestaurantList';
import { getEverythingAPI } from '../../modules/GetEverything';
import { getAppLinksApi } from '../../modules/GetAppsLink';
import { ItemRecordsApi } from '../../modules/ItemRecords';
import { getProfileAPI } from '../../modules/GetProfile';
import { EditProfileAPI } from '../../modules/EditProfile';

const mapStateToProps = state => ({
    isBusy: state.GetRestaurantListReducer.isBusy,
    response: state.GetRestaurantListReducer,
    isBusyGetEverything: state.GetEverythingReducer.isBusy,
    responseGetEverything: state.GetEverythingReducer,
    isBusyItem: state.ItemRecordsReducer.isBusy,
    responseItem: state.ItemRecordsReducer,
    isBusyGetAppLinks: state.GetAppsLinkReducer.isBusy,
    responseGetAppLinks: state.GetAppsLinkReducer,
    responseGetProfile: state.GetProfileReducer.response,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            getRestaurantList: bindActionCreators(getRestaurantList, dispatch),
            getAppLinksApi: bindActionCreators(getAppLinksApi, dispatch),
            getEverythingAPI: bindActionCreators(getEverythingAPI, dispatch),
            ItemRecordsApi: bindActionCreators(ItemRecordsApi, dispatch),
            getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            EditProfileAPI: bindActionCreators(EditProfileAPI, dispatch),

        };
    }
)(Home);

//export default Home;