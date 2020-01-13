import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
interface IProps {
}
/**
 * @author ny
 * @desc 基本信息
 */
export default class ImplementItem extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props)
	}


	render() {
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (

				<div className='base-info'>
						{
							<React.Fragment>
								实施项目
							</React.Fragment>
						}
				</div>
			)
	}
}