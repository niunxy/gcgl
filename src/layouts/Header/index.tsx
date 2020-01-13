import * as React from 'react'
import './index.less'
import NavBar from '@components/CommonComs/NavBar'
import LoginUtils from '@utils/Login'
import User from './user'
import { observer, inject } from 'mobx-react'

// import appConfig from '@config/app.config'

/**
 * @author duxx
 * @desc 一张图系统首部
 */

interface IProps {
	stores?: any
}
@inject('stores')
@observer
class MapHeader extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props)
	}

	/* const mapMenus = [
		{
			// key: ['map'],
			key: 'map',
			to: '/index/map',
			title: '首页'
		},

		{
			// key: ['dataUpload'],
			key: 'dataUpload',
			to: '/index/dataUpload',
			title: '资料上传'
		},
		{
			// key: ['processMonitoring'],
			key: 'processMonitoring',
			to: '/index/processMonitoring',
			title: '过程监控'
		},
		{
			// key: ['statisticalAnalysis'],
			key: 'statisticalAnalysis',
			to: '/index/statisticalAnalysis',
			title: '统计分析'
		},
		{
			// key: ['examineAndApprove'],
			key: 'examineAndApprove',
			to: '/index/examineAndApprove',
			title: '审批提醒'
		},
		{
			// key: ['setting'],
			key: 'setting',
			to: '/index/systemManagement',
			title: '系统管理'
		},
	] */
	render() {
		// const arr = StorageUtils.getLocalStorage('menuData')
		return (
			<div className='map-header-wrap'>
				<div className='map-header-content'>
					{/* <p className='map-header-title'>{appConfig.projectName}</p> */}
					<img src={require('../../../public/images/logo.png')} alt='土地工程项目监督管理平台' style={{ paddingLeft: '24px', height: '44px' }} />
					<NavBar />
					{LoginUtils.isLogin() ? <User infoId={this.props.stores.infoStore.infoId} /> : null}
				</div>
			</div>
		)
	}

}


export default MapHeader

