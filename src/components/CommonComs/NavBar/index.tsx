import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import StorageUtils from '@utils/StorageUtil'
import Home from '../../../../public/images/icon_home.svg'
import Analytics from '../../../../public/images/icon_analytics.svg'
import List from '../../../../public/images/icon_list.svg'
import Settings from '../../../../public/images/icon_settings.svg'
import Folder from '../../../../public/images/icon_folder.svg'
import Calendar from '../../../../public/images/icon_calendar.svg'
// import PubSub from 'pubsub-js'
// import { observer, inject } from 'mobx-react'
import {
	NavLink,
	// Link
} from 'react-router-dom'


import { Menu, Icon } from 'antd'
import './index.less'

/* interface INavs {
	key: string // string[],
	to: any // string
} */
export interface IProps extends RouteComponentProps {
	// empty?: any
	height?: string
	// theme?: any
	// style?: any
	// navs?: any[],
	history: any,
	// stores: any
}
interface IState {
	currentSelected?: string// string[]
	navs: any[]
}

/**
 * @author duxx
 * @desc 导航栏组件
 */
/* @inject('stores')
@observer */
class NavBar extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		const tab = /\/(\w+)[\/]?$/.exec(window.location.href)
		this.state = {
			currentSelected: (tab !== null && (tab as string[]).length > 0) ? (tab as string[])[1] : '/', // ['/'],
			// navs: this.props.navs ? this.props.navs : this.props.navs // testNavs // []
			navs: StorageUtils.getLocalStorage('menuData')
		}
	}
	handleClick = (key) => {
		console.log(key)
		this.setState({
			currentSelected: key,
		})
	}

	getIcon = (key) => {
		let icon
		switch (key) {
			case 'map': // gis 模块
				icon = Home
				break
			case 'dataUpload': // 资料上传 
				icon = Folder
				break
			case 'processMonitoring': // 过程监控
				icon = Calendar
				break
			case 'StatisticalAnalysis': // 统计分析
				icon = Analytics
				break
			case 'examineAndApprove': // 审批提醒
				icon = List
				break
			case 'systemManagement': // 系统管理
				icon = Settings
				break
		}
		return <Icon style={{ fontSize: '24px', position: 'relative', top: '2px' }} component={icon} />
	}
	renderNavBarAntdMenuCom = (navs) => {
		/** ul 的风格 */
		const menuStyle = {
			height: '70px', // this.props.height!,       // 自定义导航栏高度
			lineHeight: '70px', // this.props.height!    // 确保在自定义高度下导航内容保持在导航条内部上下居中
			backgroundColor: '#2177d7',
		}
		return (
			<div className='navBar-wrap'>
				<Menu style={menuStyle} onClick={this.handleClick} selectedKeys={[this.state.currentSelected!]} mode='horizontal'>
					{
						navs.map((navItem: any) => {
							return (
								<Menu.Item key={navItem.key}>
									<NavLink activeClassName='NavBars-activeNavLink' to={navItem.to}>
										{this.getIcon(navItem.key)}
										{navItem.title}
									</NavLink>
								</Menu.Item>
							)
						})
					}
				</Menu>
			</div>
		)
	}
	render() {
		return (
			<React.Fragment>
				{this.state.navs && this.renderNavBarAntdMenuCom(this.state.navs)}
			</React.Fragment>
		)
	}
}

export default withRouter(NavBar)
