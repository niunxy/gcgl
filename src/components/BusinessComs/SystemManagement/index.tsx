import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import { Layout, Menu, Icon, Breadcrumb, Spin } from 'antd'
import logo from './img/logo.png'
const { Sider, Content } = Layout // Header
import { Switch, Route, Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
const showMenu = lazy(() => import('./menuManage'))
const showUser = lazy(() => import('./showUser'))
const showRole = lazy(() => import('./showRole'))
const showDept = lazy(() => import('./showDept'))
const showModel = lazy(() => import('./showModel'))
const showAct = lazy(() => import('./showAct'))

import StorageUtils from '@utils/StorageUtil'

import UserIcon from '../../../../public/images/icon_settings_user.svg'
import RoleIcon from '../../../../public/images/icon_settings_account.svg'
import MenuIcon from '../../../../public/images/icon_settings_menu.svg'
import PartIcon from '../../../../public/images/icon_settings_organization.svg'
import ProcessIcon from '../../../../public/images/icon_settings_process.svg'
import ModelIcon from '../../../../public/images/icon_settings_cube.svg'

interface IProps {
    // subMenu: any,
    history: any
}
interface IState {
    collapsed: boolean,
    subMenu: any[],
    defaultSelectedKeys: any[],
    name: string
}
/* const showMenu = lazy(() => import('./menuManage'))
const showUser = lazy(() => import('./showUser'))
const showRole = lazy(() => import('./showRole')) */


/**
 * @author duxx
 * @desc 系统管理模块
 */
export default class SystemManagement extends React.Component<IProps, IState> {
    constructor(props: IProps) {

        super(props)
        const filterMenuData = StorageUtils.getLocalStorage('menuData')
        let sysSubMenu
        if (filterMenuData) {
            filterMenuData.forEach((item) => {
                switch (item.name) {
                    case '系统管理':
                        item.component = SystemManagement
                        item.path = item.to
                        sysSubMenu = item.child
                        break
                }
            })
        }
        const subMenu = sysSubMenu
        subMenu.forEach((item: any) => {
            if (item.url === 'showMenu') {
                item.component = showMenu
            } else if (item.url === 'showUser') {
                item.component = showUser
            } else if (item.url === 'showRole') {
                item.component = showRole
            } else if (item.url === 'model') {
                item.component = showModel
            } else if (item.url === 'process') {
                item.component = showAct
            } else if (item.url === 'part') {
                item.component = showDept
            }
        })
        this.state = {
            collapsed: false,
            subMenu,
            defaultSelectedKeys: [],
            name: '菜单管理'
        }
    }


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    renderLogo = () => (
        this.state.collapsed ? <img className='SystemManagement-only-logo' src={logo} alt='logo' /> : <div className='SystemManagement-logo-text'>
            <img className='SystemManagement-logo' src={logo} alt='logo' /><span className='SystemManagement-text'>土地工程管理项目</span>
        </div>
    )

    menuChange = (key, name) => {
        const arr: any[] = []
        arr[0] = key
        this.setState({
            defaultSelectedKeys: arr,
            name
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
            case 'showMenu':
                type = MenuIcon
                break
            case 'part':
                type = PartIcon
                break
            case 'showRole':
                type = RoleIcon
                break
            case 'showUser':
                type = UserIcon
                break
            case 'model':
                type = ModelIcon
                break
            case 'process':
                type = ProcessIcon
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
                <div className='SystemManagement-wrap'>
                    <Layout>
                        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                            <Menu mode='inline' selectedKeys={this.state.defaultSelectedKeys}>
                                {
                                    this.state.subMenu.map((item: any) => {
                                        return (
                                            <Menu.Item key={item.url} onClick={this.menuChange.bind(this, item.url, item.name)}>
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
                                    /* margin: '4px',
                                    padding: '8px', */
                                    background: 'rgb(241, 242, 246)',
                                }}
                            >
                                <Breadcrumb className='breadcrumb'>
                                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        {this.state.name}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div className='placeHolder' />
                                <Suspense fallback={<Spin />}>
                                    <Switch>
                                        {
                                            this.state.subMenu.map((item: any) => (
                                                <Route path={'/index/systemManagement/' + item.url} render={(props) => (<item.component {...props} buttons={item.child} />)} key={item.id} />
                                            ))
                                        }
                                        <Redirect to={'/index/systemManagement/' + this.state.subMenu[0].url} />
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
    }
}
