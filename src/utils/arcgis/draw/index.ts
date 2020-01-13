/** 
 * @desc 简单标绘核心代码 - 简单版,不支持连续标绘
 * @author duxx
 */

import esriLoader from 'esri-loader'
import esriConfig from '@config/esri.config'
const { arcgisVersion } = esriConfig
import measureSymbols from '@utils/arcgis/measure/symbols'

const {
    measureDistanceLineNodeMarkerSymbol,
    measureDistanceLineSymbol,
    // measureDistanceFirstNodeTextSymbol,
    // measureDistanceLineNodeTextSymbol,
    measureAreaNodeMarkerSymbol,
    measureAreaFillSymbol,
    // measureAreaTextSymbol
} = measureSymbols
/**
 * @desc 创建 Draw 实例
 * @author duxx
 * @param {*} view
 */
export function createDraw(viewParam) {
    // console.log(viewParam)
    // debugger
    return new Promise((resolve, reject) => {
        esriLoader.loadModules([
            'esri/views/draw/Draw'
        ], arcgisVersion).then(([
            Draw
        ]) => {
            try {
                resolve(
                    new Draw({
                        view: viewParam
                    })
                )
            } catch (e) {
                reject(e)
            }
        })
    })
}



/**
 * @desc 启用创建 point graphic功能
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
export function enableCreatePoint(view, draw) {
    const action = draw.create('point')
    // PointDrawAction.cursor-update
    // Give a visual feedback to users as they move the pointer over the view
    action.on('cursor-update', (evt) => {
        createPointGraphic(evt.coordinates, view)
    })

    // PointDrawAction.draw-complete
    // Create a point when user clicks on the view or presses 'C' key.
    action.on('draw-complete', (evt) => {
        createPointGraphic(evt.coordinates, view)
    })
}


/**
 * @desc 创建 point graphic 
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
function createPointGraphic(coordinates, view) {
    esriLoader.loadModules([
        'esri/Graphic'
    ], arcgisVersion).then(([
        Graphic
    ]) => {
        view.graphics.removeAll()
        const point = {
            type: 'point',
            x: coordinates[0],
            y: coordinates[1],
            spatialReference: view.spatialReference
        }
        const graphic = new Graphic({
            geometry: point,
            symbol: {
                type: 'simple-marker',
                color: [255, 255, 255],
                size: 6,
                outline: {
                    color: [255, 0, 0],
                    width: 1.5
                }
            }
        })
        view.graphics.add(graphic)
    })
}



/**
 * @desc 启用创建 polyline graphic功能
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
export function enableCreatePolyline(view, draw) {
    const action = draw.create('polyline')

    // listen to PolylineDrawAction.vertex-add
    // Fires when the user clicks, or presses the 'F' key
    // Can also fire when the 'R' key is pressed to redo.
    action.on('vertex-add', (evt) => {
        createPolylineGraphic(evt.vertices, view)
    })

    // listen to PolylineDrawAction.vertex-remove
    // Fires when the 'Z' key is pressed to undo the
    // last added vertex
    action.on('vertex-remove', (evt) => {
        createPolylineGraphic(evt.vertices, view)
    })

    // listen to PolylineDrawAction.cursor-update
    // fires when the pointer moves over the view
    action.on('cursor-update', (evt) => {
        createPolylineGraphic(evt.vertices, view)
    })

    // listen to PolylineDrawAction.draw-complete
    // event to create a graphic when user double-clicks
    // on the view or presses the 'C' key
    action.on('draw-complete', (evt) => {
        createPolylineGraphic(evt.vertices, view)
    })
}

/**
 * @desc 创建 polyline graphic
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
function createPolylineGraphic(vertices, view) {
    esriLoader.loadModules([
        'esri/Graphic',
        'esri/geometry/Polyline',
        'esri/geometry/Point',
    ], arcgisVersion).then(([
        Graphic,
        Polyline,
        Point
    ]) => {

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
        // /** polyline 起点 text */
        // const firstTextGraphics = new Graphic({
        //     geometry: firstPoint,
        //     symbol: measureDistanceFirstNodeTextSymbol
        // })
        /** polyline 起点 point 符号 */
        const firstGraphics = new Graphic({
            geometry: firstPoint,
            symbol: measureDistanceLineNodeMarkerSymbol
        })
        // view.graphics.add(firstTextGraphics)
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

            // const polyline = new Polyline({
            //     hasZ: false,
            //     hasM: true,
            //     paths: path,
            //     spatialReference: view.spatialReference
            // })

            // let distance
            // let unit
            // if (view.scale > 5000) {
            //     distance = GeometryEngine.geodesicLength(polyline, 'kilometers')
            //     unit = '千米'
            // } else {
            //     distance = GeometryEngine.geodesicLength(polyline, 'meters')
            //     unit = '米'
            // }


            // measureDistanceLineNodeTextSymbol.text = Math.abs(Math.round(distance * 100) / 100) + unit

            // /** polyline 节点 text */
            // const textGraphics = new Graphic({
            //     geometry: point,
            //     symbol: measureDistanceLineNodeTextSymbol
            // })


            /** polyline 节点 point 符号 */
            const Graphics = new Graphic({
                geometry: point,
                symbol: measureDistanceLineNodeMarkerSymbol
            })
            // view.graphics.add(textGraphics)
            view.graphics.add(Graphics)
        }
        // =================== 简单绘制 =====================
        // view.graphics.removeAll()
        // const polyline = {
        //     type: 'polyline', // autocasts as Polyline
        //     paths: vertices,
        //     spatialReference: view.spatialReference
        // }

        // const graphic = new Graphic({
        //     geometry: polyline,
        //     symbol: {
        //         type: 'simple-line', // autocasts as SimpleLineSymbol
        //         color: 'red',
        //         width: 1,
        //         cap: 'round',
        //         join: 'round'
        //     }
        // })
        // view.graphics.add(graphic)
    })
}

/**
 * @desc 启用创建 polygon graphic功能
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
export function enableCreatePolygon(view, draw) {
    const action = draw.create('polygon')

    // PolygonDrawAction.vertex-add
    // Fires when user clicks, or presses the 'F' key.
    // Can also be triggered when the 'R' key is pressed to redo.
    action.on('vertex-add', (evt) => {
        createPolygonGraphic(evt.vertices, view)
    })

    // PolygonDrawAction.vertex-remove
    // Fires when the 'Z' key is pressed to undo the last added vertex
    action.on('vertex-remove', (evt) => {
        createPolygonGraphic(evt.vertices, view)
    })

    // Fires when the pointer moves over the view
    action.on('cursor-update', (evt) => {
        createPolygonGraphic(evt.vertices, view)
    })

    // Add a graphic representing the completed polygon
    // when user double-clicks on the view or presses the 'C' key
    action.on('draw-complete', (evt) => {
        createPolygonGraphic(evt.vertices, view)
    })
}

/**
 * @desc 添加 polygon graphic
 * @author duxx
 * @param {*} vertices
 * @param {*} view
 */
function createPolygonGraphic(vertices, view) {
    esriLoader.loadModules([
        'esri/Graphic',
        'esri/geometry/Polygon',
    ], arcgisVersion).then(([
        Graphic,
        Polygon
    ]) => {
        view.graphics.removeAll()
        const polygon = new Polygon({
            rings: [vertices],
            spatialReference: view.spatialReference
        })
        const graphic = new Graphic({
            geometry: polygon,
            symbol: measureAreaFillSymbol
        })
        view.graphics.add(graphic)
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
// ====================== simple draw ===========================
        // view.graphics.removeAll()
        // const polygon = {
        //     type: 'polygon',
        //     rings: vertices,
        //     spatialReference: view.spatialReference
        // }
        // const graphic = new Graphic({
        //     geometry: polygon,
        //     symbol: {
        //         type: 'simple-fill',
        //         color: [234, 130, 7, 0.6],
        //         style: 'solid',
        //         outline: {
        //             color: 'red',
        //             width: 1
        //         }
        //     }
        // })
        // view.graphics.add(graphic)
    })
}

