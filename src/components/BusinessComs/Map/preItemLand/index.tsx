import * as React from 'react'
import { Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
import CesiumMap from '@components/Cesium'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import './index.less'

interface IProps {
	match: any,
	form: any,
	location: any,
	stores?: any
}

interface IState {

}

@inject('stores')
@observer
export default class PreItemLand extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {
		}
	}

	render() {
		const { mapStore } = this.props.stores
		const info = toJS(mapStore.projectInfo)
			return!loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='pre-item-land' />
					<CesiumMap type='1' xmName={this.props.stores.mapStore.xmName} dkxh={this.props.stores.mapStore.xmId} parentXm={this.props.stores.mapStore.parentXm} xmScreenId={this.props.stores.mapStore.xmScreenId} xmjd={info.xmjd} county={info.county} />
				</div>
			)
	}
}
