/**
 * @author Roman
 * @date 2019/12/21
 * @Description: 创建并初始化Cesium
 */
import * as Cesium from 'cesium'

function CesiumCreater (this: any) {
    const that = this
    that.initViewer =  (id, mapServerUrl) => {
        const viewer = new Cesium.Viewer(id, {
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
              url: mapServerUrl
            }),
            infoBox: false, // 是否显示点击要素之后显示的信息
            selectionIndicator: false, // 是否显示选取指示器组件
            shadows: true,
            shouldAnimate: true,
            geocoder: false, // 是否显示地名查找控件
            homeButton: false,
            baseLayerPicker: false, // 是否显示图层选择控件
            navigationHelpButton: false,
            animation: false,
            timeline: false, // 是否显示时间线控件
            fullscreenButton: false, // 是否显示全屏按钮
            vrButton: false, // 是否显示vr按钮
            sceneModePicker: false,
        })
        // 关闭cesium三维深度检测
        viewer.scene.globe.depthTestAgainstTerrain = false
        // 去除默认双击事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction( Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

        // @ts-ignore
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        // handler.setInputAction(() => {
        //     console.log(viewer.scene.camera.heading)
        //     console.log(viewer.scene.camera.pitch)
        //     console.log(viewer.scene.camera.roll)
        //     console.log(viewer.scene.camera.position)
        //     const ellipsoid = viewer.scene.globe.ellipsoid
        //     const cartesian3 = new Cesium.Cartesian3(viewer.scene.camera.position.x, viewer.scene.camera.position.y, viewer.scene.camera.position.z)
        //     const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
        //     const lat = Cesium.Math.toDegrees(cartographic.latitude)
        //     const lng = Cesium.Math.toDegrees(cartographic.longitude)
        //     const alt = cartographic.height
        //     console.log(lat, lng, alt)
        // }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
        return viewer
    }
    // 加载谷歌卫星地图
    that.loadGoogle = (viewer) => {
        const provider = new Cesium.UrlTemplateImageryProvider({
            url: 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
        })
        const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
        return imageryLayer
    }
    // 加载Esri卫星地图
    that.loadEsri = (viewer) => {
        const provider = new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        })
        const imageryLayer = viewer.imageryLayers.addImageryProvider(provider)
        return imageryLayer
    }
    // 加载网络地形
    that.loadWebTerrain = (viewer) => {
        viewer.scene.terrainProvider = Cesium.createWorldTerrain({
            requestWaterMask: false,
            requestVertexNormals: false,
        })
    }
    // 加载本地地形
    that.loadLocalTerrain = (viewer, localTerrainUrl) => {
        const terrainData = new Cesium.CesiumTerrainProvider({
            url: localTerrainUrl
        })
        viewer.scene.terrainProvider = terrainData
    }
    // 定位至陕西省
    that.initCameraToSX = (viewer) => {
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(109.04424069633983, 35.202882462424164, 500000),
            orientation: {
                heading: 0,
                pitch: -1.5643170560621522,
                roll: 0
            }
        })
    }
    // 初始化视角
    that.initCamera = (viewer) => {
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(108.35282527896344, 37.369023262190694, 2365.608565497709),
            orientation: {
                heading: 5.638259927233962,
                pitch: -0.8588487973496148,
                roll: 6.28019771414181
            }
            // duration: 2,
        })
    }
    // 解决gltf报错问题
    that.resolveGltfError = () => {
        // 解决gltf加载报错
        const fixGltf = (gltf) => {
            if (!gltf.extensionsUsed) {
                return
            }
            const v = gltf.extensionsUsed.indexOf('KHR_technique_webgl')
            const t = gltf.extensionsRequired.indexOf('KHR_technique_webgl')
            // 中招了。。
            if (v !== -1) {
                gltf.extensionsRequired.splice(t, 1, 'KHR_techniques_webgl')
                gltf.extensionsUsed.splice(v, 1, 'KHR_techniques_webgl')
                gltf.extensions = gltf.extensions || {}
                gltf.extensions.KHR_techniques_webgl = {}
                gltf.extensions.KHR_techniques_webgl.programs = gltf.programs
                gltf.extensions.KHR_techniques_webgl.shaders = gltf.shaders
                gltf.extensions.KHR_techniques_webgl.techniques = gltf.techniques
                const techniques = gltf.extensions.KHR_techniques_webgl.techniques
                // @ts-ignore
                gltf.materials.forEach((mat, index) => {
                    gltf.materials[index].extensions.KHR_technique_webgl.values = gltf.materials[index].values
                    gltf.materials[index].extensions.KHR_techniques_webgl = gltf.materials[index].extensions.KHR_technique_webgl
                    const vtxfMaterialExtension = gltf.materials[index].extensions.KHR_techniques_webgl
                    for (const value of Object.keys(vtxfMaterialExtension.values)) {
                        const us = techniques[vtxfMaterialExtension.technique].uniforms
                        for (const key in us) {
                            if (us[key] === value) {
                                vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value]
                                delete vtxfMaterialExtension.values[value]
                                break
                            }
                        }
                    }
                })
                techniques.forEach( (value) => {
                    for (const attribute of Object.keys(value.attributes)) {
                        const name = value.attributes[attribute]
                        value.attributes[attribute] = value.parameters[name]
                    }
                    for (const uniform of Object.keys(value.uniforms)) {
                        const name = value.uniforms[uniform]
                        value.uniforms[uniform] = value.parameters[name]
                    }
                })
            }
        }

        Object.defineProperties(Cesium.Model.prototype, {
            _cachedGltf: {
                set (value) {
                    this._vtxf_cachedGltf = value
                    if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
                        fixGltf(this._vtxf_cachedGltf._gltf)
                    }
                },
                get () {
                    return this._vtxf_cachedGltf
                },
                configurable: true
            }
        })
    }
    // 创建左键点击事件，返回屏幕坐标
    that.createMapClick = (viewer, callback) => {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((movement) => {
            const wp = movement.position
            callback(wp)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    // 创建左键点击事件，返回经纬度
    that.createMapClickToDegree = (viewer, callback) => {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((movement) => {
            const wp = movement.position
            const ellipsoid = viewer.scene.globe.ellipsoid
            const ray = viewer.scene.camera.getPickRay(wp)
                if (!Cesium.defined(ray)) {
                return
            }
            const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
            if (!Cesium.defined(cartesian)) {
                callback(null) // 如果选取无效坐标，则返回null
                return
            }
            const cartographic = ellipsoid.cartesianToCartographic(cartesian)
            const lon = Cesium.Math.toDegrees(cartographic.longitude)
            const lat = Cesium.Math.toDegrees(cartographic.latitude)
            const elev = cartographic.height
            const degree = {
                lon,
                lat,
                elev
            }
            callback(degree)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    // 创建左键点击事件，返回所点击的对象
    that.createMapClickToEntity = (viewer, callback) => {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((movement) => {
            const wp = movement.position
            const pick = viewer.scene.pick(wp)
            if (!Cesium.defined(pick)) {
                callback(null) // 如果未选中entity 则返回null
                return
            }
            if (!pick.id) {
                return
            }
            const selectedEntity = pick.id
            callback(selectedEntity)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    // 加载json数据
    that.loadGeoJson = (url, option, callback) => {
        Cesium.GeoJsonDataSource.load(url, option).then((ds) => {
            callback(ds)
        })
    }
}
export default CesiumCreater
