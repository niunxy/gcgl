
import * as React from 'react'
import './index.less'
import { Icon } from 'antd'

interface IState {
	/**
	 * 侧边栏按钮状态 'left' 侧边栏打开 'right' 侧边栏关闭
	 */
	sliderIconStyle: string


	sidebarType: 'left' | 'right'

	/**
	 * 侧边栏模式：最大化 - max、最小化 - min、中等 - middle
	 */
	mode: 'max' | 'min' | 'middle',

	/**
	 * 组件 props 参数
	 */
	props: IProps

}
interface IProps {
	/**
	 * 侧边栏内容组件
	 */
	Sidebar?: React.ReactNode
	/**
	 * 主区域内容组件
	 */
	Content?: React.ReactNode
	/**
	 * 侧边栏布局状态
	 */
	sidebarType: 'left' | 'right'
	/**
	 * 侧边栏宽度
	 * 'min' 最小化
	 * 'max' 最大化
	 * 'middle' 中等大小
	 */
	mode: 'max' | 'min' | 'middle'

}

/**
 * @author duxx
 * @desc 模板
 * @todo
 */
export default class SubregionLayout extends React.Component<IProps, IState> {
	preMode = this.props.mode
	/**
	 * 侧边栏真实 dom
	 */
	silderNode: any
	/**
	 * 内容真实 dom
	 */
	ContentNode: any
	constructor(props: IProps) {
		super(props)
		this.state = {
			sliderIconStyle: 'left',
			sidebarType: this.props.sidebarType ? this.props.sidebarType : 'left',
			mode: this.props.mode ? this.props.mode : 'middle',
			props
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { mode } = nextProps
		const { props } = prevState
		if (mode !== props.mode) {
			return {
				mode,
				props: {
					mode
				}
			}
		}
		return null
	}

	shouldComponentUpdate(nextProps) {
		this.preMode = nextProps.mode // 保存 state.mode 之前的 mode 参数，确保可以在当前状态与原始状态之间正常切换
		return true
	}

	render() {
		console.log(this.props.children)
		return this.getCurrentComponent()
	}



	/**
	 * @author duxx
	 * @desc 获取当前布局模式
	 */
	getCurrentComponent = () => {
		const childrenComs: any = this.props.children
		let silderNodeStyle
		let silderContentNodeStyle
		let sliderIconStyle
		const mode = this.state.mode
		switch (mode) {
			case 'min':
				silderNodeStyle = 'frame-slider-layout-min-width'
				silderContentNodeStyle = 'frame-main-layout-min-width'
				sliderIconStyle = this.state.sliderIconStyle
				break
			case 'middle':
				silderNodeStyle = 'frame-slider-layout-middle-width'
				silderContentNodeStyle = 'frame-main-layout-middle-width'
				sliderIconStyle = this.state.sliderIconStyle
				break
			case 'max':
				silderNodeStyle = 'frame-slider-layout-max-width'
				silderContentNodeStyle = 'frame-main-layout-max-width'
				sliderIconStyle = this.state.sliderIconStyle
				break
			default:
				console.error('SliderLayout 组件 mode 参数错误' + mode)
		}

		let component
		if (this.state.sidebarType === 'right') {
			// component = <div className='frame-layout-custom'>
			// 	<div className={`frame-main-layout-default ${silderContentNodeStyle}`} ref={(node) => this.ContentNode = node}>
			// 		{
			// 			this.props.Content
			// 				? this.props.Content
			// 				: childrenComs.props.children[1]
			// 		}
			// 	</div>
			// 	<div className={`frame-Sidebar-layout-default ${silderNodeStyle}`} ref={(node) => this.silderNode = node} >
			// 		{
			// 			this.props.Sidebar
			// 				? this.props.Sidebar
			// 				: childrenComs.props.children[1]
			// 		}
			// 		<div className='frame-silder-btn-silder-left' onClick={this.toggleSilder}>
			// 			<Icon type={sliderIconStyle} />
			// 		</div>
			// 		<div className='frame-silder-btn-silder-right' onClick={this.toggleSilder}>
			// 			<Icon type={sliderIconStyle === 'left' ? 'right' : 'left'} />
			// 		</div>
			// 	</div>
			// </div>
			component = <div className='frame-layout-custom'>
				<div className={`frame-main-layout-default ${silderContentNodeStyle}`} ref={(node) => this.ContentNode = node}>
					{
						this.props.Content
							? this.props.Content
							: childrenComs.props.children[1]
					}
				</div>
				<div className={`frame-slider-layout-default ${silderNodeStyle}`} ref={(node) => this.silderNode = node} >
					{
						this.props.Sidebar
							? this.props.Sidebar
							: childrenComs.props.children[1]
					}
					<div className='frame-silder-btn-slider-left' onClick={this.toggleSilder}>
						<Icon type={sliderIconStyle} />
					</div>
					<div className='frame-silder-btn-slider-right' onClick={this.toggleSilder}>
						<Icon type={sliderIconStyle === 'left' ? 'right' : 'left'} />
					</div>
				</div>
			</div>
		} else {
			component = <div className='frame-layout-custom'>
				<div className={`frame-slider-layout-default ${silderNodeStyle}`} ref={(node) => this.silderNode = node} >
					{
						this.props.Sidebar
							? this.props.Sidebar
							: childrenComs.props.children[0]
						// : <div> Sidebar</div>
					}
					<div className='frame-silder-btn-slider-left' onClick={this.toggleSilder}>
						<Icon type={sliderIconStyle} />
					</div>
					<div className='frame-silder-btn-slider-right' onClick={this.toggleSilder}>
						<Icon type={sliderIconStyle === 'left' ? 'right' : 'left'} />
					</div>
				</div>
				<div className={`frame-main-layout-default ${silderContentNodeStyle}`} ref={(node) => this.ContentNode = node}>
					{
						this.props.Content
							? this.props.Content
							: childrenComs.props.children[1]
							// : <div> content</div>
					}
				</div>
			</div>
		}
		return component
	}


	/**
	 * @author duxx
	 * @desc 侧边栏开关控制
	 */
	toggleSilder = () => {
		if (this.state.mode === 'middle' || this.state.mode === 'max') {
			this.setState({
				mode: 'min',
				sliderIconStyle: 'right'
			})
		} else {
			switch (this.preMode) {
				case 'middle':
					this.setState({
						mode: 'middle',
						sliderIconStyle: 'left'
					})
					break
				case 'max':
					this.setState({
						mode: 'max',
						sliderIconStyle: 'left'
					})
					break
				default:
					console.error('SidebarLayout 组件 mode 参数错误' + this.preMode)
			}
		}
	}
}
