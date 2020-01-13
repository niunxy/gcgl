/**
 * @author Roman
 * @date 2020/1/2
 * @Description: 加载矢量瓦片的方法
 */

function VectorTileManager(this: any) {
    this.vectorTileLayers = [] // 矢量瓦片图层
    this.selectedEntity = null
    // 加载cesiumvectortileJs库
    this.loadVectorTileLibary = function () {
        this._loadThirdPartyByScript('script', 'head', { src: './cesiumvectortile/build/CesiumVectorTile.js' })
    }
    // 创建矢量瓦片图层，加载矢量瓦片
    this.createVectorTileLayer = function (viewer, path, obj, callback, func) {
        const that = this
        // 判断矢量瓦片库是否载入
        // @ts-ignore
        if (Cesium.VectorTileImageryProvider) {
            that.setVectorTileLayerProvider(viewer, path, obj, callback, func)
        } else {
            that.loadVectorTileLibary()
            setTimeout(() => {
                // @ts-ignore
                if (Cesium.VectorTileImageryProvider) {
                    that.setVectorTileLayerProvider(viewer, path, obj, callback, func)
                }
            }, 5000)
        }
    }
    // 加载矢量瓦片
    this.setVectorTileLayerProvider = function (viewer, path, obj, callback, func, name) {

        const that = this
        let defaultStyle
        if (obj && typeof obj === 'object') {
            defaultStyle = obj
        } else {
            defaultStyle = {
                outlineColor: '#f00',
                lineWidth: 2,
                fill: false,
                tileCacheSize: 500,
                // labelPropertyName:'id',
                // showCenterLabel: true,
                // showMaker: false,
                // fontColor: 'rgba(255,255,0,1)',
                // labelOffsetX: -10,
                // labelOffsetY: -5,
                // fontSize: 13,
                // fontFamily: '黑体',
                // centerLabelPropertyName: 'QSDWMC'
            }
        }
        // @ts-ignore
        const provider = new Cesium.VectorTileImageryProvider({
            source: path,
            allowPick: true,
            defaultStyle,
            maximumLevel: 20,
            minimumLevel: 1,
            simplify: false,
            myfunc(data) {
                const coodinates = []
                for (const value of data.geometry.coordinates[0]) {
                    // if (value.length <= 2) {
                    //     return
                    // }
                    const lon = parseFloat(value[0])
                    const lat = parseFloat(value[1])
                    // @ts-ignore
                    coodinates.push(Cesium.Cartesian3.fromDegrees(lon, lat))
                }
                if (that.selectedEntity) {
                    that.selectedEntity.polyline.positions = coodinates
                    that.selectedEntity.properties = data.properties
                } else {
                    that.selectedEntity = viewer.entities.add({
                        // @ts-ignore
                        polyline: new Cesium.PolylineGraphics({
                            // @ts-ignore
                            positions: coodinates,
                            // @ts-ignore
                            clampToGround: true,
                            // @ts-ignore
                            material: Cesium.Color.RED
                        }),
                        properties: data.properties
                    })
                }
                if (callback) {
                    callback(that.selectedEntity)
                }
            }
        })
        provider.readyPromise.then(() => {
            const layer = viewer.imageryLayers.addImageryProvider(provider)
            layer.name = name
            that.vectorTileLayers.push(layer)
            if (func) {
                func()
            }
        })
    }
    // 删除已存在的矢量瓦片图层
    this.removeVectorTileLayer = function (viewer) {
        const vectorTileLayers = this.vectorTileLayers
        for (const layer of vectorTileLayers) {
            viewer.imageryLayers.remove(layer)
        }
        viewer.entities.remove(this.selectedEntity)
        this.selectedEntity = null
    }
    // 删除已存在的矢量瓦片图层
    this.removeOneVectorTileLayer = function (viewer, name) {
        const vectorTileLayers = this.vectorTileLayers
        for (const layer of vectorTileLayers) {
            if (layer.name === name) {
                viewer.imageryLayers.remove(layer)
            }
        }
        viewer.entities.remove(this.selectedEntity)
        this.selectedEntity = null
    }
    // 加载第三方库的方法
    this._loadThirdPartyByScript = (tag, target, attrs) => {
        const element = document.createElement(tag)
        const head: any = document.getElementsByTagName(target)[0]
        if (attrs && typeof attrs === 'object') {
            for (const key of Object.keys(attrs)) {
                element.setAtrribute ? element.setAtrribute(key, attrs[key]) : element[key] = attrs[key]
            }
        }
        head.append(element)
    }
}

export default VectorTileManager