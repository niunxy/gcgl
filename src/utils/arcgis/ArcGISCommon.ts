
import esriLoader from 'esri-loader'
import esriConfig from '@config/esri.config'

const arcgisVersion = esriConfig.arcgisVersion

// import mapConfig from '@config/map.config'
// const { initViewpoint } = mapConfig
// const modelingViewpoint = appConfig.mapInfo.modelingViewpoint

// import { message } from 'antd'

/** 底图数据结构 */
interface IBaseMapLayers {
	id: string
	title: string
	// isArcgisDefault: boolean
	baseMap?: string
	type?: string
	url?: string
	subLayers?: object[] // 底图为geoserver发布的wmsLayer时需要
	index: number
	minScale?: number // 最小显示比例
	maxScale?: number // 最大显示比例
}









/**
 * @author duxx
 * @desc 向 map 对象上添加图层
 */
export function addLayersToMap(map, layers: IBaseMapLayers[]) {
	esriLoader.loadModules([
		'esri/layers/ElevationLayer',
		'esri/layers/WMSLayer',
		'esri/layers/TileLayer',
		'esri/layers/MapImageLayer',
	], arcgisVersion)
		.then(([
			ElevationLayer,
			WMSLayer,
			TileLayer,
			MapImageLayer
		]) => {
			for (const item of layers) {
				let layer
				switch (item.type) {
					case 'WMSLayer':
						const vectorLayer = new WMSLayer({
							url: item.url,
							sublayers: item.subLayers
						})

						// 将WMSLayer添加到地图中，作为底图
						map.add(vectorLayer)
						break
					case 'TileLayer':
						layer = new TileLayer({
							url: item.url,
							id: item.id
						})
						map.add(layer, item.index)
						break
					case 'ElevationLayer':
						layer = new ElevationLayer({
							url: item.url,
							id: item.id,
						})
						map.ground.layers.add(layer)
						// console.log('ElevationLayer')
						// console.log(layer)
						break
					case 'MapImageLayer': // 待测试节点
						layer = MapImageLayer({
							url: item.url, // "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
							// sublayers: [
							// 	{
							// 		id: 3,
							// 		visible: false
							// 	}, {
							// 		id: 2,
							// 		visible: true
							// 	}, {
							// 		id: 1,
							// 		visible: true
							// 	}, {
							// 		id: 0,
							// 		visible: true,
							// 		definitionExpression: "pop2000 > 100000"
							// 	}
							// ]
						})
						map.add(layer, item.index)
						break
					default:
						console.error('layers config error!')
				}
			}
		})
}

/**
 * @author duxx
 * @desc 飞行定位到指定位置
 * @param view view 对象
 */
export function goToTarget(view, target, optionsParam = {}) {
	const defaultOpts = {
		animate: true, // 默认即为 true
		speedFactor: 0.3,
		easing: 'easeOutQuad'
	}
	const options = Object.assign(defaultOpts, optionsParam)
	view.goTo(target, options)
	// esriLoader.loadModules([
	// 	'esri/Viewpoint'
	// ], arcgisVersion).then(([
	// ]) => {


	// }).catch(err => {
	// 	console.error(err)
	// })
}
/**
 * @author duxx
 * @desc 飞行至初始范围
 */

// export function goToIniitExtent(view, optionsParam = {
// 	animate: true, // 默认即为 true
// 	speedFactor: 0.3,
// 	easing: 'easeOutQuad'
// }
// ) {
// 	esriLoader.loadModules([
// 		'esri/Viewpoint'
// 	], arcgisVersion).then(([
// 		Viewpoint,
// 	]) => {
// 		// const viewpot = viewpointParam
// 		const viewpot = initViewpoint
// 		const viewpoint = new Viewpoint(viewpot)
// 		const options = optionsParam
// 		view.goTo(viewpoint, options)
// 	}).catch(err => {
// 		console.error(err)
// 	})
// }

export async function goToCamera(view, cameraParam, optionsParam = {
	animate: true, // 默认即为 true
	speedFactor: 0.3,
	easing: 'linear'
}
) {
	return new Promise((resolve, reject) => {
		esriLoader.loadModules([
			'esri/Camera'
		], arcgisVersion).then(([
			Camera,
		]) => {
			const camera = new Camera(cameraParam)
			const options = optionsParam
			view.goTo(camera, options).then((res) => {
				console.log(res)
				resolve(true)
			})
		}).catch(err => {
			reject(err)
		})
	})
}



/**
 * @desc 设置鼠标进入指定元素范围的展示行为
 * @param div map 容器
 * @param cursorStyle 鼠标行为
 */
export function setMapCursor(div, cursorStyle: string) {
	div.style.cursor = cursorStyle
}


export async function flyWithPath(view, cameraParamArray, saveIndex) {
	console.log(saveIndex)
	if (cameraParamArray && cameraParamArray.length > 0) {
		for (const camera of cameraParamArray) {
			await goToCamera(view, camera).then(() => {
				saveIndex = saveIndex + 1
				console.log(saveIndex)
			}, (err) => {
				console.error(err)
			})

		}
		// for (let i = 0; i < cameraParamArray.length; i++) {
		// 	resolve(i)
		// 	await goToCamera(view, cameraParamArray[i]).then(() => {
		// 		resolve(index)
		// 		index = index + 1
		// 	})
		// }
		return true


	} else {
		return false
	}
}



// /**
//  * @author duxx
//  * @desc 飞行定位到指定位置
//  * @param view view 对象
//  */
// goToTarget = (view, viewpointParam, optionsParam = {
// 	animate: true, // 默认即为 true
// 	speedFactor: 0.3,
// 	easing: 'easeOutQuad'
// }
// ) => {
// 	esriLoader.loadModules([
// 		'esri/Viewpoint'
// 	], arcgisVersion).then(([
// 		Viewpoint,
// 	]) => {
// 		const viewpoint = new Viewpoint(viewpointParam)
// 		const options = optionsParam
// 		view.goTo(viewpoint, options)
// 	}).catch(err => {
// 		console.error(err)
// 	})
// }


// 按照指定路线飞行

/**
 * @desc 添加天地图底图
 */
export function addTiandituBaseMapLayers(tiandituLayerInfos) {
	return new Promise((resolve, reject) => {
		esriLoader.loadModules([
			'esri/layers/WebTileLayer',
		], arcgisVersion).then(([
			WebTileLayer,
		]) => {
			try {
				const layer = new WebTileLayer({
					id: tiandituLayerInfos.id,
					urlTemplate: tiandituLayerInfos.url,
					subDomains: tiandituLayerInfos.subDomains,
					visible: tiandituLayerInfos.visible,
					// tileInfo: tileInfoParam
				})
				resolve(layer)
			} catch (e) {
				console.error(e)
				reject(e)
			}
		})
	})
}