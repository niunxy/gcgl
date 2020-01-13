
/** 应用程序相关配置文件 - 开发人员使用 */
const appConfig = {
	projectName: '土地工程项目监督管理平台',
	basePlatformName: '土地工程项目监督管理平台',
	system: {
		loadingText: '努力加载中...'
	}
}
if (typeof (ConfigExt) !== 'undefined') {
	Object.assign(appConfig, ConfigExt)
}

export default appConfig
