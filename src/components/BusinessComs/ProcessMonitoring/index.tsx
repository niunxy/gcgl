import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import { Layout, Menu, Icon, Spin } from 'antd'
const { Sider, Content } = Layout // Header
import { Switch, Route, Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
import StorageUtils from '@utils/StorageUtil'
const supervise = lazy(() => import('./supervise'))
const engineering = lazy(() => import('./engineering'))
const construction = lazy(() => import('./construction'))
// const EngineeringProject =  lazy(() => import('./engineeringProject'))
const threeScreen = lazy(() => import('./threeScreen'))
const fourScreen = lazy(() => import('./fourScreen'))
const SuperviseExamination = lazy(() => import('./superviseExamination'))
const Screen = lazy(() => import('./screen'))
const Historical = lazy(() => import('./historical'))
import Approval from '../../../../public/images/icon_list_approval.svg'
import ListOverview from '../../../../public/images/icon_list_listoverview.svg'
import Message from '../../../../public/images/icon_list_message.svg'

interface IProps {
    // subMenu: any,
    history: any
}
interface IState {
    collapsed: boolean,
    subMenu: any[],
    defaultSelectedKeys: any[],
}


/**
 * @author ny
 * @desc 项目表格
 */
export default class ProcessMonitoring extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const filterMenuData = StorageUtils.getLocalStorage('menuData')
        let sysSubMenu
        if (filterMenuData) {
            filterMenuData.forEach((item) => {
                switch (item.name) {
                    case '过程监控':
                        item.component = ProcessMonitoring
                        item.path = item.to
                        sysSubMenu = item.child
                        break
                }
            })
        }
        const subMenu = sysSubMenu
        subMenu.forEach((item: any) => {
            if (item.url === 'supervise') {
                item.component = supervise
            } else if (item.url === 'engineering') {
                item.component = engineering
            } else if (item.url === 'construction') {
                item.component = construction
            } else if (item.url === 'threeScreen') {
                item.component = threeScreen
            } else if (item.url === 'fourScreen') {
                item.component = fourScreen
            } else if (item.url === 'supervisorExamination') {
                item.component = SuperviseExamination
            } else if (item.url === 'historical') {
                item.component = Historical
            } else if (item.url === 'screen') {
                item.component = Screen
            }
        })
        this.state = {
            collapsed: false,
            subMenu,
            defaultSelectedKeys: []
        }
    }


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    /*  renderLogo = () => (
         this.state.collapsed ? <img className='SystemManagement-only-logo' src={logo} alt='logo' /> : <div className='SystemManagement-logo-text'>
             <img className='SystemManagement-logo' src={logo} alt='logo' /><span className='SystemManagement-text'>土地工程管理项目</span>
         </div>
     ) */

    menuChange = (key) => {
        const arr: any[] = []
        arr[0] = key
        this.setState({
            defaultSelectedKeys: arr
        })
        this.props.history.push(key)
    }

    initMenuActive = () => {
        const arr = this.props.history.location.pathname.split('/')
        const len = arr.length - 1
        this.setState({
            defaultSelectedKeys: [arr[len]]
        })
    }

    renderIcon = (url) => {
        let type
        switch (url) {
            case 'fourScreen':
                type = ListOverview
                break
            case 'threeScreen':
                type = ListOverview
                break
            case 'screen':
                type = ListOverview
                break
            case 'supervise':
                type = ListOverview
                break
            case 'engineering':
                type = Message
                break
            case 'historical':
                type = Message
                break
            case 'construction':
                type = Approval
                break
            case 'supervisorExamination':
                type = Approval
                break

        }
        return (
            <Icon style={{ fontSize: '16px', position: 'relative', top: '1px' }} component={type} />
        )
    }

    componentDidMount() {
        this.initMenuActive()
    }

    render() {
        // const { subMenu } = this.props

        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='ProcessMonitoring-wrap'>
                    <Layout>
                        {/* trigger={null} */}
                        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                            {/* <div className='logo' >
                            {this.renderLogo()}
                        </div> */}
                            <Menu mode='inline' selectedKeys={this.state.defaultSelectedKeys}>
                                {
                                    this.state.subMenu.map((item: any) => {
                                        return (
                                            <Menu.Item key={item.url} onClick={this.menuChange.bind(this, item.url)}>
                                                {/*  <NavLink to={'/index/systemManagement/' + item.url}> */}
                                                {this.renderIcon(item.url)}
                                                <span className='nav-text'>{item.name}</span>
                                                {/* </NavLink> */}
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content
                                style={{
                                    background: 'rgb(241, 242, 246)'
                                }}
                            >
                                <Suspense fallback={<Spin />}>
                                    <Switch>
                                        {
                                            this.state.subMenu.map((item: any) => (
                                                <Route path={'/index/processMonitoring/' + item.url} render={(props) => (<item.component {...props} buttons={item.child} />)} key={item.id} />
                                            ))
                                        }
                                        <Redirect to={'/index/processMonitoring/' + this.state.subMenu[0].url} />
                                        {/*<Route path={'/index/processMonitoring/engineeringProject'} render={(props) => (<EngineeringProject {...props} />)} />*/}
                                        {/*<Redirect to={'/index/processMonitoring/engineeringProject'} />*/}
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div >
            )
    }
}
