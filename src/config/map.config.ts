
/** 应用程序中地图相关功能配置文件 - 开发人员使用 */

const spt = {
	wkid: 4990
}
const mapConfig = {
	/** 地图初始化范围加载动画设置 */
	initAnimate: {
		localStorageKey: 'animate',
		defaultAnimate: 'on' // 可选值 on|off ，on 表示有动画， off 表示没有动画
	},
	gisMode: '3D', // 3D |2D  - 表示是使用三维平台还是二维平台
	/** 基础的底图，可进行切换，默认为影像地图 */
	spatialReference: spt,
	baseMapLayers: [
		// 天地图地形底图
		{
			url: `https://{subDomain}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=34e168d12e2b79f61dc1e6e220659c71`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtTer',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: false,
			title: '天地图地形',
			index: 1
		},
		// 天地图地形注记
		{
			url: `https://{subDomain}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=34e168d12e2b79f61dc1e6e220659c71`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtTer_anno',
			isBaseMap: false, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: false,
			title: '天地图地形注记',
			index: 2
		},
		// 天地图影像底图
		{
			url: `https://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=34e168d12e2b79f61dc1e6e220659c71`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtImg',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: false,
			title: '天地图影像',
			index: 3
		},
		// 天地图影像注记
		{
			url: `https://{subDomain}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=34e168d12e2b79f61dc1e6e220659c71`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtImg_anno',
			isBaseMap: false, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: false,
			title: '天地图影像注记',
			index: 4
		},
		// 天地图矢量底图
		{
			url: `https://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=871d4cd31ca475ac00f30fd7c563b61d`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtVec',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: true,
			title: '天地图矢量',
			index: 5
		},
		// 天地图矢量注记
		{
			url: `https://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=871d4cd31ca475ac00f30fd7c563b61d`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtVec_anno',
			isBaseMap: false, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: true,
			title: '天地图矢量注记',
			index: 6
		}
	],
	/** 其它默认需要加载的地图服务,如边界服务，地形数据等 */
	defaultLayers: [
		/** 地形 - 仅三维下需要地形服务 */
		// {
		// 	url: 'http://192.168.5.124:6080/arcgis/rest/services/shanxitest/shanxisheng/MapServer',
		// 	id: 'test',
		// 	visible: true,
		// 	type: 'TileLayer',
		// 	title: '陕西边界',
		// 	index: 7
		// }
	],
	/** 不旋转时的初始化范围  */
	initExtent: {},

	/**
	 * 视点
	 * 三维初始化范围
	 */
	target: {
		'position': {
			'spatialReference': {
				wkid: 4490
			},
			'x': 108.7842483881793,
			'y': 34.26659141717427,
			'z': 2268627.421636358,
		},
		'heading': 359.7248815396849,
		'tilt': 0.3190555466189679
	},
}

export { spt }
export default mapConfig
