
/**
 * @author duxx
 */

import esriLoader from 'esri-loader'
import esriConfig from '@config/esri.config'
const { arcgisVersion } = esriConfig

/**
 * @desc 地图全屏
 */
function addFullScreen(viewParam) {
    esriLoader.loadModules([
        'esri/widgets/Fullscreen'
    ], arcgisVersion).then(([
        Fullscreen
    ]) => {
        viewParam.ui.add(
            new Fullscreen({
                view: viewParam,
            }),
            'top-right'
        )
    })
}

/**
 * @desc 比例尺
 * @Limitations 仅用于 mapView 
 * @export
 * @param {*} viewParam
 * @param {string} [positionParam='bottom-left']
 * @author duxx
 */
function addScalbar(mapView, positionParam = 'bottom-left') {
    esriLoader.loadModules(['esri/widgets/ScaleBar'], arcgisVersion).then(([ScaleBar]) => {
        const scaleBar = new ScaleBar({
            view: mapView
        })
        mapView.ui.add(scaleBar, {
            position: positionParam
        })
    })
}

/**
 * @desc 添加 arcgis 工具
 * @param view 
 * @author duxx
 */
export function addWidgets(view) {
    addFullScreen(view)
    addScalbar(view)
}

