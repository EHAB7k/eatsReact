import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import images from '../../utils/Images';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {I18nManager} from 'react-native';
import strings from '../../constants/lang';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {ImageBackground} from 'react-native';
import Constants from '../../utils/Constants';

class ChooseLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSplash: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = async () => {
    const {navigation} = this.props;
    const language = await AsyncStorage.getItem('language');
    if (language !== null && language.length > 0) {
      strings.setLanguage(language);
      setConfiguration('language', language);
      if (language === 'ar' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        RNRestart.Restart();
      }
      //  navigation.navigate('Home');
      navigation.navigate('Login');
    } else {
      this.setState({
        hideSplash: true,
      });
    }
  };

  handleLanguageSelection = payload => () => {
    if (payload === 'en') {
      I18nManager.forceRTL(false);
      AsyncStorage.setItem('language', payload);
      AsyncStorage.setItem('languageId', Constants.ENGLISH_ID);
      RNRestart.Restart();
    } else {
      I18nManager.forceRTL(true);
      AsyncStorage.setItem('language', payload);
      AsyncStorage.setItem('languageId', Constants.ARABIC_ID);
      RNRestart.Restart();
    }
  };

  render() {
    const {hideSplash} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        {hideSplash ? (
          <>
            <SafeAreaView style={{backgroundColor: Colors.White}} />
            <KeyboardAwareScrollView
              contentContainerStyle={{
                paddingBottom: '5%',
              }}>
              <Image
                style={{
                  height: 150,
                  width: '60%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  marginVertical: '10%',
                }}
                source={images.loginLogo}
              />

              <Text
                style={{
                  fontFamily: Fonts.primaryBold,
                  color: Colors.textBlack,
                  fontSize: 16,
                  alignSelf: 'center',
                }}>
                {strings.CHOOSE_LANGUAGE}
              </Text>

              <TouchableOpacity
                onPress={this.handleLanguageSelection('en')}
                style={{
                  height: 80,
                  width: '90%',
                  borderRadius: 15,
                  backgroundColor: Colors.White,
                  alignItems: 'center',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    marginRight: '5%',
                  }}
                  source={images.icLangUsa}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textBlack,
                  }}>
                  {'English'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleLanguageSelection('ar')}
                style={{
                  height: 80,
                  width: '90%',
                  borderRadius: 15,
                  backgroundColor: Colors.White,
                  alignItems: 'center',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: '5%',
                  paddingHorizontal: '5%',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    marginRight: '5%',
                  }}
                  source={images.icLangUae}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: Fonts.primaryRegular,
                    color: Colors.textBlack,
                  }}>
                  {strings.ARABIC}
                </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </>
        ) : (
          <ImageBackground
            style={{
              height: '100%',
              width: '100%',
            }}
            source={images.dummySplash}
          />
        )}
      </View>
    );
  }
}

export default ChooseLanguage;
