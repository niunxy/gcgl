import * as Cesium from 'cesium'
function ModelManager(this: any) {
    const that = this
    that.loadSpeed = 0.05
    that.pauseSpeed = 0
    that.playSpeed = 1
    that.modelUp = 20
    that.modelDown = -20
    that.gradeModel = (viewer, modelName, modelLoadTimeInTimeline) => {
        const primitives = viewer.scene.primitives
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives.get(i)
            if (primitive.name && primitive.name === modelName) {
                primitive.show = true
                const tileset = primitive
                let mm = -15.2
                if (modelLoadTimeInTimeline) {
                    that.loadSpeed = (15.2 - 13.5) / parseFloat(modelLoadTimeInTimeline) * 100
                }
                // @ts-ignore
                tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
                    planes : [
                        // @ts-ignore
                        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, 100), mm)
                    ],
                })
                const clipModel = setInterval(() => {
                    // @ts-ignore
                    const clippingPlanes = new Cesium.ClippingPlaneCollection({
                        planes : [
                            // @ts-ignore
                            new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, 100), mm)
                        ],
                    })
                    if (mm > -13.5) {
                        tileset._modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.fromArray([0, 0, that.modelDown]))
                        clearInterval(clipModel)
                    } else {
                        mm += that.loadSpeed * that.playSpeed
                        tileset.clippingPlanes = clippingPlanes
                    }
                }, 100)
                tileset._modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.fromArray([0, 0, that.modelUp]))
                return 0 // 如果模型已经存在返回0
            }
        }
        return 1 // 如果模型不存在返回1
    }
    // 跳转至该模型
    that.flyToModel = (viewer, modelName, viewBack) => {
        const primitives = viewer.scene.primitives
        let viewRange = 1000
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives.get(i)
            if (primitive.name && primitive.name === modelName) {
                if (viewBack) {
                    viewRange = 2600
                } else {
                    viewRange = 1000
                }
                viewer.flyTo(primitive, {
                    duration: 2.0,
                    offset: {
                        heading: Cesium.Math.toRadians(0), // 方向
                        pitch: Cesium.Math.toRadians(-90), // 倾斜角度
                        range: viewRange
                    }
                })
                break
            }
        }
    }
    that.pauseAnimation = () => {
        that.pauseSpeed = that.loadSpeed
        that.loadSpeed = 0
    }
    that.continueAnimation = () => {
        that.loadSpeed = that.pauseSpeed
    }
}

export default ModelManager