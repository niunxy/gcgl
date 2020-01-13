import * as React from 'react'

import mapConfig from '@config/map.config'

interface IProps { }

interface IState {
    isOn: boolean // 是否开启
}

/**
 * @author duxx
 * @desc 地图初始化范围显示动画设置组件(开启和关闭动画)
 */
export default class AnimateSwitch extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            isOn: window.localStorage.getItem(mapConfig.initAnimate.localStorageKey) === 'off' ? false : true
        }
    }

    changeSwitch = () => {
        this.setState({
            isOn: !this.state.isOn
        }, () => {
            // 进行地球是否旋转的存储
            if (this.state.isOn) {
                window.localStorage.setItem(mapConfig.initAnimate.localStorageKey, 'on')
            } else {
                window.localStorage.setItem(mapConfig.initAnimate.localStorageKey, 'off')
            }
        })

    }

    render() {
        let imgPath: string = ''
        if (this.state.isOn) {
            imgPath = require('./img/rotateSwitch_on.png')
        } else {
            imgPath = require('./img/rotateSwitch.png')
        }
        return (
            <div className='esri-widget--button esri-widget esri-interactive' title='地图初始化范围加载动画开关' onClick={this.changeSwitch}>
                <img src={imgPath} />
            </div>
        )
    }

}

/**
 * @author duxx
 * @desc AnimateSwitch 组件参数初始化是
 */
export function animateSwitchParamsInit() {
    const flag = window.localStorage.getItem(mapConfig.initAnimate.localStorageKey)
    if (!flag) {
        window.localStorage.setItem(mapConfig.initAnimate.localStorageKey, mapConfig.initAnimate.defaultAnimate)
    }
}