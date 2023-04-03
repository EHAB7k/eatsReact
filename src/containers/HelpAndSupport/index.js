import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import {DrawerActions} from 'react-navigation-drawer';
import WebView from 'react-native-webview';
import {getConfiguration} from '../../utils/configuration';
import strings from '../../constants/lang';
import Images from '../../utils/Images';
import {Header} from '../../components/Header';

export default class HelpAndSupport extends React.Component {
  /********************** Handled methods *************************/

  openDrawerClick() {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  render() {
    const {navigation} = this.props;
    const language = getConfiguration('language');
    return (
      <SafeAreaView SafeAreaView style={styles.mainView}>
        <Header menu title={strings.HELP_N_SUPPORT} navigation={navigation} />

        <Text
          style={{
            paddingHorizontal: '5%',
            fontFamily: Fonts.primaryBold,
            color: Colors.textBlack,
            fontSize: 22,
            marginTop: '5%',
            textAlign: 'left',
          }}>
          {strings.HERE_TO_HELP}
        </Text>
        <WebView
          style={styles.webViewStyles}
          source={{
            uri: `${getConfiguration(
              'API_ROOT',
            )}/api/v1/admin/helpandsupport?lang=${language}&type=CUSTOMER`,
          }}
        />

        <View style={styles.bottomView}>
          <Text style={styles.stuckText}>{strings.STILL_STUCK}</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Support')}
            style={styles.updateDisputeButton}>
            <Text style={styles.updateText}>{strings.SEND_A_MESSAGE}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
