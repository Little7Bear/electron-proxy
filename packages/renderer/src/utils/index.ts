/** *Storage,Session工具类 */ /*****************localStorage********************/
const storage = window.localStorage;

// 保存数据
export function setStorageData(key: string, value: unknown) {
  if (!window.localStorage) {
    alert('浏览器支持不localstorage');
  } else {
    storage.setItem(key, JSON.stringify(value));
  }
}

// 获取数据
export function getStorageData(key: string) {
  return storage.getItem(key) ? JSON.parse(storage.getItem(key) || '') : '';
}

/*****************sessionStorage********************/
// 保存数据
export function setSessionData(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// 获取数据
export function getSessionData(key: string) {
  return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key) || '') : '';
}

// 移除数据
export function removeSessionData(key: string) {
  sessionStorage.removeItem(key);
}

// 移除所有数据
export function clearSessionData() {
  sessionStorage.clear();
}
