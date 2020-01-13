import React, { Component } from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import CesiumCreater from '../CesiumTools/CesiumCreater'
import MultipleScreen from '../CesiumTools/MultipleScreen'
import MapManager from '../CesiumTools/MapManager'
import 'cesium/Build/Cesium/Widgets/widgets.css'
interface IState {

}
export default class ThreeScreen extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }

    componentDidMount () {
        // 初始化地球
        const map = new CesiumCreater()
        const viewer1 = map.initViewer('cesiumContainer1', 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer2 = map.initViewer('cesiumContainer2', 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const viewer3 = map.initViewer('cesiumContainer3', 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        const mapManager1 = new MapManager(viewer1)
        const mapManager2 = new MapManager(viewer2)
        const mapManager3 = new MapManager(viewer3)
        map.initCameraToSX(viewer1)
        map.initCameraToSX(viewer2)
        map.initCameraToSX(viewer3)
        mapManager1.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        mapManager2.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        mapManager3.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        // 创建多屏对象
        const multipleScreen = new MultipleScreen()
        // 设置三屏操作功能
        multipleScreen.setThreeScreenCopy(viewer1, viewer2, viewer3)
    }

    // handleMouseOver = (e) => {
    //     e.nativeEvent.stopImmediatePropagation()
    //     this.setState({
    //         stageStyle: {display: 'block'}
    //     })
    // }
    //
    // handleMouseOut = (e) => {
    //     e.nativeEvent.stopImmediatePropagation()
    //     this.setState({
    //         stageStyle: {display: 'none'}
    //     })
    // }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='threeMapPanel'>
                    <div className='threeMapContainer'>
                        <div id='cesiumContainer1' className='cesiumContainerInThree'/>
                    </div>
                    <div className='threeMapContainer'>
                        <div id='cesiumContainer2' className='cesiumContainerInThree'/>
                    </div>
                    <div className='threeMapContainer'>
                        <div id='cesiumContainer3' className='cesiumContainerInThree'/>
                    </div>
                </div>
            )
    }
}
