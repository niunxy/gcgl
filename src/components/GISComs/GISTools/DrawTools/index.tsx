import React from 'react'
import { observer, inject } from 'mobx-react'
import './index.less'

import { 
    createDraw,
    enableCreatePoint,
    enableCreatePolyline,
    enableCreatePolygon,
 } from '@utils/arcgis/draw'


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
            <div key={index} className={`drawTools-child ${item.className}`} onClick={item.onClick}>
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
    draw: any // 绘制对象
    stores = this.props.stores
    view: any // view 对象
    constructor(props: IProps) {
        super(props)
    }
    drawPoint = (e, view = this.view, draw = this.draw) => {
        console.log(e)
        enableCreatePoint(view, draw)
    }
    drawPolyline = (e, view = this.view, draw = this.draw) => {
        console.log(e)
        enableCreatePolyline(view, draw)
    }
    drawPolygon = (e, view = this.view, draw = this.draw) => {
        console.log(e)
        enableCreatePolygon(view, draw)
    }
    menuArr: IMenu[] = [
        {
            title: '点',
            className: ['drawTools-point'],
            onClick: this.drawPoint
        },
        {
            title: '线',
            className: ['drawTools-polyline'],
            onClick: this.drawPolyline
        },
        {
            title: '面',
            className: ['drawTools-area'],
            onClick: this.drawPolygon
        }
    ]
    render() {
        const { mapStore } = this.stores
        if (mapStore.viewConfigLoaded) {
            this.view = global.viewConfig.activeView
            createDraw(this.view).then((draw) => {
                this.draw = draw
            })
        }
        return (
            <div className='drawTools-wrap'>
                <span className='drawTools-title'>绘制</span>
                {measureItem(this.menuArr)}
            </div>
        )
    }
} 