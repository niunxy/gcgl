import * as React from 'react'
import './index.less'
import { Icon, Badge, Avatar, Tabs, Dropdown, Menu, Modal, Button, Row, Col, message } from 'antd'
import StorageUtils from '@utils/StorageUtil'
import LoginUtils from '@utils/Login'
import TransTool from '@utils/TransTool'
import InfoAction from '@api/InfoAction'
import { observer, inject } from 'mobx-react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import ChangePassword from './changePswd'
import * as Stomp from 'stompjs'
import Detail from '../../components/BusinessComs/ExamineAndApprove/infoList/detail'
import dev from '@config/dev.config'
import Notice from './images/notice.svg'
const { TabPane } = Tabs

interface IProps extends RouteComponentProps {
    stores?: any,
    infoId: string
    // history: any
}

@inject('stores')
@observer
class User extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }
    inputRef = React.createRef<HTMLInputElement>()
    state = {
        list: [],
        count: 0,
        visible: false,
        flag: this.props.stores.mapStore.mapShow,
        showModal: false,
        showDetail: false,
        record: {},
        id: '',
        ids: '',
    }

    renderDrop = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a onClick={this.logout}>
                        退出
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.changePassword}>
                        修改密码
                    </a>
                </Menu.Item>
            </Menu>
        )
    }
    logout = () => {
        /** step1、清除登录状态 */
        LoginUtils.DeleteToken()
        LoginUtils.DeleteUserInfo()
        StorageUtils.delLocalStorage('menuData')
        /** step2、跳转至首页 (或一张图的登录页面) */
        window.location.href = '#/login'
        // window.location.href = '#/mapLogin'
    }

    getList = () => {
        InfoAction.GetUnread(null).then((res: any) => {
            const arr: any = []
            res.data.forEach((value: any) => {
                arr.push(value.id)
            })
            this.setState({
                list: res.data,
                count: res.count,
                ids: arr
            })
        })
    }

    checkInfo = (e) => {
        e.nativeEvent.stopImmediatePropagation()
        /* if (this.state.count === 0) {
            return
        } */
        this.setState({
            visible: !this.state.visible
        })
    }

    handleCancel = () => {
        this.setState({
            showModal: false
        })
    }

    handleShowDetail = (record, e) => {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({
            showDetail: true,
            record,
            id: record.id
        })
        InfoAction.GetUnreadList(record.id, null).then((res: any) => {
            if (res.status === 200) {
                this.getList()
            }
        })
    }

    handleStopPropagation = (e) => {
        e.nativeEvent.stopImmediatePropagation()
    }

    handleCancelDetail = () => {
        this.setState({
            showDetail: false
        })
    }

    changePassword = () => {
        this.setState({
            showModal: true
        })
    }

    runningInfo = () => {
        const that = this
        // const lastTime = Date.now()
        const ws = new WebSocket(`${dev.rmqUrl}/ws`)
        // 获得Stomp client对象
        const client = Stomp.over(ws)
        client.heartbeat.outgoing = 0
        client.heartbeat.incoming = 0
        // 连接RabbitMQ
        client.connect('admin', '123456', () => {
            const headers: any = new Object()
            // headers.id='1234';
            headers.durable = false
            headers.autoDelete = true
            headers.exclusive = false
            // data.body是接收到的数据
            const userId = StorageUtils.getLocalStorage('userId')
            client.subscribe('/queue/' + userId, (data) => {
                const msg = data.body
                // if (Date.now() - lastTime > 9 * 1000) {
                if (msg !== '') {
                    that.getList()
                }
                // }
                // data.ack()
            }, headers)
        }, () => {
            that.runningInfo()
        }, '/')
    }

    onConnect = (client) => {
        const headers: any = new Object()
        // headers.id='1234';
        headers.durable = false
        headers.autoDelete = true
        headers.exclusive = false
        // data.body是接收到的数据
        client.subscribe('/queue/6b2a351af2bd44dc94ffd354ccddacc0', (data) => {
            // const msg = data.body
            console.log('收到数据：' + data)
        }, headers)
    }

    onError = () => {
        console.log('error')
    }

    markRead = () => {
        InfoAction.MarkRead({
            ids: JSON.stringify(this.state.ids)
        }).then((res: any) => {
            if (res.status === 200) {
                message.success('标记批量已读成功！')
                this.setState({
                    list: [],
                    count: 0,
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    scanMore = () => {
        console.log(this)
        this.props.history.replace({ pathname: '/index/examineAndApprove/infoList' })
    }

    componentDidMount() {
        this.getList()
        this.runningInfo()
        document.addEventListener('click', () => {
            this.setState({
                visible: false
            })
        }, false)
    }

    componentDidUpdate(prevProps) {
        if (this.props.infoId !== '' && prevProps.infoId !== this.props.infoId) {
            this.getList()
        }
    }

    render() {
        return (
            <div className='map-header-loging'>
                <div className='notice-box'>
                    <Badge count={this.state.count}>
                        <Icon type='mail' style={{ fontSize: '24px', position: 'relative', color: '#fff', top: '4px' }} onClick={this.checkInfo.bind(this)} />
                    </Badge>
                    {this.state.visible ? <div className='notice-list'>
                        <Tabs defaultActiveKey='1'>
                            <TabPane tab={'通知 (' + this.state.count + ')'} key='1'>
                                {this.state.count > 0 ? <><ul>
                                    {
                                        this.state.list.map((item: any) => {
                                            return (
                                                <li key={item.id} onClick={this.handleStopPropagation.bind(this)}>
                                                    <div>
                                                        {item.type === '提醒' ? <Avatar style={{ backgroundColor: '#7fc952' }} icon='mail' /> : null}
                                                        {item.type === '预警' ? <Avatar style={{ backgroundColor: '#fe5d58' }} icon='exclamation' /> : null}
                                                        {item.type === '整改' ? <Avatar style={{ backgroundColor: '#1890ff' }} icon='info' /> : null}
                                                    </div>
                                                    <div ref={this.inputRef}>
                                                        {/* <div>渭南市华州区土改项目已上传</div> */}
                                                        <p>
                                                            {item.content}
                                                        </p>
                                                        <p>{TransTool.timeTrans(item.createTime)}<Button type='link' style={{ float: 'right' }} size='small' onClick={this.handleShowDetail.bind(this, item)}>详情</Button></p>
                                                    </div>

                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                                    <Row type='flex' justify='start' style={{ textAlign: 'center', borderTop: '1px solid #cccccc', lineHeight: '40px' }}>
                                        <Col span={12} style={{ cursor: 'pointer', borderRight: '1px solid #cccccc' }} onClick={this.markRead}>
                                            批量已读
                                    </Col>
                                        <Col span={12} style={{ cursor: 'pointer' }} onClick={this.scanMore}>
                                            查看更多
                                    </Col>
                                    </Row>
                                </> : <div style={{ height: '200px', textAlign: 'center', fontSize: '16px' }}>
                                        <Icon style={{ fontSize: '87px', marginTop: '34px' }} component={Notice} />
                                        <p style={{ marginTop: '6px' }}>你已查看所有通知</p>
                                    </div>}
                            </TabPane>
                        </Tabs>
                    </div> : null}
                </div>
                {/* 欢迎您,<span>  {LoginUtils.GetUserInfo()} </span>
                <Tooltip placement='top' title='退出'>
                    <Icon type='logout' onClick={this.logout} />
                </Tooltip> */}
                <Dropdown overlay={this.renderDrop()} overlayClassName='user-setting'>
                    <a className='ant-dropdown-link' style={{ color: '#fff' }}>
                        {LoginUtils.GetUserInfo()} <Icon type='down' />
                    </a>
                </Dropdown>
                <Modal
                    title={'修改密码'}
                    visible={this.state.showModal}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={800}
                >
                    {
                        this.state.showModal ? <ChangePassword handleCancel={this.handleCancel} /> : null
                    }
                </Modal>
                <Modal
                    title={'查看'}
                    visible={this.state.showDetail}
                    onCancel={this.handleCancelDetail}
                    footer={null}
                    width={1200}
                >
                    {
                        this.state.showDetail ? <Detail id={this.state.id} handleCancel={this.handleCancelDetail} /> : null
                    }
                </Modal>
            </div>
        )
    }
}
export default withRouter(User)
