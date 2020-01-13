import React from 'react'
import './index.less'
import classNames from 'classnames'
interface IProps {
    stores?: any
    /** view 对象 */
    view: any
}
interface IState {
    coordinate: string | boolean
}

/**
 * @desc 展示当前鼠标所在位置坐标点 - 随鼠标移动显示
 * @author duxx
 */
export default class DisplayCoordinate extends React.Component<IProps, IState> {
    draw: any
    constructor(props: IProps) {
        super(props)
        this.state = {
            coordinate: false
            // coordinate: 'NAN/NAN'
            // coordinate: '39.796755/110.796644'
        }
    }
    componentDidMount() {
        const view = this.props.view
        /** 监听 view 上的鼠标滑动事件 */
        view.on(' pointer-move', () => {
            // console.log(e)
        })
    }

    render() {
        const coordinate = this.state.coordinate
        let displayCoordinateInShow: boolean
        if (coordinate === false) {
            displayCoordinateInShow = false
        } else {
            displayCoordinateInShow = true
        }
        return (
            <div className={`displayCoordinate-wrap ${classNames({
                'displayCoordinateInShow': displayCoordinateInShow
            })}`}>
                {this.state.coordinate}
            </div>
        )
    }
} 