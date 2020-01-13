import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Row, Radio } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import Detail from './detail'
import UploadAction from '@api/UploadAction'
import InfoAction from '@api/InfoAction'
import dev from '@config/dev.config'
const { confirm } = Modal
const { Search } = Input
interface IState {
    page: number,
    limit: number,
    total: number,
    keyword: string,
    visible: boolean,
    actionInfo: string,
    title: string,
    projectId: string,
    id: any,
    data: any[],
    ids: string[],
    columns: any,
    statics: {},
    status: string,
    readStatus: string,
}
export default class InfoList extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '详情信息',
            visible: false,
            data: [],
            id: '',
            actionInfo: '新增',
            columns: [
                {
                    title: '项目名称',
                    dataIndex: 'projectName',
                    key: 'projectName',
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    key: 'createTime',
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: '更新时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: (text) => {
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '责任人',
                    dataIndex: 'dutyPerson',
                    key: 'dutyPerson',
                },
                {
                    title: '来源',
                    dataIndex: 'source',
                    key: 'source',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('详细信息') ? <Button type='link' onClick={this.showModal.bind(this, record.id, record.status)}>详细信息</Button> : null}

                            {buttons.includes('删除') ? <Button onClick={this.handleDelete.bind(this, record.id)} disabled={record.type === '0' || record.type === '1'} type='link'>删除</Button> : null}
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
            readStatus: ''
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
        this.setState({ keyword, page: 1 }, () => this.init())
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    showModal = (id, status, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            id: id ? id : 0,
            readStatus: status
        })
    }

    init = () => {
        InfoAction.List(
            {
                pageNum: this.state.page,
                pageSize: this.state.limit,
                content: this.state.keyword,
                status: this.state.status
            }
        ).then((res: any) => {
            if (res.code === 0) {
                this.setState({
                    data: res.data,
                    total: res.count,
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

    handleChangeStatus = (e) => {
        this.setState({
            status: e.target.value,
            page: 1
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

    GetFolederByXmId = (record) => {
        UploadAction.GetFolederByXmId({
            xmId: record.projectId
        }).then((res: any) => {
            if (res.status === 200) {
                if (res.data.length > 0) {
                    const data = this.state.data
                    res.data.forEach((value) => {
                        value.name = value.folderName
                        value.count = value.foldercount
                    })
                    data && data.forEach((item) => {
                        if (item.id === record.id) {
                            item.children = res.data
                        }
                    })
                    this.setState({
                        data
                    })
                }
            } else {
                message.error(res.msg)
            }
        })
    }

    getXmzlByIds = (record) => {
        UploadAction.GetXmzlByIds({ xmId: record.projectId, folderId: record.folderId }).then((res: any) => {
            if (res.status === 200) {
                if (res.data.length > 0) {
                    const data = this.state.data
                    res.data.forEach((value) => {
                        value.name = value.zlmc
                        value.count = 1

                    })
                    data.forEach((list) => {
                        if (res.data[0].projectId === list.projectId) {
                            list.children.forEach((item) => {
                                if (item.folderId === res.data[0].folderId) {
                                    item.children = res.data
                                }
                            })
                        }
                    })
                    this.setState({
                        data
                    })
                }
            } else {
                message.error(res.msg)
            }
        })
    }

    handleRow = (record) => {
        if (record.type === '0') {
            this.GetFolederByXmId(record)
        } else if (record.type === '1') {
            this.getXmzlByIds(record)
        }
    }

    handlePreview = (xmzlUrl, e) => {
        e && e.preventDefault()
        if (!xmzlUrl) {
            return
        }
        const rUrl = xmzlUrl.replace('uploadFiles', 'uploadFilesPdf')
        const fUrL = rUrl.split('.')[0]
        const url = dev.url + '/xmzlqd/showAttach?filePath=' + fUrL + '.pdf&type=pdf'
        window.open(url)
    }

    handleDownload = (id) => {
        if (!id) {
            return
        }
        const link = document.createElement('a')
        link.href = dev.url + '/xmzlqd/download?id=' + id
        link.download = 'admin'
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='information'>
                    <Card title='消息列表' className='card'>
                        <Row style={{ marginBottom: '20px' }}>
                            {buttons.includes('批量下载') ? <Button type='primary' onClick={this.handleDownload.bind(this, this.state.ids.join(','))}>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleDelete.bind(this, this.state.ids.join(','))}>删除</Button> : null}
                            <span style={{ float: 'right' }}>
                                <Search
                                    placeholder='请输入'
                                    onSearch={this.handleKeyword}
                                    style={{ width: 240 }}
                                />
                            </span>
                            <Radio.Group value={this.state.status} onChange={this.handleChangeStatus}>
                                <Radio.Button value=''>全部</Radio.Button>
                                <Radio.Button value='已查看'>已查看</Radio.Button>
                                <Radio.Button value='未查看'>未查看</Radio.Button>
                            </Radio.Group>
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
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        this.handleRow(record)
                                    }
                                }
                            }}
                        />
                    </Card>
                    <Modal
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={1000}
                        title='提醒'
                    >
                        {
                            this.state.visible ? <Detail id={this.state.id} handleCancel={this.handleCancel} init={this.init} readStatus={this.state.readStatus} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
