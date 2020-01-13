import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Divider, Row, Col } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import AddRole from './addRole'
import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config'
import TransTool from '@utils/TransTool'
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
    selectedRowKeys: string[],
    selectedRowsID: string[],
    columns: any,
    statics: {}
}
export default class TemplateDownload extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '新增角色',
            visible: false,
            data: [],
            id: '',
            actionInfo: '新增',
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '上传人',
                    dataIndex: 'uploader',
                    key: 'uploader',
                },
                {
                    title: '上传时间',
                    dataIndex: 'uploadDate',
                    key: 'uploadDate',
                    render: (text) => {
                        return TransTool.formatDate(text)
                    }
                },
                {
                    title: '文件数量',
                    dataIndex: 'count',
                    key: 'count',
                },
                {
                    title: '变更次数',
                    dataIndex: 'bgcs',
                    key: 'bgcs',
                    render: val => TransTool.numFormat(val)
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('预览') ? <Button onClick={this.handlePreview.bind(this, record.xmzlUrl)} disabled={record.type === '0' || record.type === '1'} type='link'>预览</Button> : null}
                            {buttons.includes('预览') ? <Divider type='vertical' /> : null}
                            {buttons.includes('下载') ? <Button onClick={this.handleDownload.bind(this, record.id)} disabled={record.type === '0' || record.type === '1'} type='link'>下载</Button> : null}
                            {buttons.includes('下载') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <Button onClick={this.handleDelete.bind(this, record.id)} disabled={record.type === '0' || record.type === '1'} type='link'>删除</Button> : null}
                        </span>
                    ),
                },
            ],
            page: 1,
            limit: 10,
            total: 0,
            keyword: '',
            selectedRowKeys: [],
            selectedRowsID: [],
            statics: {},
            projectId: '',
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

    showModal = (info, id, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            actionInfo: info,
            title: info + '角色',
            id: id ? id : 0
        })
    }

    init = () => {
        UploadAction.GetXmmcForZlqd(
            { page: this.state.page, limit: this.state.limit, xmmc: this.state.keyword }
        ).then((res: any) => {
            if (res.status === 200) {
                res.data && res.data.forEach((item) => {
                    item.name = item.projectName
                    item.count = item.projectcount
                })
                this.setState({
                    data: res.data,
                    total: res.count,
                    statics: res.josnObj,
                    projectId: res.data.length > 0 ? res.data[0].id : ''
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

    getCheckboxProps = (record) => {
        if (record.type === '0') {
            return {
                disabled: false
            }
        } else {
            return {
                disabled: true
            }
        }
    }

    onChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowsID: [selectedRows[0].projectId],
            selectedRowKeys
        })
    }

    handleBatchDownload = () => {
        const keys = this.state.selectedRowsID
        if (this.state.selectedRowsID.length === 1) {
            const link = document.createElement('a')
            link.href = dev.url + '/xmzlqd/batchDownload?xmId=' + keys[0]
            link.download = 'admin'
            link.target = '_blank'
            if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
                const evt = document.createEvent('MouseEvents')
                evt.initEvent('click', true, true)
                link.dispatchEvent(evt)
            } else {
                link.click()
            }
        }
    }

    handleBatchDelete = () => {
        const keys = this.state.selectedRowsID
        if (this.state.selectedRowsID.length === 1) {
            const that = this
            confirm({
                title: '您确定要删除选中的内容吗?',
                content: '当您点击了此按钮，选中内容将永久删除！',
                onOk() {
                    UploadAction.BatchDeleteFile({ xmId: keys[0] }).then((res: any) => {
                        if (res.status === 200) {
                            message.success('删除成功')
                            that.init()
                        } else if (res.status === 400) {
                            message.error(res.msg)
                        }
                    })
                }
            })
        }
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
        if (TransTool.isPreview(xmzlUrl)) {
            window.open(dev.url + '/xmzlqd/showAttach?filePath=' + xmzlUrl)
        } else {
            message.error('该文件不支持预览，请下载')
        }
    }

    handleDownload = (id) => {
        if (!id) {
            return
        }
        const link = document.createElement('a')
        link.href = dev.url + '/xmzlqd/download?id=' + id
        link.download = 'admin'
        link.target = '_blank'
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

    componentWillMount() {
        this.init()
    }

    render() {
        const { buttons } = this.props
        const { xmzlTotal, xmzlThisWeek, xmzlThisUser }: any = this.state.statics
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='infoList'>
                    {/* <div className='xmmc'>
                        资料清单
                    </div> */}
                    <Card title='资料清单' className='card' bordered={false}>
                        <Row style={{ marginBottom: '20px' }}>
                            <Col span={8} className='file-statics'>
                                <div style={{ textAlign: 'center' }}>总计</div>
                                <div style={{ textAlign: 'center' }}>{xmzlTotal}项资料</div>
                            </Col>
                            <Col span={8} className='file-statics'>
                                <div style={{ textAlign: 'center' }}>本周上传</div>
                                <div style={{ textAlign: 'center' }}>{xmzlThisWeek}项资料</div>
                            </Col>
                            <Col span={8} className='file-statics'>
                                <div style={{ textAlign: 'center' }}>本账户上传</div>
                                <div style={{ textAlign: 'center' }}>{xmzlThisUser}项资料</div>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '16px' }}>
                            {buttons.includes('批量下载') ? <Button type='primary' onClick={this.handleBatchDownload.bind(this)}>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleBatchDelete.bind(this)}>删除</Button> : null}
                            <span style={{ float: 'right' }}>
                                <Search
                                    placeholder='请输入'
                                    onSearch={this.handleKeyword}
                                    style={{ width: 240 }}
                                />
                            </span>
                        </Row>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey={record => record.type + '-' + record.id}
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
                                type: 'radio',
                                getCheckboxProps: this.getCheckboxProps,
                                onChange: this.onChange
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
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        {
                            this.state.visible ? <AddRole actionInfo={this.state.actionInfo} id={this.state.id} init={this.init} handleCancel={this.handleCancel} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
