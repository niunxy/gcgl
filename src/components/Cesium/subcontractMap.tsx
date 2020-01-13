import * as React from 'react'
import {
    // Menu,
    // Icon,
    message
} from 'antd'
import CesiumMap from '../../utils/CesiumMap'
import ToolBar from './toolBar'
import CesiumNavigation from 'cesium-navigation-es6'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {
    Cartesian3,
    Color,
    GeoJsonDataSource,
    Math as CesiumMath,
    ArcGisMapServerImageryProvider,
    HeightReference,
    ImageryLayer,
    UrlTemplateImageryProvider,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    defined,
    GeographicTilingScheme,
    Rectangle,
    WebMapTileServiceImageryProvider,
    Camera,
    PolylineGraphics
} from 'cesium'
// import Cartographic from 'cesium/Source/Core/Cartographic'
import { withRouter, RouteComponentProps } from 'react-router-dom'
// import { getImageryLayers } from './layerLib'
import Layer from './layer'
import BaseMapSwitcher from './BaseMapSwitcher'
import LandParcel from './landParcel'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import IndexAction from '@api/IndexAction'
import { calcCenterByPositions } from './tool'
import GisTools from './gisTools'
import StorageUtils from '@utils/StorageUtil'
import { shouldCanParcel } from '@utils/utils'

import './index.less'
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
    subId?: any,
    xmFbId?: any,
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
    contractorList: any,
    screenCoordinates: IDegreePosition,
    layers: any
}
interface IDegreePosition {
    lon: string,
    lat: string,
    elev?: string
}
@inject('stores')
@observer
class SubcontractMap extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
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
            contractorList: [],
            screenCoordinates: {
                lon: '----',
                lat: '----',
                elev: '----'
            },
            layers: null
        }
    }
    // 主方法
    map = () => {
        Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(90, -20, 110, 90)
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
            StorageUtils.getLocalStorage('xmFbId') !== '' && this.initFb()
        })
        // this.setHomeButton(viewer)

        const allLayers = viewer.imageryLayers._layers

        this.setState({
            allLayers
        })
        this.setStateBarContent(viewer) // 底部经纬度状态栏
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

    /* setHomeButton = (viewer) => {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
            e.cancel = true
            // 定位至陕西省视图
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(109.16, 35.80, 1500000.0)
            })
        })
    } */

    subcontract = () => {
        this.setState({
            screenFlag: false,
            subcontractFlag: !this.state.subcontractFlag
        })
    }

    // 分包初始化
    getPlotSub = (viewer) => {
        const dataSources = this.state.viewer.dataSources
        const len = dataSources.length
        if (len > 0) {
            for (let n = 0; n < len; n++) {
                dataSources.remove(dataSources.get(0))
            }
        }
        const { processInstanceId, bgcs } = this.props.subId
        if (processInstanceId) {
            IndexAction.GetPlotSub({
                projectId: `XM${processInstanceId}`,
                bgcs,
                layName: 'ZYTK'
            }).then((res: any) => {
                if (res.status === 200) {
                    res.josnObj && GeoJsonDataSource.load(res.josnObj, {
                        // stroke: Color.RED.withAlpha(1),
                        // fill: Color.PINK.withAlpha(0),
                        // strokeWidth: 10,
                        // clampToGround: true,
                        // markerSymbol: '?'
                    }).then((ds) => {
                        const entities = ds.entities.values
                        for (let o = 0; o < entities.length; o++) {
                            const r: any = entities[o]
                            const pointPositions = r.polygon.hierarchy._value.positions
                            r.polyline = new PolylineGraphics()
                            r.nameID = o   // 给每条线添加一个编号，方便之后对线修改样式
                            r.polyline.positions = pointPositions
                            r.polyline.width = 2  // 添加默认样式
                            r.polyline.clampToGround = true
                            r.polyline.material = Color.RED
                            r.polygon = undefined
                        }
                        this.state.viewer.dataSources.add(ds)
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
                            const obj = JSON.parse(JSON.stringify(res.josnObj))
                            const features = this.filterLabel(obj.features)
                            obj.features = features
                            this.loadLabel(obj)
                        })
                    })
                } else {
                    message.warning(res.msg)
                }
            })
        }
    }

    filterLabel = (data) => {
        const result = data.filter((item) => {
            const arr: any = []
            this.state.contractorList.forEach((value) => {
                arr.push(value.id)
            })
            return arr.indexOf(item.properties.SSSGD) > -1
        })
        return result
    }

    loadLabel = (data) => {

        const shpData = GeoJsonDataSource.load(data, {
            markerSize: 0,
            clampToGround: true,
        })
        shpData.then((dataSource) => {
            // dataSource.name = layerName
            this.state.viewer.dataSources.add(dataSource)
            const entities = dataSource.entities.values
            entities.forEach((entity: any) => {
                entity.position = calcCenterByPositions(entity.polygon.hierarchy._value.positions)
                const labelText: any = this.state.contractorList.find((value: any) => {
                    return value.id === entity._properties.SSSGD._value
                })
                entity.label = {

                    text: labelText.username,
                    color: Color.fromCssColorString('#f00'),
                    font: 'normal 20px MicroSoft YaHei',
                    showBackground: false,
                    // scale: 0.4,
                    heightReference: HeightReference.CLAMP_TO_GROUND,
                    /*horizontalOrigin : Cesium.HorizontalOrigin.LEFT_CLICK,*/
                    /*verticalOrigin : Cesium.VerticalOrigin.BOTTOM,*/
                    // distanceDisplayCondition: new DistanceDisplayCondition(0, 500),
                    /*disableDepthTestDistance : 1000*/

                    /*Represents a scalar value's lower and upper bound at a near distance and far distance in eye space.
                    Name    Type    Default Description
                    near    Number  0.0 optional The lower bound of the camera range.
                        nearValue   Number  0.0 optional The value at the lower bound of the camera range.
                    far Number  1.0 optional The upper bound of the camera range.
                        farValue    Number  0.0 optional The value at the upper bound of the camera range.*/
                    // scaleByDistance: new NearFarScalar(100, 2, 500, 0.0),
                }
            })
        })
    }
    // 底部状态栏：获取并显示屏幕坐标
    setStateBarContent = (viewer) => {
        console.log(viewer)
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
    getContractor = () => {
        IndexAction.PlotContractor(null).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    contractorList: res.data
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    initFb = () => {
        const id = StorageUtils.getLocalStorage('xmFbId')
        id && this.getPlotSub(this.state.viewer)
    }

    componentDidMount() {
        this.map()
        this.getContractor()
    }

    componentDidUpdate(...rest) {
        if (this.props.xmFbId !== '' && this.props.xmFbId !== rest[0].xmFbId) {
            this.getPlotSub(this.state.viewer)
            StorageUtils.setLocalStorage('xmFbId', this.props.xmFbId)
        }
    }
    componentWillUnmount() {
        const { mapStore } = this.props.stores
        mapStore.onShowPlot(false)
        StorageUtils.delLocalStorage('xmFbId')
    }
    getLayers = (layers) => {
        this.setState({
            layers
        })
    }
    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div id='cesiumContainer' style={{ height: window.innerHeight - 70 + 'px' }} />
                <ToolBar viewer={this.state.viewer} type={1} subContract={this.subcontract} />
                <GisTools viewer={this.state.viewer} />
                <BaseMapSwitcher viewer={this.state.viewer} allLayers={this.state.allLayers} baseLayers={this.state.baseLayers} layer={this.state.layer} changeAllLayer={this.changeAllLayer} />
                <LandParcel viewer={this.state.viewer} allEntities={this.state.allEntities} />
                {
                    <Layer viewer={this.state.viewer} getLayers={this.getLayers} />
                }
                <div className='mapStateBar'><span>{`经度：${this.state.screenCoordinates.lon}  纬度：${this.state.screenCoordinates.lat}  高程：${this.state.screenCoordinates.elev}`}</span></div>
            </div>

        )
    }
}
export default withRouter(SubcontractMap)