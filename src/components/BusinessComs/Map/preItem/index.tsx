import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Button } from 'antd'
import './index.less'
interface IProps {
	history: any,
}
/**
 * @author ny
 * @desc 基本信息
 */
export default class PreItem extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props)
	}

	createProject = () => {
		this.props.history.push('/index/map/createProject')
	}

	render() {
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (

				<div className='base-info'>
						{
							<React.Fragment>
								<Button onClick={this.createProject}>新建项目</Button>
							</React.Fragment>
						}
				</div>
			)
	}
}