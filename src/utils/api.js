import Promise from 'bluebird';
import HttpError from 'standard-http-error';
import {getConfiguration} from '../utils/configuration';
import {getAuthenticationToken} from '../utils/authentication';

const TIMEOUT = 600000;

export async function get(path) {
  return bodyOf(requestAPI('get', path, null));
}

export async function post(path, body, suppressRedBox) {
  return bodyOf(request('post', path, body, suppressRedBox));
}

export async function postAPI(path, body) {
  return bodyOf(requestAPI('post', path, body));
}

export async function request(method, path, body, suppressRedBox) {
  try {
    const response = await sendRequest(method, path, body, suppressRedBox);
    return handleResponse(path, response);
  } catch (error) {
    if (!suppressRedBox) {
      logError(error, url(path), method);
    }
    throw error;
  }
}

export async function requestAPI(method, path, body) {
  try {
    const response = await sendRequestAPI(method, path, body);
    return handleResponse(path, response);
  } catch (error) {
    throw error;
  }
}

async function sendRequestAPI(method, path, body) {
  try {
    const endpoint = url(path);
    const token = await getAuthenticationToken();
    const headers = getRequestHeaders(body, token);
    const options = {method, headers, body: body};

    console.log('endpoint', endpoint);
    console.log('options', options);

    return timeout(fetch(endpoint, options), TIMEOUT);
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Takes a relative path and makes it a full URL to API server
 */
export function url(path) {
  const apiRoot = getConfiguration('API_ROOT');
  return path.indexOf('/') === 0 ? apiRoot + path : apiRoot + '/' + path;
}

/**
 * Constructs and fires a HTTP request
 */
async function sendRequest(method, path, body) {
  try {
    const endpoint = url(path);
    const token = await getAuthenticationToken();
    const headers = getRequestHeaders(body, token);
    const options = body ? {method, headers, body: body} : {method, headers};

    return timeout(fetch(endpoint, options), TIMEOUT);
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse(path, response) {
  try {
    const status = response.status;
    // `fetch` promises resolve even if HTTP status indicates failure. Reroute
    // promise flow control to interpret error responses as failures
    if (status >= 400) {
      const message = await getErrorMessageSafely(response);
      const error = new HttpError(status, message);

      // emit events on error channel, one for status-specific errors and other for all errors
      //      errors.emit(status.toString(), {path, message: error.message});
      //      errors.emit('*', {path, message: error.message}, status);
      throw error;
    }

    // parse response text
    const responseBody = await response.text();
    return {
      status: response.status,
      headers: response.headers,
      body: responseBody ? JSON.parse(responseBody) : null,
    };
  } catch (e) {
    throw e;
  }
}

function getRequestHeaders(body, token) {
  const headers = body
    ? {'Content-Type': 'application/json'}
    : {'Content-Type': 'application/json'};

  const acces_token = getConfiguration('token');
  const customerid = getConfiguration('user_id');
  const language = getConfiguration('language');

  if (acces_token.length > 0) {
    return {
      ...headers,
      token: acces_token,
      customerid: customerid,
      language: language,
    };
  }

  return headers;
}

// try to get the best possible error message out of a response
// without throwing errors while parsing
async function getErrorMessageSafely(response) {
  try {
    const body = await response.text();
    if (!body) {
      return '';
    }

    // Optimal case is JSON with a defined message property
    const payload = JSON.parse(body);
    if (payload && payload.message) {
      return payload.message;
    }

    // Should that fail, return the whole response body as text
    return body;
  } catch (e) {
    // Unreadable body, return whatever the server returned
    return response._bodyInit;
  }
}

/**
 * Rejects a promise after `ms` number of milliseconds, it is still pending
 */
function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(reject);
  });
}

async function bodyOf(requestPromise) {
  try {
    const response = await requestPromise;
    /*    if (response.headers.map.res_message) {
          const message = response.headers.map.res_message[0];
          console.log('response_message', message);
          const res_code = response.headers.map.res_code[0];
          console.log('response_code', res_code);
          await AsyncStorage.setItem('response_message', message);
          await AsyncStorage.setItem('response_code', res_code);
        }
        */
    return response.body;
  } catch (e) {
    throw e;
  }
}

/**
 * Make best effort to turn a HTTP error or a runtime exception to meaningful error log message
 */
function logError(error, endpoint, method) {
  if (error.status) {
    const summary = `(${error.status} ${error.statusText}): ${error._bodyInit}`;
    console.error(
      `API request ${method.toUpperCase()} ${endpoint} responded with ${summary}`,
    );
  } else {
    console.error(
      `API request ${method.toUpperCase()} ${endpoint} failed with message "${
        error.message
      }"`,
    );
  }
}
