import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  AsyncStorage,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Activity from '../../components/ActivityIndicator';
import Images from '../../utils/Images';
import {create} from 'apisauce';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Colors from '../../utils/Colors';
import Constants from '../../utils/Constants';
import Fonts from '../../utils/Fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScrollView} from 'react-native-gesture-handler';
import {Header} from '../../components/Header';
import strings from '../../constants/lang';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {Platform} from 'react-native';
import {genericAlert} from '../../utils/genricUtils';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import {requestCameraPermission} from '../../components/Popups/Permissions';
import {CameraOptionsPopup} from '../../components/Popups/popup';
Geocoder.init('AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY');

const GOOGLE_MAPS_APIKEY = 'AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY';
const screenHeight = Dimensions.get('screen').height;
export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    const {data} = props.responseGetProfile.response;
    this.state = {
      name: '',
      email: '',
      phone: '',
      address: '',
      isBusyUploadImage: false,
      region: {
        latitude: data.userLocation.coordinates[1],
        longitude: data.userLocation.coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      lat: data.userLocation.coordinates[1],
      lng: data.userLocation.coordinates[0],
      data: [
        {
          value: 'English',
          label: 'English',
        },
        {
          value: 'Arabic',
          label: 'Arabic',
        },
      ],
      isOpen: false,
      value: '',
    };

    const {navigation} = props;
    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = payload => {
    const {data} = this.props.responseGetProfile.response;
    var mobileNumber = data.mobileNumber;
    var email = data.email;
    var address = '';
    var name = data.name;
    this.setState({
      name: name,
      phone: mobileNumber,
      email: email,
      countryCode: data.countryCode,
      address: '',
    });
  };

  _keyboardDidShow() {
    this.setState({
      mainViewTop: -200,
    });
  }

  _keyboardDidHide() {
    this.setState({
      mainViewTop: 0,
    });
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
    const value = this.state.data[0].value;
    this.setState({
      value,
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  isValidEmail(string) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(string) === true) {
      return true;
    }
    return false;
  }

  renderHeaderTile() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: wp('3%'),
          marginTop: Platform.OS == 'android' ? hp('0.7%') : hp('2.5%'),
        }}>
        <TouchableOpacity
          onPress={
            () => this.props.navigation.navigate('Profile')
            // this.props.navigation.goBack()
          }>
          <Image
            resizeMode="contain"
            style={{
              height: 22,
              width: 22,
              tintColor: Colors.White,
            }}
            source={Images.backImage}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            color: Colors.White,
            alignSelf: 'center',
            fontFamily: Fonts.primarySemibold,
          }}>
          Edit Profile
        </Text>

        <Image
          resizeMode="contain"
          style={{height: wp('0%'), width: wp('0%')}}
          //source={Images.editProfile}
        />
      </View>
    );
  }

  onOpenCamera = async () => {
    let data = await requestCameraPermission();
    if (data.isGraned) {
      try {
        launchCamera(
          {
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.5,
            maxWidth: 500,
            maxHeight: 500,
          },
          response => {
            console.log('launchCamera', response);
            this.setState({isOpen: false});
            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.errorCode) {
              // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              // console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = {uri: response.uri};

              // You can also display the image using data:
              //const source = { uri: 'data:image/jpeg;base64,' + response.data };

              this.setState({
                avatarSource: source,
              });

              this.upload();
              // this.setState({
              //      filePath: response.assets[0].uri,
              // });
              // this.saveImage(response.assets[0]);
            }
          },
        );
      } catch (error) {
        alert(error);
        this.setState({isOpen: false});
      }
    } else {
      alert(data.message);
    }
  };

  onOpenGallery = async () => {
    let data = await requestCameraPermission();
    if (data.isGraned) {
      this.setState({isOpen: false});
      try {
        setTimeout(() => {
          launchImageLibrary(
            {mediaType: 'photo', quality: 0.5, maxWidth: 500, maxHeight: 500},
            response => {
              console.log('launchImageLibrary', response);

              if (response.didCancel) {
                // console.log('User cancelled image picker');
              } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
              } else {
                // this.resize(response.uri);
                const source = {uri: response.uri};

                // You can also display the image using data:
                //const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                  avatarSource: source,
                });

                this.upload();
                // this.setState({
                //      filePath: response.assets[0].uri,
                // });
                // this.saveImage(response.assets[0]);
              }
            },
          );
        }, 500);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(data.message);
    }
  };

  changeImage() {
    const options2 = {
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    this.setState({isOpen: true});
    // try {
    //   launchImageLibrary(options2, response => {
    //     if (response.didCancel) {
    //       console.log('User cancelled image picker');
    //     } else if (response.error) {
    //       console.log('ImagePicker Error: ', response.error);
    //     } else if (response.customButton) {
    //       console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //       const source = {uri: response.uri};

    //       // You can also display the image using data:
    //       //const source = { uri: 'data:image/jpeg;base64,' + response.data };

    //       this.setState({
    //         avatarSource: source,
    //       });

    //       this.upload();
    //     }
    //   });
    // } catch (err) {
    //   console.log('dikfgfjdk', err);
    // }
  }

  upload() {
    this.setState({
      isBusyUploadImage: true,
    });
    let acces_token = getConfiguration('token');

    let customerid = getConfiguration('user_id');

    const apiRoot = getConfiguration('API_ROOT');
    var url = apiRoot;

    // create api.
    const api = create({
      baseURL: url,
      headers: {token: acces_token, customerId: customerid},
    });

    var photo = this.state.avatarSource;
    // create formdata
    const data = new FormData();
    // data.append('name', 'testName');

    data.append('profileImage', {
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
      type: 'image/jpeg',
      name: 'profile',
    });

    // post your data.
    api
      .post('/api/v1/user/upload', data, {
        onUploadProgress: e => {
          const progress = e.loaded / e.total;
          this.setState({
            progress: progress,
          });
        },
      })
      .then(res => this.uploadSuccess(res));

    // if you want to add DonwloadProgress, use onDownloadProgress
    onDownloadProgress: e => {
      const progress = e.loaded / e.total;
    };
  }

  uploadSuccess(res) {
    if (res.status == 200) {
      this.setState({
        isBusyUploadImage: false,
      });
      this.getProfile();
    } else {
      this.setState({
        isBusyUploadImage: false,
      });
      this.showAlert(res.message, 300);
    }
  }

  handleUploadPhoto() {
    this.setState({
      isBusyUploadImage: true,
    });
    var apiRoot = getConfiguration('API_ROOT');

    const acces_token = getConfiguration('token');
    const customerid = getConfiguration('user_id');

    var url = apiRoot + '/api/v1/user/upload';
    fetch(url, {
      method: 'POST',
      body: createFormData(this.state.avatarSource),
      headers: {token: acces_token, customerId: customerid},
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          isBusyUploadImage: false,
        });
        this.getProfile();
      })
      .catch(error => {
        this.setState({
          isBusyUploadImage: false,
        });
        alert(strings.ALERT_UPLOAD_FAILED);
      });
  }

  renderProfileImageTile() {
    return (
      <View>
        <View
          style={{
            bottom: hp('7%'),
            alignSelf: 'center',
            height: 50,
            width: 50,
            borderRadius: 10,
          }}>
          <TouchableOpacity
            style={{height: wp('25%'), width: wp('25%'), alignSelf: 'center'}}
            onPress={() => this.changeImage()}>
            {this.props.responseGetProfile.response.data.profileImage ==
              'none' ||
            this.props.responseGetProfile.response.data.profileImage == '' ||
            this.props.responseGetProfile.response.data.profileImage ==
              'null' ||
            this.props.responseGetProfile.response.data.profileImage == null ? (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: wp('26%') / 2,
                  height: wp('26%'),
                  width: wp('26%'),
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="cover"
                  style={{
                    height: wp('24%'),
                    width: wp('24%'),
                    alignSelf: 'center',
                    borderRadius: wp('24%') / 2,
                  }}
                  source={Images.dummyUser}
                />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: wp('26%') / 2,
                  height: wp('26%'),
                  width: wp('26%'),
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="cover"
                  style={{
                    height: wp('24%'),
                    width: wp('24%'),
                    alignSelf: 'center',
                    borderRadius: wp('24%') / 2,
                  }}
                  source={{
                    uri: this.props.responseGetProfile.response.data
                      .profileImage,
                  }}
                />
              </View>
            )}
            <View
              style={{
                borderColor: 1,
                backgroundColor: 'transparent',
                bottom: wp('8.5%'),
                left: wp('16%'),
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: 40,
                borderRadius: wp('8%'),
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 30,
                  width: 30,
                }}
                source={Images.icPencil}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderEditProfileNameTile() {
    return (
      <View style={styles.textInputView}>
        <Image
          resizeMode="contain"
          style={styles.textInputImage}
          source={Images.nameIcon}
        />
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor={Colors.Black}
          onChangeText={name => {
            if (name.length == 1 && name == ' ') {
            } else {
              this.setState({name});
            }
          }}
          value={this.state.name}
          style={styles.searchTextInput}></TextInput>
      </View>
    );
  }

  renderEditProfileEmailTile() {
    return (
      <View style={styles.textInputView}>
        <Image
          resizeMode="contain"
          style={styles.textInputImage}
          source={Images.mailIcon}
        />
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor={Colors.Black}
          keyboardType="email-address"
          onChangeText={email => {
            if (email.length == 1 && email == ' ') {
            } else {
              this.setState({email});
            }
          }}
          value={this.state.email}
          style={styles.searchTextInput}></TextInput>
      </View>
    );
  }

  renderEditProfilePhoneTile() {
    return (
      <View style={styles.textInputView}>
        <Image
          resizeMode="contain"
          style={styles.textInputImage}
          source={Images.phoneIcon}
        />
        <TextInput
          placeholder="Enter Mobile Number"
          placeholderTextColor={Colors.Black}
          editable={false}
          keyboardType="phone-pad"
          onChangeText={phone => {
            if (phone.length == 1 && phone == ' ') {
            } else {
              this.setState({phone});
            }
          }}
          value={this.state.phone}
          style={styles.searchTextInput}></TextInput>
      </View>
    );
  }

  renderEditProfileAddressTile() {
    return (
      <View style={styles.textInputView}>
        <Image
          resizeMode="contain"
          style={styles.textInputImage}
          source={Images.locationIcon}
        />
        <TextInput
          placeholder="Enter Address"
          placeholderTextColor={Colors.Black}
          onChangeText={address => {
            if (address.length == 1 && address == ' ') {
            } else {
              this.setState({address});
            }
          }}
          value={this.state.address}
          style={styles.searchTextInput}></TextInput>
      </View>
    );
  }

  editProfileAction() {
    if (this.isValidEmail(this.state.email) == false) {
      this.showAlert(strings.ALERT_VALID_EMAIL, 300);
      return;
    }

    if (this.state.phone != '' && this.state.email != '') {
      // this.props.navigation.goBack();

      this.callEditProfileAPI();
    } else {
      this.showAlert(strings.ALERT_ALL_REQUIRED, 300);
    }
  }

  callEditProfileAPI() {
    const data = {
      name: this.state.name,
      email: this.state.email,
      mobileNumber: this.state.phone,
      address: this.state.address,
      lat: this.state.lat,
      lng: this.state.lng,
    };

    this.props
      .EditProfileAPI(data)
      .then(() => this.afterEditProfileAPI())
      .catch(e => this.showAlert(e.message, 300));
  }

  afterEditProfileAPI() {
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

    this.getProfile();
  }

  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch(e => this.showAlert(e.message, 300));
  }

  async logOut() {
    setConfiguration('token', '');
    setConfiguration('user_id', '');

    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('language', '');
    this.props.navigation.navigate('Login');
  }

  afterGetProfile() {
    let status = this.props.responseGetProfile.response.status;
    let message = this.props.responseGetProfile.response.message;
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

    Alert.alert(
      '',
      strings.ALERT_PROFILE_UPDATED_SUCCESS,
      [
        {
          text: strings.OK,

          onPress: () => this.goBack(),
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  goBack() {
    this.props.navigation.navigate('Profile');
    //this.props.navioation.navigate('Profile')
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  renderConfirmButtom() {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: '8%',
          alignItems: 'flex-end',
          marginVertical: '8%',
        }}>
        <TouchableOpacity onPress={() => this.editProfileAction()}>
          <Image
            resizeMode="contain"
            style={{height: 60, width: 60}}
            source={Images.sucessIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // ********* set location ********* //

  selectAddressAction(item) {
    console.log('Google places selected address', item);
    Geocoder.from(item.description)
      .then(json => {
        var location = json.results[0].geometry.location;
        const {lat, lng} = location;
        this.setState({
          address: item.description,
          predictions: [],
          lat,
          lng,
        });
        console.log('Destination location : ', location);
      })
      .catch(error => console.warn(error));
  }

  async onChangeSource(address) {
    this.setState({address});
    this.setState({showSuggestionDest: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      address +
      '&key=' +
      GOOGLE_MAPS_APIKEY;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
        showSuggestion: true,
      });
      var adress_data = json.predictions;
      this.setState({
        myaddress_list: adress_data,
      });
      if (json.predictions.length == 0) {
        this.setState({
          showSuggestion: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ******* Render & Handle Map ******* //

  renderMapView() {
    const {region} = this.state;
    return (
      <View
        style={{
          height: 100,
          width: wp('80%'),
          alignSelf: 'center',
          borderRadius: 10,
          overflow: 'hidden',
          marginTop: '5%',
        }}>
        <MapView
          style={{flex: 1}}
          region={region}
          onRegionChangeComplete={region => {
            this.setState({
              region,
            });
            this.handleDragFinish(region);
          }}>
          <MapView.Marker
            onDragEnd={e => this.handleDragFinish(e.nativeEvent.coordinate)}
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            draggable
          />
        </MapView>
      </View>
    );
  }

  handleDragFinish = payload => {
    const {latitude, longitude} = payload;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyDgoIfaAkuJaRCUK6G-dZm8d1kkhyvZHvY`,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          address: responseJson.results[0].formatted_address,
          lat: latitude,
          lng: longitude,
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  chanegLanguage(value, data) {
    this.setState({
      value,
    });
    let payload = value == 'English' ? 'en' : 'ar';
    if (payload === 'en') {
      I18nManager.forceRTL(false);
      AsyncStorage.setItem('language', payload);
      RNRestart.Restart();
    } else {
      I18nManager.forceRTL(true);
      AsyncStorage.setItem('language', payload);
      RNRestart.Restart();
    }
  }

  render() {
    const {navigation, responseGetProfile} = this.props;
    const {countryCode} = this.state;
    const language = getConfiguration('language');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SafeAreaView style={{backgroundColor: Colors.White}} />
        <Header
          title={strings.EDIT_PROFILE}
          navigation={navigation}
          screen="Profile"
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{
            minHeight: screenHeight / 1.2,
          }}>
          <View
            style={{
              width: '100%',
              height: 150,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.changeImage()}
              style={{
                height: 90,
                overflow: 'hidden',
                width: 90,
                borderWidth: 2,
                borderColor: 'white',
                backgroundColor: 'transparent',
              }}>
              {responseGetProfile?.response?.data?.profileImage != null &&
              responseGetProfile?.response?.data?.profileImage != 'none' &&
              responseGetProfile?.response?.data?.profileImage != 'null' ? (
                <Image
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    height: '100%',
                    borderRadius: 45,
                  }}
                  source={{
                    uri: responseGetProfile?.response?.data?.profileImage,
                  }}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 45,
                  }}
                  source={require('../../../assets/icon/dummyUser.png')}
                />
              )}
              <Image
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: 'contain',
                  position: 'absolute',
                  zIndex: 3,
                  alignSelf: 'center',
                  bottom: 0,
                  right: 5,
                }}
                source={Images.icCamera}
              />
            </TouchableOpacity>

            <TextInput
              placeholder={this.state.name}
              placeholderTextColor={Colors.Black}
              onChangeText={name => {
                if (name.length == 1 && name == ' ') {
                } else {
                  this.setState({name});
                }
              }}
              value={this.state.name}
              style={styles.profileName}
            />

            {/* <Text style={styles.profileName}>{this.state.name}</Text> */}
          </View>
          <View style={styles.lowerView}>
            <View style={styles.fieldsWrapper}>
              <View style={styles.tile}>
                <Image
                  resizeMode="contain"
                  style={[
                    styles.tileIcon,
                    {
                      transform: [
                        {
                          scaleX: language === 'ar' ? -1 : 1,
                        },
                      ],
                    },
                  ]}
                  source={require('../../../assets/icon/ic_phone.png')}
                />
                <TextInput
                  style={[
                    styles.searchTextInput,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  placeholder={strings.PH_MOBILE_NUMBER}
                  placeholderTextColor={'#818e97'}
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  onChangeText={txt => {
                    if (txt.length > countryCode.length) {
                      const phone = txt.replace(`${countryCode} `, '');
                      this.setState({phone});
                    } else {
                    }
                  }}
                  value={`${countryCode} ${this.state.phone}`}
                />
              </View>

              <View style={styles.tile}>
                <Image
                  resizeMode="contain"
                  style={[
                    styles.tileIcon,
                    {
                      transform: [
                        {
                          scaleX: language === 'ar' ? -1 : 1,
                        },
                      ],
                    },
                  ]}
                  source={require('../../../assets/icon/ic_mail.png')}
                />
                <TextInput
                  style={[
                    styles.searchTextInput,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  placeholder={strings.PH_EMAIL}
                  //    editable={false}
                  placeholderTextColor={'#818e97'}
                  autoCorrect={false}
                  onChangeText={email => this.setState({email})}
                  value={this.state.email}
                />
              </View>

              {/* {this.renderMapView()} */}

              <View style={styles.tile}>
                <Image
                  resizeMode="contain"
                  style={[
                    styles.tileIcon,
                    {
                      transform: [
                        {
                          scaleX: language === 'ar' ? -1 : 1,
                        },
                      ],
                    },
                  ]}
                  source={require('../../../assets/icon/ic_facebook.png')}
                />
                <TextInput
                  style={[
                    styles.searchTextInput,
                    {
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                  placeholder={strings.PH_ADDRESS}
                  placeholderTextColor={'#818e97'}
                  onChangeText={address => this.onChangeSource(address)}
                  value={this.state.address}
                />
              </View>

              {/* <Text style={{color: '#000', marginTop: 20, textAlign: language === 'ar' ? 'right' : 'left',}}>{strings.changeText}</Text>

            <Dropdown
        value={this.state.label}
        label={language == 'en' ? 'English' : 'Arabic'}
        data={this.state.data}
        pickerStyle={{borderBottomColor:'transparent',borderWidth: 0, width: '80%', marginLeft: 30}}
        dropdownOffset={{ 'top': 10 }}
        containerStyle = {{width:'100%', marginTop: 20,}}
        onChangeText={(value, data)=> {this.chanegLanguage(value, data)}}
      /> */}

              <FlatList
                style={{
                  marginTop: wp('3%'),
                  marginBottom: 5,
                  marginHorizontal: wp('5%'),
                  backgroundColor: 'white',
                }}
                data={this.state.predictions}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.loadDetail}
                    onPress={() => this.selectAddressAction(item)}>
                    <View
                      style={{
                        width: 'auto',
                        justifyContent: 'center',
                        height: 'auto',
                        borderBottomWidth: 0.7,
                        borderBottomColor: 'transparent',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp('100%'),
                          backgroundColor: 'transparent',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: wp('100%'),
                            height: 50,
                          }}>
                          <View
                            style={{
                              width: wp('100%'),
                              height: 50,
                              justifyContent: 'center',
                              backgroundColor: 'white',
                            }}>
                            <View>
                              <Text
                                style={{
                                  height: 20,
                                  width: '100%',
                                  paddingHorizontal: 10,
                                  fontSize: 16,
                                  fontFamily: Fonts.primaryRegular,
                                  textAlign: 'left',
                                }}>
                                {item.structured_formatting.main_text}
                              </Text>
                              <Text
                                style={{
                                  height: 20,
                                  width: 'auto',
                                  paddingHorizontal: 10,
                                  fontSize: 13,
                                  fontFamily: Fonts.primaryRegular,
                                  textAlign: 'left',
                                }}>
                                {item.structured_formatting.secondary_text}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}></FlatList>
            </View>
          </View>
          <CameraOptionsPopup
            isOpen={this.state.isOpen}
            onClose={() => this.setState({isOpen: false})}
            openCamera={() => this.onOpenCamera()}
            openGallery={() => this.onOpenGallery()}
          />
          {this.renderConfirmButtom()}
        </KeyboardAwareScrollView>
        {this.props.isBusy ||
        this.state.isBusyUploadImage ||
        this.props.isBusyGetProfile ? (
          <Activity />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileName: {
    fontFamily: Fonts.primaryBold,
    fontSize: 20,
    color: Colors.textBlack,
    alignSelf: 'center',
  },
  fieldsWrapper: {
    borderRadius: 5,
    backgroundColor: Colors.White,
    width: '80%',
    alignSelf: 'center',
    paddingBottom: '8%',
    paddingHorizontal: '5%',
    marginTop: '8%',
  },
  lowerView: {
    backgroundColor: 'white',
    width: wp('100%'),
    height: 'auto',
    marginTop: 0,
  },
  tileIcon: {
    width: 30,
    height: 30,
  },
  tile: {
    width: 'auto',
    marginTop: wp('5.33%'),
    marginHorizontal: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchTextInput: {
    width: '100%',
    paddingHorizontal: 20,
    fontSize: 15,
    marginTop: 0,
    margin: 0,
    padding: 0,
    fontFamily: Fonts.primaryRegular,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    color: Colors.textBlack,
    fontSize: 20,
  },
});
