import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class PromoTermAndCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.navigation.getParam('message', ''),
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidMount() {}

  componentDidFocus = payload => {
    const {params} = payload.action;
  };

  goBack() {
    this.props.navigation.goBack();
  }

  renderTopView() {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          style={styles.backTouchable}
          onPress={() => this.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backIcon}
            source={Images.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Term And Conditions</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <SafeAreaView style={{backgroundColor: Colors.navigationColor}} />
        {this.renderTopView()}
        <View
          style={{
            width: '100%',
            height: 'auto',
            alignItems: 'center',
            marginTop: 20,
            backgroundColor: 'transparent',
          }}>
          <Text style={{width: '80%', height: 'auto', color: 'grey'}}>
            {this.state.message}
          </Text>
          <View
            style={{
              width: '85%',
              height: 1,
              marginTop: 3,
              backgroundColor: Colors.placeholderColor,
            }}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    top: 0,
    height: 40,
    width: '100%',
    backgroundColor: Colors.navigationColor,
  },
  backTouchable: {
    position: 'absolute',
    width: 60,
    height: 50,
    top: 0,
    left: 0,
  },
  backIcon: {
    position: 'absolute',
    width: 22,
    height: 22,
    top: 10,
    left: 15,
    backgroundColor: 'transparent',
    tintColor: Colors.White,
  },
  title: {
    fontSize: 18,
    marginLeft: wp('30%'),
    marginTop: 10,
    color: Colors.navigationTitle,
  },
});
