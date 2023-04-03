/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  I18nManager,
  PermissionsAndroid,
} from 'react-native';

import Navigation from './Navigation';
import { AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import { API_ROOT } from './env';
import { setConfiguration } from './src/utils/configuration';
import { Provider } from 'react-redux';
import Colors from './src/utils/Colors';
import Geolocation from 'react-native-geolocation-service';
import { fcmService } from './src/components/Notification/FCMService';
import { Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';
class App extends React.Component {

  async componentDidMount() {
    console.disableYellowBox = true;
    setTimeout(() => SplashScreen.hide(), 5000);
    if (Platform.OS === 'android') {
      this.locationPermission()
    }
    // I18nManager.forceRTL(false);
    await fcmService.registerAppWithFCM();
    await fcmService.register(onRegister);

    this.getCurrentLocation();
    async function onRegister(token) {
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        await setConfiguration('fcmToken', token);
        console.log('Fresh token', token)
      }
    }
  }

  componentWillMount() {
    setConfiguration('API_ROOT', API_ROOT);
    setConfiguration('fcmToken', 'none');
    setConfiguration('token', '');
    setConfiguration('user_id', '');
    setConfiguration('language', 'en');
    setConfiguration('address', '');
  }

  locationPermission = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (granted) {
      console.log("You can use the ACCESS_FINE_LOCATION")
    }
    else {
      console.log("ACCESS_FINE_LOCATION permission denied")
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location")
        } else {
          console.log("Location permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            setConfiguration('latitude', position.coords.latitude)
            setConfiguration('longitude', position.coords.longitude)
            // setConfiguration('address', '');

            Geocoder.from(position.coords.latitude, position.coords.longitude)
                              .then(json => {
                                   const homePd = json.results[0].formatted_address;
                                   const place_id = json.results[0].place_id;
                                   setConfiguration('address', homePd);
                                  
                              })
                              .catch(error => console.log('ERRRR', error));
        },
        (error) => {
            // See error code charts below.
            console.log('Geolocation ERROR', error.code, error.message);
            setConfiguration('latitude', "30.7129")
            setConfiguration('longitude', "76.7079")
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
}

  render() {
    const store = require('./src/redux/store').default;
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <Navigation theme='no-preference' />
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White
  },
});

export default App;
