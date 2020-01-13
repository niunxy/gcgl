import * as React from 'react'
import './index.less'
import ArcgisInitCom from '@components/GISComs/Map'
import mapConfig from '@config/map.config'
import { observer, inject } from 'mobx-react'
import Measure from '@components/GISComs/GISTools/Measure'
import DrawTools from '@components/GISComs/GISTools/DrawTools'
import Clear from '@components/GISComs/GISTools/Clear'
import DisplayCoordinate from '@components/GISComs/GISTools/DisplayCoordinate'
import Full from '@components/GISComs/GISTools/Full'
const { gisMode, target } = mapConfig
import BaseMapSWitcher from '@components/GISComs/GISTools/BaseMapSwitcher'
import AnimateSwitch, { animateSwitchParamsInit } from '@components/GISComs/GISTools/AnimateSwitch'
import SimplePrint from '@components/GISComs/GISTools/Print'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
interface IProps extends RouteComponentProps { 
	viewConfigLoaded?: boolean,
	stores?: any,
	history: any
}

animateSwitchParamsInit()

/**
 * @author duxx
 * @desc 地图容器组件
 */
@inject('stores')
@observer

class MapContainerCore extends React.Component<IProps> {
	gisMode = gisMode
	stores = this.props.stores
	view: any // view 对象
	constructor(props: IProps) {
		super(props)
	}

	/**
	 * @author duxx
	 * @desc 创建测量组件 
	 * @memberof MapContainerCore
	 */
	createMeasure = () => {
		return <Measure />
	}
	/**
	 * @author duxx
	 * @desc 创建绘制组件 
	 * @memberof MapContainerCore
	 */
	createDrawTools = () => {
		return <DrawTools />
	}
	/**
	 * @author duxx
	 * @desc 创建清除工具 
	 * @memberof MapContainerCore
	 */
	createClear = () => {
		return <Clear view={this.view} />
	}

	/**
	 * @author duxx
	 * @desc 创建 DisplayCoordinate 工具 - 用于实时显示鼠标所在位置坐标
	 * @memberof MapContainerCore
	 */
	createDisplayCoordinate = () => {
		return <DisplayCoordinate view={this.view} />
	}
	/**
	 * @author duxx
	 * @desc 创建全图组件工具 - 回到初始地图范围
	 * @memberof MapContainerCore
	 */
	createFull = () => {
		return <Full fullViewpoint={target} />
	}

	/**
	 * @author duxx
	 * @desc 创建底图切换基础组件
	 * @memberof MapContainerCore
	 */
	createBaseMapSwitcher = () => {
		return <BaseMapSWitcher />
	}

	/**
	 * @author duxx
	 * @desc 初始化范围显示方式切换工具
	 * @memberof MapContainerCore
	 */
	createAnimateSwitch = () => {
		return <AnimateSwitch />
	}

	/**
	 * @author duxx
	 * @desc 地图打印工具，简版
	 * @memberof MapContainerCore
	 */
	createSimplePrint = () => {
		return <SimplePrint parentDomId = 'mapContainer'/>
	}

	createProject = () => {
		this.props.history.push('/index/map/createProject/0')
	}


	render() {
		let measure, drawTools, clear, displayCoordinate, full, baseMapSwitcher, animateSwitch, print
		const { mapStore } = this.stores
		// /* const { mapStore } = this.props */
		if (mapStore.viewConfigLoaded) {
			this.view = global.viewConfig.activeView
			measure = this.createMeasure()
			drawTools = this.createDrawTools()
			clear = this.createClear()
			displayCoordinate = this.createDisplayCoordinate()
			full = this.createFull()
			baseMapSwitcher = this.createBaseMapSwitcher()
			animateSwitch = this.createAnimateSwitch()
			print = this.createSimplePrint()
		}
		return (
			<div className='map-container' id = 'mapContainer'>
				<ArcgisInitCom />
				<div className='position-measure'>
					{measure}
				</div>
				<div className='position-drawTools'>
					{drawTools}
				</div>
				<div className='position-clear'>
					{clear}
				</div>
				<div className='position-print'>
					{print}
				</div>
				<div className='position-displayCoordinate'>
					{displayCoordinate}
				</div>
				<div className='position-full'>
					{full}
				</div>
				<div className='position-animateSwitch'>
					{animateSwitch}
				</div>
				<div className='position-baseMapSwitcher'>
					{baseMapSwitcher}
				</div>
				<div className='position-create'>
					<Button onClick={this.createProject}>新建项目</Button>
				</div>
				
			</div>
		)
	}
}
export default withRouter(MapContainerCore)

