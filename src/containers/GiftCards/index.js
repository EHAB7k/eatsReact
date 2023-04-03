import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import {getGiftCardList} from '../../modules/GiftCardList';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import Activity from '../../components/ActivityIndicator/ActivityIndicator';
import {errorAlert} from '../../utils/genricUtils';

class GiftCards extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const {navigation} = props;

    this.w = navigation.addListener('didFocus', this.componentDidFocus);
  }

  componentDidFocus = () => {
    const {getGiftCardList, responseGetProfile} = this.props;
    const userid = responseGetProfile.response.data._id;
    getGiftCardList(userid)
      .then(() => this.afterGettinGiftCardList())
      .catch(e => errorAlert(e.message));
  };

  afterGettinGiftCardList = () => {
    const {response} = this.props;
  };

  render() {
    const {navigation, isBusy, response} = this.props;
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header menu title={strings.GIFT_CARDS} navigation={navigation} />
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          numColumns={2}
          columnWrapperStyle={styles.listColumnWrapper}
          data={response?.data}
          ListEmptyComponent={() => (
            <Text style={{marginTop: 20, textAlign: 'center'}}>
              {strings.NO_GIFT_ITEM_AVAILABLE}
            </Text>
          )}
          keyExtractor={(item, index) => `${index}_GiflCardList`}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('GiftCardForm', {item})}
              style={styles.itemWrapper}>
              <Image style={styles.itemImage} source={{uri: item.itemImage}} />
              <View style={styles.rowWrapper}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.itemName}
                </Text>
                {/* <Text
                                    numberOfLines={1}
                                    style={styles.itemCat}>
                                    {`(${item.itemDesc})`}
                                </Text> */}
              </View>
              <View style={styles.rowWrapper}>
                <Text numberOfLines={1} style={styles.discountPrice}>
                  {`${item.price} ${strings.SAR} `}
                </Text>
                <Text numberOfLines={1} style={styles.actualPrice}>
                  {`${item.regular_price} ${strings.SAR}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {isBusy ? <Activity /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isBusy: state.GiftCardListReducer.isBusy,
  response: state?.GiftCardListReducer?.response,
  responseGetProfile: state.GetProfileReducer,
});

export default connect(mapStateToProps, dispatch => {
  return {
    getGiftCardList: bindActionCreators(getGiftCardList, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(GiftCards);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  listContentContainer: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  itemWrapper: {
    width: '47%',
  },
  itemImage: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    marginBottom: '2%',
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    overflow: 'hidden',
  },
  itemName: {
    fontFamily: Fonts.primaryBold,
    fontSize: 17,
    color: Colors.textBlack,
  },
  itemCat: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 17,
    color: Colors.textBlack,
  },
  discountPrice: {
    fontFamily: Fonts.primaryLight,
    fontSize: 16,
    color: Colors.textBlack,
  },
  actualPrice: {
    fontFamily: Fonts.primaryLight,
    fontSize: 16,
    color: Colors.textBlack,
    textDecorationLine: 'line-through',
  },
});

const listData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
