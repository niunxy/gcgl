import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Divider } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import AddUser from './addUser'
import SystemAction from '@api/SystemAction'
const { confirm } = Modal
const { Search } = Input
interface IState {
    keyword: string,
    visible: boolean,
    actionInfo: string,
    title: string,
    id: any,
    data: any[],
    ids: string[],
    columns: any,
    page: number,
    limit: number,
    total: number,
    status: string,
}
export default class ShowUser extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '新增账号',
            visible: false,
            data: [],
            id: '',
            actionInfo: '新增',
            columns: [
                {
                    title: '序号',
                    key: 'index',
                    render: (...rest) => {
                        return (
                            <span>
                                {(this.state.page - 1) * 10 + rest[2] + 1}
                            </span>
                        )
                    }
                },
                {
                    title: '用户名',
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: '真实名称',
                    dataIndex: 'realName',
                    key: 'realName',
                },
                {
                    title: '联系方式',
                    dataIndex: 'telephone',
                    key: 'telephone',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createDate',
                    key: 'createDate',
                    render: (text) => {
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '当前状态',
                    dataIndex: 'active',
                    key: 'active',
                    render: (text) => {
                        if (text === '1') {
                            return '停用'
                        } else {
                            return '启用'
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('查看') ? <a onClick={this.showModal.bind(this, '查看', record.id, event)}>查看</a> : null}
                            {buttons.includes('查看') ? <Divider type='vertical' /> : null}
                            {buttons.includes('编辑') ? <a onClick={this.showModal.bind(this, '编辑', record.id, event)}>编辑</a> : null}
                            {buttons.includes('编辑') ? <Divider type='vertical' /> : null}
                            {buttons.includes('重置') ? <a onClick={this.handleReset.bind(this, record.id, event)}>重置</a> : null}
                            {buttons.includes('重置') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <a onClick={this.handleDelete.bind(this, record, '1', event)}>删除</a> : null}
                            {buttons.includes('删除') ? <Divider type='vertical' /> : null}
                            {
                                buttons.includes('停用') ? record.active === 0 ? <a onClick={this.handleStop.bind(this, record.id, 1, event)}>停用</a> : <a onClick={this.handleStop.bind(this, record.id, 0, event)}>启用</a> : null
                            }

                        </span>
                    ),
                },
            ],
            keyword: '',
            ids: [],
            page: 1,
            limit: 10,
            total: 0,
            status: '停用'
        }
    }

    dateFomart = (date) => {
        if (new Date(date).getMonth() + 1 > 9) {
            if (new Date(date).getDate() > 9) {
                return new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate()
            } else {
                return new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-0' + new Date(date).getDate()
            }
        } else {
            if (new Date(date).getDate() > 9) {
                return new Date(date).getFullYear() + '-0' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate()
            } else {
                return new Date(date).getFullYear() + '-0' + (new Date(date).getMonth() + 1) + '-0' + new Date(date).getDate()
            }
        }
    }

    handleKeyword = (keyword) => {
        this.setState({ keyword }, () => this.init())
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    showModal = (info, id, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            actionInfo: info,
            title: info + '用户',
            id: id ? id : 0
        })
    }

    init = () => {
        SystemAction.QueryAllUser(
            { page: this.state.page, limit: this.state.limit, userName: this.state.keyword }
        ).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data,
                    total: res.count
                })
            }
        })
    }

    changePage = (page) => {
        this.setState({
            page
        }, () => {
            this.init()
        })
    }

    handleDelete = (record, type, event) => {
        event && event.preventDefault()
        if (record === '') {
            message.error('请先选择一条数据处理！')
            return
        }
        let content, id
        if (type === '1') {
            content = `用户名称【${record.username}】。确认要删除吗？`
            id = record.id
        } else {
            content = '确认要删除您选中的所有用户吗？'
            id = record
        }
        const that = this
        confirm({
            title: '您确定要删除选中的内容吗?',
            content,
            onOk() {
                SystemAction.DelUser({ id }).then((res: any) => {
                    if (res.status === 200) {
                        message.success('删除成功')
                        that.init()
                    } else if (res.status === 400) {
                        message.error(res.msg)
                    }
                })

            },
            onCancel() {
                console.log()
            },
        })
    }
    handleReset = (id, event) => {
        event && event.preventDefault()
        if (id === '') {
            return
        }
        confirm({
            title: '您确定要重置选中的用户吗?',
            content: '当您点击了此按钮，选中用户将重置！',
            onOk() {
                SystemAction.ResetUser({ id }).then((res: any) => {
                    if (res.status === 200) {
                        message.success(res.msg)
                    } else {
                        message.error(res.msg)
                    }
                })

            }
        })
    }
    handleStop = (id, active, event) => {
        event && event.preventDefault()
        if (id === '') {
            return
        }
        let status
        if (active === 1) {
            this.setState({
                status: '停用'
            })
            status = '停用'
        } else {
            this.setState({
                status: '启用'
            })
            status = '启用'
        }
        const that = this
        confirm({
            title: `您确定要${status}选中的用户吗?`,
            content: `当您点击了此按钮，选中用户将被${status}！`,
            onOk() {
                SystemAction.ActivateUser({ userId: id, activeId: active }).then((res: any) => {
                    if (res.status === 200) {
                        message.success(status + '成功')
                        that.init()
                    } else if (res.status === 400) {
                        message.error(res.msg)
                    }
                })

            },
            onCancel() {
                console.log()
            },
        })
    }

    handleSelectAll = (selected, selectedRows) => {
        let ids: string[] = []
        if (selected) {
            selectedRows.forEach((value) => {
                ids.push(value.id)
            })
        } else {
            ids = []
        }
        this.setState({ ids })
    }

    handleSelect = (record, selected) => {
        let ids = this.state.ids
        if (selected) {
            ids.push(record.id)
        } else {
            ids = ids.filter((value) => value !== record.id)
        }
        this.setState({
            ids
        })

    }

    handleSizeChange = (current, size) => {
        this.setState({
            page: current,
            limit: size
        }, () => {
            this.init()
        })

    }

    /* queryRoleById = (id, e) => {
        e.preventDefault()
        SystemAction.QueryRoleById({id})
        .then((res: any) => {
            if ( res.status === 200) {
                this.setState({
                    data: res.data
                })
            }
        })
    } */

    componentDidMount() {
        this.init()
    }

    render() {
        const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='user-manage'>
                    <Card title='用户管理' className='card'>
                        {buttons.includes('新增') ? <Button type='primary' onClick={this.showModal.bind(this, '新增', 0)} style={{ marginBottom: '20px' }}>新增</Button> : null}
                        {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleDelete.bind(this, this.state.ids.join(','))}>删除</Button> : null}
                        <span style={{ float: 'right' }}>

                            <Search
                                placeholder='请输入账号名称'
                                onSearch={this.handleKeyword}
                                style={{ width: 240 }}
                            />
                            {/* <Button type='primary' style={{marginLeft: '6px'}}>搜索</Button> */}
                        </span>
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            pagination={{
                                total: this.state.total,
                                onChange: this.changePage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onShowSizeChange: this.handleSizeChange,
                                showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条数据`
                            }}
                            rowSelection={{
                                onSelectAll: this.handleSelectAll,
                                onSelect: this.handleSelect
                            }}
                            rowKey='id'
                        />
                    </Card>
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={1000}
                    >
                        {
                            this.state.visible ? <AddUser data={this.state.data} actionInfo={this.state.actionInfo} id={this.state.id} init={this.init} handleCancel={this.handleCancel} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
