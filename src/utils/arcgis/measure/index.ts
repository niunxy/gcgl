/** 
 * @desc 测量 - 4490/4326 的经纬度数据实现的基于 geometryEngine 的测量
 * @author duxx
 */

import esriLoader from 'esri-loader'
import esriConfig from '@config/esri.config'
const { arcgisVersion } = esriConfig
import measureSymbols from './symbols'
const {
    measureDistanceLineNodeMarkerSymbol,
    measureDistanceLineSymbol,
    measureDistanceFirstNodeTextSymbol,
    measureDistanceLineNodeTextSymbol,
    measureAreaNodeMarkerSymbol,
    measureAreaFillSymbol,
    measureAreaTextSymbol
} = measureSymbols

// import { geoCoorToWebMercator } from '@utils/commomGIS/index'
const spt = {
    wkid: 4326
}
export function measureDistance(event, view) {
    esriLoader.loadModules([
        'esri/Graphic',
        'esri/geometry/Polyline',
        'esri/geometry/geometryEngine',
        'esri/geometry/Point',
    ], arcgisVersion).then(([
        Graphic,
        Polyline,
        GeometryEngine,
        Point,
    ]) => {
        try {
            const vertices = event.vertices
            view.graphics.removeAll()
            const graphic = new Graphic({
                geometry: new Polyline({
                    paths: vertices,
                    spatialReference: view.spatialReference
                }),
                symbol: measureDistanceLineSymbol
            })
            view.graphics.add(graphic)

            const firstPoint = new Point({
                x: vertices[0][0],
                y: vertices[0][1],
                spatialReference: view.spatialReference
            })
            /** polyline 起点 text */
            const firstTextGraphics = new Graphic({
                geometry: firstPoint,
                symbol: measureDistanceFirstNodeTextSymbol
            })

            /** polyline 起点 point 符号 */
            const firstGraphics = new Graphic({
                geometry: firstPoint,
                symbol: measureDistanceLineNodeMarkerSymbol
            })
            view.graphics.add(firstTextGraphics)
            view.graphics.add(firstGraphics)

            const path: any[] = [] // Polyline 的 paths 参数
            const firstPathPoint: any[] = [] // Polyline 的 paths 参数的第一个元素

            firstPathPoint.push(vertices[0][0])
            firstPathPoint.push(vertices[0][1])
            path.push(firstPathPoint)
            for (let i = 1; i < vertices.length; i++) {
                const point = {
                    type: 'point',
                    x: vertices[i][0],
                    y: vertices[i][1],
                    spatialReference: view.spatialReference
                }
                const pathPoint: any[] = [] // Polyline 的 paths 参数的一个元素

                pathPoint.push(vertices[i][0])
                pathPoint.push(vertices[i][1])
                path.push(pathPoint)

                const polyline = new Polyline({
                    hasZ: false,
                    hasM: true,
                    paths: path,
                    spatialReference: spt
                })
                let distance
                let unit
                if (view.scale > 5000) {
                    distance = GeometryEngine.geodesicLength(polyline, 'kilometers')
                    unit = '千米'
                } else {
                    distance = GeometryEngine.geodesicLength(polyline, 'meters')
                    unit = '米'
                }
                measureDistanceLineNodeTextSymbol.text = Math.abs(Math.round(distance * 100) / 100) + unit

                /** polyline 节点 text */
                const textGraphics = new Graphic({
                    geometry: point,
                    symbol: measureDistanceLineNodeTextSymbol
                })
                /** polyline 节点 point 符号 */
                const Graphics = new Graphic({
                    geometry: point,
                    symbol: measureDistanceLineNodeMarkerSymbol
                })
                view.graphics.add(textGraphics)
                view.graphics.add(Graphics)
            }
        } catch (e) {
            console.error(e)
        }
    })
}



export function measureArea(event, view) {
    esriLoader.loadModules([
        'esri/Graphic',
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine'
    ], arcgisVersion).then(([
        Graphic,
        Polygon,
        GeometryEngine
    ]) => {
        try {
            const vertices = event.vertices

            view.graphics.removeAll()
            const polygon = new Polygon({
                rings: [vertices],
                spatialReference: spt
            })

            const graphic = new Graphic({
                geometry: polygon,
                symbol: measureAreaFillSymbol
            })
            view.graphics.add(graphic)
            const center = polygon.centroid
            let area = 0
            let unit
            if (view.scale > 5000) {
                area = GeometryEngine.geodesicArea(graphic.geometry, 'square-kilometers')
                unit = '平方千米'
            } else {
                area = GeometryEngine.geodesicArea(graphic.geometry, 'square-meters')
                unit = '平方米'
            }
            for (const vertex of vertices) {
                const point = {
                    type: 'point',
                    x: vertex[0],
                    y: vertex[1],
                    spatialReference: view.spatialReference
                }

                const pointGraphics = new Graphic({
                    geometry: point,
                    symbol: measureAreaNodeMarkerSymbol
                })
                view.graphics.add(pointGraphics)
            }
            const pointCenter = {
                type: 'point',
                longitude: center.longitude,
                latitude: center.latitude
            }
            measureAreaTextSymbol.text = Math.abs(Math.round(area * 100) / 100) + unit
            const textGraphics = new Graphic({
                geometry: pointCenter,
                symbol: measureAreaTextSymbol
            })

            view.graphics.add(textGraphics)
        } catch (e) {
            console.error(e)
        }
    })
}
export function createGraphic(vertices, view) {
    return new Promise((resolve, reject) => {
        esriLoader.loadModules([
            'esri/Graphic',
            'esri/geometry/Polyline'
        ], arcgisVersion).then(([
            Graphic,
            Polyline
        ]) => {
            try {
                const graphics = new Graphic({
                    geometry: new Polyline({
                        paths: vertices,
                        spatialReference: view.spatialReference
                    }),

                    symbol: {
                        type: 'simple-line', // autocasts as new SimpleFillSymbol
                        color: [255, 116, 3],
                        width: 2,
                        cap: 'round',
                        join: 'round'
                    }
                })
                resolve(graphics)
            } catch (e) {
                console.error(e)
                reject(e)
            }
        })
    })
}

export default {
    createGraphic,
    measureDistance,
    measureArea,
}