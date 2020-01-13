import http from '../utils/HttpClient'

interface ILoginParams {
  username: string,
  password: string,
  code: string
}
/**
 * @author duxx
 * @desc 登录模拟
 * @param params 
 */
const Login = (params: ILoginParams) => {
  /* return new Promise((resolve, reject) => {
    if (params.username) {
      resolve(params.username)
    } else {
      reject('failed')
    }
  }) */
  return http.post('/loginAcc', params)
}

const GetCode = () => {
  return http.get('/getCode?t=' + Date.now(), null)
}

const ChangePassword = (params) => {
    return http.post('/user/rePass', params)
}

export default {
  Login,
  GetCode,
  ChangePassword
}