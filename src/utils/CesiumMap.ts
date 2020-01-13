/*
 * @Description: map
 * @version: 1.0
 * @Author: ny
 * @Date: 2019-12-04 14:17:31
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-20 11:09:49
 */
import * as Cesium from 'cesium'
/* import createDefaultTerrainProviderViewModels from 'cesium/Source/Widgets/BaseLayerPicker/createDefaultTerrainProviderViewModels'
import createDefaultImageryProviderViewModels from 'cesium/Source/Widgets/BaseLayerPicker/createDefaultImageryProviderViewModels' */
function CesiumMap(this: any, mapUrl) {
    // this.worldTerrain = createWorldTerrain({
    //     requestWaterMask: true,
    //     requestVertexNormals: true,
    //     // height: 0
    // })
    const terrainProvider = new Cesium.CesiumTerrainProvider({ // 加载火星gis地形
        url: 'http://data.marsgis.cn/terrain'
    })
    this.option = {
        geocoder: false, // 是否显示地名查找控件
        timeline: false, // 是否显示时间线控件
        // scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        animation: false, // 是否显示动画控件
        infoBox: false, // 是否显示点击要素之后显示的信息
        sceneModePicker: false, // 是否显示3D按钮
        selectionIndicator: false, // 是否显示选取指示器组件
        vrButton: false,
        // terrainProvider: this.worldTerrain, // 世界地形
        terrainProvider, // 火星gis地形
        baseLayerPicker: true, // 是否显示图层选择控件
        shouldAnimate : true,
        clampToGround: true, // 是否贴地
        navigationHelpButton: false, // 是否显示帮助信息控件
        navigationInstructionsInitiallyVisible: false, // 是否显示帮助信息展开面板
        fullscreenButton: false, // 是否显示全屏按钮
        // homeButton: false,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: mapUrl
        }), // 图像图层提供者
    }
    this.layer = this.option.imageryProvider
}
CesiumMap.prototype.init = function(id) {
    return new Cesium.Viewer(id, this.option)
}


export default CesiumMap