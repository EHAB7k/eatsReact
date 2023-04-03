import React from 'react';
import {
  Image,
  View,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {getStatusBarHeight} from '../../utils/IPhoneXHelper';
// import VectorIcon from '../../utils/vectorIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import strings from '../../constants/lang';
import Fonts from '../../utils/Fonts';
import Colors from '../../utils/Colors';

function CameraOptionsPopup({isOpen, onClose, openCamera, openGallery}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => onClose()}>
      <TouchableOpacity
        style={{width: '100%', height: '100%'}}
        onPress={() => onClose()}>
        <View style={styles.backgroundblacktint} />
        <View style={styles.viewForOptions}>
          <TouchableHighlight>
            <View style={styles.viewforChoosePhoto}>
              <Text style={styles.selectPhototxt}>{strings.selectPhoto}</Text>
              <View style={styles.sepratorLine} />
              <TouchableHighlight onPress={() => openCamera()}>
                <Text style={styles.takephotoTxt}>{strings.takephoto}...</Text>
              </TouchableHighlight>

              <View style={styles.sepratorLine} />
              <TouchableHighlight onPress={() => openGallery()}>
                <Text style={styles.takephotoTxt}>{strings.chooselib}...</Text>
              </TouchableHighlight>
            </View>
          </TouchableHighlight>

          <View style={styles.viewForcancel}>
            <TouchableHighlight onPress={() => onClose()}>
              <Text style={styles.takephotoTxt}>{strings.CANCEL}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// export {googleAutocomplete, EnterAddressPopup, CameraOptionsPopup};
export {CameraOptionsPopup};

const styles = StyleSheet.create({
  HeaderView: {
    height: Platform.select({
      ios: 40 + getStatusBarHeight(),
      android: 50,
      backgroundColor: 'white',
    }),
    width: '100%',
    borderColor: '#0082cb',
    borderWidth: 0,
    backgroundColor: Colors.White,
    alignItems: 'center',
    paddingTop: Platform.select({
      ios: getStatusBarHeight(),
      android: 0,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TouchBackButton: {
    marginLeft: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.bgGray,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  HeaderText: {
    fontSize: wp('5.33%'),
    fontFamily: Fonts.primarySemibold,
    textAlign: 'center',
    color: Colors.textBlack,
  },
  searchTextInput: {
    width: '86%',
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderRadius: 0,
    fontSize: wp('4.8%'),
    fontFamily: Fonts.primaryRegular,
    marginLeft: 25,
  },
  predictionItemView: {
    height: wp('55%'),
    width: wp('100%'),
    backgroundColor: 'white',
  },
  tileIcon: {
    width: 20,
    height: 45,
    marginLeft: 0,
  },
  tile: {
    backgroundColor: 'transparent',
    width: '75%',
    marginTop: wp('5.33%'),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1.0,
    borderColor: Colors.borderColor,
    alignSelf: 'center',
  },
  ItemTouchHighStyle: {
    paddingVertical: 5,
    borderBottomWidth: 1.0,
    borderColor: 'gray',
    backgroundColor: 'white',
    height: 'auto',
  },

  backgroundblacktint: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.3,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  viewForOptions: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  viewforChoosePhoto: {
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  selectPhototxt: {
    alignSelf: 'center',
    color: 'gray',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: Fonts.primaryRegular,
  },
  sepratorLine: {
    height: 1,
    backgroundColor: 'gray',
    opacity: 0.4,
  },
  takephotoTxt: {
    alignSelf: 'center',
    fontSize: 18,
    color: Colors.primary,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: Fonts.primaryRegular,
  },
  viewForcancel: {
    marginTop: 7,
    marginBottom: 10,
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  backic: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginLeft: 0,
  },
});
