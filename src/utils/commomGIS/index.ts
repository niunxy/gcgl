interface IMercator {
    x: number
    y: number
    z?: number
}
/**
 * 
 * @param geoCoor [114.32894, 30.585748]
 * @return 
 * {
 *  x: 12727039.383734727,
 *  y: 3579066.6894065146
 * }
 */
export function geoCoorToWebMercator(geoCoor: number[]) {
    const mercator: IMercator = {
        x: 0,
        y: 0
    }
    // console.log(geoCoor)
    const earthRad = 6378137.0
    // console.log('mercator-poi',poi)
    const lng = geoCoor[0]
    const lat = geoCoor[1]
    // const lng = geoCoor.lng
    // const lat = geoCoor.lat
    mercator.x = lng * Math.PI / 180 * earthRad
    const a = lat * Math.PI / 180
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
    // console.log('mercator', mercator)
    return mercator // [12727039.383734727, 3579066.6894065146]

}

// //经纬度转墨卡托
// function _getMercator(poi) {//[114.32894, 30.585748]
//     const mercator = {}
//     const earthRad = 6378137.0
//     // console.log('mercator-poi',poi)
//     mercator.x = poi.lng * Math.PI / 180 * earthRad
//     const a = poi.lat * Math.PI / 180
//     mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
//     // console.log('mercator',mercator)
//     return mercator //[12727039.383734727, 3579066.6894065146]
// }

// //墨卡托转经纬度
// function _getLngLat(poi){
//     const lnglat = {}
//     lnglat.lng = poi.x/20037508.34*180
//     const mmy = poi.y/20037508.34*180
//     lnglat.lat = 180/Math.PI*(2*Math.atan(Math.exp(mmy*Math.PI/180))-Math.PI/2)
//     return lnglat
// }
