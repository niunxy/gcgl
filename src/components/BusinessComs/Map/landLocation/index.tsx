import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'

interface IProps {
	match: any,
	form: any,
	location: any
}

interface IState {
}

export default class LandLocation extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)

	}
	render() {
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='land-location'>
						land location
					</div>
				</div>
			)
	}
}