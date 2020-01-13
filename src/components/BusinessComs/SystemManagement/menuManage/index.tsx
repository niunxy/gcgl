import React, { Component } from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Table, Button, message, Card, Modal, Input, Divider } from 'antd'
import AddMenu from './addMenu'
import './index.less'
import SystemAction from '@api/SystemAction'
const { confirm } = Modal
const { Search } = Input
interface IProps {
    buttons: string[]
}
interface IState {
    data: any,
    columns: any,
    title: string,
    ids: any,
    actionInfo: string,
    visible: boolean,
    id: any,
    keyword: string,
    value: string,
}
export default class MenuManage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        const { buttons } = this.props
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'orderNum',
                    key: 'orderNum',
                },
                {
                    title: '菜单名称',
                    dataIndex: 'name',
                    key: 'name',
                    render: text => <a>{text}</a>,
                },
                {
                    title: 'url',
                    dataIndex: 'url',
                    key: 'url',
                },
                {
                    title: '类型',
                    dataIndex: 'menuType',
                    key: 'menuType',
                    render: (text: any) => {
                        if (text === 0 || text === 1 || text === 2) {
                            if (text === 0) {
                                return '二级菜单'
                            } else if (text === 1) {
                                return '按钮'
                            } else if (text === 2) {
                                return '一级菜单'
                            } else {
                                return ''
                            }
                        } else {
                            return ''
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('查看') ? <a onClick={this.showModal.bind(this, '查看', record.id)}>查看</a> : null}
                            {buttons.includes('查看') ? <Divider type='vertical' /> : null}
                            {buttons.includes('编辑') ? <a style={{ marginLeft: '6px' }} onClick={this.showModal.bind(this, '编辑', record.id)}>编辑</a> : null}
                            {buttons.includes('编辑') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <a style={{ marginLeft: '6px' }} onClick={this.handleDelete.bind(this, record, '1')}>删除</a> : null}
                        </span>
                    ),
                },
            ],
            data: [

            ],
            title: '菜单',
            visible: false,
            value: '',
            actionInfo: '新增',
            id: 0,
            keyword: '',
            ids: [],
        }
    }

    handleOk = () => {
        this.setState({
            visible: false,
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    showModal = (info, id) => {
        this.setState({
            visible: true,
            actionInfo: info,
            title: info + '菜单',
            id: id ? id : 0
        })
    }

    queryAllMenu = () => {
        SystemAction.QueryAllMenu({ name: this.state.keyword }).then((res: any) => {
            this.setState(() => ({
                data: []
            }))
            res.data.length > 0 && res.data.forEach((item) => {
                if (item.children.length > 0) {
                    item.children.forEach((value) => {
                        if (value.children.length === 0) {
                            delete value.children
                        } else {
                            value.children.forEach((value1) => {
                                if (value1.children.length === 0) {
                                    delete value1.children
                                }
                            })
                        }
                    })
                } else {
                    delete item.children
                }
            })
            this.setState(() => ({
                data: res.data
            }))
            /* this.setState({
                data: res.data
            }) */
        })
    }

    handleDelete = (record, type) => {
        const that = this
        if (record === '') {
            message.error('请先选择一条数据处理！')
            return
        }
        let content, id
        if (type === '1') {
            let str = ''
            if (record.children && record.children.length > 0) {
                str += '包含'
                record.children.forEach((item) => {
                    str += `【${item.name}】`
                })
            }
            content = `菜单名称【${record.name}】${str}。确认要删除吗？`
            id = record.id
        } else {
            content = '确认要删除您选中的所有菜单吗？'
            id = record
        }
        confirm({
            title: '您确定要删除此项内容吗?',
            content,
            onOk() {
                SystemAction.Delete({ id }).then((res: any) => {
                    if (res.status === 200) {
                        message.success('删除成功')
                        that.queryAllMenu()
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

    handleKeyword = (keyword) => {
        this.setState({ keyword }, () => this.queryAllMenu())
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

    componentDidMount() {
        this.queryAllMenu()
    }

    render() {
        const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='menu-manage'>
                    <Card title='菜单管理' className='card' bordered={false}>
                        {buttons.includes('新增') ? <Button type='primary' onClick={this.showModal.bind(this, '新增', 0)} style={{ marginBottom: '20px', width: '86px' }}>新增</Button> : null}
                        {
                            buttons.includes('批量删除') ?
                                <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleDelete.bind(this, this.state.ids.join(','))}>批量删除</Button>
                                : null
                        }
                        <span style={{ float: 'right' }}>
                            <Search
                                placeholder='请输入角色名称'
                                onSearch={this.handleKeyword}
                                style={{ width: 240 }}
                            />
                            {/* <Button type='primary' style={{marginLeft: '6px'}}>搜索</Button> */}
                        </span>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='id'
                            rowSelection={{
                                onSelectAll: this.handleSelectAll,
                                onSelect: this.handleSelect
                            }}
                            pagination={false}
                        />
                    </Card>
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        {
                            this.state.visible ? <AddMenu data={this.state.data} id={this.state.id} actionInfo={this.state.actionInfo} queryAllMenu={this.queryAllMenu} handleCancel={this.handleCancel} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
