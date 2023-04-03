import {PermissionsAndroid, Platform} from 'react-native';

const requestCameraPermission = async () => {
  let data = {isGraned: false, Message: 'message'};
  if (Platform.OS == 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        data = {isGraned: true, Message: 'Camera permission given'};
        return data;
      } else {
        data = {isGraned: false, Message: 'Camera permission denied'};
        console.log('Camera permission denied');
        return data;
      }
    } catch (err) {
      console.warn(err);
      data = {isGraned: false, Message: 'Error with camera'};

      return data;
    }
  } else {
    data = {isGraned: true, Message: 'ios'};
    return data;
  }
};

export {requestCameraPermission};
