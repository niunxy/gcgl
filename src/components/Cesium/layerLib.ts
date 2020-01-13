import {
    ArcGisMapServerImageryProvider,
    // ImageryLayer,
    // UrlTemplateImageryProvider,
    // WebMapTileServiceImageryProvider,
    // GeographicTilingScheme,
    // GridImageryProvider,
    // TileCoordinatesImageryProvider,
    WebMapServiceImageryProvider,
    // ArcGisMapServerImageryProvider
} from 'cesium'
// import defaultValue from 'cesium/Source/Core/defaultValue'
// import knockout from 'cesium/Source/ThirdParty/knockout'
// import Cesium3DTileColorBlendMode from 'cesium/Source/Scene/Cesium3DTileColorBlendMode'
import dev from '@config/dev.config'
import { env } from '@config/dev.config'
import FileAction from '@api/UploadAction'


// const tdtCiac = 'http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
//     '&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
//     '&style=default&format=tiles&tk=30dd720975f6e4f6a401b13ae0bd07e4'
// export const getImageryLayers = (viewer, config) => {
//     const imageryLayers = viewer.imageryLayers
//     const viewModel = {
//         layers: [],
//         baseLayers: [],
//         models: [],
//         upLayer: null,
//         downLayer: null,
//         selectedLayer: null,
//         isSelectableLayer: (aa: never) => {
//             return viewModel.baseLayers.indexOf(aa) >= 0
//         },
//         raise: (layer, index) => {
//             imageryLayers.raise(layer)
//             viewModel.upLayer = layer
//             viewModel.downLayer = viewModel.layers[Math.max(0, index - 1)]
//             updateLayerList(viewer, viewModel)
//             window.setTimeout(() => {
//                 viewModel.upLayer = viewModel.downLayer = null
//             }, 10)
//         },
//         lower: (layer, index) => {
//             imageryLayers.lower(layer)
//             viewModel.upLayer = viewModel.layers[Math.min(viewModel.layers.length - 1, index + 1)]
//             viewModel.downLayer = layer
//             updateLayerList(viewer, viewModel)
//             window.setTimeout(() => {
//                 viewModel.upLayer = viewModel.downLayer = null
//             }, 10)
//         },
//         canRaise: (layerIndex) => {
//             return layerIndex > 0
//         },
//         canLower: (layerIndex) => {
//             return layerIndex >= 0 && layerIndex < imageryLayers.length - 1
//         }
//     }
//
//     knockout.track(viewModel)
//     // setupLayers(viewer, viewModel, config)
//     updateLayerList(viewer, viewModel)
//
//     /* const layerToolbar = document.getElementById('layerToolbar')
//         knockout.applyBindings(viewModel, layerToolbar)
//         console.log(viewModel) */
//     knockout.getObservable(viewModel, 'selectedLayer').subscribe((baseLayer) => {
//         // Handle changes to the drop-down base layer selector.
//         let activeLayerIndex = 0
//         const numLayers = viewModel.layers.length
//         for (let i = 0; i < numLayers; ++i) {
//             if (viewModel.isSelectableLayer(viewModel.layers[i])) {
//                 activeLayerIndex = i
//                 break
//             }
//         }
//         const activeLayer: any = viewModel.layers[activeLayerIndex]
//         const show = activeLayer.show
//         const alpha = activeLayer.alpha
//         imageryLayers.remove(activeLayer, false)
//         imageryLayers.add(baseLayer, numLayers - activeLayerIndex - 1)
//         baseLayer.show = show
//         baseLayer.alpha = alpha
//         updateLayerList(viewer, viewModel)
//     })
//     return viewModel
// }

// const updateLayerList = (viewer, viewModel) => {
//     // 图层
//     const imageryLayers = viewer.imageryLayers
//     const numLayers = imageryLayers.length
//     viewModel.layers.splice(0, viewModel.layers.length)
//     for (let i = numLayers - 1; i >= 0; --i) {
//         viewModel.layers.push(imageryLayers.get(i))
//     }
//     // 模型
//     const numModels = viewer.scene.primitives.length
//     viewModel.models = []
//     for (let j = 0; j < numModels; j++) {
//         const model = viewer.scene.primitives.get(j)
//         if (model.name) {
//             viewModel.models.push(model)
//         }
//     }
// }
// const addBaseLayerOption = (name, imageryProvider, viewer, viewModel) => {
//     const imageryLayers = viewer.imageryLayers
//     const baseLayers = viewModel.baseLayers
//     for (let i = 0; i < imageryLayers.length; i++) {
//         const imageryLayer = imageryLayers.get(i)
//         if (imageryLayer.name && imageryLayer.name === name) {
//             viewModel.selectedLayer = imageryLayer
//             baseLayers.push(imageryLayer)
//             return
//         }
//     }
//     let layer
//     layer = new ImageryLayer(imageryProvider)
//     layer.name = name
//     baseLayers.push(layer)
//     /* or (let i = 0; i < imageryLayers.length; i++) {
//         const imageryLayer = imageryLayers.get(i)
//         if (imageryLayer.name && imageryLayer.name === name) {
//             return
//         }
//     }
//
//     let layer
//     if (typeof imageryProvider === 'undefined') {
//         layer = imageryLayers.get(0)
//         viewModel.selectedLayer = layer
//     } else {
//         layer = new ImageryLayer(imageryProvider)
//     }
//     layer.name = name
//     viewModel.baseLayers.push(layer) */
// }

// const addAdditionalLayerOption = (name, imageryProvider, alpha, show, viewer) => {
//     const imageryLayers = viewer.imageryLayers
//     for (let i = 0; i < imageryLayers.length; i++) {
//         const imageryLayer = imageryLayers.get(i)
//         if (imageryLayer.name && imageryLayer.name === name) {
//             return
//         }
//     }
//     const layer = imageryLayers.addImageryProvider(imageryProvider)
//     layer.alpha = defaultValue(alpha, 1.0)
//     layer.show = defaultValue(show, true)
//     layer.name = name
//     // Cesium.knockout.track(layer, ['alpha', 'show', 'name'])
// }

// export const addArcgisWmsLayerOption = (name, layer, alpha, show) => {
//     layer.alpha = defaultValue(alpha, 1.0)
//     layer.show = defaultValue(show, true)
//     layer.name = name
//     // Cesium.knockout.track(layer, ['alpha', 'show', 'name']);
// }

// export const loadArcgisWms = (viewer, layerName, layers) => {
//     const serverUrl = wmsUrlSplice(layerName)
//     const provider = new WebMapServiceImageryProvider({
//         url: serverUrl,
//         layers,
//         crs: 'EPSG:4525',
//         parameters: {
//             service: 'WMS',
//             format: 'image/png',
//             transparent: true
//         }
//     })
//     const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
//     return imageryLayer
// }

/*
 * 加载倾斜摄影模型
 */
// const load3DModel = (viewer, modelUrl, modelName) => {
//     const primitive = viewer.scene.primitives.add(new Cesium3DTileset({
//         url: modelUrl,
//         maximumScreenSpaceError: 2,        // 最大的屏幕空间误差
//         maximumNumberOfLoadedTiles: 10000,  // 最大加载瓦片个数
//         // colorBlendMode: Cesium3DTileColorBlendMode.REPLACE,
//     }))
//     primitive.name = modelName
//     return primitive
// }
//
// const add3DModelOption = (name, modelUrl, show, viewer) => {
//     const primitive = load3DModel(viewer, modelUrl, name)
//     primitive.show = defaultValue(show, true)
// }

// const setupLayers = (viewer, viewModel, config) => {

//     /* const wqImageryProvider = new WebMapServiceImageryProvider({
//         url: 'http://192.168.5.124:6080/arcgis/rest/services/wqxwms/MapServer',
//         layers: '0,1,2,3,4,5,6,7,8,9,10,11,12',
//         crs: 'EPSG:4525',
//         parameters : {
//             service : 'WMS',
//             format: 'image/png',
//             transparent: true
//         },
//     }) */
//     addBaseLayerOption(
//         'ESRI影像底图',
//         new ArcGisMapServerImageryProvider({
//             url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
//         }),
//         viewer,
//         viewModel
//     )
//
//     addBaseLayerOption(
//         '谷歌影像底图',
//         new UrlTemplateImageryProvider({
//             url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
//         }),
//         viewer,
//         viewModel
//     )
//
//     /*  addBaseLayerOption(
//          'ArcGIS World Street Maps',
//          new ArcGisMapServerImageryProvider({
//              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
//          }),
//          viewer,
//          viewModel
//      ) */
//
//     addAdditionalLayerOption(
//         '影像中文注记',
//         new WebMapTileServiceImageryProvider({
//             url: tdtCiac,
//             layer: 'tdtImg_c',
//             style: 'default',
//             format: 'tiles',
//             tileMatrixSetID: 'c',
//             subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
//             tilingScheme: new GeographicTilingScheme(),
//             tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
//             maximumLevel: 50,
//             // show: false // 报错
//         }), 1.0, false, viewer
//     )
//
//     addAdditionalLayerOption(
//         'Grid',
//         new GridImageryProvider(), 1.0, false, viewer)
//
//     addAdditionalLayerOption(
//         'Tile Coordinates',
//         new TileCoordinatesImageryProvider(), 1.0, false, viewer)
//     /* addArcgisWmsLayerOption(
//         '2019吴起县土地整治项目',
//         loadArcgisWms(viewer, 'sxmap', '0,1,2'), 1.0, false
//     ) */
//     // 业务wms图层
//     addArcgisWmsLayerOption('陕西省行政区划边界', loadArcgisWms(viewer, 'sxmap', '0,1,2'), null, null)
//
//     addArcgisWmsLayerOption('基础地图服务', loadArcgisWms(viewer, 'ED_JCSJ2', '0,1,2,3,4'), 1.0, true)
//     if (config) {
//         const arcgisWmsConfig = config.layerController.arcgisWms
//         // const modelConfig = config.layerController.modelSet
//         addArcgisWmsLayerOption('立项范围线', loadArcgisWms(viewer, arcgisWmsConfig.lx_layerName, arcgisWmsConfig.lx_fwx), 1.0, false)
//         addArcgisWmsLayerOption('立项规划要素', loadArcgisWms(viewer, arcgisWmsConfig.lx_layerName, arcgisWmsConfig.lx_ghys), 1.0, false)
//         addArcgisWmsLayerOption('立项田块范围', loadArcgisWms(viewer, arcgisWmsConfig.lx_layerName, arcgisWmsConfig.lx_tkfw), 1.0, false)
//         addArcgisWmsLayerOption('设计范围线', loadArcgisWms(viewer, arcgisWmsConfig.sj_layerName, arcgisWmsConfig.sj_fwx), 1.0, false)
//         addArcgisWmsLayerOption('设计规划要素', loadArcgisWms(viewer, arcgisWmsConfig.sj_layerName, arcgisWmsConfig.sj_ghys), 1.0, false)
//         addArcgisWmsLayerOption('设计田块范围', loadArcgisWms(viewer, arcgisWmsConfig.sj_layerName, arcgisWmsConfig.sj_tkfw), 1.0, false)
//         addArcgisWmsLayerOption('竣工范围线', loadArcgisWms(viewer, arcgisWmsConfig.jg_layerName, arcgisWmsConfig.jg_fwx), 1.0, false)
//         addArcgisWmsLayerOption('竣工规划要素', loadArcgisWms(viewer, arcgisWmsConfig.jg_layerName, arcgisWmsConfig.jg_ghys), 1.0, false)
//         addArcgisWmsLayerOption('竣工田块范围', loadArcgisWms(viewer, arcgisWmsConfig.jg_layerName, arcgisWmsConfig.jg_tkfw), 1.0, false)
//         addArcgisWmsLayerOption('二调底图', loadArcgisWms(viewer, arcgisWmsConfig.eddt_layerName, arcgisWmsConfig.eddt_layers), 1.0, false)
//         // addArcgisWmsLayerOption('吴起县土地整治项目', loadArcgisWms(viewer, 'wqxwms', '0,1,2,3,4,5,6,7,8,9,10,11,12'), 1.0, false)
//         // add3DModelOption('施工前倾斜模型', modelConfig.sgq_model, false, viewer)
//         // add3DModelOption('施工后倾斜模型', modelConfig.sgh_model, false, viewer)
//     }
// }

// export const removeImageryLayer = (viewer, layer) => {
//     if (layer) {
//         viewer.imageryLayers.remove(layer, true)
//     } else {
//         const numLayers = viewer.imageryLayers.length
//         for (let i = 0; i < numLayers; i++) {
//             viewer.imageryLayers.get(i).show = false
//         }
//         // viewer.imageryLayers.removeAll();
//     }
// }

/**
 * @author Roman
 * @date 2019/12/26
 * @Description: 通过底图编号获取 立项、设计、复核、耕评、竣工等图层
 */
// 加载底图
const loadWmsLayer = (viewer, layerLoadName, layers, layerName, show) => {
    const serverUrl = wmsUrlSplice(layerLoadName)
    const provider = new WebMapServiceImageryProvider({
        url: serverUrl,
        layers,
        crs: 'EPSG:4326',
        parameters: {
            service: 'WMS',
            format: 'image/png',
            transparent: true
        }
    })
    const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
    imageryLayer.name = layerName
    imageryLayer.show = show
    return imageryLayer
}
// 加载二调底图
const loadWmtsLayer = (viewer, layerLoadName, layerName, show) => {
    const wmtsUrl = wmtsUrlSplice(layerLoadName)
    const provider = new ArcGisMapServerImageryProvider({
        url: wmtsUrl
    })
    const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
    imageryLayer.name = layerName
    imageryLayer.show = show
    return imageryLayer
}
// 遍历已加载的图层
const ergodicLayers = (layers, callback) => {
    layers.forEach((layer) => {
        callback(layer)
    })
}
// wmsUrl拼接
export const wmsUrlSplice = (layerName) => {
    return dev.mapUrl + '/arcgis/services/' + layerName + '/MapServer/WMSServer?'
}
// wmtsUrl拼接
export const wmtsUrlSplice = (layerName) => {
    // console.log('二调底图名称：' + layerName)
    // @ts-ignore
    const path = env === 'local' ? 'baseService/' : ''
    return dev.mapUrl + '/arcgis/rest/services/' + path + layerName + '/MapServer/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=' + layerName + '&tileMatrixSet=default028mm&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=png'
}

// 拼接底图编号
const splitLayerNum = (items) => {
    const result: any = {
        lx: [], // 立项
        sj: [], // 设计
        fh: [], // 复核
        jg: [], // 竣工
        gp: [], // 耕评
    }
    items.forEach((item) => {
        let str: string
        str = `XM${item.processInstanceId}_${item.bgcs}_LX`
        result.lx.push(str)
        str = `XM${item.processInstanceId}_${item.bgcs}_SJ`
        result.sj.push(str)
        str = `XM${item.processInstanceId}_${item.bgcs}_FH`
        result.fh.push(str)
        str = `XM${item.processInstanceId}_${item.bgcs}_JG`
        result.jg.push(str)
        str = `XM${item.processInstanceId}_${item.bgcs}_GP`
        result.gp.push(str)
        // switch (true) {
        //     case item.xmjd > 4 && item.xmjd < 12 : // 立项 [5,11]
        //         str = `XM${item.processInstanceId}_${item.bgcs}_LX`
        //         // @ts-ignore
        //         result.lx.push(str)
        //         break
        //     case item.xmjd > 11 && item.xmjd < 16 : // 设计 [12,15]
        //         str = `XM${item.processInstanceId}_${item.bgcs}_SJ`
        //         // @ts-ignore
        //         result.sj.push(str)
        //         break
        //     case item.xmjd > 22 && item.xmjd < 28 : // 复核 [23,27] 对用竣工和耕评阶段
        //         str = `XM${item.processInstanceId}_${item.bgcs}_FH`
        //         // @ts-ignore
        //         result.fh.push(str)
        //         // @ts-ignore
        //         result.gp.push(str)
        //         break
        //     case item.xmjd > 15 && item.xmjd < 23 : // 竣工 [16,22] 对应施工阶段
        //         str = `XM${item.processInstanceId}_${item.bgcs}_JG`
        //         // @ts-ignore
        //         result.jg.push(str)
        //         break
        //     default :
        //         // @ts-ignore
        //         result.other.push(item.xmjd)
        //         break
        // }
    })
    return result
}
// 获取底图（主方法）
export const getProjectLayers = (viewer, callback) => {
    const layers: any = []
    const lxItem: any = {
        name: '立项阶段',
        layer: [],
        layerNum: [],
        show: true,
        index: 0
    }
    const sjItem: any = {
        name: '设计阶段',
        layer: [],
        layerNum: [],
        show: false,
        index: 1
    }
    const jgItem: any = {
        name: '竣工阶段',
        layer: [],
        layerNum: [],
        show: false,
        index: 2
    }
    const fhItem: any = {
        name: '复核阶段',
        layer: [],
        layerNum: [],
        show: false,
        index: 3
    }
    const gpItem: any = {
        name: '耕评阶段',
        layer: [],
        layerNum: [],
        show: false,
        index: 4
    }
    const edItem: any = {
        name: '基础地图服务',
        layer: [],
        show: false,
        index: 5
    }
    const sxqhItem: any = {
        name: '陕西省行政区划',
        layer: [],
        show: true,
        index: 6
    }
    // @ts-ignore
    sxqhItem.layer.push(loadWmsLayer(viewer, 'XZQH', '0,1,2', 'sxqh', true))
    // @ts-ignore
    // edItem.layer.push(loadWmsLayer(viewer, 'ED_JCSJ3', '0,1,2,3,4', 'eddt', true))
    const ED_JCSJ = env === 'local' ? 'ED_JCSJ' : 'ED_JCSJ1'
    edItem.layer.push(loadWmtsLayer(viewer, ED_JCSJ, 'eddt', false))
    // @ts-ignore
    // sxqhItem.layer.push(imagery)
    layers.push(lxItem, sjItem, jgItem, fhItem, gpItem, edItem, sxqhItem)
    FileAction.QueryUnFinshXm({}).then((res: any) => {
        if (res.status === 200) {
            if (res.data) {
                if (res.data instanceof Array && res.data.length > 0) {
                    const layersNumArr = splitLayerNum(res.data)
                    layersNumArr.lx.forEach((item) => {
                        const lxLayer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'lx', true)
                        lxItem.layer.push(lxLayer)
                        lxItem.layerNum.push(item)
                    })
                    layersNumArr.sj.forEach((item) => {
                        const sjLayer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'sj', false)
                        sjItem.layer.push(sjLayer)
                        sjItem.layerNum.push(item)
                    })
                    layersNumArr.jg.forEach((item) => {
                        const jgLayer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'jg', false)
                        jgItem.layer.push(jgLayer)
                        jgItem.layerNum.push(item)
                    })
                    layersNumArr.fh.forEach((item) => {
                        const fhLayer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'fh', false)
                        fhItem.layer.push(fhLayer)
                        fhItem.layerNum.push(item)
                    })
                    layersNumArr.gp.forEach((item) => {
                        const gpLayer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'gp', false)
                        gpItem.layer.push(gpLayer)
                        gpItem.layerNum.push(item)
                    })
                    // layers.push(lxItem, sjItem, jgItem, fhItem)
                    callback(layers)
                }
            } else {
                // layers.push(lxItem, sjItem, jgItem, fhItem)
                callback(layers)
            }
        } else {
            // layers.push(lxItem, sjItem, jgItem, fhItem)
            callback(layers)
        }
    }, () => {
        callback(layers)
    })
}
// 打开图层
export const openLayers = (layers) => {
    ergodicLayers(layers, (layer) => {
        layer.show = true
    })
}
// 关闭图层
export const closeLayers = (layers) => {
    ergodicLayers(layers, (layer) => {
        layer.show = false
    })
}
// 调节图层透明度
export const changeLayerAlpha = (layers, alpha) => {
    ergodicLayers(layers, (layer) => {
        layer.alpha = alpha
    })
}
// 单独获取某阶段图层 stageName=['lx','sj','fh','jg']
export const getProjectStageLayers = (viewer, stageName, show, callback) => {
    FileAction.QueryUnFinshXm({}).then((res: any) => {
        if (res.status === 200) {
            if (res.data) {
                if (res.data instanceof Array && res.data.length > 0) {
                    const layersNumArr = splitLayerNum(res.data)
                    const layers: object[] = []
                    layersNumArr[stageName].forEach((item) => {
                        const layer = loadWmsLayer(viewer, item, '0,1,2,3,4,5,6,7,8', 'lx', show)
                        layers.push(layer)
                    })
                    if (callback) {
                        callback(layersNumArr[stageName], layers)
                    }
                }
            }
        }
    })
}
// 获取所有图层的图层名称
export const getLayers = (callback) => {
    FileAction.QueryUnFinshXm({}).then((res: any) => {
        if (res.status === 200) {
            if (res.data) {
                if (res.data instanceof Array && res.data.length > 0) {
                    const layersNumArr = splitLayerNum(res.data)
                    if (callback) {
                        callback(layersNumArr)
                    }
                }
            }
        }
    })
}
