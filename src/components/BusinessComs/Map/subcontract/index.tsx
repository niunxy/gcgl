import * as React from 'react'
import { Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
import SubcontractMap from '@components/Cesium/subcontractMap'
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
export default class Subcontract extends React.PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {
		}
	}

	render() {
		const { mapStore } = this.props.stores
		const data = toJS(mapStore.projectInfo)
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='pre-item-land' />
					<SubcontractMap type='2' xmName={this.props.stores.mapStore.xmName} dkxh={this.props.stores.mapStore.xmId} parentXm={this.props.stores.mapStore.parentXm} xmScreenId={this.props.stores.mapStore.xmScreenId} subId={data} xmFbId={this.props.stores.mapStore.xmFbId}/>
				</div>
			)
	}
}
