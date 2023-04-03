import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Activity from '../../components/ActivityIndicator';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import {AsyncStorage} from 'react-native';
import {Header} from '../../components/Header';
import {genericAlert} from '../../utils/genricUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../../constants/lang';
// stripe.setOptions({
//   publishableKey: 'pk_test_SfSOd6XGV9cG66RsaOj35kKT00pNmUMNyk',
// });

export default class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      expDate: '',
      cvv: '',
      email: '',
      orderInfo: {},
      myCardBusy: false,
      name: '',
    };
  }

  componentDidMount() {
    var orderInfo = this.props.navigation.getParam('orderInfo', '');
    this.setState({orderInfo: orderInfo});
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
    //this.getEverything()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    //return true;
    if (this.props.navigation.isFocused()) {
      this.goBack();
      return true;
    } else {
      return false;
    }
  };

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  addCardAPICalling(customerId, type, name, token, lastd) {
    this.props
      .addCardAPI(
        customerId,
        type,
        name,
        token,
        lastd,
        this.state.cardNumber,
        this.state.expDate,
        this.state.cvv,
      )
      .then(() => this.afterAddCardAPICalling())
      .catch(e => this.errorMethod());
  }

  errorMethod() {
    this.setState({myCardBusy: false});
    this.showAlert(e.message, 300);
  }

  afterAddCardAPICalling() {
    this.setState({myCardBusy: false});
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
    this.getEverything();
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');

    this.props.navigation.navigate('Login');
  }

  getEverything() {
    this.props
      .getEverythingAPI('123', '123')
      .then(() => this.afterGetEverything())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterGetEverything() {
    let status = this.props.responseGetEverything.response.status;
    let message = this.props.responseGetEverything.response.message;
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
    this.goBack();
  }

  goToNextScreen() {
    if (
      this.state.cardNumber.length > 14 &&
      this.state.expDate.length > 4 &&
      this.state.cvv.length > 2 &&
      this.state.name.length > 0
    ) {
      this.setState({myCardBusy: true});
      //  this.stripePay();
    } else {
      this.showAlert(strings.ALERT_ALL_REQUIRED, 300);
    }
  }

  //   stripePay() {
  //     var str = this.state.expDate;

  //     var month = str.substring(0, 2);
  //     var year = str.substring(3, 5);

  //     const params = {
  //       // mandatory
  //       number: this.state.cardNumber,
  //       expMonth: parseInt(month, 10),
  //       expYear: parseInt(year, 10),
  //       cvc: this.state.cvv,
  //       // optional
  //       name: this.state.name,
  //     };
  //     stripe
  //       .createTokenWithCard(params)
  //       .then(token => {
  //         const customerid = getConfiguration('user_id');
  //         this.addCardAPICalling(
  //           customerid,
  //           'Card',
  //           token.card.brand,
  //           token.tokenId,
  //           token.card.last4,
  //         );
  //       })
  //       .catch(e => {
  //         this.setState({myCardBusy: false});
  //         this.showAlert(e.message, 300);
  //       });
  //   }

  goBack() {
    if (this.state.orderInfo && this.state.orderInfo.isFromAddOrder) {
      this.props.navigation.navigate('AccountDetailScreen', {
        orderInfo: this.state.orderInfo,
      });
    } else {
      this.props.navigation.navigate('AccountDetail', {
        orderInfo: this.state.orderInfo,
      });
    }
  }

  render() {
    const {navigation, name} = this.props;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView
          style={{
            backgroundColor: Colors.secondary,
          }}
        />
        <Header
          navigation={navigation}
          title={strings.ADD_CARD}
          screen={
            this.state.orderInfo && this.state.orderInfo.isFromAddOrder
              ? 'AccountDetailScreen'
              : 'AccountDetail'
          }
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.gridViewBackground}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>{strings.PH_CARD_NUMBER}</Text>
            <View style={styles.tile}>
              <TextInput
                style={[
                  styles.searchTextInput,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={16}
                onChangeText={cardNumber => {
                  if (cardNumber.length == 1 && cardNumber == ' ') {
                  } else {
                    this.setState({cardNumber});
                  }
                }}
                value={this.state.cardNumber}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputHeading}>
              {strings.PH_CARD_HOLDER_NAME}
            </Text>
            <View style={styles.tile}>
              <TextInput
                style={[
                  styles.searchTextInput,
                  {
                    textAlign: language === 'ar' ? 'right' : 'left',
                  },
                ]}
                returnKeyType="done"
                onChangeText={name => {
                  if (name.length == 1 && name == ' ') {
                  } else {
                    this.setState({name});
                  }
                }}
                value={name}
              />
            </View>
          </View>

          <View style={styles.bottomTile}>
            <View
              style={{
                width: '48%',
              }}>
              <Text style={styles.inputHeading}>{strings.PH_EXP_DATE}</Text>
              <View style={styles.tile}>
                <TextInput
                  style={[
                    styles.searchTextInput,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={5}
                  onChangeText={expDate => {
                    if (expDate.length == 2) {
                      expDate = expDate + '/';
                    } else if (expDate.length == 3) {
                      if (expDate.indexOf('/') !== -1) {
                        expDate = expDate.replace('/', '');
                      } else {
                        expDate =
                          expDate.substr(0, 2) + '/' + expDate.substr(2);
                      }
                    }

                    if (expDate.length == 1 && expDate == ' ') {
                    } else {
                      this.setState({expDate});
                    }
                  }}
                  value={this.state.expDate}
                />
              </View>
            </View>

            <View
              style={{
                width: '48%',
              }}>
              <Text style={styles.inputHeading}>
                {strings.PH_SECURITY_CODE}
              </Text>
              <View style={styles.tile}>
                <TextInput
                  style={[
                    styles.searchTextInput,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={3}
                  onChangeText={cvv => {
                    if (cvv.length == 1 && cvv == ' ') {
                    } else {
                      this.setState({cvv});
                    }
                  }}
                  value={this.state.cvv}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.touchableArrow}
            onPress={() => this.goToNextScreen()}>
            <Text style={styles.addButtonText}>{strings.ADD}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {this.props.isBusy ||
        this.props.isBusyEveryThing ||
        this.state.myCardBusy ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: Colors.navigationTitle,
    fontFamily: Fonts.primarySemibold,
  },
  inputWrapper: {
    marginTop: 20,
  },
  gridViewBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: '8%',
  },
  inputHeading: {
    fontFamily: Fonts.primaryBold,
    fontSize: 14,
    color: Colors.textBlack,
    marginBottom: '2%',
    textAlign: 'left',
  },
  tile: {
    backgroundColor: Colors.textFieldBackground,
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1.0,
    borderColor: Colors.borderGray,
    paddingHorizontal: '5%',
    borderRadius: 15,
  },
  bottomTile: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchTextInput: {
    width: '100%',
    padding: 0,
    margin: 0,
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    color: Colors.textBlack,
  },
  addButtonText: {
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
    color: Colors.White,
  },
  touchableArrow: {
    marginTop: '20%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderRadius: 30,
  },
});
