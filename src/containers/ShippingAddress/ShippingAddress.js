import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  Keyboard,
  Alert,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Constants from '../../utils/Constants';
import Geocoder from 'react-native-geocoding';
import strings from '../../constants/lang';
import Fonts from '../../utils/Fonts';
import {genericAlert} from '../../utils/genricUtils';

Geocoder.init(Constants.GOOGLE_MAPS_APIKEY);

export default class ShippingAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      showSuggestion: false,
      predictions: [],
      predictionsdest: [],
      selSourcePlaceId: '',
      showSuggestionDest: false,
      destinationPlaceID: '',
      finalSourceCordinates: {
        latitude: 0.0,
        longitude: 0.0,
      },
      noStoreAvailable: false,
    };
  }

  goBack() {
    this.props.navigation.navigate('Home');
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      genericAlert(message);
    }, duration);
  }

  renderTextField() {
    const language = getConfiguration('language');
    return (
      <View style={styles.tile}>
        <View style={{flexDirection: 'row', width: wp('80%')}}>
          <Image
            resizeMode="contain"
            style={styles.tileIcon}
            source={Images.searchSelectedTabBarIcon}
          />
          <TextInput
            style={[
              styles.searchTextInput,
              {
                textAlign: language === 'ar' ? 'right' : 'left',
              },
            ]}
            placeholder={strings.PH_UC_ADDRESS}
            keyboardType="default"
            autoCapitalize="none"
            placeholderTextColor={Colors.placeholderColor}
            autoCorrect={false}
            onChangeText={address => this.onChangeSource(address)}
            value={this.state.address}
          />
        </View>
        {this.state.address.length == 0 ? null : (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              backgroundColor: 'trasparent',
            }}
            onPress={() => this.clearPickUpAddress()}>
            <Image
              resizeMode="contain"
              style={styles.searchIcon}
              source={Images.crossIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  selectAddresses() {
    let item = {
      address: this.state.address,
      lat: this.state.finalSourceCordinates.latitude,
      long: this.state.finalSourceCordinates.longitude,
    };
    this.props.navigation.navigate('Home', {isFromAddress: true, item: item});
  }

  clearPickUpAddress() {
    Keyboard.dismiss();
    this.setState({address: '', showSuggestion: false});
  }

  renderBottomButton() {
    return (
      <View style={styles.arrowTile}>
        <TouchableOpacity
          style={styles.touchableArrow}
          onPress={() => this.goToNextScreen()}>
          <Image
            resizeMode="contain"
            style={styles.arrowIcon}
            source={Images.sucessIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  goToNextScreen() {
    if (
      this.state.address.length == 0 ||
      this.state.finalSourceCordinates.latitude == 0.0 ||
      this.state.finalSourceCordinates.longitude == 0.0
    ) {
      this.showAlert('Please Add Address', 300);
      return;
    }
    setConfiguration('address', this.state.address);
    setConfiguration('latitude', this.state.finalSourceCordinates.latitude);
    setConfiguration('longitude', this.state.finalSourceCordinates.longitude);
    setConfiguration('SourcePlaceId', this.state.selSourcePlaceId);
    this.selectAddresses();
    //this.props.navigation.navigate('Home');
  }

  async onChangeSource(address) {
    this.setState({address});
    this.setState({showSuggestionDest: false, noStoreAvailable: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      address +
      '&key=' +
      Constants.GOOGLE_MAPS_APIKEY;

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

  async setSourceLocation(placeId, description) {
    Keyboard.dismiss();
    this.setState({
      address: description,
      showSuggestion: false,
      selSourcePlaceId: placeId,
    });

    Geocoder.from(description)
      .then(json => {
        var location = json.results[0].geometry.location;
        const newdestination = {
          latitude: location.lat,
          longitude: location.lng,
        };
        this.setState({
          finalSourceCordinates: newdestination,
        });
        //this.openDetail(description, location.lat, location.lng);
      })
      .catch(error => console.warn(error));

    // if (this?.state?.destinationPlaceID?.length > 0 && placeId?.length > 0) {
    // }
  }

  render() {
    const predictions = this.state.predictions.map(prediction => (
      <TouchableHighlight
        style={{
          paddingVertical: 5,
          borderBottomWidth: 1.0,
          borderColor: 'gray',
        }}
        onPress={() =>
          this.setSourceLocation(prediction.place_id, prediction.description)
        }>
        <Text
          allowFontScaling={false}
          style={{
            margin: 10,
            fontFamily: Fonts.primaryRegular,
            textAlign: 'left',
          }}
          key={prediction.id}>
          {prediction.description}
        </Text>
      </TouchableHighlight>
    ));
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SafeAreaView
          style={{flex: 0, backgroundColor: Colors.navigationColor}}
        />
        {this.renderTextField()}
        {this.state.showSuggestion ? (
          <View
            style={{
              height: 'auto',
              width: wp('85%'),
              backgroundColor: 'white',
              borderLeftWidth: 2.0,
              borderRightWidth: 2.0,
              borderBottomWidth: 2.0,
              borderBottomLeftRadius: 8.0,
              borderBottomRightRadius: 8.0,
              borderColor: 'grey',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <View>{predictions}</View>
          </View>
        ) : null}
        {this.renderBottomButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  arrowTile: {
    backgroundColor: 'transparent',
    height: wp('25%'),
    position: 'absolute',
    right: 20,
    left: 20,
    bottom: 80,
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'blue',
  },
  touchableArrow: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: wp('16%'),
    width: wp('16%'),
    borderRadius: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: wp('15%'),
    height: wp('15%'),
  },
  tile: {
    backgroundColor: Colors.textFieldBackground,
    width: 'auto',
    height: 60,
    marginTop: 20,
    marginHorizontal: 0,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#818e97',
    marginRight: 20,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  searchTextInput: {
    height: 40,
    width: '100%',
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderRadius: 0,
    fontSize: wp('4.8%'),
  },
  tileIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginTop: 8,
  },
  searchIcon: {
    padding: 10,
    width: 10,
    height: 10,
  },
});
