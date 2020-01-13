import _ from 'lodash'
import momentTimezone from 'moment-timezone'
import configFE from '@config/fe.config'
/**
 * @author duxx
 * @desc 一些列转换工具
 */
export default {

	getMomentTime: (date) => {
		return momentTimezone.tz(date, 'Asia/Shanghai')
	},

	timeTrans: (timeStamp) => {
		const date = new Date(timeStamp)
		const Y = date.getFullYear()
		const M = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
		const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
		const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
		const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
		const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
		return `${Y}-${M}-${D} ${h}:${m}:${s}`
	},

	formatDate: (date) => {
		if (date) {
			return momentTimezone.tz(date, 'Asia/Shanghai').format('YYYY-MM-DD')
		} else {
			return ''
		}
	},

	/**
	 * @desc 去除字符中空格
	 * @param str 操作对象
	 * @param global 是否去除全部空格： true - 去掉全部, false - 去掉两端
	 */
	trim: (str: string, global = true) => {
		let result
		result = str.replace(/(^\s+)|(\s+$)/g, '')
		if (global) {
			result = result.replace(/\s/g, '')
		}
		return result
	},

	isPreview: url => {
		if (_.isString(url)) {
			const suffix = url.substring(url.lastIndexOf('.'))
			return configFE.allowPreview.indexOf(suffix) > -1
		} else {
			return false
		}
	},

	getXMLX: (value) => {
		if (value === '0') {
			return '增减挂钩'
		} else if (value === '1') {
			return '占补平衡'
		} else {
			return ''
		}
	},

	// return default val 0
	numFormat: (val) => {
		if (_.isNil(val)) {
			return 0
		} else {
			return val
		}
	},

	getXMJD: (xmjd) => {
		let name: string, color: string
		if (xmjd >= 1 && xmjd <= 4) {  // 1 - 4
			name = '预立项'
			color = 'green'
		} else if (xmjd <= 11) {       // 5 - 11
			name = '立项'
			color = 'rgb(2,143,254)'
		} else if (xmjd <= 15) {       // 12 - 15
			name = '设计'
			color = 'rgb(39,185,63)'
		} else if (xmjd <= 22) {       // 16 - 22
			name = '施工'
			color = 'rgb(221,111,23)'
		} else if (xmjd <= 27) {       // 23 - 27
			name = '竣工'
			color = 'rgb(221,41,23)'
		} else if (xmjd <= 29) {       // 28 - 29 (xmjd val only is 28)
			name = '验收'
			color = 'green'
		} else if (xmjd <= 35) {       // 30 - 35 (xmjd val is btw 31 and 35)
			name = '变更'
			color = 'rgb(221,111,23)'
		} else {                       // xmjd = -1 or xmjd >35　
			name = '复核'
			color = 'rgb(221,41,23)'
		}
		return { name, color, val: xmjd }
	},

	isSpecialStyle: (xmjd) => {
		// 变更 & 归档复核 display border, others display background
		return xmjd >= 30 && xmjd <= 46
	},

	getStepsOfXMJD: (xmjd) => {
		const config = [
			{
				name: '预立项',
				keys: ['1', '2', '3', '4'],
				values: ['新建项目', '资源筛选', '地块分发', '资源踏勘']
			},
			{
				name: '立项',
				keys: ['5', '6', '7', '8', '9', '10', '11'],
				values: ['工程管理中心分发', '项目踏勘', '测绘踏勘', '设计踏勘', '计算工程量', '项目估算', '设计部项目立项']
			},
			{
				name: '设计',
				keys: ['12', '13', '14', '15'],
				values: ['初步设计', '项目预算', '设计完成', '工程管理中心设计审批']
			},
			{
				name: '施工',
				keys: ['16', '17', '18', '19', '20', '21', '22'],
				values: ['项目分包', '施工前资料', '施工中资料', '施工后资料', '竣工测量', '施工资料', '监理资料']
			},
			{
				name: '竣工',
				keys: ['23', '24', '25', '26', '27'],
				values: ['竣工资料', '复核资料', '耕评资料', '审核资料', '审计资料']
			},
			{
				name: '验收',
				keys: ['28'],
				values: ['验收资料']
			},
			{
				name: '变更',
				keys: ['31', '32', '33', '34', '35'],
				values: ['变更审批', '计算完工情况', '递交变更资料', '工程管理中心审核', '项目变更']
			}
		]
		return _.find(config, item => _.includes(item.keys, xmjd))
	}
}
