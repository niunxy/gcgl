import * as Cesium from 'cesium'
import Timeline from './Timeline'
import dev from '@config/dev.config'
function MapManager(this: any, viewer) {
    this.viewer = viewer
    this.arcgisIpAddress = dev.arcgisUrl
    this.modelIpAddress = dev.modelUrl
    // 加载arcgiswms图层
    this.loadArcgisWms = (layerLoadName: string, layers: any, layerName: string, show: any) => {
        const serverUrl = this._arcgisUrlPrefix() + '/arcgis/services/' + layerLoadName + '/MapServer/WMSServer?'
        const provider = new Cesium.WebMapServiceImageryProvider({
            url : serverUrl,
            layers,
            crs: 'EPSG:4525',
            parameters : {
                service : 'WMS',
                format: 'image/png',
                transparent: true
            }
        })
        const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
        imageryLayer.show = show
        imageryLayer.name = layerName
        return imageryLayer
    }
    // 加载模型
    this.load3DModel = (modelLoadName, modelName, show) => {
        const modelUrl = this._serverUrlPrefix() + '/data/ProjectData/modelData/' + modelLoadName + '/tileset.json'
        const primitive = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelUrl,
            maximumScreenSpaceError: 32,        // 最大的屏幕空间误差
            maximumNumberOfLoadedTiles: 10000,  // 最大加载瓦片个数
            // @ts-ignore
            colorBlendMode : Cesium.Cesium3DTileColorBlendMode.REPLACE,
        }))
        primitive.name = modelName
        primitive.show = show
        return primitive
    }
    /*
     * Url拼接
     */
    // arcgisUrl拼接
    this._arcgisUrlPrefix = () => {
        return this.arcgisIpAddress
    }
    // serverUrl拼接
    this._serverUrlPrefix = () => {
        return this.modelIpAddress
    }
}
MapManager.prototype = {
    // 图层控制
    getMapConfig () {
        const timeline = new Timeline(null)
        this.config = timeline.testConfig()
    },
    loadWMSMap () {
        if (!this.config) {
            this.getMapConfig ()
        }
        const arcgisWmsConfig = this.config.layerController.arcgisWms
        this.loadArcgisWms(arcgisWmsConfig.lx_layerName , arcgisWmsConfig.lx_fwx , '立项范围线', false) // 立项范围线
        this.loadArcgisWms(arcgisWmsConfig.lx_layerName , arcgisWmsConfig.lx_ghys , '立项规划要素', false) // 立项规划要素
        this.loadArcgisWms(arcgisWmsConfig.lx_layerName , arcgisWmsConfig.lx_tkfw, '立项田块范围', false) // 立项田块范围
        this.loadArcgisWms(arcgisWmsConfig.sj_layerName , arcgisWmsConfig.sj_fwx, '设计范围线', false) // 设计范围线
        this.loadArcgisWms(arcgisWmsConfig.sj_layerName , arcgisWmsConfig.sj_ghys , '设计规划要素', false) // 设计规划要素
        this.loadArcgisWms(arcgisWmsConfig.sj_layerName , arcgisWmsConfig.sj_tkfw , ' 设计田块范围', false) // 设计田块范围
        this.loadArcgisWms(arcgisWmsConfig.jg_layerName , arcgisWmsConfig.jg_fwx , '竣工范围线', false) // 竣工范围线
        this.loadArcgisWms(arcgisWmsConfig.jg_layerName , arcgisWmsConfig.jg_ghys , '竣工规划要素', false) // 竣工规划要素
        this.loadArcgisWms(arcgisWmsConfig.jg_layerName , arcgisWmsConfig.jg_tkfw, '竣工田块范围', false) // 竣工田块范围
        this.loadArcgisWms(arcgisWmsConfig.fh_layerName , arcgisWmsConfig.fh_fwx,  '复核范围线', false) // 复核范围线
        this.loadArcgisWms(arcgisWmsConfig.fh_layerName , arcgisWmsConfig.fh_ghys, '复核规划要素', false) // 复核规划要素
        this.loadArcgisWms(arcgisWmsConfig.fh_layerName , arcgisWmsConfig.fh_tkfw, '复核田块范围', false) // 复核田块范围
    },
    openWMSMapByName (layerName) {
        this._ergodicImagryLayers(layerName, (imageryLayer) => {
            imageryLayer.show = true
        })
    },
    closeWMSMapByName (layerName) {
        this._ergodicImagryLayers(layerName, (imageryLayer) => {
            imageryLayer.show = false
        })
    },
    closeWMSMapAll () {
        this._ergodicImagryLayers(null, (imageryLayer) => {
            if (imageryLayer.name) {
                imageryLayer.show = false
            }
        })
    },
    // 模型控制
    close3DModelByName (modelName) {
        this._ergodicPrimitives(modelName, (primitive) => {
            primitive.show = false
        })
    },
    open3DModelByName (modelName) {
        this._ergodicPrimitives(modelName, (primitive) => {
            primitive.show = true
        })
    },
    // 遍历图层
    _ergodicImagryLayers (layerName, callback) {
        const that = this
        const viewer = that.viewer
        const imageryLayers = viewer.imageryLayers
        const numLayers = imageryLayers.length
        for (let i = 0; i < numLayers ; i++) {
            const imageryLayer = imageryLayers.get(i)
            if (layerName) {
                if (imageryLayer.name && layerName === imageryLayer.name) {
                    callback(imageryLayer)
                    break
                }
            } else {
                callback(imageryLayer)
            }
        }
    },
    // 遍历对象
    _ergodicPrimitives (modelName, callback) {
        const primitives = this.viewer.scene.primitives
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives.get(i)
            if (modelName) {
                if (primitive.name && primitive.name === modelName) {
                    callback(primitive)
                    break
                }
            } else {
                callback(primitive)
            }
        }
    }
}

export default MapManager