import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Constants from '../../utils/Constants';
import Fonts from '../../utils/Fonts';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {getConfiguration} from '../../utils/configuration';
import {postAPI} from '../../utils/api';
import {genericAlert} from '../../utils/genricUtils';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      searchList: [],
      isLoading: false,
      existingRestaurantId: '',
    };

    const {navigation} = props;

    this.w = navigation.addListener('didFocus', this.componentDidFocus);
  }

  componentDidFocus = () => {};

  renderTextField() {
    const {isLoading} = this.state;
    const language = getConfiguration('language');
    return (
      <View style={styles.tile}>
        <TextInput
          style={[
            styles.searchTextInput,
            {
              textAlign: language === 'ar' ? 'right' : 'left',
            },
          ]}
          placeholder={strings.PH_SEARCH_RESTAURANT}
          placeholderTextColor={Colors.placeholderColor}
          onChangeText={searchString => {
            this.handleStoreSearch(searchString);
          }}
          value={this.state.searchString}
        />
        {this.state.searchString.length == 0 ? null : (
          <TouchableOpacity
            disabled={isLoading}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              backgroundColor: 'trasparent',
            }}
            onPress={() => this.clearPickUpAddress()}>
            <Image
              resizeMode="contain"
              style={styles.searchIcon}
              source={Images.crossIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  clearPickUpAddress() {
    Keyboard.dismiss();
    this.setState({searchString: ''});
  }

  goToNextScreen() {
    this.props.navigation.navigate('HomeTab', {
      isFromSearch: true,
      searchString: this.state.searchString,
    });
    this.setState({searchString: ''});
  }

  handleStoreSearch = async searchString => {
    this.setState({
      isLoading: true,
      searchList: [],
      searchString,
    });

    if (searchString != '') {
      try {
        let myLet = getConfiguration('latitude');
        let mylong = getConfiguration('longitude');
        let details = {
          customerLocation: {lat: myLet, lng: mylong},
          sortby: '',
          page: 0,
          limit: 200,
          search: searchString,
        };
        if (
          myLet !== undefined &&
          myLet !== 'undefined' &&
          mylong !== undefined &&
          mylong !== 'undefined'
        ) {
          const user = await postAPI(
            '/api/v1/user/restaurant/nearby',
            JSON.stringify(details),
          );
          if (user?.status === 'success') {
            this.setState({
              searchList: user?.data,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
            genericAlert(user?.message);
          }
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
    }
  };

  handleItemPress = item => () => {
    let cartItems = this.props.responseItem.response;
    if (cartItems && cartItems.length > 0) {
      let firstValue = cartItems[0];
      let storeValue = firstValue.restaurantId;
      if (storeValue?.length == 0 || item._id == storeValue) {
        this.setState({
          searchList: [],
          searchString: '',
        });
        this.props.navigation.navigate('Items', {
          item: item,
        });
        return;
      } else {
        genericAlert(strings.ALERT_CLEAR_CART_FIRST);
        return;
      }
    }
    this.setState({
      searchList: [],
      searchString: '',
    });
    this.props.navigation.navigate('Items', {
      item: item,
    });
  };

  render() {
    const {navigation} = this.props;
    const {searchList, isLoading} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <SafeAreaView
          style={{
            backgroundColor: Colors.secondary,
          }}
        />
        <Header title={strings.SEARCH_BY_RESTAURANT} navigation={navigation} />
        {this.renderTextField()}
        <FlatList
          contentContainerStyle={{
            paddingVertical: '8%',
          }}
          data={searchList}
          keyExtractor={(item, index) => `${index}_searchList`}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={this.handleItemPress(item)}
              style={{
                borderBottomWidth: searchList.length === index + 1 ? 0 : 0.8,
                borderColor: Colors.borderGray,
                paddingHorizontal: '7%',
                paddingVertical: '3%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.primaryBold,
                  color: Colors.textBlack,
                  alignSelf: 'flex-start',
                  textAlign: 'left',
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.primaryRegular,
                  color: Colors.textBlack,
                  alignSelf: 'flex-start',
                  textAlign: 'left',
                }}>
                {item.address}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() =>
            isLoading ? <ActivityIndicator color={Colors.primary} /> : null
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: wp('4.8%'),
    color: Colors.navigationTitle,
    fontFamily: Fonts.primarySemibold,
  },
  tile: {
    backgroundColor: Colors.textFieldBackground,
    width: 'auto',
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    justifyContent: 'space-between',
    marginHorizontal: '8%',
    paddingHorizontal: '5%',
  },
  searchTextInput: {
    height: 40,
    width: '80%',
    padding: 0,
    margin: 0,
    fontSize: 15,
    color: Colors.placeholderColor,
    fontFamily: Fonts.primaryRegular,
  },
  searchIcon: {
    padding: 10,
    width: 10,
    height: 10,
  },
});
