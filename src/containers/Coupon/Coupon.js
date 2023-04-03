import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import { CachedImage } from 'react-native-cached-image';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import moment from 'moment';
import Activity from '../../components/ActivityIndicator';
import Fonts from '../../utils/Fonts';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';

export default class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      orderTotal: this.props.navigation.getParam('itemAmount', ''),
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {params} = payload.action;
  };

  componentDidMount() {
    this.getPromoCode();
  }

  getPromoCode() {
    this.props
      .getPromoCodeAPI()
      .then(() => this.afterGetPromoCode())
      .catch(e => {
        this.showAlert(e.message, 300);
      });
  }

  afterGetPromoCode() {
    let status = this.props.response.response.status;
    let message = this.props.response.response.message;
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
    this.setState({dataSource: this.props.response.response.data});
    // this.props.navigation.navigate('MyAppointmentsScreen');
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  goBack() {
    this.props.navigation.goBack();
  }

  openDrawerClick() {
    this.props.navigation.goBack();
  }

  openDetail(item) {
    this.props.navigation.navigate('Detail', {selectedItem: item});
  }

  openDetailPast(item) {
    this.props.navigation.navigate('PastDetail', {selectedItem: item});
  }

  getExpiryDate(dat) {
    const yourDate = new Date(dat);
    var newDate = moment(yourDate).format('DD-MM-YYYY');
    var newDate1 = 'Valid Upto ' + newDate;
    return newDate1;
  }

  clickOnitem(item) {
    let newV = item;
    this.props.navigation.state.params.onGoBack(newV, true);
    this.props.navigation.goBack();
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <View style={{flex: 1, backgroundColor: Colors.White}}>
          <Header title={strings.COUPON} navigation={navigation} />

          <View
            style={{
              flex: 1,
              backgroundColor: Colors.White,
              marginTop: 2,
            }}>
            {this.state.dataSource.length > 0 ? (
              <FlatList
                data={this.state.dataSource}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <TouchableOpacity
                    disabled={
                      item.type == 'Flat' &&
                      (item.amount > this.state.orderTotal ? true : false)
                    }
                    style={{
                      backgroundColor:
                        item.type == 'Flat' &&
                        item.amount > this.state.orderTotal
                          ? Colors.lineViewColor
                          : 'white',
                      borderColor: 'gray',
                      marginBottom: 6,
                      marginLeft: '2%',
                      width: '96%',
                      marginTop: 5,
                      borderRadius: 5,
                      padding: 6,
                      shadowRadius: 5,
                      borderBottomWidth: 0.0,
                    }}
                    onPress={() => this.clickOnitem(item)}>
                    <View style={{flexDirection: 'row', margin: 10}}>
                      <View style={{width: '20%'}}>
                        <Image
                          resizeMode="contain"
                          style={{
                            height: 50,
                            width: 50,
                          }}
                          source={Images.promoCodeImage}
                        />
                      </View>
                      <View>
                        <Text
                          allowFontScaling={false}
                          style={{
                            color: 'black',
                            marginTop: 2,
                            fontFamily: Fonts.primaryBold,
                            textAlign: 'left',
                          }}>
                          {item.promocode}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{
                            color: '#BEBDC2',
                            marginTop: 2,
                            fontFamily: Fonts.primaryBold,
                            textAlign: 'left',
                          }}>
                          {this.getExpiryDate(item.upto)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.txtNoLoads}> No Promo code available </Text>
            )}
          </View>
        </View>
        {this.props.isBusy ? <Activity /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: Colors.navigationTitle,
    fontFamily: Fonts.primarySemibold,
  },
  txtNoLoads: {
    marginTop: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: wp('5.86%'),
  },
});
