import React, { Component } from 'react'
import { Button, Card, Modal, Table, message, Breadcrumb } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import IndexAction from '@api/IndexAction'
import SystemAction from '@api/SystemAction'
import './index.less'
const { confirm } = Modal
import FileAction from '@api/UploadAction'
import tool from '@utils/TransTool'

interface IState {
    option: [],
    keyword: '',
    columns: any[],
    data: any[]
}
export default class SuperviseExamination extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        // const { buttons } = this.props
        this.state = {
            keyword: '',
            option: [],
            data: [

            ],
            columns: [
                {
                    title: '项目名称',
                    dataIndex: 'xmmc',
                    key: 'xmmc',
                },
                {
                    title: '项目创建人',
                    dataIndex: 'xmcjr',
                    key: 'xmcjr',
                },
                {
                    title: '项目日期',
                    dataIndex: 'cjrq',
                    key: 'cjrq',
                    render: (text) => {
                        return tool.formatDate(text)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => {
                        // console.log(record.qtzt === undefined)
                        return (
                            < span >
                                {
                                    record.qtzt === undefined || Number(record.qtzt) === 0 ?
                                        <Button type='link' onClick={this.stopStart.bind(this, record.processInstanceId, 'suspend')}>暂停</Button> :
                                        <Button type='link' onClick={this.stopStart.bind(this, record.processInstanceId, 'activate')}>启用</Button>
                                }
                            </span>
                        )
                    },
                },
            ]
        }
    }

    handleKeyword = (keyword) => {
        this.setState({ keyword })
    }

    initProject = () => {
        FileAction.QueryUnFinshXm({}).then((res: any) => {
            if (res.status === 200) {
                if (res.data) {
                    /* const result = res.data.find((item) => {
                        return item.xmjd === 19
                    }) */
                    this.setState({
                        data: res.data
                    })
                }
            }
        })
    }
    // 暂停启用
    stopStart = (processInstanceId, type) => {
        SystemAction.ManagerProcess({
            processInstanceId,
            type
        }).then((res: any) => {
            if (res.status === 200) {
                message.success(res.msg)
                this.initProject()
            } else {
                message.error(res.msg)
            }
        })
    }

    handleAgree = (id, event) => {
        event && event.preventDefault()
        if (id === '') {
            return
        }
        // const that = this
        confirm({
            title: '您确定要通过吗?',
            content: '当您点击了确定按钮，流程将会通过到下一个阶段！',
            onOk() {
                IndexAction.StopActivity({
                    xmId: id
                }).then((res: any) => {
                    if (res.status === 200) {
                        message.success(res.msg)
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

    componentDidMount() {
        this.initProject()
    }

    render() {
        // const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <>
                    <Breadcrumb className='breadcrumb'>
                        <Breadcrumb.Item>过程监控</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            监督审查
                                    </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className='placeHolder' />
                    <div className='examination'>
                        <Card title='监理审查' className='card'>
                            {/* <Row style={{marginBottom: '20px'}}>
                            {buttons.includes('批量下载') ? <Button type='primary'>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }}>删除</Button> : null}
                        </Row> */}
                            <Table
                                className='components-table-demo-nested'
                                columns={this.state.columns}
                                dataSource={this.state.data}
                                rowKey='id'
                                pagination={false}
                            />
                        </Card>
                    </div>
                </>
            )
    }
}
