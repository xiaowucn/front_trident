import axios from 'axios';
import Crypt from 'cryptjs';
import store from '@/store/';

export const baseURL = `api/v1`;
const service = axios.create({
  baseURL: baseURL,
  timeout: 150000,
});

// autodoc响应数据解密
const handshakeEncrypt = new Crypt('0b168d3bb0828b5f6242cb3a9f144a23');
export function bufferToUnit8Array(buffer, handshake = false) {
  let ints = new Uint8Array(buffer);
  if (handshake) {
    return handshakeEncrypt.decryptJson(ints);
  } else {
    const key = store.getters['SysInfo/autodocConfig']['binary_key'];
    let packageEncrypt = new Crypt(key);
    return packageEncrypt.decryptJson(ints);
  }
}

service.interceptors.request.use(
  (config) => {
    const configs = store.getters['SysInfo/config'];
    console.log(
      config.headers.isEncrypt,
      configs.binary_key,
      'config.headers.isEncrypt || configs.binary_key',
    );
    if (config.headers.isEncrypt || configs.binary_key) {
      let packageEncrypt = new Crypt(configs.binary_key);
      if (!(config.data instanceof FormData)) {
        config.data = packageEncrypt.encryptJson(config.data);
      }
    }
    if (config.url.includes('/config') || config.headers.isDecrypt) {
      config.responseType = 'arraybuffer';
    }
    const csrftoken = store.getters['UserInfo/csrftoken'];
    if (csrftoken) {
      Object.assign(config, {
        headers: {
          'X-Csrftoken': csrftoken,
        },
      });
    }

    if (configs.http_secure_map) {
      if (config.method === 'put') {
        config.method = 'POST';
        config.url += '/put';
      }
      if (config.method === 'delete') {
        config.method = 'POST';
        config.url += '/delete';
      }
    }

    if (process.env.VUE_APP_DIST === 'SWHY') {
      const swhySession = store.getters['SysInfo/swhySession'];
      if (swhySession) {
        config.headers['X-trident-id'] = swhySession;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (res) => {
    if (res.config.responseType === 'arraybuffer') {
      const isConfigRequest = res.config.url.includes('/config');
      res.data = bufferToUnit8Array(res.data, isConfigRequest);
    }

    if (res.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'));
    } else if (res.data.status !== 'ok') {
      // 兼容 上交所统一登录平台 返回数据格式: {success: true, result: {}}
      if (res.data.success) {
        return res.data;
      }
      return Promise.reject(new Error(res.data.message || 'Error'));
    } else {
      return res.data;
    }
  },
  (error) => {
    if (error.config.responseType === 'arraybuffer') {
      error.response.data = bufferToUnit8Array(error.response.data);
    }
    if (error.response.status === 401) {
      window.parent.postMessage(
        { type: 'session_expired', message: '登录过期，请重新登录' },
        '*',
      );
    }
    if (error.response.status === 418 || error.response.status === 306) {
      return Promise.reject(error.response);
    }
    return Promise.reject(
      new Error(error.response.data.message || error.message),
    );
  },
);

export const plainRequest = axios.create({
  baseURL,
});

export const autodocRequest = axios.create({
  baseURL: 'autodoc/api/v1',
});

autodocRequest.interceptors.request.use(
  (config) => {
    const configs = store.getters['SysInfo/autodocConfig'];
    if (configs['binary_json']) {
      let packageEncrypt = new Crypt(configs.binary_key);
      if (config.responseType === undefined) {
        config.responseType = 'arraybuffer';

        if (!(config.data instanceof FormData)) {
          config.data = packageEncrypt.encryptJson(config.data);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
autodocRequest.interceptors.response.use(
  (res) => {
    const configs = store.getters['SysInfo/autodocConfig'];
    if (configs['binary_json']) {
      res.data = bufferToUnit8Array(res.data);
    }
    return res.data;
  },
  (error) => {
    return Promise.reject(
      new Error(error.response.data.message || error.message),
    );
  },
);

export default service;
