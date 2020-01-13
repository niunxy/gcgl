import {
    BoundingSphere,
    CallbackProperty,
    Cartesian2,
    Cartesian3,
    CircleOutlineGeometry,
    Color,
    defined,
    Ellipsoid,
    EllipsoidGeodesic,
    GeoJsonDataSource,
    HeightReference,
    HorizontalOrigin,
    LabelStyle,
    Math as CesiumMath,
    NearFarScalar,
    Rectangle,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    VerticalOrigin
} from 'cesium'
import api from '@utils/HttpClient'
import mapMarker from './images/map-marker.png'
import Cartographic from 'cesium/Source/Core/Cartographic'

/**
 * @author ny+
 * @desc 测量距离
 */
let handler
export const measureDistanceTool = (viewer, callback) => { // 测距
    clearHandler()
    let positions: any[] = []
    let distance
    const entities: any[] = []
    let poly
    viewer.scene.globe.depthTestAgainstTerrain = false // 测量时关闭深度检测
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement) => {
        const wp = movement.position
        const cartesian = getCartesian(viewer, wp)
        if (!defined(cartesian)) {
            return
        }
        if (positions.length === 0) {
            positions.push(cartesian)
        }
        positions.push(cartesian)
        const cartographic = Cartographic.fromCartesian(cartesian)
        // console.log(distance + ",lng:" + cartographic.longitude/Math.PI*180.0)
        const floatingPoint = viewer.entities.add({
            position: Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, cartographic.height),
            // position:positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true,
            },
            label: {
                text: positions.length > 2 ? distance + '米' : '',
                font: '18px sans-serif',
                fillColor: Color.GOLD,
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(20, -20),
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true
            }
        })
        entities.push(floatingPoint)
    }, ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement: any) => {
        if (positions.length < 2) { return }
        const wp = movement.endPosition
        const cartesian = getCartesian(viewer, wp)
        if (!defined(cartesian)) {
            return
        }
        // const cartesian = viewer.scene.pickPosition(movement.endPosition)
        // cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
        positions.pop()
        positions.push(cartesian)
        if (positions.length === 2) {
            poly = viewer.entities.add({
                polyline: {
                    positions: new CallbackProperty(() => {
                        return positions
                    }, false),
                    material: Color.CHARTREUSE,
                    width: 2,
                    heightReference: HeightReference.CLAMP_TO_GROUND,
                    clampToGround: true,
                }
            })
            entities.push(poly)
        }

        distance = getDistance(positions)
        // console.log("distance: " + distance)
        // tooltip.innerHTML='<p>' + distance + '米</p>'
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((movement) => {
        // positions.pop()
        handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
        handler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        const cartesian = viewer.scene.pickPosition(movement.position)
        if (positions.length === 0) {
            positions.push(cartesian)
        }
        positions.push(cartesian)
        const cartographic = Cartographic.fromCartesian(cartesian)
        const floatingPoint = viewer.entities.add({
            position: Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, cartographic.height),
        })
        entities.push(floatingPoint)
        // const position: any[] = []
        /* for (const i of positions) {
            position.push(positions[i])
        } */
        if (poly !== null) {
            poly.polyline.positions = positions
        }
        poly = null

        positions = []
        distance = 0.0

        if (handler !== null) {
            handler.destroy()
            handler = null
        }
        callback(entities)
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // function clearHandler() {
    //     if (handler !== null) {
    //         handler.destroy()
    //         handler = null
    //     }
    // }
}
const getDistance = (positions) => {
    let distance = 0
    for (let i = 0; i < positions.length - 1; i++) {
        const point1cartographic = Cartographic.fromCartesian(positions[i])
        const point2cartographic = Cartographic.fromCartesian(positions[i + 1])
        // 根据经纬度计算出距离
        const geodesic = new EllipsoidGeodesic()
        geodesic.setEndPoints(point1cartographic, point2cartographic)
        let s = geodesic.surfaceDistance
        // console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)))
        // 返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
        distance = distance + s
    }
    return distance.toFixed(2)
}

/**
 * @author ny
 * @desc 测量面积
 */
export const measureSurfaceTool = (viewer, callback) => { // 测面
    clearHandler()
    let sPositions: any[] = []
    let area
    const sEntities: any[] = []
    let polyline: any = null
    let polygon: any = null
    let label: any = null
    // let handler
    viewer.scene.globe.depthTestAgainstTerrain = false // 关闭深度检测
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    // handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    handler.setInputAction((movement) => {
        const wp = movement.position
        const cartesian = getCartesian(viewer, wp)
        if (!defined(cartesian)) {
            return
        }
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        sPositions.push(cartesian)
        // const cartographic = Cartographic.fromCartesian(cartesian)
        // console.log("lng:" + cartographic.longitude/Math.PI*180.0)
        const floatingPoint = viewer.entities.add({// 绘制点
            // position: Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
            position: sPositions[sPositions.length - 1],
            point: {
                pixelSize: 5,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true
            }
        })
        sEntities.push(floatingPoint)
    }, ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
        if (sPositions.length < 2) { return }
        const wp = movement.endPosition
        const cartesian = getCartesian(viewer, wp)
        if (!defined(cartesian)) {
            return
        }
        sPositions.pop()
        sPositions.push(cartesian)
        if (sPositions.length === 2) {
            polyline = viewer.entities.add({// 绘制线
                polyline: {
                    positions: new CallbackProperty(() => {
                        return sPositions
                    }, false),
                    material: Color.CHARTREUSE,
                    width: 2,
                    heightReference: HeightReference.CLAMP_TO_GROUND,
                    clampToGround: true,
                }
            })
            sEntities.push(polyline)
        }

        if (sPositions.length === 3) {
            if (polygon === null) {
                polygon = viewer.entities.add({
                    polygon: {
                        hierarchy: new CallbackProperty(() => {
                            return { positions: sPositions }
                        }, false),
                        outline: false,
                        material: Color.BLUE.withAlpha(0.5),
                        heightReference: HeightReference.CLAMP_TO_GROUND
                        // clampToGround: true
                    }
                })
                sEntities.push(polygon)
            }
            if (label === null) {
                let center = BoundingSphere.fromPoints(sPositions).center
                center = Ellipsoid.WGS84.scaleToGeodeticSurface(center)

                label = viewer.entities.add({
                    position: center,
                    label: {
                        text: area + '平方米',
                        font: '18px sans-serif',
                        fillColor: Color.GOLD,
                        style: LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        pixelOffset: new Cartesian2(20, -20),
                        heightReference: HeightReference.CLAMP_TO_GROUND,
                        clampToGround: true,
                    }
                })
                sEntities.push(label)
            }
        }

        if (label !== null) {

            area = getArea(sPositions)
            label.label.text = area + '平方米'

            let center = BoundingSphere.fromPoints(sPositions).center
            center = Ellipsoid.WGS84.scaleToGeodeticSurface(center)
            label.position = center
        }

        // console.log("area: " + area)
        // tooltip.innerHTML='<p>' + area + '米</p>'
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((movement) => {
        //
        const cartesian = viewer.scene.pickPosition(movement.position)
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        // sPositions.pop()

        // sPositions.push(cartesian)
        // let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        // console.log("lng:" + cartographic.longitude/Math.PI*180.0)
        const floatingPoint = viewer.entities.add({
            // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
            position: sPositions[sPositions.length - 1],
            point: {
                pixelSize: 5,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true,
            }
        })
        sEntities.push(floatingPoint)
        // console.log(positions)
        sPositions.push(sPositions[0])
        polyline = viewer.entities.add({
            polyline: {
                positions: new CallbackProperty(() => {
                    return sPositions
                }, false),
                material: Color.CHARTREUSE,
                width: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true,
            }
        })
        sEntities.push(polyline)
        // positions.pop()
        // const position: any = []
        /* for (const i of sPositions) {
            position.push(sPositions[i])
        } */
        if (polygon !== null) {
            polygon.polygon.hierarchy = sPositions
        }
        if (polyline !== null) {
            polyline.polyline.positions = sPositions
        }
        polygon = null
        polyline = null
        label = null
        sPositions = []
        area = 0.0
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
        callback(sEntities)
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
const getArea = (positions) => {
    let area = 0
    for (let i = 0; i < positions.length - 1; i++) {
        const p0 = positions[i]
        const p1 = positions[i + 1]
        area += (p0.y + p1.y) * (p1.x - p0.x)
    }
    area = Math.abs(area) / 200000
    return area.toFixed(2)
}

// 标点
export const markPointTool = (viewer, callback) => {
    clearHandler()
    viewer.scene.globe.depthTestAgainstTerrain = false
    // let handler
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement) => {
        const wp = movement.position
        const cartesian = getCartesian(viewer, wp)
        // const position = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
        const tempEntities = drawPoint(viewer, mapMarker, cartesian)
        // handler.destroy()
        callback(tempEntities)
        // tempEntities.push(point)
    }, ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(() => {
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    handler.setInputAction(() => {
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
    }, ScreenSpaceEventType.RIGHT_CLICK)

}
const drawPoint = (viewer, m, position) => { // 绘制点
    viewer.scene.globe.depthTestAgainstTerrain = false
    const pointGeometry = viewer.entities.add({
        name: '点几何对象',
        position,
        billboard: {
            image: m,
            scale: 1,
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.MAX_VALUE
        }
    })
    return pointGeometry
}

// 绘线
export const drawLineString = (viewer, callback) => {
    clearHandler()
    // let handler
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    const positions: any = []
    let poly
    // 鼠标左键单击画点
    handler.setInputAction((movement) => {
        const cartesian = getCartesian(viewer, movement.position)
        if (!defined(cartesian)) {
            return
        }
        // const cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
        if (positions.length === 0) {
            positions.push(cartesian.clone())
        }
        positions.push(cartesian)
    }, ScreenSpaceEventType.LEFT_CLICK)
    // 鼠标移动
    handler.setInputAction((movement) => {
        // const cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
        const cartesian = getCartesian(viewer, movement.endPosition)
        if (!defined(cartesian)) {
            return
        }
        if (positions.length >= 2) {
            if (!defined(poly)) {
                poly = new PolyLinePrimitive(positions, viewer)
            } else {
                if (cartesian !== undefined) {
                    positions.pop()
                    cartesian.y += (1 + Math.random())
                    positions.push(cartesian)
                }
            }
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)
    // 单击鼠标右键结束画线
    handler.setInputAction(() => {
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
        callback(positions)
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
function PolyLinePrimitive(this: any, positions, viewer) {
    this.options = {
        polyline: {
            show: true,
            positions: [],
            material: Color.RED,
            width: 3,
            clampToGround: true
        }
    }
    this.positions = positions
    this.init(viewer)
}
PolyLinePrimitive.prototype.init = function (viewer) {
    const update = () => {
        return this.positions
    }
    // 实时更新polyline.positions
    this.options.polyline.positions = new CallbackProperty(update, false)
    viewer.entities.add(this.options)
}

// 绘面
export const drawPolygons = (viewer, callback) => {
    clearHandler()
    let sPositions: any[] = []
    const sEntities: any[] = []
    let polyline: any = null
    let polygon: any = null
    // let handler
    viewer.scene.globe.depthTestAgainstTerrain = false // 关闭深度检测
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement) => {
        const cartesian = getCartesian(viewer, movement.position)
        if (!defined(cartesian)) {
            return
        }
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        sPositions.push(cartesian)
        const floatingPoint = viewer.entities.add({// 绘制点
            position: sPositions[sPositions.length - 1],
            point: {
                pixelSize: 5,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true
            }
        })
        sEntities.push(floatingPoint)
    }, ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
        if (sPositions.length < 2) { return }
        const cartesian = getCartesian(viewer, movement.endPosition)
        if (!defined(cartesian)) {
            return
        }
        sPositions.pop()
        sPositions.push(cartesian)
        if (sPositions.length === 2) {
            polyline = viewer.entities.add({// 绘制线
                polyline: {
                    positions: new CallbackProperty(() => {
                        return sPositions
                    }, false),
                    material: Color.CHARTREUSE,
                    width: 2,
                    heightReference: HeightReference.CLAMP_TO_GROUND,
                    clampToGround: true,
                }
            })
            sEntities.push(polyline)
        }

        if (sPositions.length === 3) {
            if (polygon === null) {
                polygon = viewer.entities.add({
                    polygon: {
                        hierarchy: new CallbackProperty(() => {
                            return { positions: sPositions }
                        }, false),
                        outline: false,
                        material: Color.BLUE.withAlpha(0.5),
                        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        clampToGround: true,
                    }
                })
                sEntities.push(polygon)
            }
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((movement) => {
        const cartesian = viewer.scene.pickPosition(movement.position)
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        const floatingPoint = viewer.entities.add({
            position: sPositions[sPositions.length - 1],
            point: {
                pixelSize: 5,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true,
            }
        })
        sEntities.push(floatingPoint)
        sPositions.push(sPositions[0])
        polyline = viewer.entities.add({
            polyline: {
                positions: new CallbackProperty(() => {
                    return sPositions
                }, false),
                material: Color.CHARTREUSE,
                width: 2,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                clampToGround: true,
            }
        })

        sEntities.push(polyline)
        if (polygon !== null) {
            polygon.polygon.hierarchy = sPositions
        }
        if (polyline !== null) {
            polyline.polyline.positions = sPositions
        }
        polygon = null
        polyline = null
        sPositions = []
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
        callback && callback(sEntities)
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}

const getCartesian = (viewer, wp) => {
    const ray = viewer.camera.getPickRay(wp)
    if (!ray) { return null }
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    return cartesian
}

function clearHandler() {
    if (handler) {
        handler.destroy()
        handler = null
    }
}

// 地块Label
export const addMapLabel = (viewer, imgUrl, wfsUrl, layerName) => {
    loadGeoJsonData(wfsUrl).then((data) => {
        const shpData = GeoJsonDataSource.load(data.data, {
            markerSize: 0,
            clampToGround: true,
        })
        shpData.then((dataSource) => {
            dataSource.name = layerName
            viewer.dataSources.add(dataSource)
            const entities = dataSource.entities.values
            entities.forEach((entity: any) => {
                entity.billboard.image = imgUrl
                entity.billboard.heightReference = HeightReference.CLAMP_TO_GROUND
                entity.billboard.width = 16
                entity.billboard.height = 24
                entity.billboard.translucencyByDistance = new NearFarScalar(0, 1, 1.2e6, 0)
                /*entity.label=new Cesium.LabelGraphics({
                    text:entity.properties["项目名称"]._value,
                    font:'15px sans-serif',
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                    translucencyByDistance:new Cesium.NearFarScalar(99999, 1, 100000, 0),
                    background:new Cesium.Color(0, 0, 0, 0.4),
                    showBackground:true,
                    pixelOffset:new Cesium.Cartesian2(0, -35)
                })*/
            })
        })
    })
}
const loadGeoJsonData = (wfsUrl) => {
    return api.getGeoJson(wfsUrl, null)
}

// 画矩形
let rectEntity: any = null
let polyEntity: any = null
export const drawRect = (viewer, callback) => {
    // 清除上一个矩形
    if (rectEntity) {
        viewer.entities.remove(rectEntity)
        rectEntity = null
    }
    if (polyEntity) {
        viewer.entities.remove(polyEntity)
        polyEntity = null
    }
    const pointsArr: any = []
    const shape: any = {
        points: [],
        rect: {
            west: 0,
            east: 0,
            south: 0,
            north: 0,
        },
        entity: null,
    }
    let tempPosition
    const handle = new ScreenSpaceEventHandler(viewer.scene.canvas)
    // 鼠标左键单击画点
    handle.setInputAction((click) => {
        tempPosition = getPointFromWindowPoint(viewer, click.position)
        // 选择的点在球面上
        if (tempPosition) {
            if (shape.points.length === 0) {
                pointsArr.push(tempPosition)
                shape.points.push(viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition))
                shape.rect = Rectangle.fromCartographicArray(shape.points)
                shape.rect.east += 0.000001
                shape.rect.north += 0.000001
                shape.entity = viewer.entities.add({
                    rectangle: {
                        coordinates: shape.rect,
                        material: Color.BLACK.withAlpha(0.4),
                        outline: true,
                        outlineWidth: 2,
                        outlineColor: Color.RED,
                        heightReference: HeightReference.CLAMP_TO_GROUND
                    }
                })
                rectEntity = shape.entity
                // const bufferEntity = shape.entity
            } else {
                handle.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
                handle.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
                if (pointsArr.length > 1) {
                    callback(pointsArr)
                }
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK)
    // 鼠标移动
    handle.setInputAction((movement) => {
        if (shape.points.length === 0) {
            return
        }
        const moveEndPosition = getPointFromWindowPoint(viewer, movement.endPosition)
        // 选择的点在球面上
        if (moveEndPosition) {
            pointsArr[1] = moveEndPosition
            shape.points[1] = viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition)
            shape.rect = Rectangle.fromCartographicArray(shape.points)
            if (shape.rect.west === shape.rect.east) {
                shape.rect.east += 0.000001
            }
            if (shape.rect.south === shape.rect.north) {
                shape.rect.north += 0.000001
            }
            shape.entity.rectangle.coordinates = new CallbackProperty(() => {
                return shape.rect
            }, false)
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)
}

const getPointFromWindowPoint = (viewer, point) => {
    if (viewer.scene.terrainProvider.constructor.name === 'EllipsoidTerrainProvider') {
        return viewer.camera.pickEllipsoid(point, viewer.scene.globe.ellipsoid)
    } else {
        const ray = viewer.scene.camera.getPickRay(point)
        return viewer.scene.globe.pick(ray, viewer.scene)
    }
}

// 画点
export const drawPoints = (viewer, callback) => {
    // 坐标存储
    const positions: any[] = []

    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    // 单击鼠标左键画点
    handler.setInputAction((movement) => {
        const cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
        positions.push(cartesian)
        viewer.entities.add({
            position: cartesian,
            point: {
                color: Color.RED,
                pixelSize: 10,
                heightReference: HeightReference.CLAMP_TO_GROUND
            }
        })
    }, ScreenSpaceEventType.LEFT_CLICK)

    // 单击鼠标右键结束画点
    handler.setInputAction(() => {
        handler.destroy()
        callback(positions)
    }, ScreenSpaceEventType.RIGHT_CLICK)
}

export const circleDraw = (viewer, callBack) => {
    viewer.scene.globe.depthTestAgainstTerrain = true
    const circle: any = {
        points: []
        , rect: null
        , entity: null
        , r: 1
    }
    let tempPosition
    let cartographic1
    // let p
    let tempLon
    let tempLat
    const ShapeEventHandler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    // common.handlerList.push(ShapeEventHandler)
    ShapeEventHandler.setInputAction((click) => {
        tempPosition = getPointFromWindowPoint(viewer, click.position)
        //   选择的点在球面上
        if (tempPosition) {
            if (circle.points.length === 0) {
                // p = click.position
                cartographic1 = Ellipsoid.WGS84.cartesianToCartographic(tempPosition)
                circle.points.push(viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition))
                circle.points.push(viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition))
                tempLon = CesiumMath.toDegrees(cartographic1.longitude)
                tempLat = CesiumMath.toDegrees(cartographic1.latitude)
                circle.entity = viewer.entities.add({
                    position: Cartesian3.fromDegrees(tempLon, tempLat),
                    ellipse: {
                        semiMinorAxis: new CallbackProperty(() => callBackPos(circle.points[0].longitude, circle.points[0].latitude, circle.points[1].longitude, circle.points[1].latitude), false),
                        semiMajorAxis: new CallbackProperty(() => callBackPos(circle.points[0].longitude, circle.points[0].latitude, circle.points[1].longitude, circle.points[1].latitude), false),
                        //   条形材质
                        material: Color.RED.withAlpha(0.3)
                    }
                })
            } else {
                ShapeEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
                ShapeEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
                const tempCircle = new CircleOutlineGeometry({
                    center: Cartesian3.fromDegrees(tempLon, tempLat),
                    radius: callBackPos(circle.points[0].longitude, circle.points[0].latitude, circle.points[1].longitude, circle.points[1].latitude),
                    granularity: Math.PI / 2
                })
                const geometry = CircleOutlineGeometry.createGeometry(tempCircle)
                const float64ArrayPositionsIn = geometry.attributes.position.values
                const positionsIn = [].slice.call(float64ArrayPositionsIn)
                callBack(positionsIn)
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK)
    ShapeEventHandler.setInputAction((movement) => {
        if (circle.points.length === 0) {
            return
        }
        const moveEndPosition = getPointFromWindowPoint(viewer, movement.endPosition)
        //   选择的点在球面上
        if (moveEndPosition) {
            circle.points.pop()
            circle.points.push(viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition))
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)
}

const callBackPos = (longitude, latitude, longitude1, latitude1) => {
    const minlon = CesiumMath.toDegrees(longitude)
    const minlat = CesiumMath.toDegrees(latitude)
    const maxlon = CesiumMath.toDegrees(longitude1)
    const maxlat = CesiumMath.toDegrees(latitude1)
    const r = getFlatternDistance(minlat, minlon, maxlat, maxlon)
    if (r) {
        return r
    }
    return 1
}

const getFlatternDistance = (lat1, lng1, lat2, lng2) => {
    const EARTH_RADIUS = 6378137.0    // 单位M
    const PI = Math.PI

    function getRad(dn: any) {
        return dn * PI / 180.0
    }
    const f = getRad((lat1 + lat2) / 2)
    const g = getRad((lat1 - lat2) / 2)
    const l = getRad((lng1 - lng2) / 2)

    let sg = Math.sin(g)
    let sl = Math.sin(l)
    let sf = Math.sin(f)

    let s, c, w, r, d, h1, h2
    const a = EARTH_RADIUS
    const fl = 1 / 298.257

    sg = sg * sg
    sl = sl * sl
    sf = sf * sf

    s = sg * (1 - sl) + (1 - sf) * sl
    c = (1 - sg) * (1 - sl) + sf * sl

    w = Math.atan(Math.sqrt(s / c))
    r = Math.sqrt(s * c) / w
    d = 2 * w * a
    h1 = (3 * r - 1) / 2 / c
    h2 = (3 * r + 1) / 2 / s

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}

/* export const drawPolygon = (viewer, callback) => {
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    const positions: any = []
    let poly
    // 鼠标单击画点
    handler.setInputAction((movement) => {
        // const cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
        const cartesian = getCartesian(viewer, movement.position)
        if (!defined(cartesian)) {
            return
        }
        if (positions.length === 0) {
            positions.push(cartesian.clone())
        }
        positions.push(cartesian)
    }, ScreenSpaceEventType.LEFT_CLICK)
    // 鼠标移动
    handler.setInputAction((movement) => {
        // const cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
        if (positions.length < 1) {
            return
        }
        const cartesian = getCartesian(viewer, movement.endPosition)
        if (!defined(cartesian)) {
            return
        }
        if (positions.length >= 2) {
            if (!defined(poly)) {
                poly = new PolygonPrimitive(positions, viewer)
            } else {
                if (cartesian !== undefined) {
                    positions.pop()
                    cartesian.y += (1 + Math.random())
                    positions.push(cartesian)
                }
            }
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)
    // 鼠标右键单击结束绘制
    handler.setInputAction(() => {
        handler.destroy()
        callback(positions)
    }, ScreenSpaceEventType.RIGHT_CLICK)
}

function PolygonPrimitive(this: any, positions, viewer) {
    this.options = {
        name: '多边形',
        polygon: {
            hierarchy: [],
            perPositionHeight: true,
            material: Color.RED.withAlpha(0.4),
            // heightReference: HeightReference.CLAMP_TO_GROUND
            clampToGround: true
        }
    }
    this.hierarchy = positions
    this.init(viewer)
}

PolygonPrimitive.prototype.init = function (viewer) {
    const update = () => {
        return this.hierarchy
    }
    // 实时更新polygon.hierarchy
    this.options.polygon.hierarchy = new CallbackProperty(update, false)
    viewer.entities.add(this.options)
} */

export const drawPoly = (viewer, callback, func) => {
    clearHandler()
    /* // 清除上一个矩形
    if (rectEntity) {
        viewer.entities.remove(rectEntity)
        rectEntity = null
    }
    if (polyEntity) {
        viewer.entities.remove(polyEntity)
        polyEntity = null
    } */
    let sPositions: any[] = []
    const fPositions: any[] = []
    const sEntities: any[] = []
    let polyline: any = null
    let polygon: any = null
    // let handler
    viewer.scene.globe.depthTestAgainstTerrain = false // 关闭深度检测
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((movement) => {
        const cartesian = getCartesian(viewer, movement.position)
        if (!defined(cartesian)) {
            return
        }
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        sPositions.push(cartesian)
        fPositions.push(cartesian)
    }, ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
        if (sPositions.length < 2) { return }
        const cartesian = getCartesian(viewer, movement.endPosition)
        if (!defined(cartesian)) {
            return
        }
        sPositions.pop()
        sPositions.push(cartesian)
        if (sPositions.length === 3) {
            if (polygon === null) {
                polygon = viewer.entities.add({
                    polygon: {
                        hierarchy: new CallbackProperty(() => {
                            return { positions: sPositions }
                        }, false),
                        outline: false,
                        material: Color.BLACK.withAlpha(0.4),
                        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        clampToGround: true,
                    }
                })
                polyEntity = polygon
                sEntities.push(polygon)
            }
        }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((movement) => {
        const cartesian = viewer.scene.pickPosition(movement.position)
        if (sPositions.length === 0) {
            sPositions.push(cartesian)
        }
        func && func(fPositions)
        sPositions.push(sPositions[0])
        if (polygon !== null) {
            polygon.polygon.hierarchy = sPositions
        }
        if (polyline !== null) {
            polyline.polyline.positions = sPositions
        }
        polygon = null
        polyline = null
        sPositions = []
        if (handler !== null) {
            handler.destroy()
            handler = null
        }
        callback && callback(sEntities)
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}

export const cartesian3ToWGS84 = (point) => {
    const cartesian33 = new Cartesian3(point.x, point.y, point.z)
    const cartographic = Cartographic.fromCartesian(cartesian33)
    const lat = CesiumMath.toDegrees(cartographic.latitude)
    const lng = CesiumMath.toDegrees(cartographic.longitude)
    const alt = cartographic.height
    return { lat, lng, alt }
}

export const calcCenterByPositions = (positions) => {
    const center = BoundingSphere.fromPoints(positions).center
    const surfaceCenter = Ellipsoid.WGS84.scaleToGeodeticSurface(center)
    return surfaceCenter
}


