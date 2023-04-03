import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {getConfiguration} from '../../utils/configuration';

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectSort: '',
    };
  }

  goBack() {
    this.props.navigation.navigate('Home');
  }

  selectSortValue(sort) {
    this.setState({selectSort: sort});
  }

  sortView() {
    const {selectSort} = this.state;
    const language = getConfiguration('language');
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: Fonts.primaryBold,
            color: Colors.textBlack,
            alignSelf: 'flex-start',
          }}>
          {' '}
          {strings.SORT_BY}
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => this.selectSortValue('nearBy')}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.0,
                backgroundColor:
                  selectSort === 'nearBy' ? Colors.primary : Colors.White,
                borderColor:
                  selectSort === 'nearBy' ? Colors.primary : Colors.textBlack,
              }}>
              <Image
                style={[
                  styles.imageIcon,
                  {
                    tintColor:
                      selectSort === 'nearBy' ? Colors.White : Colors.textBlack,
                    transform: [
                      {
                        scaleX: language === 'ar' ? -1 : 1,
                      },
                    ],
                  },
                ]}
                source={Images.nearByIcon}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.title1,
                  {
                    color:
                      selectSort === 'nearBy' ? Colors.White : Colors.textBlack,
                  },
                ]}>
                {strings.NEAR_BY}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 10, marginLeft: 20}}
            onPress={() => this.selectSortValue('rating')}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.0,
                backgroundColor:
                  selectSort === 'rating' ? Colors.primary : Colors.White,
                borderColor:
                  selectSort === 'rating' ? Colors.primary : Colors.textBlack,
              }}>
              <Image
                style={[
                  styles.imageIcon,
                  {
                    tintColor:
                      selectSort === 'rating' ? Colors.White : Colors.textBlack,
                  },
                ]}
                source={Images.starFilled}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.title1,
                  {
                    color:
                      selectSort === 'rating' ? Colors.White : Colors.textBlack,
                  },
                ]}>
                {strings.RATING}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  goToNextScreen() {
    this.props.navigation.navigate('Home', {
      isFromFilter: true,
      selectSort: this.state.selectSort,
    });
  }

  ApplyButtonView() {
    const language = getConfiguration('language');
    return (
      <TouchableOpacity
        onPress={() => this.goToNextScreen()}
        style={{
          width: '100%',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: '15%',
          borderRadius: 25,
          backgroundColor: Colors.primary,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: Colors.White,
            fontFamily: Fonts.primaryBold,
          }}>
          {' '}
          {strings.APPLY}{' '}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {navigation} = this.props;
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
          title={strings.FILTER}
          navigation={navigation}
          screen="HomeTab"
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: '8%',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
            }}>
            <Text
              onPress={() => this.selectSortValue('')}
              style={{
                fontFamily: Fonts.primaryRegular,
                fontSize: 16,
                color: Colors.textBlack,
              }}>
              {strings.CLEAR_ALL}
            </Text>
          </View>
          {this.sortView()}
          {this.ApplyButtonView()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: Fonts.primarySemibold,
  },
  title1: {
    fontSize: 12,
    alignSelf: 'center',
    paddingTop: 3,
    fontFamily: Fonts.primaryMedium,
  },
  imageIcon: {
    height: 25,
    width: 25,
  },
});
