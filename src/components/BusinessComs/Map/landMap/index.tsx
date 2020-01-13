import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

// import MapContainer from '@components/MapContainer'
import Cesium from '@components/Cesium'
import './index.less'

interface IProps {
    stores?: any,
}

/**
 * @author ny
 * @desc 首页
 */
@inject('stores')
@observer
export default class LandMap extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)

    }

    getSnapshotBeforeUpdate() {
        console.log(this.props)
    }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <React.Fragment>
                    <Cesium type='1' xmName={this.props.stores.mapStore.xmName} dkxh={this.props.stores.mapStore.xmId} parentXm={this.props.stores.mapStore.parentXm} />
                </React.Fragment>
            )
    }
}
