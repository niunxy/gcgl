 /** 距离测量的路线节点处的 marker - 一个圆圈 */
 const measureDistanceLineNodeMarkerSymbol = {
    type: 'simple-marker',
    color: [255, 255, 255],
    size: 6,
    outline: {
        color: [255, 0, 0],
        width: 1.5
    }
}
/** 距离测量的(路)线符号化效果 */
const measureDistanceLineSymbol = {
    type: 'simple-line',
    color: [255, 116, 3],
    width: 2,
    cap: 'round',
    join: 'round'
}
 /** 距离测量起点节点提示 textSymbol  */
 const measureDistanceFirstNodeTextSymbol = {
    type: 'text',
    color: 'white',
    haloColor: 'black',
    haloSize: '2px',
    text: '起点',
    xoffset: 0,
    yoffset: 10,
    font: {
        size: 8,
        family: 'sans-serif',
        weight: 'bold'
    }
}
 /** 距离测量除起点之外的路线节点处的提示 textSymbol  */
 const measureDistanceLineNodeTextSymbol = {
    type: 'text',
    color: 'white',
    haloColor: 'black',
    haloSize: '2px',
    text: '',
    xoffset: '0px',
    yoffset: '10px',
    font: {
        size: 8,
        family: 'sans-serif',
        weight: 'bold'
    }
}
// ======================== 面积测量 ==================================

/** 面积测量的路线节点处的 marker - 一个圆圈 */
const measureAreaNodeMarkerSymbol = {
    type: 'simple-marker',
    color: [255, 255, 255],
    size: 6,
    outline: {
        color: [255, 0, 0],
        width: 1.5
    }
}
 /** 面积测量面内部填充符号效果 */
 const measureAreaFillSymbol = {
    type: 'simple-fill',
    color: [234, 130, 7, 0.6],
    style: 'solid',
    outline: {
        color: 'red',
        width: 1
    }
}

 /** 面积测量提示 textSymbol  */
 const measureAreaTextSymbol = {
    type: 'text',
    color: 'white',
    haloColor: 'black',
    haloSize: '2px',
    text: '',
    font: {
        size: 8,
        family: 'sans-serif',
        weight: 'bold'
    }
}

const symbols = {
    measureDistanceLineNodeMarkerSymbol,
    measureDistanceLineSymbol,
    measureDistanceFirstNodeTextSymbol,
    measureDistanceLineNodeTextSymbol,
    measureAreaNodeMarkerSymbol,
    measureAreaFillSymbol,
    measureAreaTextSymbol
}
export default symbols 
