import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
//import { getConfiguration } from '../../utils/configuration';
import Activity from '../../components/ActivityIndicator';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Images from '../../utils/Images';
//import { strings } from "../../services/stringsoflanguages";
import Colors from '../../utils/Colors';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Fonts from '../../utils/Fonts';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
export default class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      referralCode: 585858,
    };
  }

  handleInviteFriends = async () => {
    const {referralCode} = this.state;
    await Share.share({
      message: `Hey, I'm inviting you to join Eats Cutomer App wih referral code ${referralCode}`,
    });
  };

  render() {
    const {navigation} = this.props;
    const {referralCode} = this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.secondary}} />
        <Header title={strings.INVITE_FRIENDS} menu navigation={navigation} />
        <ScrollView>
          <Image style={styles.inviteBanner} source={Images.loginLogo} />
          <Text style={styles.mainText}>{strings.INVITE_YOUR_FRIENDS}</Text>
          <Text style={styles.referText}>{strings.REFERRAL_CODE}</Text>
          <Text style={styles.referCode}>{referralCode}</Text>
        </ScrollView>
        <TouchableOpacity
          onPress={this.handleInviteFriends}
          style={styles.buttonWrapper}>
          <Text style={styles.buttonText}>{strings.INVITE_FRIENDS}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  inviteBanner: {
    width: '60%',
    height: 230,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '8%',
  },
  mainText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 22,
    color: Colors.Black,
    alignSelf: 'center',
    marginTop: '5%',
    marginBottom: '2%',
  },
  referText: {
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
    color: Colors.Black,
    alignSelf: 'center',
  },
  referCode: {
    fontFamily: Fonts.primaryBold,
    fontSize: 22,
    color: Colors.textBlue,
    alignSelf: 'center',
    marginTop: '3%',
    marginBottom: '2%',
  },
  buttonWrapper: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '10%',
  },
  buttonText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    color: Colors.White,
  },
});
