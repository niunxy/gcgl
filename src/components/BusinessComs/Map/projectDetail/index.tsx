import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import IndexAction from '@api/IndexAction'
interface IProps {
	id: string
}
/**
 * @author ny
 * @desc 基本信息
 */
export default class ProjectDetail extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props)
	}
	init = () => {
		IndexAction.GetDetail({id: this.props.id}).then((res) => {
			console.log(res)
		})
	}
	componentDidMount() {
		this.init()
	}
	render() {
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (

				<div className='base-info'>
						
					<React.Fragment>
						<div>
							项目简介
						</div>
					</React.Fragment>
						
				</div>
			)
	}
}