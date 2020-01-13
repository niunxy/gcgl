/*
 * @Author: your name
 * @Date: 2019-12-13 16:17:06
 * @LastEditTime : 2019-12-30 09:59:02
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesium-react-webpack-demof:\work\landManage\src\utils\StorageUtil.ts
 */
/**
 * @author duxx
 */
export default {
  setLocalStorage: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  getLocalStorage: (key) => {
    const result = window.localStorage.getItem(key)
    if (result) {
      return JSON.parse(result!)
    }
    return null
  },
  delLocalStorage: (key) => {
    return new Promise((resolve) => {
      window.localStorage.removeItem(key)
      resolve({ 'isDeleted': true })
    })
  },
  delAllLocalStorage: () => {
    return new Promise((resolve) => {
      window.localStorage.clear()
      resolve({ 'isDeleted': true })
    })
  },
}