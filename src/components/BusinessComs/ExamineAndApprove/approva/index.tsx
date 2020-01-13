import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Divider, Row, Radio } from 'antd'
import loginUtils from '@utils/Login'
import TransTool from '@utils/TransTool'
import { Redirect } from 'react-router-dom'
import './index.less'
import Detail from './detail'
import AddApply from './AddApply'
import UploadAction from '@api/UploadAction'
import InfoAction from '@api/InfoAction'
// import dev from '@config/dev.config'
const { confirm } = Modal
const { Search } = Input
interface IState {
    page: number,
    limit: number,
    total: number,
    keyword: string,
    visible: boolean,
    addApply: boolean,
    actionInfo: string,
    title: string,
    projectId: string,
    id: any,
    data: any[],
    ids: string[],
    columns: any,
    statics: {},
    status: string,
    record: {}
}
export default class Approva extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '变更申请',
            visible: false,
            addApply: false,
            data: [],
            id: '',
            actionInfo: '申请',
            columns: [
                {
                    title: '项目名称',
                    dataIndex: 'projectName',
                    key: 'projectName',
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    key: 'content',
                    ellipsis: true,
                },
                {
                    title: '上报时间',
                    dataIndex: 'submitTime',
                    key: 'submitTime',
                    render: (text) => {
                        return TransTool.timeTrans(text)
                    }
                },
                {
                    title: '审批时间',
                    dataIndex: 'approveTime',
                    key: 'approveTime',
                    render: (text) => {
                        if (text) {
                            return TransTool.timeTrans(text)
                        } else {
                            return '--------'
                        }
                    }
                },
                {
                    title: '项目负责人',
                    dataIndex: 'dutyPerson',
                    key: 'dutyPerson',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                },
                {
                    title: '来源',
                    render: (record) => {
                        return record.submiterDept + '-' + record.submiter
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('审批') ?
                                (
                                    record.status !== '已驳回' ?
                                        <Button onClick={this.showModal.bind(this, '审批', record.id, record)} disabled={record.approveStatus !== '待审批'} type='link'>审批</Button> :
                                        (record.status === '已驳回' && buttons.includes('重新申请') ? <Button onClick={this.showModal.bind(this, '重新申请', record.id, record)} disabled={record.approveStatus === '已审批'} type='link'>重新申请</Button> : <Button onClick={this.showModal.bind(this, '审批', record.id, record)} disabled={record.approveStatus !== '待审批'} type='link'>审批</Button>)
                                )
                                : null}
                            {buttons.includes('审批') ? <Divider type='vertical' /> : null}
                            {buttons.includes('查看') ? <Button type='link' onClick={this.showModal.bind(this, '查看', record.id, record)}>查看</Button> : null}
                        </span>
                    ),
                },
            ],
            page: 1,
            limit: 10,
            total: 0,
            keyword: '',
            ids: [],
            statics: {},
            projectId: '',
            status: '',
            record: {}
        }
    }

    handleKeyword = (keyword) => {
        this.setState({ keyword, page: 1 }, () => this.init())
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    handleApplyCancel = () => {
        this.setState({
            addApply: false
        })
    }

    showApplyModal = () => {
        this.setState({
            addApply: true
        })
    }

    showModal = (info, id, record, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            actionInfo: info,
            title: '变更' + info,
            id: id ? id : 0,
            record
        })
    }

    init = () => {
        InfoAction.GetApproveList(
            { pageNum: this.state.page, pageSize: this.state.limit, content: this.state.keyword, status: this.state.status }
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

    handleDelete = (id) => {
        if (id === '') {
            return
        }
        const that = this
        confirm({
            title: '您确定要删除选中的内容吗?',
            content: '当您点击了此按钮，选中内容将永久删除！',
            onOk() {
                UploadAction.DeleteFile({ id }).then((res: any) => {
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

    handleSelectAll = (selected, selectedRows) => {
        let ids: string[] = []
        if (selected) {
            selectedRows.forEach((value) => {
                if (value.type === '2') {
                    ids.push(value.id)
                }
            })
        } else {
            ids = []
        }
        this.setState({ ids })
    }

    handleSelect = (record, selected) => {
        let ids = this.state.ids
        if (record.type === '2') {
            if (selected) {
                ids.push(record.id)
            } else {
                ids = ids.filter((value) => value !== record.id)
            }
        } else {
            return
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

    handleChangeStatus = (e) => {
        this.setState({
            status: e.target.value,
            page: 1
        }, () => {
            this.init()
        })
    }

    componentDidMount() {
        this.init()
    }

    render() {
        // const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='approval-box'>
                    <Card title='审批处理' className='card'>
                        <Row style={{ marginBottom: '20px' }}>
                            <span style={{ float: 'right' }}>
                                <Search
                                    placeholder='请输入内容'
                                    onSearch={this.handleKeyword}
                                    style={{ width: 240 }}
                                />
                            </span>
                            <Radio.Group value={this.state.status} onChange={this.handleChangeStatus}>
                                <Radio.Button value=''>全部</Radio.Button>
                                <Radio.Button value='已审批'>已审批</Radio.Button>
                                <Radio.Button value='审批中'>未审批</Radio.Button>
                            </Radio.Group>
                            {/* {buttons.includes('变更') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.showApplyModal}>变更申请</Button> : null} */}
                        </Row>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='id'
                            pagination={{
                                total: this.state.total,
                                pageSize: this.state.limit,
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
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={1200}
                    >
                        {
                            this.state.visible ? <Detail actionInfo={this.state.actionInfo} record={this.state.record} id={this.state.id} init={this.init} handleCancel={this.handleCancel} /> : null
                        }
                    </Modal>
                    <Modal
                        title={'变更申请'}
                        visible={this.state.addApply}
                        onCancel={this.handleApplyCancel}
                        footer={null}
                        width={1000}
                    >
                        {
                            this.state.addApply ? <AddApply handleApplyCancel={this.handleApplyCancel} init={this.init} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
