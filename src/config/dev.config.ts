/*
 * @Author: your name
 * @Date: 2019-11-09 16:11:33
 * @LastEditTime : 2020-01-10 14:54:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gcgl\src\config\dev.config.ts
 */

/** 应用程序相关配置文件 - 开发人员使用 */
const cofig = {
	'prod': {
		isDummy: false,
		rdpServerUrl: 'http://192.168.5.251:18080', // RDP-SERVER
		mapUrl: 'http://192.168.5.124:6080', // 地图ip
		url: 'http://192.168.5.251:8089', // 接口ip
		rmqUrl: 'ws://192.168.5.124:15674', // rabitMQ的ip
		arcgisUrl: 'http://192.168.5.124:6080', // arcgis地图ip
		modelUrl: 'http://192.168.5.124:8080' // 模型地图地址
	},
	'test': {
		isDummy: false,
		rdpServerUrl: 'http://192.168.5.230:18080', // RDP-SERVER
		mapUrl: 'http://192.168.5.124:6080', // 地图ip
		// url: 'http://192.168.5.230:8089', // 接口ip
		url: 'http://192.168.5.120:8089', // 接口ip
		rmqUrl: 'ws://192.168.5.124:15674', // rabitMQ的ip
		arcgisUrl: 'http://192.168.5.124:6080', // arcgis地图ip
		modelUrl: 'http://192.168.5.124:8080' // 模型地图地址	
	},
	'local': {
		isDummy: false,
		rdpServerUrl: 'http://127.0.0.1:18080', // RDP-SERVER
		mapUrl: 'http://127.0.0.1:6080', // 地图ip
		url: 'http://127.0.0.1:8089', // 接口ip
		rmqUrl: 'ws://127.0.0.1:15674', // rabitMQ的ip
		arcgisUrl: 'http://127.0.0.1:6080', // arcgis地图ip
		modelUrl: 'http://127.0.0.1:8080' // 模型地图地址
	}
}
export const env = 'test' // prod, test, local
export default cofig[env]
