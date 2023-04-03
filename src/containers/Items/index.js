import Items from './Items';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItemRecordsApi } from '../../modules/ItemRecords';
import { getItemByStoreApi } from '../../modules/GetItemByStore';
import { addCartAPI } from '../../modules/AddCart';

const mapStateToProps = state => ({
    isBusy: state.ItemRecordsReducer.isBusy,
    response: state.ItemRecordsReducer,
    isBusyGetItem: state.GetItemReducer.isBusy,
    responseGetItem: state.GetItemReducer,
    isBusyAddCart: state.AddCartReducer.isBusy,
    responseAddCart: state.AddCartReducer,
});

export default connect(
    mapStateToProps,
    dispatch => {
        return {
            addCartAPI: bindActionCreators(addCartAPI, dispatch),
            ItemRecordsApi: bindActionCreators(ItemRecordsApi, dispatch),
            getItemByStoreApi: bindActionCreators(getItemByStoreApi, dispatch),
            navigate: bindActionCreators(NavigationActions.navigate, dispatch)
        };
    }
)(Items);
//export default Items;