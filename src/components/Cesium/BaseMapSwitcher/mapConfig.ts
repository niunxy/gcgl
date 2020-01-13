/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-12-12 14:41:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-12-15 17:12:49
 */
// import {GeographicTilingScheme} from 'cesium'
const mapConfig = {
    baseMapLayers: [		
		{
			url: `http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'esriImg',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'esriImagery',
			visible: false,
			title: 'ESRI影像底图',
			index: 1
		},
		{
			url: `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'googleImg',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'googleImagery',
			visible: false,
			title: '谷歌影像底图',
			index: 2
		},
		{
			url: `http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0` +
				 `&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}` +
				 `&style=default&format=tiles&tk=30dd720975f6e4f6a401b13ae0bd07e4`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtAnnotation',
			isBaseMap: false, // 是否为底图，注记为非底图
			type: 'tdtAnnotationImagery',
			visible: false,
			title: '影像中文注记',
			index: 3,
		}
		/* {
			url: `http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali`,
			subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			id: 'tdtVec',
			isBaseMap: true, // 是否为底图，注记为非底图
			type: 'tiandituOnline4490',
			visible: true,
			title: '天地图矢量',
			index: 5
		} */
    ]
}
export default mapConfig