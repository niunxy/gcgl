import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Divider } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import UploadTemplate from './UploadTemplate'
import TransTool from '@utils/TransTool'
import FileAction from '@api/UploadAction'
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
    id: any,
    data: any[],
    selectedRowsID: string[],
    selectedRowKeys: string[],
    columns: any
}
export default class TemplateDownload extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '上传模板',
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
                                {rest[2] + 1}
                            </span>
                        )
                    }
                },
                {
                    title: '名称',
                    dataIndex: 'templateName',
                    key: 'templateName',
                },
                {
                    title: '上传人',
                    dataIndex: 'uploadUser',
                    key: 'uploadUser',
                },
                {
                    title: '上传时间',
                    dataIndex: 'uploadDate',
                    key: 'uploadDate',
                    render: (text) => {
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '下载次数',
                    dataIndex: 'downloadNum',
                    key: 'downloadNum'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('预览') ? <a onClick={this.handlePreview.bind(this, record.templateUrl, event)}>预览</a> : null}
                            {buttons.includes('预览') ? <Divider type='vertical' /> : null}
                            {buttons.includes('下载') ? <a onClick={this.download.bind(this, record.id, event)}>下载</a> : null}
                            {buttons.includes('下载') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <a onClick={this.handleDelete.bind(this, record.id, event)}>删除</a> : null}
                        </span>
                    ),
                },
            ],
            page: 1,
            limit: 10,
            total: 0,
            keyword: '',
            selectedRowsID: [],
            selectedRowKeys: []
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

    showModal = (info, id, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            actionInfo: info,
            title: info + '模板',
            id: id ? id : 0
        })
    }

    init = () => {
        FileAction.QueryAllTemplate(
            { page: this.state.page, limit: this.state.limit, templateName: this.state.keyword }
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
                FileAction.DelTemplate({ id }).then((res: any) => {
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

    onChange = (selectedRowKeys, selectedRows) => {
        const selectedRowsID: string[] = []
        selectedRows.forEach(item => {
            selectedRowsID.push(item.id)
        })
        this.setState({
            selectedRowsID,
            selectedRowKeys
        })
    }

    download = (id, event) => {
        event && event.preventDefault()
        if (!id) {
            return
        }
        const link = document.createElement('a')
        link.href = dev.url + '/template/downloadTemplate?id=' + id
        link.download = 'admin'
        link.target = '_blank'
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
        this.init()
    }

    handlePreview = (xmzlUrl) => {
        if (TransTool.isPreview(xmzlUrl)) {
            window.open(dev.url + '/xmzlqd/showAttach?filePath=' + xmzlUrl)
        } else {
            message.error('该文件不支持预览，请下载')
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
                <div className='template-download'>
                    {/* <div className='xmmc'>
                        模板下载
                    </div> */}
                    <Card title='模板下载' className='card' bordered={false}>
                        {buttons.includes('下载') ? <Button type='primary' onClick={this.download.bind(this, this.state.selectedRowsID.join(','))} style={{ marginBottom: '20px' }}>下载</Button> : null}
                        {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleDelete.bind(this, this.state.selectedRowsID.join(','))}>删除</Button> : null}
                        {buttons.includes('上传') ? <Button type='primary' onClick={this.showModal.bind(this, '上传', 0)} style={{ marginLeft: '20px' }}>上传</Button> : null}
                        <span style={{ float: 'right' }}>

                            <Search
                                placeholder='请输入模板名称'
                                onSearch={this.handleKeyword}
                                style={{ width: 240 }}
                            />
                        </span>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            pagination={{
                                total: this.state.total,
                                pageSize: 10,
                                onChange: this.changePage
                            }}
                            rowSelection={{
                                onChange: this.onChange
                            }}
                            rowKey='id'
                        />
                    </Card>
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        {
                            this.state.visible ? <UploadTemplate actionInfo={this.state.actionInfo} id={this.state.id} init={this.init} handleCancel={this.handleCancel} /> : null
                        }
                    </Modal>
                </div>
            )
    }
}
