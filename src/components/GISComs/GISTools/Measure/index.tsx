import React from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import esriLoader from 'esri-loader'
import esriConfig from '@config/esri.config'
const { arcgisVersion } = esriConfig
import {
    measureDistance,
    measureArea,
} from '@utils/arcgis/measure'
interface IProps {
    stores?: any
}
interface IState {
}

interface IMenu {
    title: string,
    className: string[],
    onClick: (e) => void
}

const measureItem = (menuArr: IMenu[]) => {
    return menuArr.map((item, index) => {
        // 
        return (
            <div key={index} className={`measure-child ${item.className}`} onClick={item.onClick}>
                {item.title}
            </div>
        )
    })
}

/**
 * @desc 测量工具
 *
 * @export
 * @class Measure
 * @extends {React.Component<IProps, IState>}
 */

@inject('stores')
@observer
export default class Measure extends React.Component<IProps, IState> {
    stores = this.props.stores
    view: any // view 对象
    constructor(props: IProps) {
        super(props)
    }
    startMeasureDistance = () => { // , view = this.view, draw = this.draw
        esriLoader.loadModules([
            'esri/views/draw/Draw'
        ], arcgisVersion).then(([
            Draw
        ]) => {
            const draw = new Draw({
                view: this.view
            })
            this.view.graphics.removeAll()
            const action = draw.create('polyline')
            this.view.focus()
            action.on(
                [
                    'vertex-add',
                    'vertex-remove',
                    'cursor-update',
                    'redo',
                    'undo',
                    'draw-complete'

                ],
                (evt) => {
                    measureDistance(evt, this.view)
                }
            )
        })

    }
    startMeasureArea = () => {
        esriLoader.loadModules([
            'esri/views/draw/Draw'
        ], arcgisVersion).then(([
            Draw
        ]) => {
            const draw = new Draw({
                view: this.view
            })
            const action = draw.create('polygon')
            this.view.focus()
            action.on(
                [
                    'vertex-add',
                    'vertex-remove',
                    'cursor-update',
                    'redo',
                    'undo',
                    'draw-complete'
                ],
                (evt) => {
                    measureArea(evt, this.view)
                }
            )
        })
    }
    menuArr: IMenu[] = [
        {
            title: '测距',
            className: ['measure-distance'],
            onClick: this.startMeasureDistance
        },
        {
            title: '测面',
            className: ['measure-area'],
            onClick: this.startMeasureArea
        }
    ]
    render() {
        // let com: any = null
        const { mapStore } = this.stores
        if (mapStore.viewConfigLoaded) {
            this.view = global.viewConfig.activeView
        }
        return (
            <div className='measure-wrap'>
                <span className='measure-title'>测量</span>
                {measureItem(this.menuArr)}
                {/* <div className='measure-child measure-distance'>
                测距
            </div>
            <div className='measure-child measure-area'>
                测面
            </div> */}
            </div>
        )
    }
} 