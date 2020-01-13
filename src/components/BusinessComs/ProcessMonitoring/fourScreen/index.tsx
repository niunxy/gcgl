import React, { Component } from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import CesiumCreater from '../CesiumTools/CesiumCreater'
import MultipleScreen from '../CesiumTools/MultipleScreen'
import MapManager from '../CesiumTools/MapManager'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {getProjectStageLayers} from '@components/Cesium/layerLib'
import SelectFeature from '../CesiumTools/toolComponents/selectFeature'
import {
    Color,
    defined as CesiumDefined,
    GeoJsonDataSource,
    HeightReference,
    Math as CesiumMath,
    PointGraphics, PolylineGraphics
} from 'cesium'
import api from '@utils/HttpClient'
interface IState {
    panelLeft: number,
    panelTop: number,
    dataPanelShow: boolean
    selectedEntity: any
}
export default class FourScreen extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            panelLeft: 0,
            panelTop: 0,
            dataPanelShow: false,
            selectedEntity: {
                viewer1: null,
                viewer2: null,
                viewer3: null,
                viewer4: null
            }
        }
    }
    selectedEntityFlag = 0
    componentDidMount () {
        // 初始化地球
        const map = new CesiumCreater()
        const viewer1 = map.initViewer('cesiumContainer1', 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer2 = map.initViewer('cesiumContainer2', 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer3 = map.initViewer('cesiumContainer3', 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer4 = map.initViewer('cesiumContainer4', 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const mapManager1 = new MapManager(viewer1)
        const mapManager2 = new MapManager(viewer2)
        const mapManager3 = new MapManager(viewer3)
        const mapManager4 = new MapManager(viewer4)
        let layers1 = 1
        let layers2 = 1
        let layers3 = 1
        let layers4 = 1
        viewer1.imageryLayers.removeAll() // 删除viewer1、viewer2默认图层并加载esri底图
        viewer2.imageryLayers.removeAll()
        map.loadEsri(viewer1)
        map.loadEsri(viewer2)
        map.initCameraToSX(viewer1) // 跳转至陕西省
        map.initCameraToSX(viewer2)
        map.initCameraToSX(viewer3)
        map.initCameraToSX(viewer4)
        mapManager1.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        mapManager2.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        mapManager3.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        mapManager4.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        // 创建多屏对象
        const multipleScreen = new MultipleScreen()
        // 同步四屏视角
        multipleScreen.setFourScreenCopy(viewer1, viewer2, viewer3, viewer4)
        // 加载不同阶段底图
        getProjectStageLayers(viewer1, 'lx', true, (layers) => {layers1 = layers})
        getProjectStageLayers(viewer2, 'sj', true, (layers) => {layers2 = layers})
        getProjectStageLayers(viewer3, 'jg', true, (layers) => {layers3 = layers})
        getProjectStageLayers(viewer4, 'fh', true, (layers) => {layers4 = layers})
        // 创建点击事件
        map.createMapClick(viewer1, (wp) => {
            this.entitySelected(viewer1, layers1, wp, 'viewer1')
            this.entitySelected(viewer2, layers2, wp, 'viewer2')
            this.entitySelected(viewer3, layers3, wp, 'viewer3')
            this.entitySelected(viewer4, layers4, wp, 'viewer4')
        })
        map.createMapClick(viewer2, (wp) => {
            this.entitySelected(viewer1, layers1, wp, 'viewer1')
            this.entitySelected(viewer2, layers2, wp, 'viewer2')
            this.entitySelected(viewer3, layers3, wp, 'viewer3')
            this.entitySelected(viewer4, layers4, wp, 'viewer4')
        })
        map.createMapClick(viewer3, (wp) => {
            this.entitySelected(viewer1, layers1, wp, 'viewer1')
            this.entitySelected(viewer2, layers2, wp, 'viewer2')
            this.entitySelected(viewer3, layers3, wp, 'viewer3')
            this.entitySelected(viewer4, layers4, wp, 'viewer4')
        })
        map.createMapClick(viewer4, (wp) => {
            this.entitySelected(viewer1, layers1, wp, 'viewer1')
            this.entitySelected(viewer2, layers2, wp, 'viewer2')
            this.entitySelected(viewer3, layers3, wp, 'viewer3')
            this.entitySelected(viewer4, layers4, wp, 'viewer4')
        })
    }

    entitySelected = (viewer, layers, wp, parentName) => {
            // 清除已选中的地块
            if (this.state.selectedEntity[parentName]) {
                viewer.entities.remove(this.state.selectedEntity[parentName])
                this.state.selectedEntity[parentName] = null
                this.setDataPanelShow(false) // 关闭地块数据窗体
            }
            if (layers) {
                this.getEntityByScreenLocation(viewer, layers, wp, parentName)
            }
    }
    getEntityByScreenLocation = async (viewer, layers, cartesian2, parentName) => {
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
                                panelLeft: cartesian2.x,
                                panelTop: cartesian2.y
                            })
                            this.getFeatureFromFeatures(viewer, features, parentName)
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
    getFeatureFromFeatures = (viewer, features, parentName) => {
        const pointReg = /Point/i
        const polylineReg = /LineString/i
        const polygonReg = /Polygon/i
        for (const feature of features) {
            const type = feature.geometry.type
            switch (true) {
                case pointReg.test(type) :
                    this.setFeature(viewer, feature, 'Point', parentName)
                    return
                case polylineReg.test(type) :
                    this.setFeature(viewer, feature, 'Polyline', parentName)
                    return
                case polygonReg.test(type) :
                    this.setFeature(viewer, feature, 'Polygon', parentName)
                    return
            }
        }
    }
    /*
     *  加载feature，获取feature的属性，并渲染feature
     *  @param features arcgis查询的矢量数据集
     */
    setFeature = (viewer, feature, type, parentName) => {
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
                viewer.entities.add(entity)
                entity.selectedEntityFlag = this.selectedEntityFlag++
                const selectedEntity = this.state.selectedEntity
                selectedEntity[parentName] = entity
                this.setState({
                    selectedEntity
                })
                this.setDataPanelShow(true)
            }
        })
    }




    // 设置数据面板的开关
    setDataPanelShow = (dataPanelIsShow) => {
        this.setState({
            dataPanelShow: dataPanelIsShow
        })
    }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='fourMapPanel'>
                    <div className='fourMapContainer'>
                        <span className='fourMapContainerTile'>立项图</span>
                        <div id='cesiumContainer1' className='fourContainerInFour'/>
                        {this.state.dataPanelShow ? <SelectFeature selectedFeature={this.state.selectedEntity.viewer1} setDataPanelShow={this.setDataPanelShow} panelLeft={this.state.panelLeft} panelTop={this.state.panelTop} parentDomId={'cesiumContainer1'}/> : null}
                    </div>
                    <div className='fourMapContainer'>
                        <span className='fourMapContainerTile'>设计图</span>
                        <div id='cesiumContainer2' className='fourContainerInFour'/>
                        {this.state.dataPanelShow ? <SelectFeature selectedFeature={this.state.selectedEntity.viewer2} setDataPanelShow={this.setDataPanelShow} panelLeft={this.state.panelLeft} panelTop={this.state.panelTop} parentDomId={'cesiumContainer2'}/> : null}
                    </div>
                    <div className='fourMapContainer'>
                        <span className='fourMapContainerTile'>竣工图</span>
                        <div id='cesiumContainer3' className='fourContainerInFour'/>
                        {this.state.dataPanelShow ? <SelectFeature selectedFeature={this.state.selectedEntity.viewer3} setDataPanelShow={this.setDataPanelShow} panelLeft={this.state.panelLeft} panelTop={this.state.panelTop} parentDomId={'cesiumContainer3'}/> : null}
                    </div>
                    <div className='fourMapContainer'>
                        <span className='fourMapContainerTile'>复核图</span>
                        <div id='cesiumContainer4' className='fourContainerInFour'/>
                        {this.state.dataPanelShow ? <SelectFeature selectedFeature={this.state.selectedEntity.viewer4} setDataPanelShow={this.setDataPanelShow} panelLeft={this.state.panelLeft} panelTop={this.state.panelTop} parentDomId={'cesiumContainer4'}/> : null}
                    </div>
                </div>
            )
    }
}
