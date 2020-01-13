/*
* Create by Roman
* Description: czml文件加载管理
*/
import * as Cesium from 'cesium'
function CZMLManager() {
    // @ts-ignore
    this.init.apply(this, arguments)
}
CZMLManager.prototype = {
    dataSource: null,
    multiplier: 0,
    removeClockListener: null,
    roadEntity: null,
    viewer: null,
    init(viewer) {
        this.viewer = viewer
    },
    loadCZML(url, entityId, beforeCb, afterCb) {
        const that = this
        const viewer = that.viewer
        that.removeCZML()
        that.dataSource = new Cesium.CzmlDataSource()
        viewer.dataSources.add(that.dataSource)
        viewer.clock.canAnimate = false
        viewer.clock.shouldAnimate = false
        that.dataSource.load(url).then( () => {
            viewer.trackedEntity = that.dataSource.entities.getById(entityId)
            viewer.clock.currentTime = viewer.clock.startTime
            viewer.clock.clockRange = Cesium.ClockRange.CLAMPED// CLAMPED：达到终止时间后停止 LOOP_STOP：达到终止时间后重新循环 UNBOUNDED：达到终止时间后继续读秒
            viewer.clock.multiplier = 0// 时间轴速度
            viewer.clock.canAnimate = true
            viewer.clock.shouldAnimate = true
            const czmlLoadTimeLength = viewer.clock.stopTime.secondsOfDay - viewer.clock.startTime.secondsOfDay
            beforeCb(czmlLoadTimeLength)
            that.removeClockListener = viewer.clock.onStop.addEventListener(() => {
                that.endCzmlFunction()
                afterCb()// 将时间长度传入
            }, that)
        })
    },
    // czml加载完成后执行的方法
    endCzmlFunction() {
        const viewer = this.viewer
        if (this.removeClockListener) {
            this.removeClockListener()
            this.removeClockListener = null
        }
        viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this.removeCZML()
    },
    removeCZML() {
        const that = this
        const viewer = that.viewer
        if (viewer.trackedEntity) {
            that.dataSource.entities.remove(viewer.trackedEntity)
            viewer.trackedEntity = undefined
            const road = that.dataSource.entities.getById('Polyline')
            if (!road) {
                return
            }
            road.polyline.width = 18
            // @ts-ignore
            road.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.GHOSTWHITE ,
                    outlineColor: Cesium.Color.GHOSTWHITE,
                    outlineWidth: 3
            })
            road.polyline.clampToGround = true
            that.roadEntity = viewer.entities.add(road)
            viewer.dataSources.remove(that.dataSource)
        }
    },
    // 暂停
    pauseAnimation() {
        const that = this
        const viewer = that.viewer
        that.multiplier = viewer.clock.multiplier
        viewer.clock.multiplier = 0
    },
    // 继续
    continueAnimation() {
        const that = this
        const viewer = that.viewer
        if (!viewer.clock.multiplier) {
            viewer.clock.multiplier = that.multiplier
        }
    }
}
export default CZMLManager