import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Divider, Icon } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import SystemAction from '@api/SystemAction'
import dev from '@config/dev.config'
const { confirm } = Modal
// const { Search } = Input
interface IState {
    // keyword: string,
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
    src: string,
    height: number
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
                /* {
                    title: '序号',
                    key: 'index',
                    render: (...rest) => {
                        return (
                            <span>
                                { (this.state.page - 1) * 10 + rest[2] + 1 }
                            </span>
                        )
                    } 
                }, */
                {
                    title: '编号',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '流程名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'key',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '版本',
                    dataIndex: 'version',
                    key: 'version',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (text) => {
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('编辑') ? <a onClick={this.showModal.bind(this, '编辑', record.id, event)}>编辑</a> : null}
                            {buttons.includes('编辑') ? <Divider type='vertical' /> : null}
                            {buttons.includes('发布') ? <a onClick={this.handlePublish.bind(this, record.id)}>发布</a> : null}
                            {buttons.includes('发布') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <a onClick={this.handleDelete.bind(this, record, '1', event)}>删除</a> : null}
                        </span>
                    ),
                },
            ],
            // keyword: '',
            ids: [],
            page: 1,
            limit: 10,
            total: 0,
            status: '停用',
            src: dev.url + '/act/goActiviti',
            height: 0
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

    /* handleKeyword = (keyword) => {
        this.setState({keyword}, () => this.init())
    } */

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
        if (info === '编辑') {
            this.setState({
                src: dev.url + '/act/actUpdate/' + id
            })
        } else {
            this.setState({
                src: dev.url + '/act/goActiviti'
            })
        }
    }

    init = () => {
        SystemAction.QueryAllAm(
            { page: this.state.page, limit: this.state.limit }
        ).then((res: any) => {
            if (res.code === 0) {
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
            content = `流程名称【${record.name}】。确认要删除吗？`
            id = record.id
        } else {
            content = '确认要删除您选中的所有流程吗？'
            id = record
        }
        const that = this
        confirm({
            title: '您确定要删除选中的内容吗?',
            content,
            onOk() {
                SystemAction.DelModel({ id }).then((res: any) => {
                    if (res.msg === '删除成功') {
                        message.success('删除成功')
                        that.init()
                    } else {
                        message.error(res.msg)
                    }
                })

            },
            onCancel() {
                console.log()
            },
        })
    }

    handlePublish = (id, event) => {
        event && event.preventDefault()
        SystemAction.PublishModel({ id })
            .then((res: any) => {
                if (res.flag) {
                    message.success('发布成功！')
                } else {
                    message.error(res.msg)
                }
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

    componentDidMount() {
        this.init()
        this.setState({
            height: window.innerHeight - 80
        })
    }

    render() {
        const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='model-manage'>
                    <Card title='模型管理' className='card'>
                        {buttons.includes('新增') ? <Button type='primary' onClick={this.showModal.bind(this, '新增', 0)} style={{ marginBottom: '20px' }}>新增</Button> : null}
                        {/* <Button type='primary' style={{marginLeft: '20px'}} onClick={this.handleDelete.bind(this, this.state.ids.join(','))}>删除</Button> */}
                        {/* <span style={{float: 'right'}}>
                            <Search
                            placeholder='请输入'
                            onSearch={this.handleKeyword}
                            style={{ width: 240 }}
                            />
                        </span> */}
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='id'
                            pagination={{
                                total: this.state.total,
                                onChange: this.changePage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onShowSizeChange: this.handleSizeChange,
                                showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条数据`
                            }}
                            rowSelection={{
                                /* onSelectAll: this.handleSelectAll,
                                onSelect: this.handleSelect */
                            }}
                        />
                    </Card>
                    {
                        this.state.visible ? <div className='add-model' style={{ height: this.state.height + 'px' }}>
                            <span style={{ position: 'absolute', right: '2px', top: '44px', zIndex: 9, width: '100px', height: '50px', background: '#e8edf1' }} />
                            <Icon type='close-circle' style={{ position: 'absolute', right: '20px', top: '50px', zIndex: 10, fontSize: '36px', color: '#36a7c4' }} onClick={this.handleCancel} />
                            <iframe src={this.state.src} />
                        </div> : null
                    }
                </div>
            )
    }
}
