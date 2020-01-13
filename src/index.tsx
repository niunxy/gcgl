import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Pages from '@pages/index'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import '@css/app/index.less'
import '@global/index' // 实现全局变量的初始化
import * as Cesium from 'cesium'

window.Cesium = Cesium
ReactDOM.render(
	<LocaleProvider locale={zh_CN}>
		<Pages />
	</LocaleProvider>,
	document.getElementById('root') as HTMLElement
)

// HMR
if (module.hot) {
    module.hot.accept()
}