import * as React from 'react'
import './index.less'
import Header from '@layouts/Header'
interface IState {

}

interface IProps {
}

/**
 * @author duxx
 * @desc 首页
 */
export default class Home extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)

	}
	componentDidMount() {
		// console.log(global.map)
	}
	render() {
		return (
			<div className='homeWrap'>
				<Header />
				{this.props.children}
			</div>
		)
	}
}
