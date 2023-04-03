import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {get} from '../../utils/api';

const spaceRegex = /^.+\s.+$/;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatList: [],
      userID: '2me',
      keyboardHeight: 0,
      msg: '',
      showImage: false,
      imageUri: '',
      showOptions: false,
      selectedItem: null,
      isLoading: false,
    };
    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = () => {
    this.getChatData();
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
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = e => {
    this.setState({
      keyboardHeight: 0,
    });
  };

  // **************** Main Functions ****************** //

  getChatData = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const res = await get('/api/v1/user/getPointsHistoryByUserId');
      if (res?.status === 'success') {
        this.setState({
          isLoading: false,
          chatList: chatData,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  handleSendMessage = () => {
    const {chatList, msg} = this.state;
    const newItem = {
      type: 'msg',
      userID: '2me',
      msg,
      createdAt: Date(),
      _id: chatList.length + 1,
    };
    this.setState({
      chatList: [newItem, ...chatList],
      msg: '',
    });
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
          type: 'image',
          userID: '2me',
          media: response.uri,
          createdAt: Date(),
          _id: chatList.length + 1,
        };
        this.setState({
          chatList: [newItem, ...chatList],
        });
      }
    });
  };

  handleItemPress = payload => () => {
    if (payload.type === 'image') {
      this.setState({
        showImage: true,
        imageUri: payload.media,
      });
    }
  };

  renderImageView = () => {
    const {imageUri} = this.state;
    return (
      <View style={styles.popupMainView}>
        <TouchableOpacity
          onPress={() => this.setState({showImage: false})}
          style={styles.popupBackWrapper}>
          <Image style={styles.popupBackIcon} source={Images.crossIcon} />
        </TouchableOpacity>
        <Image style={styles.popupImage} source={{uri: imageUri}} />
      </View>
    );
  };

  handleHoldItem = payload => () => {
    this.setState({
      showOptions: true,
      selectedItem: payload,
    });
  };

  handleUnsendMsg = () => {
    const {chatList, selectedItem} = this.state;
    const updatedList = chatList.filter(item => item._id !== selectedItem._id);
    this.setState({
      chatList: updatedList,
      showOptions: false,
      selectedItem: null,
    });
  };

  renderMoreOptions = () => {
    return (
      <View style={styles.optionsMainView}>
        <TouchableOpacity onPress={this.handleUnsendMsg}>
          <Text style={styles.optionsText}>Unsend</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      chatList,
      userID,
      keyboardHeight,
      msg,
      showImage,
      showOptions,
      isLoading,
    } = this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView />

        {/* ******** Render Popups ******** */}
        {showImage && this.renderImageView()}

        <Header navigation={navigation} title={strings.CHAT} />

        {/* *********** Render Chat List Data ********** */}

        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          inverted
          data={chatList}
          ListEmptyComponent={() =>
            isLoading && (
              <ActivityIndicator size="large" color={Colors.primary} />
            )
          }
          renderItem={({item, index}) => (
            <View
              style={[
                styles.itemWrapper,
                {
                  alignItems:
                    userID === item.userID ? 'flex-end' : 'flex-start',
                },
              ]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.handleItemPress(item)}
                onLongPress={
                  userID === item.userID ? this.handleHoldItem(item) : null
                }
                style={styles.bubbleWrapper}>
                {userID !== item.userID && (
                  <Image style={styles.chatProfile} source={Images.dummyUser} />
                )}
                <View
                  style={[
                    styles.bubbleStyle,
                    {
                      backgroundColor:
                        userID === item.userID
                          ? Colors.primary
                          : Colors.inputBgGray,
                    },
                  ]}>
                  {item?.msg ? (
                    <Text
                      style={[
                        styles.msgText,
                        {
                          color:
                            userID === item.userID
                              ? Colors.White
                              : Colors.textBlack,
                        },
                      ]}>
                      {item?.msg}
                    </Text>
                  ) : (
                    <Image
                      style={styles.msgImage}
                      source={{uri: item?.media}}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text
                style={[
                  styles.timeText,
                  {
                    marginLeft: userID !== item.userID ? '13%' : 0,
                  },
                ]}>
                {moment(item.createdAt).format('h:mm A')}
              </Text>
            </View>
          )}
        />

        {showOptions && this.renderMoreOptions()}

        {/* *********** Render Message & Media share View ********** */}

        <View
          style={[
            styles.bottomWrapper,
            {
              marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
            },
          ]}>
          <TouchableOpacity
            onPress={this.handleMediaShare}
            style={{alignSelf: 'flex-end'}}>
            <Image style={styles.mediaIcon} source={Images.icUploadMsg} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              multiline
              style={styles.inputStyle}
              value={msg}
              onChangeText={msg => {
                this.setState({
                  msg,
                });
              }}
            />
          </View>
          <TouchableOpacity
            disabled={msg.trim().length === 0}
            onPress={this.handleSendMessage}
            style={{alignSelf: 'flex-end'}}>
            <Image style={styles.sendIcon} source={Images.icSendMsg} />
          </TouchableOpacity>
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  contentContainerStyle: {
    paddingHorizontal: '5%',
  },
  itemWrapper: {
    width: '100%',
    marginVertical: '3%',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chatProfile: {
    height: 35,
    width: 35,
    marginRight: '3%',
    borderRadius: 35 / 2,
  },
  bubbleStyle: {
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    maxWidth: '60%',
    borderRadius: 20,
  },
  msgText: {
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
    textAlign: 'left',
  },
  msgImage: {
    height: 150,
    width: 150,
  },
  timeText: {
    fontSize: 11,
    fontFamily: Fonts.primaryRegular,
    textAlign: 'left',
    color: Colors.textLightGrey,
    marginTop: '2%',
  },
  bottomWrapper: {
    width: '100%',
    paddingHorizontal: '4%',
    flexDirection: 'row',
    paddingVertical: '3%',
    justifyContent: 'space-between',
    backgroundColor: Colors.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mediaIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  inputWrapper: {
    width: '75%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    paddingHorizontal: '5%',
    justifyContent: 'center',
    maxHeight: 120,
    paddingVertical: '1%',
  },
  inputStyle: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 15,
    color: Colors.textBlack,
    width: '100%',
    padding: 0,
  },
  sendIcon: {
    height: 35,
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
    opacity: 1,
  },
  popupBackWrapper: {
    position: 'absolute',
    zIndex: 2,
    top: '5%',
    left: '5%',
  },
  popupBackIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  optionsMainView: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.borderGray,
  },
  optionsText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 15,
    color: Colors.textBlack,
  },
});

const chatData = [
  {
    type: 'msg',
    userID: '2me',
    msg: 'Hey, I`m good!',
    createdAt: Date(),
    _id: 2,
  },
  {
    type: 'msg',
    userID: '2e',
    msg: 'Hey, How are you?',
    createdAt: Date(),
    _id: 1,
  },
];
