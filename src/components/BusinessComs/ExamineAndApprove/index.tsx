import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import { Layout, Menu, Icon, Breadcrumb, Spin } from 'antd'
const { Sider, Content } = Layout // Header
import { Switch, Route, Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
import StorageUtils from '@utils/StorageUtil'
const listOverview = lazy(() => import('./listOverview'))
const infoList = lazy(() => import('./infoList'))
const approva = lazy(() => import('./approva'))
const modify = lazy(() => import('./modify'))

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
    name: string
}


/**
 * @author ny
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
                    case '审批提醒':
                        item.component = SystemManagement
                        item.path = item.to
                        sysSubMenu = item.child
                        break
                }
            })
        }
        const subMenu = sysSubMenu
        subMenu.forEach((item: any) => {
            if (item.url === 'listOverview') {
                item.component = listOverview
            } else if (item.url === 'infoList') {
                item.component = infoList
            } else if (item.url === 'approva') {
                item.component = approva
            } else if (item.url === 'modify') {
                item.component = modify
            }
        })
        this.state = {
            collapsed: false,
            subMenu,
            defaultSelectedKeys: [],
            name: '消息列表'
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
            case 'listOverview':
                type = ListOverview
                break
            case 'infoList':
                type = Message
                break
            case 'approva':
                type = Approval
                break
            case 'modify':
                type = ListOverview
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
                <div className='ExamineAndApprove-wrap'>
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
                                    <Breadcrumb.Item>审批提醒</Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        {this.state.name}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div className='placeHolder' />
                                <Suspense fallback={<Spin />}>
                                    <Switch>
                                        {
                                            this.state.subMenu.map((item: any) => (
                                                <Route path={'/index/examineAndApprove/' + item.url} render={(props) => (<item.component {...props} buttons={item.child} />)} key={item.id} />
                                            ))
                                        }
                                        <Redirect to={'/index/examineAndApprove/' + this.state.subMenu[0].url} />
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
    }
}
