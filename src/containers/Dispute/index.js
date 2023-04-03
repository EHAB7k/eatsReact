import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Keyboard,
  TextInput,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import {getConfiguration} from '../../utils/configuration';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {convertToFormData, errorAlert} from '../../utils/genricUtils';
import {Platform} from 'react-native';
import {connect} from 'react-redux';

class Dispute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatList: [],
      modifiedGrid: [],
      keyboardHeight: 0,
      msg: '',
      showImage: false,
      imageUri: '',
      showOptions: false,
      selectedItem: null,
      isLoading: false,
      ticketid: null,
      isLoading: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = () => {
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {orderDetails} = item;
    const modifiedGrid = [
      {
        key: 'Amount',
        value: `$${orderDetails?.orderTotal}`,
      },
      {
        key: 'Customer',
        value: orderDetails?.customerName,
      },
      {
        key: 'Deliver',
        value:
          orderDetails?.driverAssigned === 'no'
            ? 'Driver Not Assigned'
            : 'John',
      },
      {
        key: 'Dispute Date',
        value: moment(item?.createdAt).format('DD MMM YYYY'),
      },
      {
        key: 'Reason for dispute:',
        value: item.msg,
      },
    ];
    this.setState({
      chatList: item.reply,
      modifiedGrid,
      ticketid: item.ticketId,
    });
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = e => {
    if (Platform.OS === 'ios') {
      this.setState({
        keyboardHeight: e.endCoordinates.height,
      });
    }
  };

  _keyboardDidHide = e => {
    this.setState({
      keyboardHeight: 0,
    });
  };

  // **************** Main Functions ****************** //

  handleSendApi = async payload => {
    const {ticketid, chatList} = this.state;
    const apiRoot = getConfiguration('API_ROOT');
    const customerid = getConfiguration('user_id');
    const acces_token = getConfiguration('token');
    payload['ticketid'] = ticketid;
    const formData = convertToFormData(payload);
    this.setState({
      isLoading: true,
    });
    fetch(`${apiRoot}/api/v1/user/replyByUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        customerid: customerid,
        token: acces_token,
        Accept: 'application/json',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(res => {
        if (res?.status === 'success') {
          this.setState({
            chatList: [res?.data, ...chatList],
            msg: '',
          });
          // this.supportRef.scrollToOffset({ animated: true, y: 0 });
        } else {
          errorAlert(res?.message);
        }
        this.setState({
          isLoading: false,
        });
      })
      .catch(e => {
        this.setState({
          isLoading: false,
        });
      });
  };

  handleSendMessage = () => {
    const {msg} = this.state;
    const newItem = {
      msg,
      type: 'text',
    };
    this.handleSendApi(newItem);
  };

  handleMediaShare = () => {
    const {chatList} = this.state;

    const options2 = {
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options2, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const newItem = {
          file: {
            uri:
              Platform.OS === 'android'
                ? response.uri
                : response.uri.replace('file://', ''),
            type: response.type,
            name: 'supportReplyMedia.jpeg',
          },
          type: 'media',
        };
        this.handleSendApi(newItem);
      }
    });
  };

  handleItemPress = payload => () => {
    this.setState({
      showImage: true,
      imageUri: payload.media,
    });
  };

  renderImageView = () => {
    const {imageUri} = this.state;
    return (
      <View style={styles.popupMainView}>
        <View style={styles.popupBackWrapper}>
          <TouchableOpacity onPress={() => this.setState({showImage: false})}>
            <Image style={styles.popupBackIcon} source={Images.crossIcon} />
          </TouchableOpacity>
        </View>
        <Image style={styles.popupImage} source={{uri: imageUri}} />
      </View>
    );
  };

  render() {
    const language = getConfiguration('language');
    const {navigation, userProfile} = this.props;
    const {keyboardHeight, chatList, msg, showImage, modifiedGrid, isLoading} =
      this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header
          title={strings.DETAILS}
          screen="Support"
          navigation={navigation}
        />
        <KeyboardAwareScrollView
          // innerRef={(ref) => { this.supportRef = ref; }}
          contentContainerStyle={{
            paddingBottom: '3%',
          }}>
          {modifiedGrid.map((item, index) => (
            <View
              style={[
                styles.gridWrapper,
                {
                  flexDirection:
                    modifiedGrid.length === index + 1 ? 'column' : 'row',
                  borderBottomWidth:
                    modifiedGrid.length === index + 1 ? 0.8 : 0,
                  alignItems:
                    modifiedGrid.length === index + 1 ? 'flex-start' : 'center',
                },
              ]}>
              <Text style={styles.keyText}>{item.key}</Text>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
          ))}
          {chatList.map((item, index) => (
            <View style={styles.msgWrapper}>
              <Image
                style={styles.msgProfile}
                source={
                  item.senderType === 'customer' && userProfile?.profileImage
                    ? {uri: userProfile?.profileImage}
                    : Images.dummyProfilePic
                }
              />
              <View style={styles.msgRightSide}>
                <Text style={styles.msgUserName}>
                  {item.senderType === 'customer'
                    ? userProfile.name
                    : 'Eats Support'}
                </Text>
                <Text style={styles.msgText}>
                  {moment(item.createdAt).format('DD MMM YYYY [at] h:mm A')}
                </Text>
                {item?.msg ? (
                  <Text
                    style={[
                      styles.msgText,
                      {
                        marginTop: '3%',
                      },
                    ]}>
                    {item.msg}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={this.handleItemPress(item)}>
                    <Image style={styles.msgImage} source={{uri: item.media}} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </KeyboardAwareScrollView>
        {showImage && this.renderImageView()}
        <View
          style={[
            styles.msgBottomInput,
            {
              marginBottom: keyboardHeight,
            },
          ]}>
          <TouchableOpacity
            onPress={this.handleMediaShare}
            disabled={isLoading}>
            <Image
              style={[
                styles.icUpload,
                {
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                },
              ]}
              source={Images.icUploadMsg}
            />
          </TouchableOpacity>
          <View style={styles.inputViewStyle}>
            <TextInput
              style={[
                styles.inputStyle,
                {
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
              value={msg}
              onChangeText={msg =>
                this.setState({
                  msg,
                })
              }
            />
          </View>
          <TouchableOpacity
            disabled={msg.trim().length === 0 || isLoading}
            onPress={this.handleSendMessage}>
            <Image
              style={[
                styles.icSend,
                {
                  transform: [
                    {
                      scaleX: language === 'ar' ? -1 : 1,
                    },
                  ],
                },
              ]}
              source={Images.icSendMsg}
            />
          </TouchableOpacity>
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.GetProfileReducer.response.data,
});

export default connect(mapStateToProps, null)(Dispute);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  gridWrapper: {
    justifyContent: 'space-between',
    borderTopWidth: 0.8,
    borderColor: Colors.borderGray,
    paddingVertical: '3.5%',
    paddingHorizontal: '5%',
  },
  keyText: {
    fontSize: 17,
    fontFamily: Fonts.primaryRegular,
    color: Colors.textBlack,
  },
  valueText: {
    fontSize: 17,
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
  },
  msgWrapper: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginTop: '3%',
  },
  msgProfile: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  msgRightSide: {
    paddingLeft: '3%',
    width: '85%',
  },
  msgUserName: {
    fontFamily: Fonts.primaryBold,
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'left',
  },
  msgText: {
    fontFamily: Fonts.primaryMedium,
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'left',
  },
  msgImage: {
    height: 80,
    width: '100%',
  },
  msgBottomInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: '4%',
    paddingVertical: '3%',
  },
  icUpload: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  inputViewStyle: {
    paddingHorizontal: '5%',
    paddingVertical: '1.5%',
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: Colors.textGrey,
    width: '75%',
    marginHorizontal: '3%',
  },
  inputStyle: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 15,
    color: Colors.textBlack,
    padding: 0,
    width: '100%',
  },
  icSend: {
    height: 25,
    width: 35,
    resizeMode: 'contain',
  },
  popupMainView: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.Black,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
  },
  popupImage: {
    height: 400,
    width: '100%',
    resizeMode: 'contain',
  },
  popupBackWrapper: {
    position: 'absolute',
    zIndex: 5,
    top: '5%',
    left: '5%',
  },
  popupBackIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});
