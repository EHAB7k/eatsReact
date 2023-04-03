import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import WebView from 'react-native-webview';
import {getConfiguration} from '../../utils/configuration';
import strings from '../../constants/lang';
import Images from '../../utils/Images';
import Activity from '../../components/ActivityIndicator';

export class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStateBusy: false,
    };
  }
  render() {
    const {navigation} = this.props;
    const language = getConfiguration('language');
    console.log('my language', language);
    const responseDuePayments = this.props.navigation.state.params.duePayments;
    console.log('RESPAYM', responseDuePayments);
    // const paymentUrl = this.props.navigation.state.params.url;
    // console.log('payment', paymentUrl);
    return (
      <SafeAreaView SafeAreaView style={styles.mainView}>
        {/* <Header menu title={strings.PAYMENT} navigation={navigation} /> */}
        {/* Header with close button */}

        <View style={styles.mainView1}>
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={[
              styles.leftView,
              {
                left: 15,
              },
            ]}>
            <Image style={styles.backIcon} source={Images.backImage} />
          </TouchableOpacity>

          <Text style={styles.heading}>{strings.PAYMENT}</Text>
        </View>
        {/* Header with close button */}

        <WebView
          style={styles.webViewStyles}
          source={{
            uri: responseDuePayments,
          }}
          onLoadProgress={() => this.setState({isStateBusy: true})}
          onLoadEnd={() => this.setState({isStateBusy: false})}
          onNavigationStateChange={({url, canGoBack}) => {
            console.log('url>>>>>>>>', url);
            console.log('cangoback>>>>>>>>', canGoBack);
            if (url.includes('/success?')) {
              // alert('success');
              Alert.alert(
                strings.ALERT,
                strings.PAYMENT_SUCCESS_ALERT,
                [
                  {
                    text: strings.OK,
                    onPress: () => navigation.pop(),
                  },
                ],
                {
                  cancelable: false,
                },
              );
            } else if (url.includes('/failed')) {
              // alert('fail');
              Alert.alert(
                strings.ALERT,
                strings.PAYMENT_FAILURE_ALERT,
                [
                  {
                    text: strings.OK,
                    onPress: () => navigation.pop(),
                  },
                ],
                {
                  cancelable: false,
                },
              );
            }
          }}
        />
        {this.state.isStateBusy ? <Activity /> : null}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  mainView1: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    position: 'absolute',
    zIndex: 2,
  },
  backIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  menuIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  heading: {
    fontFamily: Fonts.primaryBold,
    fontSize: 20,
    color: Colors.textBlack,
  },
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  headerView: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backWrpper: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  menuIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
  },
  webViewStyles: {
    flex: 1,
    paddingBottom: '20%',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    width: '100%',
    paddingVertical: '8%',
    backgroundColor: Colors.White,
  },
  stuckText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 17,
    alignSelf: 'center',
    marginBottom: '5%',
    color: Colors.textBlack,
  },
  updateDisputeButton: {
    width: '90%',
    backgroundColor: Colors.primary,
    paddingVertical: '4%',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  updateText: {
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
    color: Colors.White,
  },
});
