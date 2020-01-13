import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import loginUtils from '@utils/Login'
import StorageUtils from '@utils/StorageUtil'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Icon, Spin } from 'antd'
const infoList = lazy(() => import('./infoList'))
const templateDownload = lazy(() => import('./templateDownload'))
const file = lazy(() => import('./file'))
const fileOptional = lazy(() => import('./fileOptional'))
const formUpload = lazy(() => import('./formUpload'))
const spatialData = lazy(() => import('./spatialData'))
import DownloadFile from '../../../../public/images/icon_folder_downloadfile.svg'
import Folder from '../../../../public/images/icon_folder_folder.svg'
import Optional from '../../../../public/images/icon_folder_optional.svg'
import Server from '../../../../public/images/icon_folder_server.svg'
import Spreadsheetcell from '../../../../public/images/icon_folder_spreadsheetcell.svg'
import Wishlist from '../../../../public/images/icon_folder_wishlist.svg'
import _ from 'lodash'
const { Sider, Content } = Layout // Header

interface IProps {
    history: any
}
interface IState {
    collapsed: boolean,
    subMenu: any[],
    SelectedKeys: any[],
    name: string
}

/**
 * @author ny
 * @desc 资料上传模块
 */
export default class DataUpload extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const filterMenuData = StorageUtils.getLocalStorage('menuData')
        let menu
        if (filterMenuData) {
            filterMenuData.forEach((item) => {
                switch (item.name) {
                    case '档案资料':
                        item.component = DataUpload
                        item.path = item.to
                        menu = item.child
                        break
                }
            })
        }
        const subMenu = menu
        subMenu.forEach((item: any) => {
            if (item.url === 'templateDownload') {
                item.component = templateDownload
            } else if (item.url === 'infoList') {
                item.component = infoList
            } else if (item.url === 'file') {
                item.component = file
            } else if (item.url === 'formUpload') {
                item.component = formUpload
            } else if (item.url === 'spatialData') {
                item.component = spatialData
            } else if (item.url === 'fileOptional') {
                item.component = fileOptional
            }
        })
        this.state = {
            collapsed: false,
            subMenu,
            SelectedKeys: [],
            name: subMenu[0].name
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    menuChange = (key, name) => {
        const arr: any[] = []
        arr[0] = key
        this.setState({
            SelectedKeys: arr,
            name
        })
        this.props.history.push(key)
    }

    initMenuActive = () => {
        const arr = this.props.history.location.pathname.split('/')
        const len = arr.length - 1
        const fArr: any[] = []
        fArr.push(arr[len])
        this.setState({
            SelectedKeys: fArr
        })
        const temp = _.find(this.state.subMenu, item => item.url === arr[len])
        this.setState({
            name: temp.name
        })
    }

    renderIcon = (url) => {
        let type
        switch (url) {
            case 'infoList':
                type = Wishlist
                break
            case 'file':
                type = Folder
                break
            case 'fileOptional':
                type = Optional
                break
            case 'spatialData':
                type = Server
                break
            case 'formUpload':
                type = Spreadsheetcell
                break
            case 'templateDownload':
                type = DownloadFile
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

        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='DataUpload-wrap'>
                    <Layout>
                        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                            <Menu mode='inline' selectedKeys={this.state.SelectedKeys}>
                                {
                                    this.state.subMenu.map((item: any) => {
                                        return (
                                            <Menu.Item key={item.url} onClick={this.menuChange.bind(this, item.url, item.name)}>
                                                {this.renderIcon(item.url)}
                                                <span className='nav-text'>{item.name}</span>
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
                                <Breadcrumb className='breadcrumb'>
                                    <Breadcrumb.Item>档案资料</Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        {this.state.name}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div className='placeHolder' />
                                <Suspense fallback={<Spin />}>
                                    <Switch>
                                        {
                                            this.state.subMenu.map((item: any) => (
                                                <Route path={'/index/dataUpload/' + item.url} render={(props) => (<item.component {...props} buttons={item.child} />)} key={item.id} />
                                            ))
                                        }
                                        <Redirect to={'/index/dataUpload/' + this.state.subMenu[0].url} />
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
    }
}