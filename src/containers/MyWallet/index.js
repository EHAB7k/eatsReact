import moment from 'moment';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import {get, postAPI} from '../../utils/api';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {bindActionCreators} from 'redux';
import Activity from '../../components/ActivityIndicator';
import {errorAlert, successAlert} from '../../utils/genricUtils';
import {getProfileAPI, updateGiftCardInProfile} from '../../modules/GetProfile';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class MyWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0, //0 for points, 1 for gift
      giftCardCode: '',
      isLoading: false,
      userGiftCardBalance: 0,
      userPointsBalance: 0,
      isLoading: false,
      pointsHistory: [],
      giftCardHistory: [],
    };
    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = () => {
    const {profileData, getProfileAPI} = this.props;

    this.setState({
      giftCardCode: '',
    });

    getProfileAPI()
      .then(() =>
        this.setState({
          userGiftCardBalance: profileData.userGiftCardBalance,
          userPointsBalance: profileData.userPointsBalance,
        }),
      )
      .catch(e => console.log('Error', e));

    this.handlePointsHistoryApi();
    this.handleGiftCardHistoryApi();
  };

  setActiveTab = payload => {
    this.setState({
      activeTab: payload,
    });
  };

  // *********** Render & handle Points Item ************* //

  handlePointsHistoryApi = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const res = await get('/api/v1/user/getPointsHistoryByUserId');
      if (res?.status === 'success') {
        this.setState({
          pointsHistory: res?.data,
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  renderPointsItem = ({item, index}) => {
    return (
      <View style={styles.itemWrapper}>
        <Image
          style={styles.icItem}
          source={
            item.type === 'pointsredeemed'
              ? Images.icRedeemMinus
              : Images.icEarnedPlus
          }
        />
        <View style={styles.itemMiddleView}>
          <Text style={styles.statusText}>
            {item.type === 'pointsredeemed'
              ? strings.REDEEM_POINTS
              : strings.EARNED_POINTS}
          </Text>
          <Text style={styles.timeText}>
            {moment(item.updatedAt).format('DD/MM/YYYY H:mm')}
          </Text>
        </View>
        <View style={styles.itemSideView}>
          <Text style={styles.itemPrice}>{item.amount}</Text>
          <Text style={styles.transfer}>{strings.TRANSFER}</Text>
        </View>
      </View>
    );
  };

  // *********** Render & handle Gift View ************* //

  handleGiftCardHistoryApi = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const res = await get('/api/v1/user/getGiftCardHistoryByUserId');
      if (res?.status === 'success') {
        this.setState({
          giftCardHistory: res?.data,
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  renderGiftCardItem = ({item, index}) => {
    return (
      <View style={styles.itemWrapper}>
        <Image
          style={styles.icItem}
          source={
            item.type === 'giftcardredeemed'
              ? Images.icRedeemMinus
              : Images.icEarnedPlus
          }
        />
        <View style={styles.itemMiddleView}>
          <Text style={styles.statusText}>
            {item.type === 'giftcardredeemed' ? strings.REDEEM : strings.EARNED}
          </Text>
          <Text style={styles.timeText}>
            {moment(item.updatedAt).format('DD/MM/YYYY H:mm')}
          </Text>
        </View>
        <View style={styles.itemSideView}>
          <Text style={styles.itemPrice}>
            {parseInt(item.amount).toFixed(1)} {strings.SAR}
          </Text>
          <Text style={styles.transfer}>{strings.TRANSFER}</Text>
        </View>
      </View>
    );
  };

  renderGiftView = () => {
    const {giftCardCode, giftCardHistory} = this.state;
    const {profileData} = this.props;
    return (
      <View style={styles.giftView}>
        <Text style={styles.addCardText}>{strings.ADD_A_GIFT_CARD}</Text>

        <View style={styles.inputViewStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={giftCardCode =>
              this.setState({
                giftCardCode,
              })
            }
            value={giftCardCode}
          />
        </View>

        <TouchableOpacity
          disabled={giftCardCode.length === 0}
          onPress={this.handleAddBalance}
          style={styles.addBalButton}>
          <Text style={styles.addBalText}>{strings.ADD_BALANCE}</Text>
        </TouchableOpacity>

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.giftCardListContainer}
          data={giftCardHistory}
          renderItem={this.renderGiftCardItem}
          keyExtractor={(item, index) => `${index}_WalletGiftList`}
        />
      </View>
    );
  };

  handleAddBalance = async () => {
    const {giftCardCode} = this.state;
    const {updateGiftCardInProfile} = this.props;
    this.setState({
      isLoading: true,
    });
    try {
      let details = {
        uniqueCode: giftCardCode,
      };
      const res = await postAPI(
        '/api/v1/user/redeemPurchasedGiftCardById',
        JSON.stringify(details),
      );
      if (res.status === 'success') {
        successAlert(res.message);
        this.setState({
          giftCardCode: '',
          userGiftCardBalance: res?.data?.customerData?.userGiftCardBalance,
        });
        updateGiftCardInProfile(res?.data?.customerData?.userGiftCardBalance);
      } else if (res.status === 'failure') {
        errorAlert(res.message);
      }
      this.setState({
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
      throw e;
    }
  };

  render() {
    const {navigation, profileData, profileLoader} = this.props;
    const {
      activeTab,
      isLoading,
      userGiftCardBalance,
      userPointsBalance,
      pointsHistory,
    } = this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header menu title={strings.EATS_WALLET} navigation={navigation} />

        {/* ************* Render Tabs View ************ */}

        <View style={styles.tabsViewWrapper}>
          <TouchableOpacity
            onPress={() => this.setActiveTab(0)}
            style={[
              styles.tabView,
              {
                borderBottomColor:
                  activeTab === 0 ? Colors.primary : Colors.textLightGrey,
              },
            ]}>
            <Text
              style={[
                styles.TabText,
                {
                  color:
                    activeTab === 0 ? Colors.textBlack : Colors.textLightGrey,
                },
              ]}>
              {strings.POINTS}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setActiveTab(1)}
            style={[
              styles.tabView,
              {
                borderBottomColor:
                  activeTab === 1 ? Colors.primary : Colors.textLightGrey,
              },
            ]}>
            <Text
              style={[
                styles.TabText,
                {
                  color:
                    activeTab === 1 ? Colors.textBlack : Colors.textLightGrey,
                },
              ]}>
              {strings.GIFT}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ********* Balance View ********* */}

        <View style={styles.balanceView}>
          <Text style={styles.balanceText}>
            {activeTab === 1 && `${strings.GIFT} `}
            {strings.BALANCE}
          </Text>
          <Text
            style={[
              styles.balanceText,
              {
                color: Colors.primary,
              },
            ]}>
            {activeTab
              ? `${userGiftCardBalance.toFixed(2)} ${strings.SAR}`
              : userPointsBalance.toFixed()}
          </Text>
        </View>

        {/* ********* Render FlatList ********** */}

        {activeTab === 0 ? (
          <FlatList
            data={pointsHistory}
            renderItem={this.renderPointsItem}
            keyExtractor={(item, index) => `${index}_WalletList`}
          />
        ) : (
          this.renderGiftView()
        )}
        {isLoading || profileLoader ? <Activity /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  profileData: state.GetProfileReducer.response.data,
  profileLoader: state.GetProfileReducer.isBusy,
});

export default connect(mapStateToProps, dispatch => {
  return {
    getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
    updateGiftCardInProfile: bindActionCreators(
      updateGiftCardInProfile,
      dispatch,
    ),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(MyWallet);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  tabsViewWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabView: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: '3%',
    borderBottomWidth: 1.5,
  },
  TabText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 21,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderTopWidth: 0.8,
    borderColor: Colors.textLightGrey,
  },
  icItem: {
    height: 35,
    width: 35,
  },
  itemMiddleView: {
    width: '60%',
    paddingLeft: '2%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 17,
    color: Colors.textBlack,
  },
  timeText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    color: Colors.textBlack,
  },
  itemSideView: {
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: Fonts.primaryBold,
    color: Colors.primary,
  },
  transfer: {
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textBlack,
  },
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '6%',
    marginTop: '1%',
  },
  balanceText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    color: Colors.textBlack,
  },
  giftView: {
    paddingHorizontal: '5%',
    flex: 1,
  },
  addCardText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 15,
    textAlign: 'left',
  },
  inputViewStyle: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical: '2.5%',
    borderColor: Colors.borderGray,
    borderRadius: 30,
    borderWidth: 1,
    marginVertical: '4%',
  },
  inputStyle: {
    fontFamily: Fonts.primaryLight,
    fontSize: 15,
    color: Colors.textLightGrey,
    padding: 0,
    width: '100%',
  },
  addBalButton: {
    paddingVertical: '3.5%',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: Colors.primary,
    marginBottom: '5%',
  },
  addBalText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    color: Colors.White,
  },
  floatingLogo: {
    height: 90,
    width: 80,
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: 2,
    bottom: '5%',
    right: '1%',
  },
});
