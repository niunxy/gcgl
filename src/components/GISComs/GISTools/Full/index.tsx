
import * as React from 'react'

import { Icon } from 'antd'
import './index.less'
// import { IViewConfig } from '@components/GISComs/MapInit'

import { goToTarget } from '@utils/arcgis/ArcGISCommon'


interface IProps {
	fullExtent?: any
	fullViewpoint?: any
}

interface IState { }

export default class Full extends React.Component<IProps, IState> {
	view = global.viewConfig.activeView
	constructor(props: IProps) {
		super(props)
	}

	full = () => {
		if (this.props.fullExtent) {
			goToTarget(this.view, this.props.fullExtent)
		} if (this.props.fullViewpoint) {
			goToTarget(this.view, this.props.fullViewpoint)

			// goToTarget(this.view, this.props.fullViewpoint, {
			// 	animate: false, // 默认为 true
			// })
		}
	}

	render() {
		this.view = global.viewConfig.activeView
		return (
			<div className='full esri-widget--button esri-widget esri-interactive' title='全图' onClick={this.full}>
				<Icon type='home' />
			</div>
		)
	}
}








