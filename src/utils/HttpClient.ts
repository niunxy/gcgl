import axios from 'axios'
// import { message } from 'antd'
import * as qs from 'qs'
import dev from '@config/dev.config'
import StorageUtils from '@utils/StorageUtil'
import LoginUtils from '@utils/Login'
// import { loadProgressBar } from 'axios-progress-bar'
// import 'axios-progress-bar/dist/nprogress.css'

// 自定义判断元素类型JS
function toType(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
	Object.keys(o).map(key => {
		if (o[key] === null) {
			delete o[key]
		}
		if (toType(o[key]) === 'string') {
			o[key] = o[key].trim()
		} else if (toType(o[key]) === 'object') {
			o[key] = filterNull(o[key])
		} else if (toType(o[key]) === 'array') {
			o[key] = filterNull(o[key])
		}
	})
	return o
}

axios.defaults.baseURL = dev.url
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use((config) => {
	// Do something before request is sent
	if (config.method && config.method.toLowerCase() === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
		config.data = qs.stringify(config.data)
	}
	return config
}, error => {
	// Do something with request error
	return Promise.reject(error)
})

/**
 *
 *
 * @param {String} method Ajax请求类型 'POST'|'PUT'|'GET'|'DELETE'
 * @param {String} url 请求地址
 * @param {Object} params  参数
 * @returns Promise<T>
 */

function apiAxios(method, url, params) {
	if (params) {
		params = filterNull(params)
	}
	return new Promise((resolve, reject) => {
		// loadProgressBar()
		axios({
			method,
			url,
			data: method === 'POST' || method === 'PUT' ? params : null,
			params: method === 'GET' || method === 'DELETE' || method === 'PATCH' ? params : null,
			paramsSerializer: originParams => {
				return qs.stringify(originParams, { indices: false })
			},
			withCredentials: true
		})
			.then((res: any) => {
				if (res.status === 200) {
					const data = res.data
					// if (data.status === '200' || data.status === 200 || data.code === '0' || data.code === 0 || data.code === 'CODE_0000' || data.code === '201' || data.code === 201) {
					resolve(data)
					/* } else if (data.token_type === 'bearer') { // 如果是获取 token 的请求，把 token 截取下来，保存到 sessionStorage,(或根据需求做其它操作)
						const storage = window.sessionStorage
						storage.token = 'Bearer ' + data.access_token
						// window.location.href = '#/'
					} else if (data.data.code === 'login_error') { // 缺乏token的处理方式，弹出错误的提示信息(或根据需求添加其它操作,如：返回登录页面)
						message.error(data.msg)
					} else {
						reject('服务器状态不对')
					} */
				} else {
					reject('Axios返回状态不对，查看请求处理过程．．．．')
				}
			}, err => {
				// message.error('服务端异常')
				LoginUtils.DeleteToken()
				LoginUtils.DeleteUserInfo()
				StorageUtils.delLocalStorage('menuData')
				window.location.href = '#/login'
				reject(err)

			})
			.catch((err) => {
				const errInfo = { 'err': err.response }
				reject(errInfo)
			})
	})
}
export default {
	get: (url, params) => {
		return apiAxios('GET', url, params)
	},
	post: (url, params) => {
		return apiAxios('POST', url, params)
	},
	put: (url, params) => {
		return apiAxios('PUT', url, params)
	},
	delete: (url, params) => {
		return apiAxios('DELETE', url, params)
	},
	patch: (url, params) => {
		return apiAxios('PATCH', url, params)
	},
	upload: (url, params) => {
		return axios({
			method: 'post',
			url,
			withCredentials: true,
			data: params,
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	getGeoJson: (url, params) => {
		return axios({
			method: 'get',
			baseURL: dev.mapUrl,
			url,
			withCredentials: true,
			params
		})
	}
}
