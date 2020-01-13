import * as React from 'react'
import { Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'
import './index.less'
import { IViewConfig } from '@components/GISComs/Map'
const { SubMenu } = Menu
interface IProps {
}

/**
 * @author duxx
 * @desc 地图页面的侧边栏模块
 */
export default class MapSidebar extends React.Component<IProps> {
	viewConfig: IViewConfig
	constructor(props: IProps) {
		super(props)
	}


	render() {
		return (
			<div className='MapSidebar-wrap'>
				<Menu mode='inline' defaultSelectedKeys={['1']}>
					<Menu.Item key='1'>
						{/* <NavLink to='/systemManagement/setting'> */}
						<NavLink to='/index/map/preProject'>
							<Icon type='user' />
							<span className='nav-text'>预立项</span>
						</NavLink>
					</Menu.Item>
					<SubMenu key='2'
						title={
							<span>
								<Icon type='clock-circle' />
								<span className='nav-text'>项目列表</span>
							</span>
						}
					>
						<Menu.Item key='21'>
							<NavLink to='/index/map/projectList/test1'>
								<span className='nav-text'>渭南市土改项目</span>
							</NavLink>
						</Menu.Item>
						<Menu.Item key='22'>
							<NavLink to='/index/map/projectList/test2'>
								<span className='nav-text'>华州区土改项目</span>
							</NavLink>
						</Menu.Item>
					</SubMenu>
					<Menu.Item key='3'>

						<NavLink to='/index/map/historyProject'>
							<Icon type='upload' />
							<span className='nav-text'>历史项目</span>
						</NavLink>
					</Menu.Item>
				</Menu>
			</div>
		)
	}
}
