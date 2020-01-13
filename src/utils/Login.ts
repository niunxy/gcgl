
/**
 * @author duxx
 * @desc 主要用来处理用户登录控制，存储, 获取和删除 session
 */
const KEY = 'token'
const USERKEY = 'user'
export default {
  /** 
   * @desc 设置 token 
   */
  SetToken: (token) => {
    setCookies(KEY, JSON.stringify(token), 5)
  },

  /** 
   * @desc 获取 token 
   */
  GetToken: () => {
    const token = getCookies(KEY)
    if (token && token !== '') {
      return token
    } else {
      return false
    }
  },

  /** 
   * @desc 删除 token 
   */
  DeleteToken: () => {
    setCookies(KEY, '', -1)
  },

  /** 
   * @desc 设置用户信息 
   */
  SetUserInfo: (userInfo) => {
    setCookies(USERKEY, JSON.stringify(userInfo), 5)
  },

  /**
   *  @desc 获取用户信息 
   */
  GetUserInfo: () => {
    const info = getCookies(USERKEY)
    if (info !== '') {
      return info
    } else {
      return false
    }
  },

  /**
   *  @desc 删除用户信息 
   */
  DeleteUserInfo: () => {
    setCookies(USERKEY, '', -1)
  },

  /** 
   * @desc 是否为登录状态 
   */
  isLogin: () => {
    const info = getCookies(USERKEY)
    return info
  }
}
/**
 * @desc 设置 cookie
 * @param key 
 */
const setCookies = (key, value, expireDays) => {
  const date = new Date()
  date.setTime(date.getTime() + expireDays  * 60 * 60 * 1000)
  document.cookie = key + '=' + escape(value) + ((expireDays === null) ? '' : ';expires=' + date.toUTCString())
}

/**
 * @desc 获取 cookie
 * @param key 
 */
const getCookies = (key) => {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(key + '=')
    if (cStart !== -1) {
      cStart = cStart + key.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) { cEnd = document.cookie.length }
      return JSON.parse(unescape(document.cookie.substring(cStart, cEnd)))
    }
  }
  return false
}





// /**
//  * 主要用来处理用户登录控制，存储, 获取和删除session
//  */
// const KEY = 'USER'
// export default {
//   SetLoginState: (userInfo) => {
//     window.sessionStorage.setItem(KEY, JSON.stringify(userInfo))
//   },
//   GetLoginState: () => {
//     return window.sessionStorage.getItem(KEY)
//   },
//   DeleteLoginState: () => {
//     return new Promise((resolve) => {
//       window.sessionStorage.removeItem(KEY)
//       resolve({ 'isDeleted': true })
//     })
//   }
// }