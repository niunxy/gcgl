import * as React from 'react'
const { Suspense, lazy } = React
import './index.less'
import { Layout, Menu, Icon, message, Spin, Row, Col, Tooltip, AutoComplete, Button } from 'antd'
import { Switch, Route, Redirect } from 'react-router-dom'
import loginUtils from '@utils/Login'
const preItem = lazy(() => import('./preItem'))
const implementItem = lazy(() => import('./implementItem'))
const checkItem = lazy(() => import('./checkItem'))
const createProject = lazy(() => import('./preItem/createProject'))
const preItemDetail = lazy(() => import('./preItemDetail'))
const landLocation = lazy(() => import('./landLocation'))
const preItemLand = lazy(() => import('./preItemLand'))
const implementItemDetail = lazy(() => import('./implementItemDetail'))
const implementItemDoc = lazy(() => import('./implementItemDoc'))
const LandMap = lazy(() => import('./landMap'))
const Subcontract = lazy(() => import('./subcontract'))
import StorageUtils from '@utils/StorageUtil'
import Checklist from '../../../../public/images/icon_home_checklist.svg'
import Matrix from '../../../../public/images/icon_home_matrix.svg'
import Listonclipboard from '../../../../public/images/icon_home_listonclipboard.svg'
import TransTool from '@utils/TransTool'
import IndexAction from '@api/IndexAction'
import getSubProjectByXmId from '@api/dummyData/getSubProjectByXmId'
import dev from '@config/dev.config'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import _ from 'lodash'
import { shouldScreen, shouldParcel } from '@utils/utils'
const { SubMenu } = Menu
const { Sider, Content } = Layout
const filterMenuData = StorageUtils.getLocalStorage('menuData')
let mapSubMenu

if (filterMenuData) {
    filterMenuData.forEach((item: any) => {
        switch (item.name) {
            case '首页':
                item.component = Map
                item.path = item.to
                mapSubMenu = item.child
                break
        }
    })
}

interface IProps {
    stores?: any,
    history: any
}

interface IState {
    projectList: any,
    inputProj: string,
    searchProj: string,
    searchOpenKeys: string[],
    openKeys: string[]
}

@inject('stores')
@observer
export default class Home extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
        const { openKeys: storedOpenKeys } = toJS(this.props.stores.mapStore.homeSiderMenu)
        this.state = {
            projectList: [],
            inputProj: '',
            searchProj: '',
            searchOpenKeys: [],
            openKeys: storedOpenKeys && storedOpenKeys.length > 0 ? storedOpenKeys : []
        }
        this.init()
    }

    componentWillReceiveProps() {
        const { mapStore } = this.props.stores
        const { refresh, collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
        if (refresh) {
            mapStore.onHomeSiderMenu({
                refresh: false,
                collapsed,
                indexMenus
            })
            this.init()
        }
    }

    toggle = () => {
        const { mapStore } = this.props.stores
        const { collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
        mapStore.onHomeSiderMenu!({
            collapsed: !collapsed,
            indexMenus
        })
    }

    init = () => {
        const { mapStore } = this.props.stores
        const subMenu = mapSubMenu && mapSubMenu.filter((item) => {
            return item.name !== '创建项目'
        })
        IndexAction.GetIndexMenu({}).then((res: any) => {
            if (res && res.status === 200) {
                const ylxChild: any[] = []
                const ssxmChild: any[] = []
                const ysmxChild: any[] = []
                const projectList: string[] = []
                const result = res.data
                result && result.forEach((value: any) => {
                    projectList.push(value.xmmc)
                    const obj: any = {}
                    // 预立项
                    if (value.xmjd >= 1 && value.xmjd <= 4) {
                        obj.name = value.xmmc
                        obj.url = ''
                        obj.id = value.id
                        obj.county = value.county
                        if (shouldScreen()) {
                            obj.child = [
                                {
                                    name: '项目简介',
                                    url: 'detail',
                                    id: value.id
                                },
                                {
                                    name: '地块筛选',
                                    url: 'land',
                                    id: value.id,
                                    processInstanceId: value.processInstanceId,
                                    bgcs: value.bgcs,
                                    kbbgcs: value.kbbgcs,
                                    userId: value.userId,
                                    userName: value.userName,
                                    xmmc: value.xmmc,
                                    province: value.province,
                                    city: value.city,
                                    county: value.county,
                                    xmlxdm: value.xmlxdm,
                                    xmjd: value.xmjd
                                }
                            ]
                        } else {
                            obj.child = [
                                {
                                    name: '项目简介',
                                    url: 'detail',
                                    id: value.id
                                }
                            ]
                        }
                        ylxChild.push(obj)
                    }
                    // 实施项目
                    if ((value.xmjd >= 5 && value.xmjd <= 27) || (value.xmjd >= 31 && value.xmjd <= 35)) {
                        obj.name = value.xmmc
                        obj.xmjd = TransTool.getXMJD(value.xmjd)
                        obj.isWorking = true // to distinguish 实施项目 and 验收项目
                        obj.url = ''
                        obj.id = value.id
                        if (shouldParcel()) {
                            obj.child = [
                                {
                                    name: '项目简介',
                                    url: 'detail',
                                    id: value.id
                                },
                                {
                                    name: '项目资料',
                                    url: 'document',
                                    id: value.id,
                                    processInstanceId: value.processInstanceId,
                                    xmmc: value.xmmc,
                                    xmjd: value.xmjd
                                },
                                {
                                    name: '地块分包',
                                    url: 'subcontract',
                                    id: value.id,
                                    xmmc: value.xmmc,
                                    xmjd: value.xmjd,
                                    county: value.county,
                                    processInstanceId: value.processInstanceId,
                                    bgcs: value.bgcs,
                                },
                                {
                                    name: '子项目名称',
                                    url: 'list',
                                    id: value.id,
                                    xmmc: value.xmmc,
                                    xmjd: value.xmjd,
                                    processInstanceId: value.processInstanceId,
                                    bgcs: value.bgcs,
                                    kbbgcs: value.kbbgcs,
                                    child: []
                                }
                            ]
                        } else {
                            obj.child = [
                                {
                                    name: '项目简介',
                                    url: 'detail',
                                    id: value.id
                                },
                                {
                                    name: '项目资料',
                                    url: 'document',
                                    id: value.id,
                                    processInstanceId: value.processInstanceId,
                                    xmmc: value.xmmc,
                                    xmjd: value.xmjd
                                },
                                {
                                    name: '子项目名称',
                                    url: 'list',
                                    id: value.id,
                                    xmmc: value.xmmc,
                                    xmjd: value.xmjd,
                                    processInstanceId: value.processInstanceId,
                                    bgcs: value.bgcs,
                                    kbbgcs: value.kbbgcs,
                                    child: []
                                }
                            ]
                        }
                        ssxmChild.push(obj)
                    }
                    // 验收项目
                    if (value.xmjd === 28 || value.xmjd === -1) {
                        obj.name = value.xmmc
                        obj.xmjd = TransTool.getXMJD(value.xmjd)
                        obj.isWorking = false // to distinguish 实施项目 and 验收项目
                        obj.url = ''
                        obj.id = value.id
                        obj.child = [
                            {
                                name: '项目简介',
                                url: 'detail',
                                id: value.id
                            },
                            {
                                name: '项目资料',
                                url: 'document',
                                id: value.id,
                                processInstanceId: value.processInstanceId,
                                xmmc: value.xmmc,
                                xmjd: value.xmjd
                            },
                            {
                                name: '子项目名称',
                                url: 'list',
                                id: value.id,
                                xmmc: value.xmmc,
                                xmjd: value.xmjd,
                                child: []
                            }
                        ]
                        ysmxChild.push(obj)
                    }
                })
                subMenu.forEach(item => {
                    if (item.name === '预立项') {
                        item.child = ylxChild
                    } else if (item.name === '实施项目') {
                        item.child = ssxmChild
                    } else if (item.name === '验收项目') {
                        item.child = ysmxChild
                    }
                })
                this.setState({
                    projectList
                })
                mapStore.onHomeSiderMenu!({
                    collapsed: toJS(mapStore.homeSiderMenu.collapsed),
                    indexMenus: subMenu
                })
            }
        })
    }

    getZXMMC = (value, valueP) => {
        const { mapStore } = this.props.stores
        const { id } = value
        mapStore.loadParentXm(id)
        IndexAction.GetSubProjectByXmId({ xmId: id }).then((res: any) => {
            if (dev.isDummy) {
                res = getSubProjectByXmId
            }
            if (res && res.status === 200) {
                const { indexMenus } = toJS(this.props.stores.mapStore.homeSiderMenu)
                const ssxm = _.find(indexMenus, { name: valueP.isWorking ? '实施项目' : '验收项目' })
                const xmj = _.find(ssxm.child, { id })
                const zxmmc = _.find(xmj.child, { name: '子项目名称' })
                res.data && res.data.length > 0 && res.data.forEach((item) => {
                    item.processInstanceId = value.processInstanceId
                    item.bgcs = value.bgcs
                    item.kbbgcs = value.kbbgcs
                    item.xmjd = value.xmjd
                })
                zxmmc.child = res.data
                mapStore.onHomeSiderMenu!({
                    collapsed: toJS(mapStore.homeSiderMenu.collapsed),
                    indexMenus
                })
            } else {
                message.error('没有查询到子项目')
            }
        })
    }

    showDetail = (name, isWorking, value) => {
        const { mapStore } = this.props.stores
        const { name: subName, id, xmmc, xmjd, processInstanceId } = value
        if (name === '预立项') {
            if (subName === '项目简介') {
                this.props.history.replace('/index/map/preItemDetail/' + id)
            } else if (subName === '地块筛选') {
                this.props.history.replace('/index/map/preItemLand/' + id)
                mapStore.onShowPlot(false)
                mapStore.saveXmScreenId(id)
                const obj = {
                    id: value.id,
                    processInstanceId: value.processInstanceId,
                    bgcs: value.bgcs,
                    kbbgcs: value.kbbgcs,
                    userId: value.userId,
                    userName: value.userName,
                    xmmc: value.xmmc,
                    province: value.province,
                    city: value.city,
                    county: value.county,
                    xmlxdm: value.xmlxdm,
                    xmjd: value.xmjd
                }
                mapStore.saveProjectInfo(obj)
            }
        } else if (name === '实施项目' || name === '验收项目') {
            if (subName === '项目简介') {
                this.props.history.replace(`/index/map/implementItemDetail/${id}/${isWorking}`)
            } else if (subName === '项目资料') {
                this.props.history.replace(`/index/map/implementItemDoc/${id}/${xmmc}/${xmjd}/${processInstanceId}/${isWorking}`)
            } else if (subName === '地块分包') {

                // this.props.history.replace(`/index/map/implementItemDoc/${id}/${xmmc}/${xmjd}/${isWorking}`)
                const obj = {
                    id: value.id,
                    processInstanceId: value.processInstanceId,
                    bgcs: value.bgcs,
                    kbbgcs: value.kbbgcs,
                    userId: '',
                    userName: '',
                    xmmc: value.xmmc,
                    province: '',
                    city: '',
                    county: value.county,
                    xmlxdm: '',
                    xmjd: value.xmjd
                }
                mapStore.saveProjectInfo(obj)
                mapStore.saveXmFbId(value.id)
                StorageUtils.setLocalStorage('xmFbId', value.id)
                StorageUtils.delLocalStorage('screenStatus')
                // mapStore.saveStopXm(obj)
                this.props.history.replace(`/index/map/subcontract/${id}`)
            } else {
                mapStore.saveXmId(value.dkxh)
                this.props.history.replace({ pathname: '/index/map/home', state: { info: value } })
            }
        }
    }
    // 子项目列表下的项目名称点击事件
    mapLocation = (value) => {
        const { mapStore } = this.props.stores
        mapStore.saveXmName(value.xmmc)
        this.props.history.replace({ pathname: '/index/map/home', state: { info: value } })
    }

    getIcon = (key) => {
        let icon
        switch (key) {
            case 'checkItem':
                icon = Listonclipboard
                break
            case 'implementItem':
                icon = Checklist
                break
            case 'preItem':
                icon = Matrix
                break
        }
        return <Icon style={{ fontSize: '16px', position: 'relative', top: '1px' }} component={icon} />
    }

    setProjectId = (id, county) => {
        const { mapStore } = this.props.stores
        const obj = {
            id,
            county
        }
        mapStore.saveStopXm(obj)
    }

    renderMenu = () => {
        const { indexMenus, collapsed } = toJS(this.props.stores.mapStore.homeSiderMenu)
        const that = this
        return indexMenus.map((item, indexSub1) => {
            return (
                <SubMenu key={indexSub1}
                    title={
                        collapsed ?
                            <span>
                                {this.getIcon(item.url)}
                                <span>{item.name}</span>
                            </span>
                            :
                            <Row>
                                <Col span={12}>
                                    {this.getIcon(item.url)}
                                    <span>{item.name}</span>
                                </Col>
                                <Col span={6} offset={6}>
                                    <span className='count' >{item.child.length}</span>
                                </Col>
                            </Row>
                    }
                >
                    {
                        item.child.map((value, indexSub2) => {
                            if (that.state.searchProj !== '' && that.state.searchProj !== value.name) {
                                return
                            }
                            return (
                                <SubMenu key={`${indexSub1}-${indexSub2}`}
                                    title={
                                        value.xmjd && value.isWorking ?
                                            <span>
                                                <span style={
                                                    TransTool.isSpecialStyle(value.xmjd.val) ?
                                                        {
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                            width: '40px',
                                                            borderRadius: 5,
                                                            lineHeight: '20px',
                                                            fontSize: 12,
                                                            marginRight: '5px',
                                                            color: `${value.xmjd.color}`,
                                                            border: `1px solid ${value.xmjd.color}`
                                                        }
                                                        :
                                                        {
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                            width: '40px',
                                                            borderRadius: 5,
                                                            lineHeight: '20px',
                                                            fontSize: 12,
                                                            marginRight: '5px',
                                                            color: 'white',
                                                            backgroundColor: `${value.xmjd.color}`
                                                        }
                                                } >
                                                    {value.xmjd.name}
                                                </span>
                                                <Tooltip placement='top' title={value.name}>
                                                    {value.name}
                                                </Tooltip>
                                                {/* to avoid xmmc overlap by icon */}
                                                <span style={{ color: 'white' }}>hid</span>
                                            </span>
                                            :
                                            <span>
                                                <Tooltip placement='top' title={value.name}>
                                                    {value.name}
                                                </Tooltip>
                                                {/* to avoid xmmc overlap by icon */}
                                                <span style={{ color: 'white' }}>hid</span>
                                            </span>
                                    }
                                >
                                    {
                                        value.child.map((value1, indexSub3) => {
                                            if (value1.child) {
                                                return (
                                                    <SubMenu key={`${indexSub1}-${indexSub2}-${indexSub3}`} onTitleClick={this.getZXMMC.bind(this, value1, value)} title={<span className='nav-text'>{value1.name}</span>}>
                                                        {
                                                            value1.child.map((value2, indexSub4) => {
                                                                return (
                                                                    <SubMenu key={`${indexSub1}-${indexSub2}-${indexSub3}-${indexSub4}`} onTitleClick={this.mapLocation.bind(this, value2)} title={<Tooltip placement='top' title={value2.xmmc} >{value2.xmmc}</Tooltip>}>
                                                                        {
                                                                            value2.children.map((value3, indexSub5) => {
                                                                                return (
                                                                                    <Menu.Item key={`${indexSub1}-${indexSub2}-${indexSub3}-${indexSub4}-${indexSub5}`} onClick={this.showDetail.bind(this, item.name, value.isWorking, value3)}>
                                                                                        <span className='nav-text'>{value3.dkbh}</span>
                                                                                    </Menu.Item>
                                                                                )
                                                                            })
                                                                        }
                                                                    </SubMenu>
                                                                )
                                                            })
                                                        }
                                                    </SubMenu>
                                                )
                                            } else {
                                                return (
                                                    <Menu.Item key={`3rd - level - ${value1.id} - ${value1.name}`} onClick={this.showDetail.bind(this, item.name, value.isWorking, value1)}>
                                                        <span className='nav-text'>{value1.name}</span>
                                                    </Menu.Item>
                                                )
                                            }
                                        })
                                    }
                                </SubMenu>
                            )
                        })
                    }
                </SubMenu>
            )
        })
    }

    onChange = (value) => {
        if (value !== '') {
            this.setState({
                inputProj: value,
                searchProj: ''
            })
        } else {
            this.setState({
                inputProj: '',
                searchProj: ''
            })
        }
    }

    handleSearch = () => {
        if (this.state.inputProj !== '') {
            let searchOpenKeys: string[] = []
            const { indexMenus } = toJS(this.props.stores.mapStore.homeSiderMenu)
            indexMenus.forEach((item, index) => {
                if (_.some(item.child, subItem => subItem.name === this.state.inputProj)) {
                    searchOpenKeys = [index.toString()]
                }
            })
            if (searchOpenKeys.length > 0) {
                this.setState({
                    searchProj: this.state.inputProj,
                    searchOpenKeys,
                    openKeys: []
                })
            } else {
                this.setState({
                    searchProj: this.state.inputProj,
                    searchOpenKeys: [],
                    openKeys: []
                }, () => message.error('没有查询该项目'))
            }
        } else {
            this.setState({
                searchProj: '',
                searchOpenKeys: [],
                openKeys: []
            }, () => message.error('请输入项目名称'))
        }
    }

    onSearchOpenChange = (searchOpenKeys) => {
        this.setState({
            searchOpenKeys
        })
    }

    onOpenChange = (openKeys) => {
        this.setState({
            openKeys
        })
    }

    render() {
        const subMenu = mapSubMenu
        subMenu.forEach((item: any) => {
            if (item.url === 'preItem') {
                item.component = preItem
            } else if (item.url === 'implementItem') {
                item.component = implementItem
            } else if (item.url === 'checkItem') {
                item.component = checkItem
            }
        })
        const { collapsed } = toJS(this.props.stores.mapStore.homeSiderMenu)
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='map-wrap'>
                    <Layout>
                        <Sider collapsible collapsed={collapsed} onCollapse={this.toggle} >
                            {
                                collapsed ?
                                    '' :
                                    <div className='proj-search-wrapper'>
                                        <AutoComplete
                                            style={{ width: 200 }}
                                            dataSource={this.state.projectList}
                                            placeholder='请输入项目名称'
                                            onChange={this.onChange}
                                            filterOption={(inputValue, option) =>
                                                // @ts-ignore
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                        <Button
                                            className='search-btn'
                                            type='primary'
                                            onClick={this.handleSearch.bind(this)}
                                        >
                                            <Icon type='search' />
                                        </Button>
                                    </div>
                            }
                            {
                                collapsed ?
                                    <Menu mode='inline'>
                                        {
                                            this.renderMenu()
                                        }
                                    </Menu>
                                    :
                                    this.state.searchProj !== '' ?
                                        <Menu mode='inline' openKeys={this.state.searchOpenKeys}
                                            onOpenChange={this.onSearchOpenChange}
                                            subMenuCloseDelay={0}
                                            subMenuOpenDelay={0}
                                        >
                                            {
                                                this.renderMenu()
                                            }
                                        </Menu>
                                        :
                                        <Menu mode='inline' openKeys={this.state.openKeys}
                                            onOpenChange={this.onOpenChange}
                                            subMenuCloseDelay={0}
                                            subMenuOpenDelay={0}
                                        >
                                            {
                                                this.renderMenu()
                                            }
                                        </Menu>
                            }
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
                                            subMenu && subMenu.map((item: any) => (
                                                <Route path={'/index/map/' + item.url} render={(props) => (<item.component {...props} />)} key={item.id} />
                                            ))
                                        }
                                        <Route path='/index/map/home' component={LandMap} />
                                        <Route path='/index/map/landLocation' component={landLocation} />
                                        <Route path='/index/map/createProject/:id' component={createProject} />
                                        <Route path='/index/map/preItemDetail/:id' component={preItemDetail} />
                                        <Route path='/index/map/preItemLand/:id' component={preItemLand} />
                                        <Route path='/index/map/implementItemDetail/:id/:isWorking' component={implementItemDetail} />
                                        <Route path='/index/map/implementItemDoc/:id/:xmmc/:xmjd/:processInstanceId/:isWorking' component={implementItemDoc} />
                                        <Route path='/index/map/subcontract/:id' component={Subcontract} />
                                        <Redirect to='/index/map/home' />
                                    </Switch>
                                </Suspense>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            )
    }
}

