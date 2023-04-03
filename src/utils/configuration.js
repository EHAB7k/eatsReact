import {Map} from 'immutable';

let configuration = Map();

export function setConfiguration(name, value) {
  configuration = configuration.set(name, value);
}

export function setAll(properties) {
  configuration = configuration.merge(properties);
}

export function unsetConfiguration(name) {
  configuration = configuration.delete(name);
}

export function getConfiguration(key) {
  if (!configuration.has(key)) {
    if (key === 'latitude' || key === 'longitude') {
      // show no alert
      return;
    } else {
      // throw new Error('Undefined configuration key: ' + key);
      return undefined



    }
  }

  return configuration.get(key);
}
