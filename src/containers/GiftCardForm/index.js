import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import {errorAlert, regexStrings} from '../../utils/genricUtils';
import {getConfiguration} from '../../utils/configuration';

class GiftCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      msg: '',
      qty: '',
      name: props.responseGetProfile.name,
      totalAmount: 0,
    };
    const {navigation} = props;

    this.w = navigation.addListener('didFocus', this.componentDidFocus);
  }

  componentDidFocus = () => {
    const {responseGetProfile} = this.props;
  };

  // ******* Main Functions ******* //

  validateGiftCardForm = () => {
    const {email, msg, qty} = this.state;
    if (email.length === 0 || msg.length === 0 || qty.length === 0) {
      errorAlert(strings.ALERT_ALL_REQUIRED);
      return false;
    } else if (!regexStrings.emailRegex.test(email)) {
      errorAlert(strings.ALERT_VALID_EMAIL);
      return false;
    } else if (!regexStrings.numaricRegex.test(qty)) {
      errorAlert(strings.ALERT_VALID_QTY);
      return false;
    } else {
      return true;
    }
  };

  handleBuyNow = id => () => {
    const {navigation} = this.props;
    const {email, msg, qty, name} = this.state;
    const item = {
      screenFlow: 'GiftCard',
      email,
      msg,
      qty,
      name,
      id,
    };
    if (this.validateGiftCardForm()) {
      navigation.navigate('AccountDetailScreen', {item});
    }
  };

  onChangeText = qty => {
    const item = this.props.navigation.getParam('item');
    const totalAmount = item.price * qty;
    this.setState({
      qty,
      totalAmount,
    });
  };

  render() {
    const language = getConfiguration('language');
    const {navigation} = this.props;
    const {email, msg, qty, name, totalAmount} = this.state;
    const item = navigation.getParam('item');
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header
          title={strings.GIFT_CARD}
          navigation={navigation}
          screen="GiftCards"
        />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.rowWrapper}>
            <Text numberOfLines={1} style={styles.itemName}>
              {item.itemName}
            </Text>
            {/* <Text
                            numberOfLines={1}
                            style={styles.itemCat}>
                            (Food)
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

          <Image style={styles.itemImage} source={{uri: item.itemImage}} />

          {/* ****** Form Inputs ****** */}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>{strings.TO}</Text>
            <View style={styles.inputViewStyle}>
              <TextInput
                style={[
                  styles.inputStyle,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
                placeholder={strings.PH_ENTER_EMAIL}
                autoCapitalize="none"
                value={email}
                onChangeText={email =>
                  this.setState({
                    email,
                  })
                }
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>{strings.FROM}</Text>
            <View style={styles.inputViewStyle}>
              <TextInput
                style={[
                  styles.inputStyle,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
                autoCapitalize="none"
                placeholder={strings.FROM}
                value={name}
                // editable={false}
                onChangeText={name =>
                  this.setState({
                    name,
                  })
                }
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>{strings.YOUR_MESSAGE}</Text>
            <View
              style={[
                styles.inputViewStyle,
                {
                  height: 100,
                  alignItems: 'flex-start',
                  paddingVertical: '3%',
                },
              ]}>
              <TextInput
                style={[
                  styles.inputStyle,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
                placeholder={strings.YOUR_MESSAGE}
                autoCapitalize="none"
                value={msg}
                onChangeText={msg =>
                  this.setState({
                    msg,
                  })
                }
                multiline={true}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>{strings.QUANTITY}</Text>
            <View style={styles.qtyOuterLayer}>
              <View
                style={[
                  styles.inputViewStyle,
                  {
                    width: '40%',
                  },
                ]}>
                <TextInput
                  style={[
                    styles.inputStyle,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  autoCapitalize="none"
                  placeholder={strings.QUANTITY}
                  keyboardType="numeric"
                  value={qty}
                  onChangeText={qty => this.onChangeText(qty)}
                />
              </View>
              {totalAmount > 0 && (
                <Text style={styles.totalQtyText}>
                  {language === 'en' && `${strings.TOTAL} :`} {totalAmount}{' '}
                  {language === 'ar' && `: ${strings.TOTAL}`}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={this.handleBuyNow(item._id)}
            style={styles.screenButton}>
            <Text style={styles.buttonText}>{strings.BUY_NOW}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // isBusy: state.GiftCardListReducer.isBusy,
  // response: state.GiftCardListReducer,
  responseGetProfile: state.GetProfileReducer.response.data,
});

export default connect(mapStateToProps, dispatch => {
  return {
    // getGiftCardList: bindActionCreators(getGiftCardList, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(GiftCardForm);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingVertical: '5%',
  },
  itemImage: {
    height: 150,
    width: '100%',
    borderRadius: 20,
    marginVertical: '2%',
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: '5%',
    overflow: 'hidden',
  },
  itemName: {
    fontFamily: Fonts.primaryBold,
    fontSize: 21,
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
  inputWrapper: {
    width: '100%',
    marginTop: '3%',
  },
  inputHeading: {
    fontSize: 16,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
    paddingHorizontal: '5%',
    textAlign: 'left',
  },
  inputViewStyle: {
    backgroundColor: Colors.inputBgGray,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: '3%',
    paddingHorizontal: '8%',
  },
  inputIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: '5%',
  },
  inputEyeIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: Fonts.primaryLight,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  qtyOuterLayer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalQtyText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 15,
    color: Colors.textBlack,
    marginLeft: '5%',
    paddingTop: '4%',
  },
  screenButton: {
    height: 60,
    width: '100%',
    borderRadius: 30,
    backgroundColor: Colors.primary,
    marginTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.White,
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
  },
});
