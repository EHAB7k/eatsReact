import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  AsyncStorage,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import Activity from '../../components/ActivityIndicator';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import LinearGradient from 'react-native-linear-gradient';
import {postAPI} from '../../utils/api';
import strings from '../../constants/lang';

export default class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item'),
      bannerItem: '',
      itemName: '',
      items: [],
      categories: [],
      bestSellers: [],
      showTotalView: false,
      itemsCount: 0,
      totalValue: 0,
      itemId: [],
      isLoading: true,
      ratingValue: 0,
      showMenuOptions: false,
      position: 0,
      setIndex: 0,
      showAddOnModal: false,
      AddOnItem: null,
      addonList: [],
      addonLoading: false,
      activeTab: 'All',
      storeOffline: false,
      showSizeModal: false,
      sizeArray: [],
      sizeList: [],
      sizeItem: null,
      twoSteps: false,
      isItemDetail: false,
      itemDetailData: {},
    };
    this.menuListScroll = null;
    const {navigation} = props;

    this.w = navigation.addListener('didFocus', this.componentDidFocus);
  }

  componentDidFocus = payload => {
    this.setState({
      showTotalView: false,
    });
    const item = this.props.navigation.getParam('item');
    console.log('item', item);
    this.setState({
      ratingValue: this.state.item?.avgRating,
      storeOffline: item?.restaurantStatus === 'Offline' ? true : false,
    });
    if (this.state.item && this.state.item._id) {
      this.getItemsByCategory();
    } else {
      this.setState({isLoading: false});
      this.showAlert('Restaurant Refrence id missing', 300);
    }
    let response = this.props.response.response;
    if (response && response.length > 0) {
      this.setState({
        items: response,
      });
      this.calculateTotalAmount(response);
    } else {
      this.setState({
        items: [],
      });
    }
    this.setState({
      storeId: item?._id,
    });
  };

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  getItemsByCategory() {
    //     alert(this.state.item._id);
    this.props
      .getItemByStoreApi(this.state.item._id)
      .then(() => this.afterGetItemsByCategory())
      .catch(e => this.myFaliureAlert(e));
  }

  myFaliureAlert(e) {
    this.setState({isLoading: false});
    this.showAlert(e.message, 300);
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');
    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  afterGetItemsByCategory() {
    this.setState({isLoading: false});
    let status = this.props.responseGetItem.response.status;
    let message = this.props.responseGetItem.response.message;
    if (status == 'failure') {
      if (message == 'Not Authorized') {
        Alert.alert(
          '',
          strings.ALERT_SESSION_EXP,
          [
            {
              text: strings.OK,
              onPress: () => this.logOut(),
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        this.showAlert(message, 300);
      }
      return;
    }
    let data = this.props.responseGetItem.response.data;
    console.log('data', data);
    let category = data.categories;
    let myNewCategory = data.categories;
    let bestSellers = [];
    this.setState({
      bannerItem: data?.profileImage,
      itemName: data.name,
    });

    bestSellers = this.mybestSellers(myNewCategory);

    category.forEach(myFunction);
    function myFunction(newItem, index, arr) {
      let items = newItem.items;
      items.forEach(myFunction);
      function myFunction(item, index, arr) {
        (item.qty = 0),
          (item.restaurantImage = data?.restaurantLogo),
          (item.restaurantName = data.name),
          (item.restaurantAddress = data.address),
          (item.restaurantName_ar = data.name_ar);
      }
    }
    this.setState({
      categories: category,
      bestSellers: bestSellers,
    });
  }

  mybestSellers(myNewCategory) {
    let bestSellers = [];
    myNewCategory.forEach(myFunction);
    function myFunction(categoryItem, index, arr) {
      let items = categoryItem.items;
      var itemReminder = 0;
      items.forEach(myFunction);
      function myFunction(item, index, arr) {
        if (item.bestSeller == 'yes') {
          item.qty = 0;
          bestSellers.push(item);
        }
      }
    }

    return bestSellers;
  }

  renderCategoryFlatList() {
    const {activeTab, categories} = this.state;
    return (
      <View
        style={{
          width: '100%',
          height: 'auto',
          marginBottom: 0,
          backgroundColor: Colors.White,
          marginTop: 10,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[{}, ...categories].map((item, index) =>
            index === 0 ? (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    activeTab: 'All',
                  })
                }>
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 25,
                    fontFamily: Fonts.primaryBold,
                    color: Colors.textBlack,
                  }}>
                  {strings.ALL_PRODUCTS}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    activeTab: item.catName,
                  })
                }>
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 25,
                    fontFamily: Fonts.primaryBold,
                    color: Colors.textBlack,
                  }}>
                  {item.catName}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
        <FlatList
          style={{
            margin: 5,
            backgroundColor: 'transparent',
            height: 'auto',
          }}
          data={
            activeTab === 'All'
              ? categories
              : categories.filter(itm => itm.catName === activeTab)
          }
          keyExtractor={(item, index) => item._id}
          renderItem={(item, index) =>
            this.renderItemsFlatList(item.item, index)
          }
        />
      </View>
    );
  }

  renderItemsFlatList(item, index) {
    return (
      <View
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: 'transparent',
          marginBottom: 0,
        }}>
        <FlatList
          style={{
            margin: 5,
            backgroundColor: 'transparent',
            height: 'auto',
          }}
          data={item.items}
          keyExtractor={(item, index) => `${index}_allProductCategoryList`}
          renderItem={(item, index) =>
            item.item.itemName != null &&
            typeof item.item.name != undefined &&
            item.item.name != '' ? (
              this.renderOneView(item.item)
            ) : (
              <View style={styles.emptyView}></View>
            )
          }
        />
      </View>
    );
  }

  renderBestSeller() {
    return (
      <View
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: 'transparent',
          marginBottom: 0,
          marginTop: this.state.bestSellers.length > 0 ? 20 : 0,
        }}>
        {this.state.bestSellers.length > 0 ? (
          <Text
            style={{
              fontSize: 20,
              marginLeft: 25,
              fontFamily: Fonts.primaryBold,
              color: Colors.textBlack,
              textAlign: 'left',
            }}>
            {strings.BEST_SELLERS}
          </Text>
        ) : null}
        <FlatList
          style={{
            margin: 5,
            backgroundColor: 'transparent',
            height: 'auto',
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.bestSellers}
          keyExtractor={(item, index) => `${index}_bestSellerList`}
          renderItem={(item, index) =>
            item.item.itemName != null &&
            typeof item.item.name != undefined &&
            item.item.name != '' ? (
              this.renderTwoView(item.item)
            ) : (
              <View style={styles.emptyView}></View>
            )
          }
        />
      </View>
    );
  }

  clickOnContinueButton() {
    var items = [];
    this.props.response.response.forEach(myFunction);
    function myFunction(item, arr) {
      let newItem = {};
      newItem.itemId = item._id;
      newItem.qty = item.qty;
      newItem.itemName = item.itemName;
      newItem.itemName_ar = item.itemName_ar;
      newItem.price = item.price;
      newItem.categoryId = item.categoryId;
      if (item?.selectedSize) {
        newItem.selectedSize = item?.selectedSize;
      }
      newItem.addons = item.addons
        .map(it => it.items.filter(itm => itm.isSelected))
        .flat()
        .map(data => ({
          _id: data._id,
          name: data.name,
          price: data.price,
          name_ar: data.name_ar,
        }));

      if (item.qty > 0) {
        items.push(newItem);
      }
    }
    this.addCartAPI(items);
  }

  addCartAPI(items) {
    this.props
      .addCartAPI(items, this.state.storeId, 'delivery', 'none')
      .then(() => this.afterAddCartAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterAddCartAPI() {
    let status = this.props.responseAddCart.response.status;
    let message = this.props.responseAddCart.response.message;
    if (status == 'failure') {
      if (message == 'Not Authorized') {
        Alert.alert(
          '',
          strings.ALERT_SESSION_EXP,
          [
            {
              text: strings.OK,
              onPress: () => this.logOut(),
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        this.showAlert(message, 300);
      }
      return;
    }
    this.props.navigation.navigate('AddCartDetails', {
      flow: 'Items',
    });
  }

  initiateAddOn = item => {
    const {addonList} = this.state;
    const newItem = {
      ...item,
      addons: addonList.map(itm => ({
        ...itm,
        items: itm.items.map(data => ({
          ...data,
          isSelected: false,
        })),
      })),
    };
    this.setState({
      AddOnItem: newItem,
      showAddOnModal: true,
    });
  };

  renderOneView(item) {
    const language = getConfiguration('language');
    console.log('item======>', item);
    const {storeOffline} = this.state;
    return (
      <View
        style={{
          width: '100%',
          marginTop: 5,
          height: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() =>
            this.setState({itemDetailData: item, isItemDetail: true})
          }>
          <Image
            style={{
              height: 60,
              width: 60,
              borderRadius: 8,
            }}
            source={{uri: item.itemImage}}
          />
          <View
            style={{
              width: '60%',
              marginLeft: 5,
            }}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {language === 'ar' ? item.itemName_ar : item.itemName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: Colors.textGrey,
                fontFamily: Fonts.primaryRegular,
                marginLeft: 5,
                textAlign: 'left',
              }}>
              {language === 'ar' ? item.itemDesc_ar : item.itemDesc}
            </Text>
            {item.on_sale == 'yes' ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.textGrey,
                    fontFamily: Fonts.primaryBold,
                    marginLeft: 5,
                  }}>
                  {item.price} {strings.SAR}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.textGrey,
                    fontFamily: Fonts.primaryRegular,
                    marginLeft: 5,
                    textDecorationLine: 'line-through',
                  }}>
                  {item.regular_price} {strings.SAR}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textGrey,
                  fontFamily: Fonts.primaryBold,
                  marginLeft: 5,
                }}>
                {item.price} {strings.SAR}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={storeOffline}
          style={{
            width: 90,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={
            item.size.length > 0
              ? this.getSizeList(item)
              : this.getAddonList(item)
          }>
          <Image
            resizeMode="contain"
            style={{
              width: '100%',
              height: 25,
            }}
            source={Images.addImage}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderItemView(item, index, name) {
    return item.itemName != null &&
      typeof item.name != undefined &&
      item.name != '' ? (
      item.bestSeller === 'yes' ? (
        this.renderTwoView(item)
      ) : (
        this.renderOneView(item)
      )
    ) : (
      <View style={styles.emptyView}></View>
    );
  }

  renderTwoView(item) {
    const language = getConfiguration('language');
    const {storeOffline} = this.state;
    if (item.itemName && item.itemName.length > 0) {
      return (
        <View style={styles.categoryView}>
          <View
            style={{
              width: 150,
              height: 150,
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Image
              resizeMode="stretch"
              style={styles.categoryImage}
              source={{uri: item.itemImage}}
            />
          </View>
          <Text style={styles.categoryText}>
            {language === 'ar' ? item.itemName_ar : item.itemName}
          </Text>
          <Text
            numberOfLines={3}
            style={[
              styles.itemDesc,
              {
                width: 150,
              },
            ]}>
            {language === 'ar' ? item.itemDesc_ar : item.itemDesc}
          </Text>
          <View style={{flexDirection: 'row', width: 'auto'}}>
            {item.on_sale == 'yes' ? (
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textLightGrey,
                    marginLeft: 5,
                    marginTop: 0,
                  }}>
                  {item.price} {strings.SAR}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textLightGrey,
                    marginLeft: 5,
                    marginTop: 0,
                  }}>
                  {item.regular_price} {strings.SAR}
                </Text>
              </View>
            ) : (
              <Text style={styles.priceText}>
                {item.price} {strings.SAR}
              </Text>
            )}

            <View
              style={{
                width: 'auto',
                height: 'auto',
                backgroundColor: 'transparent',
              }}>
              <TouchableOpacity
                disabled={storeOffline}
                style={{
                  width: 80,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  backgroundColor: 'transparent',
                  height: 50,
                }}
                onPress={
                  item.size.length > 0
                    ? this.getSizeList(item)
                    : this.getAddonList(item)
                }>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 25,
                    marginTop: 5,
                    marginLeft: 30,
                    marginBottom: 30,
                  }}
                  source={Images.addImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  updateValueItemAndTotal() {
    var count = 0;
    var totalValue = 0;
    // console.log('checking stupid data', this.state.items);
    this.state?.items.forEach(myFunction);
    function myFunction(item, index, arr) {
      if (item.qty > 0) {
        count = count + item.qty;
        totalValue = totalValue + item.price * item.qty + item.addOnTotalValue;
      } else {
        count = count;
      }
    }
    this.setItemsDataInRedux(this.state.items);
    if (count == 0) {
      this.setState({
        showTotalView: false,
        itemsCount: 0,
        totalValue: 0,
      });
      this.setItemsDataInRedux([]);
    } else {
      this.setState({
        showTotalView: true,
        itemsCount: count,
        totalValue: totalValue,
      });
    }
  }

  afterSetItemsDataInRedux() {}

  renderTopView() {
    const {bannerItem} = this.state;
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: wp('100%'),
          height: hp('25%'),
          marginTop: 0,
          position: 'absolute',
        }}>
        <LinearGradient
          style={{
            width: '100%',
            height: '100%',
          }}
          colors={['#00000030', 'transparent', 'transparent', '#00000030']}>
          <Image
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              marginTop: 0,
            }}
            source={
              bannerItem !== 'null' ? {uri: bannerItem} : Images.registerBGIcon
            }
          />
        </LinearGradient>
      </View>
    );
  }

  clickOnGoBack() {
    this.props.navigation.navigate('Home');
  }

  renderBackView() {
    const language = getConfiguration('language');
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 60,
          marginTop: Platform.OS === 'ios' ? 40 : 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: '5%',
            height: 30,
            width: 30,
            borderRadius: 30 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000050',
          }}
          onPress={() => this.clickOnGoBack()}>
          <Image
            resizeMode="contain"
            style={[
              styles.backIcon,
              {
                transform: [
                  {
                    scaleX: language === 'ar' ? -1 : 1,
                  },
                ],
              },
            ]}
            source={Images.backImage}
          />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.White,
            fontSize: 18,
            fontFamily: Fonts.primaryBold,
          }}>
          {this.state.itemName}
        </Text>
      </View>
    );
  }

  // ########################################
  // ## Handling Add Item to Cart & Total  ##
  // ########################################

  AddItemToCart = payload => {
    const {
      response: {response},
    } = this.props;
    let cartData = response;
    // Finding the Cart is created or not
    if (response && response.length > 0) {
      // Checking the the items
      if (payload?.size.length > 0 && payload?.addonsItemsId.length > 0) {
        let i, j, k, index, item, check;
        check = [];
        for (i = 0; i < cartData.length; i++) {
          if (check.length > 0 && check.every(it => it === true)) {
          } else {
            item = cartData[i];
            index = i;
            if (
              item._id === payload._id &&
              cartData[i].selectedSize._id === payload.selectedSize._id
            ) {
              check = [];
              for (j = 0; j < cartData[i].addons.length; j++) {
                let addonCatItem = cartData[i]?.addons[j];
                if (addonCatItem._id === payload.addons[j]._id) {
                  for (k = 0; k < cartData[i].addons[j].items.length; k++) {
                    let addonItem = cartData[i]?.addons[j]?.items[k];
                    addonItem._id === payload.addons[j].items[k]._id &&
                    addonItem.isSelected ===
                      payload.addons[j].items[k].isSelected
                      ? check.push(true)
                      : check.push(false);
                  }
                }
              }
            }
          }
        }
        if (
          check.every(it => it === true) &&
          cartData[index]._id === payload._id &&
          cartData[index].selectedSize._id === payload.selectedSize._id
        ) {
          cartData[index].qty = item.qty + 1;
        } else {
          cartData.push({
            ...payload,
            qty: 1,
          });
        }
        this.setItemsDataInRedux(cartData);
        this.calculateTotalAmount(cartData);
      } else if (
        payload?.size.length > 0 &&
        payload?.addonsItemsId.length === 0
      ) {
        let i, index, item;
        let check = false;
        for (i = 0; i < cartData.length; i++) {
          if (check === false) {
            item = cartData[i];
            index = i;
            cartData[i]._id === payload._id &&
            cartData[i].selectedSize._id === payload.selectedSize._id
              ? (check = true)
              : (check = false);
          }
        }

        if (check && cartData[index]._id === payload._id) {
          cartData[index].qty = item.qty + 1;
        } else {
          cartData.push({
            ...payload,
            qty: 1,
          });
        }

        this.setItemsDataInRedux(cartData);
        this.calculateTotalAmount(cartData);
      } else if (
        payload?.size.length === 0 &&
        payload?.addonsItemsId.length > 0
      ) {
        let i, j, k, index, item, check;
        check = [];
        for (i = 0; i < cartData.length; i++) {
          if (check.length > 0 && check.every(it => it === true)) {
          } else {
            item = cartData[i];
            index = i;
            if (item._id === payload._id) {
              check = [];
              for (j = 0; j < cartData[i].addons.length; j++) {
                let addonCatItem = cartData[i]?.addons[j];
                if (addonCatItem._id === payload.addons[j]._id) {
                  for (k = 0; k < cartData[i].addons[j].items.length; k++) {
                    let addonItem = cartData[i]?.addons[j]?.items[k];
                    addonItem._id === payload.addons[j].items[k]._id &&
                    addonItem.isSelected ===
                      payload.addons[j].items[k].isSelected
                      ? check.push(true)
                      : check.push(false);
                  }
                }
              }
            }
          }
        }

        if (
          check.every(it => it === true) &&
          cartData[index]._id === payload._id
        ) {
          cartData[index].qty = item.qty + 1;
        } else {
          cartData.push({
            ...payload,
            qty: 1,
          });
        }
        this.setItemsDataInRedux(cartData);
        this.calculateTotalAmount(cartData);
      } else if (
        payload?.size.length === 0 &&
        payload?.addonsItemsId.length === 0
      ) {
        let i, index, item;
        let check = false;
        for (i = 0; i < cartData.length; i++) {
          if (check === false) {
            item = cartData[i];
            index = i;
            cartData[i]._id === payload._id ? (check = true) : (check = false);
          }
        }

        if (check) {
          cartData[index].qty = item.qty + 1;
        } else {
          cartData.push({
            ...payload,
            qty: 1,
          });
        }

        this.setItemsDataInRedux(cartData);
        this.calculateTotalAmount(cartData);
      }
    } else {
      const newItem = {
        ...payload,
        qty: 1,
      };
      this.setItemsDataInRedux([newItem]);
      this.calculateTotalAmount([newItem]);
    }
  };

  setItemsDataInRedux(payload) {
    this.props
      .ItemRecordsApi(payload)
      .then(() => this.afterSetItemsDataInRedux())
      .catch(e => console.log(e.message));
  }

  calculateTotalAmount = payload => {
    let itemsCount = 0;
    let totalValue = 0;
    payload.map((item, index) => {
      itemsCount = itemsCount + item.qty;
      totalValue = totalValue + (item.price + item.addOnTotalValue) * item.qty;
    });
    this.setState({
      itemsCount,
      totalValue,
      showTotalView: true,
    });
  };

  renderTotalView() {
    const language = getConfiguration('language');
    const {storeOffline} = this.state;
    let itemStr =
      this.state.itemsCount == 1
        ? strings.ITEM_SELECTED
        : strings.ITEMS_SELECTED;
    if (this.state.showTotalView == true) {
      return (
        <TouchableOpacity
          disabled={storeOffline}
          style={styles.bottomView}
          onPress={() => this.clickOnContinueButton()}>
          <View style={styles.totalView}>
            <View
              style={{
                height: 'auto',
                width: 'auto',
                marginLeft: 10,
              }}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: 13,
                  fontFamily: Fonts.primaryRegular,
                }}>
                {language === 'en' && this.state.itemsCount} {itemStr}{' '}
                {language === 'ar' && this.state.itemsCount}
              </Text>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: 16,
                  fontFamily: Fonts.primaryRegular,
                }}>
                {language === 'en' && `${strings.TOTAL}:`}{' '}
                {this.state.totalValue} {strings.SAR}{' '}
                {language === 'ar' && `:${strings.TOTAL}`}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 50,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.White,
                  marginHorizontal: 10,
                  fontSize: 19,
                  fontFamily: Fonts.primaryMedium,
                }}>
                {strings.CONTINUE}
              </Text>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                }}
                source={Images.icStickArrowRight}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }

  // ########################################
  // ## handling add on render and methods ##
  // ########################################

  getAddonList = item => () => {
    var addonsItemsId = item.addonsItemsId;

    var addon = item.addons;

    let addOnArray = addon.map((item, index) => ({
      ...item,
      items: [],
    }));

    addonsItemsId.map(t1 => {
      addon.map((item, index) => ({
        ...item,
        items: item.items.map((it, ind) =>
          it._id === t1 ? addOnArray[index].items.push(it) : null,
        ),
      }));
    });
    this.setState(
      {
        addonList: addOnArray,
      },
      () =>
        item.addonsItemsId.length > 0
          ? this.initiateAddOn(item)
          : this.AddItemToCart(item),
    );
  };

  onAddOnSelect = (data, subData) => {
    const {AddOnItem} = this.state;
    const addons = AddOnItem.addons.map(item =>
      data._id === item._id
        ? {
            ...item,
            items: item.items.map(itm =>
              subData._id === itm._id
                ? {
                    ...itm,
                    isSelected: !itm.isSelected,
                  }
                : itm,
            ),
          }
        : item,
    );
    this.setState({
      AddOnItem: {
        ...AddOnItem,
        addons: addons,
      },
    });
  };

  onAddOnContinuePress = item => {
    const {items} = this.state;
    const addOnTotalValue = item.addons
      .map(data =>
        data.items
          .filter(itm => itm.isSelected === true)
          .reduce(
            (prevValue, currentValue) =>
              prevValue + parseInt(currentValue.price),
            0,
          ),
      )
      .reduce((i, n) => i + n, 0);
    const newItems = {
      ...item,
      addOnTotalValue,
    };
    this.setState(
      {
        // items: newItems,
        showAddOnModal: false,
        twoSteps: false,
      },
      () => this.AddItemToCart(newItems),
    );
  };

  renderAddOnModal = () => {
    const {twoSteps} = this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          backgroundColor: Colors.White,
          zIndex: 1,
        }}>
        <SafeAreaView />
        <View
          style={{
            backgroundColor: '#F7F7F7',
            width: wp('100%'),
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: '8%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 22,
            }}>
            {strings.ADD_ON}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showAddOnModal: false,
              })
            }>
            <Image
              resizeMode="stretch"
              style={{
                height: 22,
                width: 18,
                tintColor: Colors.darkGray,
              }}
              source={require('../../../assets/icon/cancel.png')}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{
            paddingBottom: 60,
          }}
          data={this.state.AddOnItem.addons}
          renderItem={({item, index}) => (
            <View>
              <View
                style={{
                  paddingHorizontal: '5%',
                  paddingVertical: '3%',
                  borderBottomWidth: 1,
                  borderColor: Colors.borderGray,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: Colors.primary,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.primaryBold,
                    fontSize: 18,
                  }}>
                  {language === 'ar' ? item.catName_ar : item.catName}
                </Text>
              </View>
              {item?.items.map(itm => (
                <View
                  key={itm._id}
                  style={{
                    width: '100%',
                    paddingHorizontal: '8%',
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onAddOnSelect(item, itm)}>
                      <Image
                        style={{
                          height: 17,
                          width: 17,
                          marginRight: 10,
                          resizeMode: 'contain',
                        }}
                        source={
                          itm.isSelected
                            ? Images.icAddOnCheck
                            : Images.icAddOnUncheck
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: Fonts.primarySemibold,
                        fontSize: 16,
                      }}>
                      {language === 'ar' ? itm.name_ar : itm.name}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.primaryRegular,
                      fontSize: 16,
                    }}>
                    {itm.price} {strings.SAR}
                  </Text>
                </View>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => `${index}_adOnList`}
        />

        <TouchableOpacity
          onPress={() => this.onAddOnContinuePress(this.state.AddOnItem)}
          style={{
            position: 'absolute',
            bottom: '5%',
            zIndex: 2,
            width: '90%',
            height: 50,
            borderRadius: 25,
            justifyContent: twoSteps ? 'space-between' : 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            alignSelf: 'center',
            flexDirection: 'row',
            paddingHorizontal: '5%',
          }}>
          {twoSteps && (
            <Text
              style={{
                color: Colors.White,
                fontFamily: Fonts.primaryRegular,
                fontSize: 17,
              }}>
              {strings.STEP_TWO}
            </Text>
          )}
          <Text
            style={{
              color: Colors.White,
              fontFamily: Fonts.primarySemibold,
              fontSize: 17,
            }}>
            {strings.CONTINUE}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  getSizeList = item => () => {
    if (item.size.length > 0 && item.addons.length > 0) {
      this.setState({
        twoSteps: true,
      });
    }
    const sizeList = item.size.map((item, index) =>
      index === 0
        ? {
            ...item,
            isSelected: true,
          }
        : {
            ...item,
            isSelected: false,
          },
    );
    this.setState({
      sizeList,
      showSizeModal: true,
      sizeItem: {
        ...item,
        selectedSize: item.size[0],
      },
    });
    // this.getAddonList(item)
  };

  handleSizeSelect = payload => {
    const {sizeList, sizeItem} = this.state;
    const changeList = sizeList.map((item, index) =>
      item._id === payload._id
        ? {
            ...item,
            isSelected: true,
          }
        : {
            ...item,
            isSelected: false,
          },
    );
    const newItem = {
      ...sizeItem,
      price: payload.price - sizeItem.discount,
      regular_price: payload.price,
      selectedSize: payload,
    };
    this.setState({
      sizeList: changeList,
      sizeItem: newItem,
    });
  };

  handleSizeContinue = payload => () => {
    const {bestSellers, categories, sizeItem} = this.state;
    const newBestSellers = bestSellers.map(item =>
      item._id === sizeItem._id ? sizeItem : item,
    );
    const newCategories = categories.map(item =>
      item._id === sizeItem.categoryId
        ? {
            ...item,
            items: item.items.map(itm =>
              itm._id === sizeItem._id ? sizeItem : itm,
            ),
          }
        : item,
    );
    this.setState(
      {
        bestSellers: newBestSellers,
        categories: newCategories,
        showSizeModal: false,
      },
      this.getAddonList(sizeItem),
    );
  };

  renderSizeModal = () => {
    const {sizeList, twoSteps} = this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          backgroundColor: Colors.White,
          zIndex: 1,
        }}>
        <SafeAreaView />
        <View
          style={{
            backgroundColor: '#F7F7F7',
            width: wp('100%'),
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: '8%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.primaryBold,
              fontSize: 22,
            }}>
            {strings.SELECT_SIZE}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showSizeModal: false,
              })
            }>
            <Image
              resizeMode="stretch"
              style={{
                height: 22,
                width: 18,
                tintColor: Colors.darkGray,
              }}
              source={require('../../../assets/icon/cancel.png')}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{
            paddingBottom: 60,
          }}
          data={sizeList}
          renderItem={({item, index}) => (
            <View
              key={item._id}
              style={{
                width: '100%',
                paddingHorizontal: '8%',
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => this.handleSizeSelect(item)}>
                  <Image
                    style={{
                      height: 17,
                      width: 17,
                      marginRight: 10,
                      resizeMode: 'contain',
                    }}
                    source={
                      item.isSelected
                        ? Images.icAddOnCheck
                        : Images.icAddOnUncheck
                    }
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.primarySemibold,
                    fontSize: 16,
                  }}>
                  {language === 'ar' ? item.name_ar : item.name}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.primaryRegular,
                  fontSize: 16,
                }}>
                {item.price} {strings.SAR}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => `${index}_adOnList`}
        />

        <TouchableOpacity
          onPress={this.handleSizeContinue()}
          style={{
            position: 'absolute',
            bottom: '5%',
            zIndex: 2,
            width: '90%',
            height: 50,
            borderRadius: 25,
            justifyContent: twoSteps ? 'space-between' : 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            alignSelf: 'center',
            flexDirection: 'row',
            paddingHorizontal: '5%',
          }}>
          {twoSteps && (
            <Text
              style={{
                color: Colors.White,
                fontFamily: Fonts.primaryRegular,
                fontSize: 17,
              }}>
              {strings.STEP_ONE}
            </Text>
          )}
          <Text
            style={{
              color: Colors.White,
              fontFamily: Fonts.primarySemibold,
              fontSize: 17,
            }}>
            {strings.CONTINUE}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderItemDetailView() {
    console.log('itemDetailData', this.state.itemDetailData);
    return (
      <View
        style={{
          position: 'absolute',
          elevation: 20,
          zIndex: 29,
          height: hp('100%'),
          width: wp('100%'),
          backgroundColor: 'rgba(0,0,0, 0.7)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 'auto',
            width: wp('90%'),
            borderRadius: 5,
            backgroundColor: Colors.White,
          }}>
          <View
            style={{
              padding: wp('3%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.Black, fontWeight: 'bold', fontSize: 16}}>
              {'Item Details'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                this.setState({isItemDetail: false, itemDetailData: {}})
              }>
              <Image
                style={{height: wp('4.5%'), width: wp('4.5%')}}
                resizeMode={'cover'}
                source={Images.cancel}
              />
            </TouchableOpacity>
          </View>
          <View style={{borderWidth: 0.25, borderColor: 'grey'}} />

          <Image
            style={{height: '40%'}}
            resizeMode={'cover'}
            source={{uri: this.state.itemDetailData.itemImage}}
          />
          <View style={styles.itemDetailViewStyle}>
            <Text style={styles.itemDetailStyle}>{'Name : '}</Text>
            <Text style={styles.itemDetailStyle}>
              {this.state.itemDetailData.itemName}
            </Text>
          </View>
          <View style={styles.itemDetailViewStyle}>
            <Text style={styles.itemDetailStyle}>{'Description : '}</Text>
            <Text
              style={{
                color: 'black',
                width: wp('60%'),
                fontSize: 15,
                textAlign: 'right',
              }}>
              {this.state.itemDetailData.itemDesc}
            </Text>
          </View>
          <View style={styles.itemDetailViewStyle}>
            <Text style={styles.itemDetailStyle}>{'Price : '}</Text>
            <Text style={styles.itemDetailStyle}>
              {this.state.itemDetailData.price} {strings.SAR}
            </Text>
          </View>
          <View style={styles.itemDetailViewStyle}>
            <Text style={styles.itemDetailStyle}>{'Discount : '}</Text>
            <Text style={styles.itemDetailStyle}>
              {this.state.itemDetailData.regular_price -
                this.state.itemDetailData.price}{' '}
              {strings.SAR}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {showSizeModal, showAddOnModal, addonLoading, isItemDetail} =
      this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.secondary,
        }}>
        {showAddOnModal && this.renderAddOnModal()}
        {showSizeModal && this.renderSizeModal()}
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.White,
          }}>
          <ScrollView
            ref={ref => (this.menuListScroll = ref)}
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: Colors.White,
              paddingBottom: '10%',
            }}>
            {this.renderTopView()}
            {this.renderBackView()}
            {this.state.categories.length > 0 ? (
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  marginTop: hp('25%'),
                }}>
                <ScrollView
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}>
                  {this.renderBestSeller()}
                  {this.renderCategoryFlatList()}
                  <View
                    style={{
                      backgroundColor: Colors.White,
                      width: '100%',
                      height: 130,
                    }}
                  />
                </ScrollView>
              </View>
            ) : (
              <Text style={styles.txtNoLoads}>
                {this.state.isLoading == true
                  ? strings.LOADING
                  : strings.NO_ITEM_AVAILABLE}{' '}
              </Text>
            )}
          </ScrollView>
          {this.renderTotalView()}
          {isItemDetail && this.renderItemDetailView()}
          {this.props.isBusyGetItem || addonLoading ? <Activity /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtNoLoads: {
    backgroundColor: Colors.White,
    marginTop: hp('45%'),
    width: '100%',
    textAlign: 'center',
    fontSize: wp('5.86%'),
    fontFamily: Fonts.primaryRegular,
  },
  backIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.White,
  },
  categoryView: {
    flex: 1,
    marginLeft: 20,
    marginRight: 3,
    marginBottom: 3,
    margin: 5,
    backgroundColor: 'transparent',
    height: 'auto',
    marginTop: 10,
  },
  emptyView: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 0,
    marginTop: -10,
  },
  categoryImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  categoryText: {
    textAlign: 'left',
    marginTop: 2,
    marginLeft: 5,
    color: Colors.textBlack,
    fontSize: 16,
    fontFamily: Fonts.primaryBold,
  },
  itemDesc: {
    textAlign: 'left',
    marginTop: 2,
    marginLeft: 5,

    color: 'grey',
    fontSize: 14,
  },
  bottomView: {
    position: 'absolute',
    width: '90%',
    height: 50,
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  totalView: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 30,
  },
  itemTitle: {
    fontSize: 16,
    color: Colors.textBlack,
    marginLeft: 5,
    fontFamily: Fonts.primaryBold,
    textAlign: 'left',
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textLightGrey,
    marginLeft: 10,
    marginTop: 5,
  },
  itemDetailStyle: {
    color: 'black',
    fontSize: 15,
  },
  itemDetailViewStyle: {
    marginTop: wp('3%'),
    paddingHorizontal: wp('3%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
