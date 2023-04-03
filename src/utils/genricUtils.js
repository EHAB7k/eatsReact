import {Alert} from 'react-native';
import strings from '../constants/lang';

// ********************************* //
// ******** Alert Messages ******** //
// ******************************* //

export const successAlert = msg => {
  Alert.alert(
    strings.SUCCESS,
    msg,
    [
      {
        text: strings.OK,
      },
    ],
    {cancelable: false},
  );
};

export const errorAlert = msg => {
  Alert.alert(
    strings.ERROR,
    msg,
    [
      {
        text: strings.OK,
      },
    ],
    {cancelable: false},
  );
};

export const genericAlert = msg => {
  Alert.alert(
    strings.ALERT,
    msg,
    [
      {
        text: strings.OK,
      },
    ],
    {cancelable: false},
  );
};

// ********************************* //
// ******** Regex strings ********* //
// ******************************* //

export const regexStrings = {
  emailRegex:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  alphbetRegex: /^[a-zA-Z\s]+$/,
  numaricRegex: /^\d+$/,
};

// ********************************* //
// ******** FormData Conversion ********* //
// ******************************* //

export const convertToFormData = payload => {
  let formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};
