import * as React from 'react'
import {
    message
} from 'antd'
import CesiumMap from '../../utils/CesiumMap'
import ToolBar from './toolBar'
import { isEmpty } from '@utils/Tool'
import LoadingTip from '@components/LoadingTip'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {
    Cartesian3,
    Color,
    GeoJsonDataSource,
    Math as CesiumMath,
    ArcGisMapServerImageryProvider,
    PolylineGraphics,
    // BoundingSphere,
    // HeadingPitchRange,
    ScreenSpaceEventType,
    ImageryLayer,
    UrlTemplateImageryProvider,
    WebMapTileServiceImageryProvider,
    GeographicTilingScheme,
    ScreenSpaceEventHandler,
    defined,
    defined as CesiumDefined,
    Math,
    HeightReference,
    PointGraphics
} from 'cesium'
// import Cartographic from 'cesium/Source/Core/Cartographic'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import CesiumNavigation from 'cesium-navigation-es6'
import api from '@utils/HttpClient'
import dev from '@config/dev.config'
// import { getImageryLayers } from './layerLib'
import Layer from './layer'
import PlotScreen from './plotScreen'
import BaseMapSwitcher from './BaseMapSwitcher'
import LandParcel from './landParcel'
import { addMapLabel } from './tool'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import IndexAction from '@api/IndexAction'
import './index.less'

import VectorTileManager from './VectorTileManager'
import SelectFeature from './selectFeature'
import GisTools from './gisTools'
import StorageUtils from '@utils/StorageUtil'
// import {getLayers} from './layerLib'
// import "@cesium/Widgets/widgets.css"
interface IProps extends RouteComponentProps {
    history: any,
    type?: string,
    stores?: any,
    xmId?: any,
    xmName?: any,
    dkxh?: any,
    parentXm?: any,
    xmScreenId?: any,
    stopId?: any,
    xmjd?: any,
    county?: any,
}

interface IState {
    viewer: any
    lineEntities: any,
    visible: boolean,
    allLayers: any,
    baseLayers: any,
    viewModel: {},
    entities: any[],
    dlmEntities: any[],
    childEntities: any[],
    layer: any,
    subcontractFlag: boolean,
    screenFlag: boolean,
    geoData: any,
    allEntities: any,
    viewerCamera: any,
    screenCoordinates: IDegreePosition,
    selectedDK: any,
    selectedDKFromVectorTile: any,
    vectorTileManager: any,
    spinning: boolean,
    layers: any,
    panelLeft: number,
    panelTop: number,
    dkDataPanelShow: boolean
}
interface IDegreePosition {
    lon: string,
    lat: string,
    elev?: string
}
@inject('stores')
@observer
class MainMap extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const { x, y, z, heading, pitch, roll } = toJS(this.props.stores.mapStore.viewerCamera)
        this.state = {
            viewer: null,
            lineEntities: [],
            visible: false,
            allLayers: [],
            viewModel: {},
            entities: [],
            dlmEntities: [],
            childEntities: [],
            baseLayers: [],
            layer: null,
            subcontractFlag: false,
            screenFlag: false,
            geoData: [],
            allEntities: [],
            // align to MapStore viewerCamera
            viewerCamera: {
                x,
                y,
                z,
                heading,
                pitch,
                roll
            },
            screenCoordinates: { // 记录状态栏经纬度
                lon: '----',
                lat: '----',
                elev: '----'
            },
            selectedDK: null, // 矢量数据选择
            selectedDKFromVectorTile: null, // 矢量瓦片选择
            vectorTileManager: null, // 矢量瓦片选择
            spinning: false,
            layers: null, // 矢量数据选择时获取当前图层
            panelLeft: 10, // 矢量数据选择属性窗体位置
            panelTop: 10,
            dkDataPanelShow: false // 控制矢量属性窗体是否显示
        }
    }
    selectedEntityFlag = 0 // 选中的entity的标识
    // 主方法
    map = () => {
        const map = new CesiumMap('http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const layer = map.layer
        this.setState({
            layer
        })
        const viewer = map.init('cesiumContainer')
        // 引入导航控件，禁用缩放控件
        CesiumNavigation(viewer, { enableZoomControls: false })
        const { x, y, z, heading, pitch, roll } = toJS(this.props.stores.mapStore.viewerCamera)
        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(x, y, z),
            orientation: {
                heading,
                pitch,
                roll
            }
        })
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK) // 禁止鼠标双击事件
        const base = viewer.imageryLayers.addImageryProvider(new ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        }))
        base.name = 'ESRI影像底图'
        const noteLayer = viewer.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
            url: 'http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
                '&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
                '&style=default&format=tiles&tk=30dd720975f6e4f6a401b13ae0bd07e4',
            layer: 'tdtImg_c',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            tilingScheme: new GeographicTilingScheme(),
            tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
            maximumLevel: 50
        }))
        noteLayer.name = '影像中文注记'
        noteLayer.show = false
        viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
        this.setBaseLayer()
        this.setState({
            viewer,
        }, () => {
            StorageUtils.getLocalStorage('xmSxId') !== '' && this.initSx()
            this.indexLocation(this.state.viewer)
        })
        // this.setHomeButton(viewer)

        const allLayers = viewer.imageryLayers._layers

        this.setState({
            allLayers
        })

        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50 // 相机高度最小值
        viewer.scene.screenSpaceCameraController.maximumZoomDistance = 18000000 // 相机高度最大值
        // viewer.homeButton.container.childNodes[0].title = '' // home按钮不作提示
        viewer.camera.changed.addEventListener(() => {
            const curPosition = viewer.camera.position.clone()
            const ellipsoid = viewer.scene.globe.ellipsoid
            const cartesian3 = new Cartesian3(curPosition.x, curPosition.y, curPosition.z)
            const cartographic = ellipsoid.cartesianToCartographic(cartesian3)
            const lat = CesiumMath.toDegrees(cartographic.latitude)
            const lng = CesiumMath.toDegrees(cartographic.longitude)
            const alt = cartographic.height
            this.setState({
                viewerCamera: {
                    x: lng,
                    y: lat,
                    z: alt,
                    heading: viewer.camera.heading,
                    pitch: viewer.camera.pitch,
                    roll: viewer.camera.roll
                }
            })
        })
        this.setStateBarContent(viewer) // 底部经纬度状态栏
        const vectorTileManager = new VectorTileManager()
        vectorTileManager.loadVectorTileLibary() // 加载cesiumvectortile库
        this.setState({
            vectorTileManager
        })
        this.entitySelected(viewer) // 地块选择
    }
    // 上移下移
    swapItems = (arr, index1, index2) => {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0]
        return arr
    }
    setBaseLayer = () => {
        const baseLayer1 = new ImageryLayer(new UrlTemplateImageryProvider({
            url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
        }))
        // @ts-ignore
        baseLayer1.name = '谷歌影像底图'
        this.state.baseLayers.push(baseLayer1)
        const baseLayer2 = new ImageryLayer(new ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        }))
        // @ts-ignore
        baseLayer2.name = 'ESRI影像底图'
        this.state.baseLayers.push(baseLayer2)
    }
    upLayerData = (index, layer) => {
        let newArr = []
        const arr = this.state.allLayers
        if (arr.length > 1 && index !== 0) {
            newArr = this.swapItems(arr, index, index - 1)
        }
        this.setState({
            allLayers: newArr
        })
        this.state.viewer.imageryLayers.raise(layer)
        return newArr
    }

    downData = (index, layer) => {
        let newArr = []
        const arr = this.state.allLayers
        if (arr.length > 1 && index !== (arr.length - 1)) {
            newArr = this.swapItems(arr, index, index + 1)
        }
        this.setState({
            allLayers: newArr
        })
        this.state.viewer.imageryLayers.lower(layer)
        return newArr
    }
    // 地图切换
    changeAllLayer = (title) => {
        const newArr = [...this.state.allLayers]
        const index = newArr.findIndex((item) => {
            return item.name === 'ESRI影像底图' || item.name === '谷歌影像底图'
        })
        const changeLayer = this.state.baseLayers.find((value) => {
            return value.name === title
        })
        newArr.splice(index, 1, changeLayer)
        this.setState({
            allLayers: newArr
        })
    }

    // 子项目列表点击事件
    plotLocation = (viewer) => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.stopXm)
        // api.getGeoJson(`/arcgis/rest/services/${mapStore.xmId}/MapServer/exts/GeoJSONServer/GeoJSON?layer=0&bbox=&bboxSR=&f=geojson&query=${mapStore.xmName}`, null)
        api.getGeoJson(`/arcgis/rest/services/wqxwfs/MapServer/exts/GeoJSONServer/GeoJSON?layer=0&bbox=&bboxSR=&f=geojson&query=XDM%3D%27${info.county}%27`, null)
            .then((data: any) => {
                GeoJsonDataSource.load(data.data, {
                    stroke: Color.RED.withAlpha(1),
                    fill: Color.PINK.withAlpha(1),
                    // strokeWidth: 10,
                    clampToGround: true,
                    // markerSymbol: '?'
                }).then((ds) => {
                    viewer.dataSources.add(ds)
                    viewer.flyTo(ds, {
                        offset: {
                            heading: CesiumMath.toRadians(0),
                            pitch: CesiumMath.toRadians(-90)
                        }
                    }).then(() => {
                        viewer.flyTo(ds, {
                            offset: {
                                heading: CesiumMath.toRadians(0),
                                pitch: CesiumMath.toRadians(-80)
                            },
                            duration: 1.0
                        })
                        addMapLabel(this.state.viewer, require('./images/label.png'), `${dev.mapUrl}/arcgis/rest/services/wqxdkwfs/MapServer/exts/GeoJSONServer/GeoJSON?query=&layer=0&bbox=&bboxSR=&f=geojson`, 'WQ_label')
                    })
                    this.selectEntity(viewer, ds.entities.values[0])
                })
            })
    }

    // 子项目列表下项目名称点击方法
    getXmDk = (viewer) => {
        // const { mapStore } = this.props.stores
        const { processInstanceId, kbbgcs } = this.props.location.state.info

        const name = `XM${processInstanceId}_${kbbgcs}_LX`
        api.getGeoJson(`/arcgis/rest/services/${name}/MapServer/exts/GeoJSONServer/GeoJSON?&query=XMMC%3D%27${this.props.xmName}%27&layer=6&zvalue=dsddss&bbox=&bboxSR=&f=geojson`, null)
            .then((data: any) => {
                GeoJsonDataSource.load(data.data, {
                    stroke: Color.RED.withAlpha(0.01),
                    fill: Color.PINK.withAlpha(0),
                    strokeWidth: 10,
                    clampToGround: true
                    // markerSymbol: '?'
                }).then((ds: any) => {
                    viewer.dataSources.add(ds)
                    viewer.flyTo(ds, {
                        offset: {
                            heading: CesiumMath.toRadians(0),
                            pitch: CesiumMath.toRadians(-90)
                        }
                    })
                    this.setState({
                        childEntities: ds.entities.values
                    })
                })
            })
    }

    // 地块定位
    selectEntity = (viewer, entity) => {
        if (this.state.selectedDK && this.state.selectedDK.polyline) {
            const polyline = this.state.selectedDK.polyline
            polyline.material = Color.RED.withAlpha(0)
        }
        entity.polygon.material = Color.TRANSPARENT
        const pointPositions = entity.polygon.hierarchy._value.positions
        if (pointPositions.length > 1) {
            entity.polyline = new PolylineGraphics({
                positions: pointPositions,
                width: 5.0,
                material: Color.RED.withAlpha(0.6),
                // @ts-ignore
                clampToGround: true
            })
        }
        // this.setState({
        //     selectedDK: entity
        // })
        viewer.flyTo(entity, {
            offset: {
                heading: CesiumMath.toRadians(0), // 方向
                pitch: CesiumMath.toRadians(-90), // 倾斜角度
                range: 2200
            }
        })
    }
    // 定位到具体一个子项目的一个地块
    locationOneLand = () => {
        const dkxh = this.props.dkxh
        this.state.childEntities.forEach((item) => {
            if (item._properties.DKXH._value * 1 === dkxh * 1) {
                this.selectEntity(this.state.viewer, item)
            }
        })
    }

    /*setHomeButton = (viewer) => {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
            e.cancel = true
            // 定位至陕西省视图
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(109.16, 35.80, 1500000.0)
            })
        })
    }*/

    subcontract = () => {
        this.setState({
            screenFlag: false,
            subcontractFlag: !this.state.subcontractFlag
        })
    }
    // 地块未筛选的初始化
    noScreen = (viewer) => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        api.getGeoJson(`/arcgis/rest/services/XZQH/MapServer/exts/GeoJSONServer/GeoJSON?query=CODE+%3D+%27${info.county}%27&layer=0&bbox=&bboxSR=&f=geojson&zvalue=LLLL`, null)
            .then((data: any) => {
                GeoJsonDataSource.load(data.data, {
                    stroke: Color.RED.withAlpha(1),
                    fill: Color.PINK.withAlpha(0),
                    strokeWidth: 10,
                    clampToGround: true,
                    markerSymbol: '?'
                }).then((ds) => {
                    viewer.dataSources.add(ds)
                    viewer.flyTo(ds, {
                        offset: {
                            heading: CesiumMath.toRadians(0),
                            pitch: CesiumMath.toRadians(-90)
                        }
                    }).then(() => {
                        // viewer.flyTo(ds, {
                        //     offset: {
                        //         heading: CesiumMath.toRadians(0),
                        //         pitch: CesiumMath.toRadians(-15)
                        //     },
                        //     duration: 1.0
                        // })
                        viewer.dataSources.remove(ds)
                    })
                })
            })
    }
    // 地块筛选初始化加载
    landScreen = (viewer) => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        if (this.props.xmjd === 2) {
            const dataSources = this.state.viewer.dataSources
            const len = dataSources.length
            if (len > 0) {
                for (let n = 0; n < len; n++) {
                    dataSources.remove(dataSources.get(0))
                }
            }
            this.noScreen(this.state.viewer)
        } else {
            IndexAction.GetPlot({
                projectId: `XM${info.processInstanceId}`,
                bgcs: info.bgcs,
                layName: 'ZYTK'
            })
                .then((data: any) => {
                    if (data.data === null) {
                        const dataSources = this.state.viewer.dataSources
                        const len = dataSources.length
                        if (len > 0) {
                            for (let n = 0; n < len; n++) {
                                dataSources.remove(dataSources.get(0))
                            }
                        }
                        return
                    }
                    this.state.vectorTileManager.createVectorTileLayer(viewer, data.data, null, (selectedEntity) => {
                        if (selectedEntity) {
                            this.setState({
                                selectedDKFromVectorTile: selectedEntity,
                            })
                        }
                    })
                    this.noScreen(viewer)
                    /* GeoJsonDataSource.load(data.data, {
                        stroke: Color.YELLOW.withAlpha(1),
                        fill: Color.PINK.withAlpha(1),
                        strokeWidth: 10,
                        clampToGround: true,
                        markerSymbol: '?'
                    }).then((ds) => {
                        viewer.dataSources.add(ds)
                        viewer.flyTo(ds, {
                            offset: {
                                heading: CesiumMath.toRadians(0),
                                pitch: CesiumMath.toRadians(-90)
                            }
                        }).then(() => {
                            viewer.flyTo(ds, {
                                offset: {
                                    heading: CesiumMath.toRadians(0),
                                    pitch: CesiumMath.toRadians(-15)
                                },
                                duration: 1.0
                            })
                            this.setState({
                                allEntities: ds.entities.values
                            })
                        })
                    }) */
                    this.setState({
                        geoData: data.josnObj
                    })
                })
        }
    }

    // 地块筛选取消
    plotCancel = () => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        if (info.processInstanceId) {
            IndexAction.PlotCancel({
                projectId: `XM${info.processInstanceId}`,
                bgcs: info.bgcs,
                layName: 'ZYTK'
            }).then((res: any) => {
                if (res.status === 200) {
                    message.success(res.msg)
                    // 删除实体
                    /* const dataSources = this.state.viewer.dataSources
                    const len = dataSources.length
                    if (len > 0) {
                        for (let n = 0; n < len; n++) {
                            dataSources.remove(dataSources.get(0))
                        }
                    } */
                } else {
                    message.error(res.msg)
                }
            })
        } else {
            message.error('请选择地块筛选！')
        }
    }
    // 开始筛选
    reloadEntry = (data) => {
        if (isEmpty(data)) {
            return
        }
        const dataSources = this.state.viewer.dataSources
        const len = dataSources.length
        if (len > 0) {
            for (let n = 0; n < len; n++) {
                dataSources.remove(dataSources.get(0))
            }
        }
        GeoJsonDataSource.load(data, {
            stroke: Color.RED,
            fill: Color.PINK.withAlpha(0),
            strokeWidth: 10,
            clampToGround: true,
            markerSymbol: '?'
        }).then((ds) => {
            this.state.viewer.dataSources.add(ds)
            this.state.viewer.flyTo(ds, {
                offset: {
                    heading: CesiumMath.toRadians(0),
                    pitch: CesiumMath.toRadians(-90)
                }
            }).then(() => {
                this.state.viewer.flyTo(ds, {
                    offset: {
                        heading: CesiumMath.toRadians(0),
                        pitch: CesiumMath.toRadians(-80)
                    },
                    duration: 1.0
                })
                // addMapLabel(this.state.viewer, require('./images/label.png'), `${dev.mapUrl}/arcgis/rest/services/wqxdkwfs/MapServer/exts/GeoJSONServer/GeoJSON?query=&layer=0&bbox=&bboxSR=&f=geojson`, 'WQ_label')
            })
        })
    }

    // 底部状态栏：获取并显示屏幕坐标
    setStateBarContent = (viewer) => {
        const ellipsoid = viewer.scene.globe.ellipsoid
        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        // 鼠标移动事件
        handler.setInputAction((movement) => {
            const windowPosition = movement.endPosition
            if (!defined(windowPosition)) {
                return
            }
            const ray = viewer.scene.camera.getPickRay(windowPosition)
            if (!defined(ray)) {
                return
            }
            const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
            if (!defined(cartesian)) {
                this.setState({
                    screenCoordinates: {
                        lon: '----',
                        lat: '----',
                        elev: '----'
                    }
                })
                return
            }
            const cartographic = ellipsoid.cartesianToCartographic(cartesian)
            let lon: string | number = cartographic.longitude * 180 / Math.PI
            if (lon > -180 || lon < 180) {
                lon = lon.toFixed(3)
            } else {
                lon = '----'
            }
            let lat: string | number = cartographic.latitude * 180 / Math.PI
            if (lat > -90 || lat < 90) {
                lat = lat.toFixed(3)
            } else {
                lat = '----'
            }
            const elev = cartographic.height > 0 ? (cartographic.height).toFixed(2) : '----'
            this.setState({
                screenCoordinates: {
                    lon,
                    lat,
                    elev
                }
            })
        }, ScreenSpaceEventType.MOUSE_MOVE)
    }

    openSpin = () => {
        this.setState({
            spinning: true
        })
    }
    closeSpin = () => {
        this.setState({
            spinning: false
        })
    }

    initSx = () => {
        const id = StorageUtils.getLocalStorage('xmSxId')
        id && this.landScreen(this.state.viewer)
    }

    indexLocation = (viewer) => {
        if (this.props.location.pathname === '/index/map/home') {
            api.getGeoJson(`/arcgis/rest/services/XZQH/MapServer/exts/GeoJSONServer/GeoJSON?query=SJLXDM%3D%2761%27&layer=2&bbox=&bboxSR=&zvalue=AASAS&f=geojson`, null)
                .then((data: any) => {
                    GeoJsonDataSource.load(data.data, {
                        stroke: Color.RED.withAlpha(1),
                        fill: Color.PINK.withAlpha(0),
                        strokeWidth: 10,
                        clampToGround: true,
                        markerSymbol: '?'
                    }).then((ds) => {
                        viewer.dataSources.add(ds)
                        viewer.flyTo(ds, {
                            offset: {
                                heading: CesiumMath.toRadians(0),
                                pitch: CesiumMath.toRadians(-90)
                            }
                        }).then(() => {
                            viewer.flyTo(ds, {
                                offset: {
                                    heading: CesiumMath.toRadians(0),
                                    pitch: CesiumMath.toRadians(-90)
                                },
                                duration: 1.0
                            })
                            viewer.dataSources.remove(ds)
                        })
                    })
                })
        }
    }



    componentDidMount() {
        this.map()

        // this.props.xmScreenId && this.landScreen(this.state.viewer)
    }

    componentDidUpdate(...rest) {
        /* if (this.props.parentXm !== '' && this.props.parentXm !== rest[0].parentXm) {
            this.plotLocation(this.state.viewer)
        } */
        if (this.props.xmName !== '' && this.props.xmName !== rest[0].xmName) {
            this.getXmDk(this.state.viewer)
        }
        if (this.props.dkxh !== '' && this.props.dkxh !== rest[0].dkxh) {
            this.locationOneLand()
        }

        if (this.props.xmScreenId) {
            const { mapStore } = this.props.stores
            if (!mapStore.showPlot) {
                this.state.vectorTileManager.removeVectorTileLayer(this.state.viewer)
                StorageUtils.setLocalStorage('xmSxId', this.props.xmScreenId)
                this.landScreen(this.state.viewer)
                mapStore.onShowPlot(true)
            }
        }
    }
    componentWillUnmount() {
        const { mapStore } = this.props.stores
        mapStore.onShowPlot(false)
        mapStore.onViewerCamera({
            x: this.state.viewerCamera.x,
            y: this.state.viewerCamera.y,
            z: this.state.viewerCamera.z,
            heading: this.state.viewerCamera.heading,
            hitch: this.state.viewerCamera.hitch,
            roll: this.state.viewerCamera.roll
        })
        StorageUtils.delLocalStorage('xmSxId')
    }
    setDkDataPanelShow = (dkDataPanelIsShow) => {
        this.setState({
            dkDataPanelShow: dkDataPanelIsShow
        })
    }
    getLayers = (layers) => {
        this.setState({
            layers
        })
    }
    // 地块选择
    entitySelected = (viewer) => {
        viewer.scene.globe.depthTestAgainstTerrain = false // 关闭深度检测
        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((movement) => {
            // 清除已选中的地块
            if (this.state.selectedDK) {
                viewer.entities.remove(this.state.selectedDK)
                this.setDkDataPanelShow(false) // 关闭地块数据窗体
            }
            if (this.state.selectedDKFromVectorTile) {
                this.state.selectedDKFromVectorTile.polyline.material = Color.GREENYELLOW.withAlpha(1)
                this.state.selectedDKFromVectorTile.selectedEntityFlag = this.selectedEntityFlag++
                this.setState({
                    selectedDK: this.state.selectedDKFromVectorTile,
                    selectedDKFromVectorTile: null,
                    panelLeft: movement.position.x,
                    panelTop: movement.position.y
                })
                this.setDkDataPanelShow(true)
            } else {
                if (this.state.layers) {
                    const layers = this.state.layers
                    let topestLayer: any = null
                    for (let i = 4; i > -1; i--) {
                        if (layers[i].show) {
                            topestLayer = layers[i]
                            break
                        }
                    }
                    if (topestLayer) {
                        this.getEntityByScreenLocation(viewer, topestLayer.layerNum, movement.position)
                    }
                }
                return
            }
        }, ScreenSpaceEventType.LEFT_CLICK)
    }
    /*
     * 通过经纬度及图层获取features
     * @param viewer
     * @param layers 包含图层编号的数组，ex:['XM705001_0_LX']
     * @param cartesian2 由鼠标获取的屏幕坐标mouse.position
     */
    getEntityByScreenLocation = async (viewer, layers, cartesian2) => {
        // 获取点击位置的经纬度
        const ellipsoid = viewer.scene.globe.ellipsoid
        const ray = viewer.scene.camera.getPickRay(cartesian2)
        if (!CesiumDefined(ray)) {
            return
        }
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (!CesiumDefined(cartesian)) {
            return
        }
        const cartographic = ellipsoid.cartesianToCartographic(cartesian)
        const lon = CesiumMath.toDegrees(cartographic.longitude)
        const lat = CesiumMath.toDegrees(cartographic.latitude)
        let successFlag: any // 查询到结果之后返回true，以跳出循环的标识
        for (const layer of layers) {
            for (let i = 0; i < 9; i++) {
                await api.getGeoJson(`/arcgis/rest/services/${layer}/MapServer/exts/GeoJSONServer/GeoJSON?query=&layer=${i}&bbox=${lon - 0.00002}%2C+${lat - 0.00002}%2C${lon + 0.00002}%2C+${lat + 0.00002}&bboxSR=&zvalue=aaa&f=geojson`, null)
                    .then((backData: any) => {
                        const features = backData.data.features
                        if (features.length > 0) {
                            this.setState({
                                selectedDKFromVectorTile: null,
                                panelLeft: cartesian2.x,
                                panelTop: cartesian2.y
                            })
                            this.getFeatureFromFeatures(features)
                            successFlag = true
                        }

                    })
                if (successFlag) {
                    return
                }
            }
        }
    }

    /*
     *  遍历features，获取feature，按点线面的顺序对结果进行过滤
     *  @param features arcgis查询的矢量数据集
     */
    getFeatureFromFeatures = (features) => {
        const pointReg = /Point/i
        const polylineReg = /LineString/i
        const polygonReg = /Polygon/i
        for (const feature of features) {
            const type = feature.geometry.type
            switch (true) {
                case pointReg.test(type):
                    this.setFeature(feature, 'Point')
                    return
                case polylineReg.test(type):
                    this.setFeature(feature, 'Polyline')
                    return
                case polygonReg.test(type):
                    this.setFeature(feature, 'Polygon')
                    return
            }
        }
    }
    /*
     *  加载feature，获取feature的属性，并渲染feature
     *  @param features arcgis查询的矢量数据集
     */
    setFeature = (feature, type) => {
        let entity
        GeoJsonDataSource.load(feature, {
            clampToGround: true,
        }).then((ds) => {
            entity = ds.entities.values[0]
            switch (type) {
                case 'Point':
                    entity.point = new PointGraphics({
                        pixelSize: 10,
                        color: Color.GREENYELLOW.withAlpha(1),
                        heightReference: HeightReference.CLAMP_TO_GROUND
                    })
                    break
                case 'Polyline':
                    entity.polyline.width = 5
                    entity.polyline.material = Color.GREENYELLOW.withAlpha(1)
                    entity.polyline.clampToGround = true
                    break
                case 'Polygon':
                    const pointPositions = entity.polygon.hierarchy._value.positions
                    entity.polygon = undefined
                    if (pointPositions.length > 1) {
                        entity.polyline = new PolylineGraphics({
                            positions: pointPositions,
                            width: 5.0,
                            material: Color.GREENYELLOW.withAlpha(1),
                            // @ts-ignore
                            clampToGround: true
                        })
                    }
                    break
            }
            if (entity) {
                this.state.viewer.entities.add(entity)
                entity.selectedEntityFlag = this.selectedEntityFlag++
                this.setState({
                    selectedDK: entity
                })
                this.setDkDataPanelShow(true)
            }
        })
    }


    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div id='cesiumContainer' style={{ height: window.innerHeight - 70 + 'px' }} />
                <ToolBar viewer={this.state.viewer} type={1} subContract={this.subcontract} />
                {this.props.type && this.props.stores.mapStore.showPlot ? <PlotScreen vectorTileManager={this.state.vectorTileManager} reloadEntry={this.reloadEntry} closeSpin={this.closeSpin} openSpin={this.openSpin} plotCancel={this.plotCancel} viewer={this.state.viewer} /> : null}
                <GisTools viewer={this.state.viewer} />
                <BaseMapSwitcher viewer={this.state.viewer} allLayers={this.state.allLayers} baseLayers={this.state.baseLayers} layer={this.state.layer} changeAllLayer={this.changeAllLayer} />
                {this.state.subcontractFlag ? <LandParcel viewer={this.state.viewer} allEntities={this.state.allEntities} /> : null}
                <Layer viewer={this.state.viewer} getLayers={this.getLayers} />
                <div className='mapStateBar'><span>{`经度：${this.state.screenCoordinates.lon}   纬度：${this.state.screenCoordinates.lat}   高程：${this.state.screenCoordinates.elev}`}</span></div>
                {this.state.dkDataPanelShow ? <SelectFeature selectedDK={this.state.selectedDK} setDkDataPanelShow={this.setDkDataPanelShow} panelLeft={this.state.panelLeft} panelTop={this.state.panelTop} /> : null}
                {this.state.spinning ? <LoadingTip title='正在进行地块筛选，请稍后......' /> : null}
            </div >

        )
    }
}
export default withRouter(MainMap)
