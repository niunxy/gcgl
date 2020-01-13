import React, { Component } from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import CesiumCreater from '../CesiumTools/CesiumCreater'
import MultipleScreen from '../CesiumTools/MultipleScreen'
import MapManager from '../CesiumTools/MapManager'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import MultiMediaPanel from './multiMediaPanel'
import * as Cesium from 'cesium'

interface IState {
    multiMediaPanelShowController: any,
    panelContentPath1: any,
    panelContentPath2: any,
    panelContentPath3: any,
    mediaPanelState: string
}
export default class Construction extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            multiMediaPanelShowController : {
                viewer1: false,
                viewer2: false,
                viewer3: false
            },
            panelContentPath1 : {
                pictures: [],
                videos: [],
                audios: [],
            },
            panelContentPath2 : {
                pictures: [],
                videos: [],
                audios: [],
            },
            panelContentPath3 : {
                pictures: [],
                videos: [],
                audios: [],
            },
            mediaPanelState: 'picture'
        }
    }
    selectedEntities: any = new Array(3) // 存储已选中的entity
    viewers: any = new Array(3) // 用于存储视图
    componentDidMount () {
        // 初始化地球
        const map = new CesiumCreater()
        const viewer1 = map.initViewer('cesiumContainer1', 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer2 = map.initViewer('cesiumContainer2', 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer3 = map.initViewer('cesiumContainer3', 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        this.viewers[0] = viewer1
        this.viewers[1] = viewer2
        this.viewers[2] = viewer3
        // 创建多屏对象
        const multipleScreen = new MultipleScreen()
        // 设置三屏
        multipleScreen.setThreeScreenCopy(viewer1, viewer2, viewer3)
        this.setViewer(viewer1, map)
        this.setViewer(viewer2, map)
        this.setViewer(viewer3, map)
    }

    // 设置各视图属性面板的开关
    setPanelShowByArg = (panelName, isShow) => {
        const multiMediaPanelShowController = this.state.multiMediaPanelShowController
        switch (panelName) {
            case 'viewer1':
                multiMediaPanelShowController.viewer1 = isShow
                if (!isShow) {
                    this.viewers[1].entities.remove(this.selectedEntities[1])
                    this.selectedEntities[1] = null
                }
                break
            case 'viewer2':
                multiMediaPanelShowController.viewer2 = isShow
                if (!isShow) {
                    this.viewers[2].entities.remove(this.selectedEntities[2])
                    this.selectedEntities[2] = null
                }
                break
            case 'viewer3':
                multiMediaPanelShowController.viewer3 = isShow
                if (!isShow) {
                    this.viewers[3].entities.remove(this.selectedEntities[3])
                    this.selectedEntities[3] = null
                }
                break
            case 'all':
                multiMediaPanelShowController.viewer1 = isShow
                multiMediaPanelShowController.viewer2 = isShow
                multiMediaPanelShowController.viewer3 = isShow
                if (!isShow) {
                    this.selectedEntities.forEach((selectedEntity, i) => {
                        this.viewers[i].entities.remove(selectedEntity)
                        this.selectedEntities[i] = null
                    })
                }
                break
        }
        this.setState({
            multiMediaPanelShowController : {
                viewer1 : multiMediaPanelShowController.viewer1,
                viewer2 : multiMediaPanelShowController.viewer2,
                viewer3 : multiMediaPanelShowController.viewer3,
            }
        })
    }

    // 设置数据展示窗体的选中状态
    setMediaPanelState = (str) => {
        this.setState({
            mediaPanelState: str
        })
    }

    // 设置三屏的viewer
    setViewer = (viewer, map) => {
        const mapManager = new MapManager(viewer)
        map.loadLocalTerrain(viewer, 'http://data.marsgis.cn/terrain') // 加载地形
        map.initCameraToSX(viewer) // 定位至陕西
        mapManager.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        // 加载json数据
        const option = {
            markerSize: 40,
            markerSymbol: '?',
            markerColor: Cesium.Color.RED,
            clampToGround: true
        }
        map.loadGeoJson('http://192.168.5.112:8010/test.geojson', option, (ds) => {
            viewer.dataSources.add(ds)
        })
        // 创建点击事件,每个视图同时创建删除点位
        map.createMapClickToEntity(viewer, (currentEntity) => {
            this.selectedEntities.forEach((selectedEntity, i) => {
                this.viewers[i].entities.remove(selectedEntity)
                this.selectedEntities[i] = null
            })
            if (currentEntity) {
                const entityOption = {
                    position: currentEntity.position,
                    point: {
                        color: Cesium.Color.RED,
                        pixelSize: 20,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    },
                    properties: currentEntity.properties
                }
                const entity1 = this.viewers[0].entities.add(entityOption)
                const entity2 = this.viewers[1].entities.add(entityOption)
                const entity3 = this.viewers[2].entities.add(entityOption)
                this.selectedEntities[0] = entity1
                this.selectedEntities[1] = entity2
                this.selectedEntities[2] = entity3
                this.setPanelContentPath(this.selectedEntities)
                this.setPanelShowByArg('all', true)
            } else {
                this.setPanelShowByArg('all', false)
            }
        })
    }

    setPanelContentPath = (selectedEntities) => {
        const panelContentPath1 = this.state.panelContentPath1
        const panelContentPath2 = this.state.panelContentPath2
        const panelContentPath3 = this.state.panelContentPath3
        panelContentPath1.pictures = selectedEntities[0].properties.pictures._value
        panelContentPath1.videos = selectedEntities[0].properties.videos._value
        panelContentPath1.audios = selectedEntities[0].properties.audios._value
        panelContentPath2.pictures = selectedEntities[1].properties.pictures._value
        panelContentPath2.videos = selectedEntities[1].properties.videos._value
        panelContentPath2.audios = selectedEntities[1].properties.audios._value
        panelContentPath3.pictures = selectedEntities[2].properties.pictures._value
        panelContentPath3.videos = selectedEntities[2].properties.videos._value
        panelContentPath3.audios = selectedEntities[2].properties.audios._value
        this.setState({
            panelContentPath1: Object.create(panelContentPath1),
            panelContentPath2: Object.create(panelContentPath2),
            panelContentPath3: Object.create(panelContentPath3)
        })
    }
    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='threeMapPanel'>
                    <div className='threeMapContainer'>
                        <span className='threeMapContainerLabel'>施工前</span>
                        <div id='cesiumContainer1' className='cesiumContainerInThree'/>
                        <MultiMediaPanel panelContentPath = {this.state.panelContentPath1} setShow={this.state.multiMediaPanelShowController.viewer1} setShowFunc={this.setPanelShowByArg} myParent={'viewer1'} setMediaPanelState={this.setMediaPanelState} mediaPanelState={this.state.mediaPanelState}/>
                    </div>
                    <div className='threeMapContainer'>
                        <span className='threeMapContainerLabel'>施工中</span>
                        <div id='cesiumContainer2' className='cesiumContainerInThree'/>
                        <MultiMediaPanel panelContentPath = {this.state.panelContentPath2} setShow={this.state.multiMediaPanelShowController.viewer2} setShowFunc={this.setPanelShowByArg} myParent={'viewer2'} setMediaPanelState={this.setMediaPanelState} mediaPanelState={this.state.mediaPanelState}/>
                    </div>
                    <div className='threeMapContainer'>
                        <span className='threeMapContainerLabel'>施工后</span>
                        <div id='cesiumContainer3' className='cesiumContainerInThree'/>
                        <MultiMediaPanel panelContentPath = {this.state.panelContentPath3}  setShow={this.state.multiMediaPanelShowController.viewer3} setShowFunc={this.setPanelShowByArg} myParent={'viewer3'} setMediaPanelState={this.setMediaPanelState} mediaPanelState={this.state.mediaPanelState}/>
                    </div>
                </div>
            )
    }
}
