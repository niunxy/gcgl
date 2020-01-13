import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import { Layout, Menu, Icon, Spin } from 'antd'
const { Sider, Content } = Layout // Header
import { Switch, Route, Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
import StorageUtils from '@utils/StorageUtil'
const space = lazy(() => import('./space'))
const routine = lazy(() => import('./routine'))
const projectForm = lazy(() => import('./projectForm'))
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
export default class StatisticalAnalysis extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const filterMenuData = StorageUtils.getLocalStorage('menuData')
        let sysSubMenu
        if (filterMenuData) {
            filterMenuData.forEach((item) => {
                switch (item.name) {
                    case '统计分析':
                        item.component = StatisticalAnalysis
                        item.path = item.to
                        sysSubMenu = item.child
                        break
                }
            })
        }
        const subMenu = sysSubMenu
        subMenu.forEach((item: any) => {
            if (item.url === 'space') {
                item.component = space
            } else if (item.url === 'routine') {
                item.component = routine
            } else if (item.url === 'projectForm') {
                item.component = projectForm
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
            case 'space':
                type = ListOverview
                break
            case 'routine':
                type = Message
                break
            case 'projectForm':
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
                <div className='StatisticalAnalysis-wrap'>
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
                                    background: 'rgb(241, 242, 246)',
                                    overflow: 'auto'
                                }}
                            >
                                <Suspense fallback={<Spin />}>
                                    <Switch>
                                        {
                                            this.state.subMenu.map((item: any) => (
                                                <Route path={'/index/StatisticalAnalysis/' + item.url} render={(props) => (<item.component {...props} buttons={item.child} />)} key={item.id} />
                                            ))
                                        }
                                        <Redirect to={'/index/StatisticalAnalysis/' + this.state.subMenu[0].url} />
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
    }
}
