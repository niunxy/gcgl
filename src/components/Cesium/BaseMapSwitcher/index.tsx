import * as React from 'react'
import './index.less'
import classnames from 'classnames'
import {
	Checkbox
} from 'antd'
// import mapConfig from '@config/map.config'
// import {showLayer} from '@components/Cesium/layer'
import mapConfig from './mapConfig'

interface IProps {	
	/**
	 * 组件样式名称
	 */
	className?: string,
	viewer: any,
	allLayers: any,
	baseLayers: any,
	layer: any,
	changeAllLayer: any,
}

interface IState {
	hasSelectedId?: string, // 选中的底图的Id
	className: string,
	currentLayer: string,
	note1IsOpen: boolean,
	note2IsOpen: boolean
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
			className: this.props.className ? this.props.className : '',
			currentLayer: 'ESRI影像底图',
			note1IsOpen: false,
			note2IsOpen: false
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

	switchBaseMap = (baseLayerInfo) => {
		this.setState({
			hasSelectedId: baseLayerInfo.id
		}, () => {
			const noteLayer = this.props.allLayers.find((item) => {
				return item.name === '影像中文注记'
			})
			const allLayers  = this.props.allLayers
			const imageryLayers = this.props.viewer.imageryLayers
			let activeLayerIndex = 0
			let activeLayer: any = allLayers[activeLayerIndex]
			const numLayers = allLayers.length
			if (baseLayerInfo.title === 'ESRI影像底图') {
				if (this.state.note2IsOpen) {
					this.setState({
						note2IsOpen: false
					})
					noteLayer.show = false
				}
			}
			if (baseLayerInfo.title === '谷歌影像底图') {
				if (this.state.note1IsOpen) {
					this.setState({
						note1IsOpen: false
					})
					noteLayer.show = false
				}
			}
			for (let i = 0; i < numLayers; ++i) {
				if (allLayers[i].name === 'ESRI影像底图' || allLayers[i].name === '谷歌影像底图') {
					activeLayerIndex = i
					activeLayer = allLayers[i]
					imageryLayers.remove(activeLayer, false)
					this.props.baseLayers.forEach((layer) => {
						if (layer.name === baseLayerInfo.title) {
							// imageryLayers.add(layer, numLayers - activeLayerIndex - 1)
							imageryLayers.add(layer, activeLayerIndex)
						} else {
							imageryLayers.remove(layer, false)
						}
					})
					break
				}
			}
			this.props.changeAllLayer(baseLayerInfo.title)
		})
	}

	showNoteLayer = (title, note, e) => {
		let layer
		// const selectedImgLayer = this.state.hasSelectedId
		if (title === '影像中文注记') {
			layer = this.props.allLayers.find((item) => {
				return item.name === title
			})
		}
		layer.show = false
		if (note === 'note1') {
			this.setState({
				note2IsOpen: false
			})
			if (e.target.checked) {
				layer.show = true
				this.setState({
					note1IsOpen: true
				})
			} else {
				this.setState({
					note1IsOpen: false
				})
			}
		} else if (note === 'note2') {
			this.setState({
				note1IsOpen: false
			})
			if (e.target.checked) {
				layer.show = true
				this.setState({
					note2IsOpen: true
				})
			} else {
				this.setState({
					note2IsOpen: false
				})
			}
		}
	}

	render() {
		this.map = global.map // 地图对象
		return (
            <div style={{ position: 'absolute', bottom: '5px', right: '20px' }}>
			<div className={`_baseMapSwitcher ${this.state.className}`}>
				<div className={'baseMapList'}>
					{mapConfig.baseMapLayers.map((item, key) => {
						if (!item.isBaseMap) {
							return
						}
						let baseLayer
						switch (item.id) {
							case 'esriImg':
								baseLayer = <div className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/image.jpg')}) no-repeat 0 0`, 'cursor': 'pointer', zIndex: key }}>
									<div className='note'>
										<Checkbox onChange={this.showNoteLayer.bind(this, '影像中文注记', 'note1')} checked={this.state.note1IsOpen}>影像中文注记</Checkbox>
									</div>
									<div key={key} onClick={this.switchBaseMap.bind(this, item, this.props.viewer)}>
										<div className='mask'>
											<span className='label' >{item.title}</span>
										</div>
									</div>
								</div>
								break
							case 'googleImg':
								baseLayer = <div className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/googleMap.jpg')}) no-repeat 0 0`, 'cursor': 'pointer', zIndex: key }}>
									<div className='note'>
										<Checkbox onChange={this.showNoteLayer.bind(this, '影像中文注记', 'note2')} checked={this.state.note2IsOpen}>影像中文注记</Checkbox>
									</div>
									<div key={key} onClick={this.switchBaseMap.bind(this, item, this.props.viewer)}>
										<div className='mask'>
											<span className='label' >{item.title}</span>
										</div>
									</div>
								</div>
								break
							/*case 'tdtAnnotation':
								baseLayer = <div key={key} className={classnames('baseMapItem', { 'hasSelectedItem': item.id === this.state.hasSelectedId })} style={{ 'background': `url(${require('./img/annotation_CH.png')}) no-repeat 0 0`, 'cursor': 'pointer', zIndex: key }}>
									<div className='note'>
										<Checkbox onChange={this.showNote.bind(this, item.title)}>显示注记</Checkbox>
									</div>
									<div className='mask'>
										<span className='label' >{item.title}</span>
									</div>
								</div>
								break*/
						}
						return baseLayer
					})}
				</div>
			</div>
            </div>
		)
	}
}
