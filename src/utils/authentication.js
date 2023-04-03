// @flow
import {AsyncStorage} from 'react-native';

const AUTHENTICATION_STORAGE_KEY: string = 'eNcounter:Authentication';
const CHOOSE_LANGUAGE_KEY: string = 'eNcounter:ChooseLanguage';

export function getAuthenticationToken(): string | null {
  return AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setAuthenticationToken(token: string): string {
  return AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export async function clearAuthenticationToken() {
  return AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}


export function getChooseLanguage(): string | null {
  return AsyncStorage.getItem(CHOOSE_LANGUAGE_KEY);
}

export async function setChooseLanguage(lang: string): string {
  return AsyncStorage.setItem(CHOOSE_LANGUAGE_KEY, lang);
}

export async function clearChooseLanguage() {
  return AsyncStorage.removeItem(CHOOSE_LANGUAGE_KEY);
}
