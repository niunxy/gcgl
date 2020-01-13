import * as React from 'react'
import './index.less'
import classnames from 'classnames'
import mapConfig from '@config/map.config'

interface IProps {	
	/**
	 * 组件样式名称
	 */
	className?: string
}

interface IState {
	hasSelectedId?: string, // 选中的底图的Id
	className: string
}

// 默认选中的底图
let defaultSelectedId = ''
mapConfig.baseMapLayers.forEach(item => {
	if (item.isBaseMap && item.visible) {
		defaultSelectedId = item.id
	}
})

export default class BaseMapSwitcher extends React.Component<IProps, IState> {
	map: any // map 对象
	constructor(props: IProps) {
		super(props)
		this.state = {
			hasSelectedId: defaultSelectedId,
			className: this.props.className ? this.props.className : ''
		}
	}

	handleBaseMapSwitch = (baseLayerInfo) => {
		this.setState({
			hasSelectedId: baseLayerInfo.id
		}, () => {
			// 将所有的底图置为不可见
			mapConfig.baseMapLayers.forEach(item => {
				this.map.findLayerById(item.id).visible = false
			})
			// 将id所对应的底图及其标记图层置为可见			
			const baseLayer = this.map.findLayerById(baseLayerInfo.id)
			baseLayer.visible = true
			if (this.map.findLayerById(`${baseLayerInfo.id}_anno`)) {
				this.map.findLayerById(`${baseLayerInfo.id}_anno`)!.visible = true
			}			
			// 若为矢量地图则高程数据不显示，否则显示
			if (this.state.hasSelectedId === 'tdtVec') {
				this.map.ground.layers.items.forEach(item => {
					item.visible = false
				})
			} else {
				this.map.ground.layers.items.forEach(item => {
					item.visible = true
				})
			}
		})
	}

	render() {
		this.map = global.map // 地图对象
		return (
			<div className={`_baseMapSwitcher ${this.state.className}`}>
				<div className={'baseMapList'}>
					{mapConfig.baseMapLayers.map((item, key) => {
						if (!item.isBaseMap) {
							return
						}
						let baseLayer
						switch (item.id) {
							case 'tdtImg':
								baseLayer = <div key={key} onClick={this.handleBaseMapSwitch.bind(this, item)} className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/image.jpg')}) no-repeat 0 0`, zIndex: key }}>
									<div className='mask'>
										<span className='label' >{item.title}</span>
									</div>
								</div>
								break
							case 'tdtVec':
								baseLayer = <div key={key} onClick={this.handleBaseMapSwitch.bind(this, item)} className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/map.jpg')}) no-repeat 0 0`, zIndex: key }}>
									<div className='mask'>
										<span className='label' >{item.title}</span>
									</div>
								</div>
								break
							case 'tdtTer':
								baseLayer = <div key={key} onClick={this.handleBaseMapSwitch.bind(this, item)} className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/terrain.jpg')}) no-repeat 0 0`, zIndex: key }}>
									<div className='mask'>
										<span className='label' >{item.title}</span>
									</div>                </div>
								break
						}
						return baseLayer
					})}
				</div>
			</div>
		)
	}
}
