import * as React from 'react'
const { Fragment, Suspense, lazy } = React // 
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom' // 
import { Spin } from 'antd'
import stores from '@stores/index.store'
import { Provider } from 'mobx-react'
import Home from '@pages/Home'
import loginUtils from '@utils/Login'
// import StorageUtils from '@utils/StorageUtil'

const Login = lazy(() => import('@pages/Login'))

const Map = lazy(() => import('@components/BusinessComs/Map/home'))
const ProcessMonitoring = lazy(() => import('@components/BusinessComs/ProcessMonitoring'))
const StatisticalAnalysis = lazy(() => import('@components/BusinessComs/StatisticalAnalysis'))
const DataUpload = lazy(() => import('@components/BusinessComs/DataUpload'))
const ExamineAndApprove = lazy(() => import('@components/BusinessComs/ExamineAndApprove'))

const SystemManagement = lazy(() => import('@components/BusinessComs/SystemManagement'))

// const filterMenuData = StorageUtils.getLocalStorage('menuData')
/* interface IProps {
	subMenu: any
} */
class Pages extends React.Component<any> {
	constructor(props: any) {
		super(props)
	}
	render() {
		return (
			<Provider stores={stores}>
				<HashRouter>
					<Suspense fallback={<Spin />}>
						<Fragment>
							<Switch>

								<Route exact path='/' component={() => !loginUtils.isLogin() ? <Redirect to='/login' /> : <Redirect to='/index/map' />} />
								<Route path='/login' component={Login} />
								<Route path='/index' render={
									() => {
										return (
											!loginUtils.isLogin() ? <Redirect to='/login' /> : <Home>
												<Suspense fallback={<Spin />}>
													<Switch>
														<Route path='/index/map' render={(props) => (
															<Map {...props} />
														)} />
														{/* {
															routes.map((route) => (
																<Route
																	exact
																	key={route.path}
																	path={route.path}
																	render={(props) => (<route.component {...props} />)} />
															))
														} */}
														<Route path='/index/dataUpload' render={(props) => (<DataUpload {...props} />)} />
														<Route path='/index/examineAndApprove' render={(props) => (<ExamineAndApprove {...props} />)} />
														<Route path='/index/systemManagement' render={(props) => (<SystemManagement {...props} />)} />
														<Route path='/index/StatisticalAnalysis' render={(props) => (<StatisticalAnalysis {...props} />)} />
														<Route path='/index/processMonitoring' render={(props) => (<ProcessMonitoring {...props} />)} />
													</Switch>
												</Suspense>
											</Home>
										)
									}
								} />
								<Redirect to='/' />
							</Switch>
						</Fragment>
					</Suspense>
				</HashRouter>
			</Provider>
		)
	}
}

export default Pages

/* const routes = [
	{
		path: '/index/processMonitoring',
		component: ProcessMonitoring,
		title: '过程监控'
	}
] */

