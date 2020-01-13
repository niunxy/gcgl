import React, { Component } from 'react'
import { Table, message, Card, Modal } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import SystemAction from '@api/SystemAction'
const { confirm } = Modal
// const { Search } = Input
interface IState {
    // keyword: string,
    id: any,
    data: any[],
    ids: string[],
    columns: any,
    page: number,
    limit: number,
    total: number,
}
export default class ShowAct extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            data: [],
            id: '',
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
                    title: '部署id',
                    dataIndex: 'deploymentId',
                    key: 'deploymentId',
                },
                {
                    title: '流程图资源',
                    dataIndex: 'diagramResourceName',
                    key: 'diagramResourceName',
                },
                {
                    title: '版本',
                    dataIndex: 'category',
                    key: 'category',
                },
                {
                    title: '资源名称',
                    dataIndex: 'resourceName',
                    key: 'resourceName',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('删除') ? <a onClick={this.handleDelete.bind(this, record.deploymentId, event)}>删除</a> : '无'}
                        </span>
                    ),
                },
            ],
            // keyword: '',
            ids: [],
            page: 1,
            limit: 10,
            total: 0,
        }
    }

    /* dateFomart = (date) => {
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
    } */

    /* handleKeyword = (keyword) => {
        this.setState({keyword}, () => this.init())
    } */

    init = () => {
        SystemAction.QueryAllAct(
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

    handleDelete = (id, event) => {
        event && event.preventDefault()
        if (id === '') {
            return
        }
        const that = this
        confirm({
            title: '您确定要删除选中的内容吗?',
            content: '当您点击了此按钮，选中内容将永久删除！',
            onOk() {
                SystemAction.DelDeploy({ id }).then((res: any) => {
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
    }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='flow-manage'>
                    <Card title='流程管理' className='card'>
                        {/* <Button type='primary' icon='plus'>新增</Button> */}
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
                        />
                    </Card>
                </div>
            )
    }
}
