import { NavigationActions } from 'react-navigation';
import AddCard from './AddCard';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCardAPI } from '../../modules/AddPOS';
import { getEverythingAPI } from '../../modules/GetEverything';



const mapStateToProps = state => ({
    isBusy: state.AddPOSReducer.isBusy,
    response: state.AddPOSReducer,
    isBusyGetEverything: state.GetEverythingReducer.isBusy,
    responseGetEverything: state.GetEverythingReducer,
});



export default connect(
    mapStateToProps,
    dispatch => {
        return {
            addCardAPI: bindActionCreators(addCardAPI, dispatch),
            getEverythingAPI: bindActionCreators(getEverythingAPI, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(AddCard);

//export default AddCard
