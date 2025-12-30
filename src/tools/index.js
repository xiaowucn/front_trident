import dayjs from 'dayjs';
import { Notification } from 'element-ui';
import router from '@/router';
const userAgent = navigator.userAgent;

export function isChromeBrowser() {
  return userAgent.includes('Chrome');
}

export function getChromeVersion() {
  const strStart = userAgent.indexOf('Chrome/');
  const strStop = userAgent.indexOf(' Safari');
  return userAgent.substring(strStart + 7, strStop);
}

export const phoneNumberReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/; // 手机号码验证

export const autodocMinimumBrowserVersion = 70; // autodoc 浏览器支持最低版本

export const isIPAddress = () => {
  const url = window.location.origin;
  const reg = /^(http|https):\/\/(\d+)\.(\d+)\.(\d+)\.(\d+)/g;
  return reg.test(url);
};

export const getQueryVariable = name => {
  const queryOriginal = window.location.search.split('?')[1];
  if (queryOriginal) {
    const queryList = queryOriginal.split('&');
    for (let i = 0; i < queryList.length; i++) {
      const queryItem = queryList[i];
      const [key, value] = queryItem.split('=');
      if (key === name) {
        return value;
      }
    }
  }
  return '';
};

export function determineBrowserVersion(
  minVersion = autodocMinimumBrowserVersion,
) {
  // 判断浏览器版本是否低于最低要求
  const version = getChromeVersion();
  const firstVersionNumber = Number(version.split('.')[0]);
  return firstVersionNumber < minVersion;
}

export const commonPasswordPattern = /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W])|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W])|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W])|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z_])[\da-zA-Z_\W]))/;

export const getValidUserPasswordResult = (platform, password) => {
  const passwordLength = platform === 'gyzq' ? 8 : 12;
  if (platform === 'stocke') {
    const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{12,16}$/;
    if (!reg.test(password)) {
      return `长度在12-16个字符(包含大写、小写、数字和特殊字符)`;
    }
    return '';
  } else if (
    !commonPasswordPattern.test(password) ||
    password.length < passwordLength
  ) {
    return `长度至少在 ${passwordLength} 个字符(大写、小写、数字和特殊字符至少包含三种)`;
  } else {
    return '';
  }
};

export const downloadByLink = link => {
  const linkEl = document.createElement('a');
  linkEl.href = link;
  linkEl.download = '';
  linkEl.click();
};

export const getRedirectSubpath = subpath => {
  if (subpath === '') {
    subpath = '/';
  }
  return subpath;
};

export const getRedirectURL = (subpath, redirectURL) => {
  if (redirectURL.startsWith('http')) {
    return redirectURL;
  }
  if (subpath) {
    const formatURL = redirectURL.slice(1);
    return `${subpath}${formatURL}`;
  }
  return redirectURL;
};

export const validateExpire = (config, sysName) => {
  const current = dayjs().unix();
  const expire = config[`${sysName}_expiration_timestamp`];
  const buffer = 2 * 60 * 60;
  if (expire && expire < current - buffer) {
    Notification.info({
      message: config[`${sysName}_expiration_message`],
    });
    return true;
  }
  return false;
};

export const getUsernameByUser = user => {
  return user.username || user.uid || user.ext_uname;
};

export const isUserManagerPermission = (configPermission, user) => {
  if (configPermission) {
    const userPermissions = user.permissions;
    return (
      (userPermissions && userPermissions.includes('p_manage')) || user.is_admin
    );
  }
  return false;
};

// 是否开启直接跳转到子系统
export const canAutoJumpToSubSystem = (config, user) => {
  if (config.auto_redirect_sub_sys) {
    if (config.sys === 'swhysc') {
      return !(user.permissions && user.permissions.includes('p_manage'));
    } else if (config.sys === 'nafmii') {
      return false;
    } else if (config.sys === 'cmfchina') {
      const { route } = router.resolve(window.location.hash.slice(1));
      if (route.name === 'UserManage') {
        return false;
      }
      return true;
    } else {
      return !isUserManagerPermission(config.user_manage, user);
    }
  }
  return false;
};

export const buildTree = data => {
  const cleanupTree = node => {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      node.children.forEach(child => cleanupTree(child));
    }
  };
  const tree = [];

  for (const key in data) {
    const label = data[key];
    const segments = key.split('_');
    let currentNode = tree;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      let existingNode = currentNode.find(node => node.splitValue === segment);

      if (!existingNode) {
        let newNode = {
          label: label,
          splitValue: segment,
          value: key,
          children: [],
        };
        currentNode.push(newNode);
        currentNode = newNode.children;
      } else {
        currentNode = existingNode.children;
      }
    }
  }
  tree.forEach(item => cleanupTree(item));
  return tree;
};
// 根据key在树结构中找到对应的节点
export const findNodeByKey = (key, nodes) => {
  for (let node of nodes) {
    if (node.value === key) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      let foundNode = findNodeByKey(key, node.children);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};
