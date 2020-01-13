import * as React from 'react'
import './index.less'
/* import MapContainer from '@components/MapContainer' */
import { IViewConfig } from '@components/GISComs/Map'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import SubregionLayout from '@layouts/SubregionLayout'
import MapSidebar from '@components/BusinessComs/MapSidebar'
interface IProps {
}

/**
 * @author duxx
 * @desc 地图 模块
 */
export default class Map extends React.Component<IProps> {
	viewConfig: IViewConfig
	constructor(props: IProps) {
		super(props)
	}


	render() {
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (

				<div className='map-instance'>
					<SubregionLayout sidebarType='left' mode='middle'>
						{
							<React.Fragment>
								<MapSidebar />
								{/* < MapContainer /> */}
							</React.Fragment>
						}
					</SubregionLayout>
				</div>
			)
	}
}

