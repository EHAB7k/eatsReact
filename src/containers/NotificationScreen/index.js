import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, TouchableOpacity, Text, Image} from 'react-native';
import Activity from '../../components/ActivityIndicator/ActivityIndicator';
import {Header} from '../../components/Header';
import {InfiniteIndicator} from '../../components/InfiniteIndicator';
import strings from '../../constants/lang';
import {get, postAPI} from '../../utils/api';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import {errorAlert} from '../../utils/genricUtils';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: {},
      isLoading: false,
      currentPage: 1,
      moreLoader: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => this.getNotificationList(),
    );
  };

  handleLoader = isLoading => {
    this.setState({
      isLoading,
    });
  };

  handleMoreLoader = moreLoader => {
    this.setState({
      moreLoader,
    });
  };

  // ************************************* //
  // **** Render & Handle Functions ***** //
  // *********************************** //

  getNotificationList = async () => {
    const {currentPage} = this.state;
    const data = {
      limit: 10,
      page: currentPage,
    };
    this.handleLoader(true);
    try {
      const res = await postAPI(
        '/api/v1/user/notifications',
        JSON.stringify(data),
      );
      console.log("notification response", res);
      if (res?.status === 'success') {
        this.setState({
          notificationList: {
            data: res?.data,
            totalcount: res?.totalcount,
          },
        });
      } else {
        errorAlert(res?.message);
      }
      this.handleLoader(false);
    } catch (e) {
      this.handleLoader(false);
    }
  };

  getMoreNotificationList = async () => {
    const {notificationList, currentPage} = this.state;
    const data = {
      limit: 10,
      page: currentPage,
    };
    this.handleMoreLoader(true);
    try {
      const res = await postAPI(
        '/api/v1/user/notifications',
        JSON.stringify(data),
      );
      if (res?.status === 'success') {
        this.setState({
          notificationList: {
            data: [...notificationList?.data, ...res?.data],
            totalcount: res?.totalcount,
          },
        });
      } else {
        errorAlert(res?.message);
      }
      this.handleMoreLoader(false);
    } catch (e) {
      this.handleMoreLoader(false);
    }
  };

  handleLoadMore = () => {
    const {notificationList, currentPage, moreLoader} = this.state;
    if (
      notificationList?.totalcount / 10 > currentPage &&
      moreLoader === false
    ) {
      this.setState(
        {
          currentPage: currentPage + 1,
        },
        () => {
          this.getMoreNotificationList();
        },
      );
    }
  };

  handleItemPress = payload => () => {
    const {navigation} = this.props;
    if (payload.type === 'order') {
      navigation.navigate('OrderDetailsScreen', {
        isFromOrderScreen: true,
        item: payload?.orderRefId,
      });
    }
  };

  renderNotificationItem = ({item, index}) => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        disabled={item?.type !== 'order'}
        onPress={this.handleItemPress(item)}
        style={styles.itemWrapper}>
        <View style={styles.notifyBadge} />
        <Text style={styles.itemHeading}>{item.title}</Text>
        <Text style={styles.itemDesc}>{item.body}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation} = this.props;
    const {notificationList, isLoading, moreLoader} = this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header navigation={navigation} title={strings.NOTIFICATIONS} menu />
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            contentContainerStyle={styles.contentContainerStyle}
            data={notificationList?.data? notificationList?.data:[]}
          // data={[]}
            keyExtractor={(item, index) => `${index}_notificationList`}
            renderItem={this.renderNotificationItem}
            onEndReachedThreshold={0.1}
            onEndReached={this.handleLoadMore}
            ListFooterComponent={() => (
              <InfiniteIndicator isVisible={moreLoader} />
            )}
            ListEmptyComponent={()=>{return<Text style={{alignSelf:'center',  fontWeight:'bold', marginTop:20, fontSize:16}} >{"No notification found"}</Text>}}
          />
        </View>
        {isLoading && <Activity />}
      </View>
    );
  }
}

export default NotificationScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  contentContainerStyle: {
    paddingHorizontal: '5%',
    paddingBottom: '5%',
  },
  itemWrapper: {
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    borderRadius: 10,
    backgroundColor: Colors.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: '5%',
  },
  itemHeading: {
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
    fontSize: 17,
    marginBottom: '3%',
    textAlign: 'left',
  },
  itemDesc: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.textGrey,
    fontSize: 15,
    textAlign: 'left',
  },
  notifyBadge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.textRed,
    position: 'absolute',
    right: '5%',
    top: -5,
  },
});
