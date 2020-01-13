import * as React from 'react'
import {
    Spin
} from 'antd'

import './index.less'

interface IProps {
    title: string
}
export default class LoadingTip extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <div className='spin-box'>
                <div className='spin-tip'>
                    <div>{this.props.title}</div>
                    <Spin />
                </div>
            </div>
        )
    }
}