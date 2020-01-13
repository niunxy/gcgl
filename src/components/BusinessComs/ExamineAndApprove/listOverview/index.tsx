import React, { Component } from 'react'
import { Table, Button, message, Card, Modal, Input, Divider, Row, Col } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import AddRole from './addRole'
import UploadAction from '@api/UploadAction'
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
    statics: {}
}
export default class ListOverview extends Component<any, IState> {
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
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '文件数量',
                    dataIndex: 'count',
                    key: 'count',
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
            ids: [],
            statics: {},
            projectId: '',
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
                    projectId: res.data[0].id
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
        UploadAction.GetXmzlByIds({xmId: record.projectId, folderId: record.folderId}).then((res: any) => {
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
        // this.init()
        /* if (!id) {
            return
        }
        const arr = id.split(',')
        const aArr: any[] = []
        arr.forEach((item) => {
            const link = document.createElement('a')
            link.href = dev.url + '/xmzlqd/download?id=' + item 
            link.download = 'admin'
            aArr.push(link)
        })
        aArr.forEach((item: any) => {
            if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
                const evt = document.createEvent('MouseEvents')
                evt.initEvent('click', true, true)
                item.dispatchEvent(evt)
            } else {
                item.click()
            }
        }) */
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const { buttons } = this.props
        const {xmzlTotal, xmzlThisWeek, xmzlThisUser}: any = this.state.statics
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div>
                    <Card title='资料清单' bordered={false}>
                        <Row style={{marginBottom: '20px'}}>
                            <Col span={8} className='file-statics'>
                                <div style={{textAlign: 'center'}}>总计</div>
                                <div style={{textAlign: 'center'}}>{xmzlTotal}项资料</div>
                            </Col>
                            <Col span={8} className='file-statics'>
                                <div style={{textAlign: 'center'}}>本周上传</div>
                                <div style={{textAlign: 'center'}}>{xmzlThisWeek}项资料</div>
                            </Col>
                            <Col span={8} className='file-statics'>
                                <div style={{textAlign: 'center'}}>本账户上传</div>
                                <div style={{textAlign: 'center'}}>{xmzlThisUser}项资料</div>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '20px'}}>
                            {buttons.includes('批量下载') ? <Button type='primary' onClick={this.handleDownload.bind(this, this.state.ids.join(','))}>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }} onClick={this.handleDelete.bind(this, this.state.ids.join(','))}>删除</Button> : null}
                            <span style={{ float: 'right' }}>
                                <Search
                                    placeholder='请输入'
                                    onSearch={this.handleKeyword}
                                    style={{ width: 240 }}
                                />
                                {/* <Button type='primary' style={{marginLeft: '6px'}}>搜索</Button> */}
                            </span>
                        </Row>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='uploadDate'
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
