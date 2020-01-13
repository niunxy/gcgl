import React, { Component } from 'react'
import { Card, List, Breadcrumb, Button, Modal, Row, Form, Select, message, Icon } from 'antd'
import FileAction from '@api/UploadAction'
import IndexAction from '@api/IndexAction'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import data from './data'
import dev from '@config/dev.config'
const { Option } = Select
import _ from 'lodash'
import './index.less'

interface IState {
    isDummy: boolean,
    visible: boolean,
    projectList: any[],
    projSubList: any[],
    landList: any[],
    proj: string,
    processInstanceId: string,
    kbbgcs: string,
    projSub: string,
    land: string,
    index: number,
    optionsName: string[],
    config: any[]
}
export default class ProjectForm extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isDummy: false,
            visible: false,
            projectList: [],
            projSubList: [],
            landList: [],
            proj: '',
            processInstanceId: '',
            kbbgcs: '',
            projSub: '',
            land: '',
            index: 0,
            optionsName: ['选择项目', '选择子项目', '选择地块'],
            config: [
                {
                    name: '设计意见汇总表',
                    baseNameSuffix: 'lx_lxfw',
                    btnStatus: false,
                    display: ['block', 'block', 'block'],
                    url: `${dev.rdpServerUrl}/RDP-SERVER/rdppage/show/a58688e6c67c140725ab6f96c0396c00?xmId=xmIdPlaceholder&baseName=baseNamePlaceholder&xmmc=xmmcPlaceholder&dkbh=dkbhPlaceholder`,
                    btnDownloadField: 3
                },
                {
                    name: '项目现场确认单',
                    baseNameSuffix: 'zytk',
                    btnStatus: false,
                    display: ['block', 'none', 'none'],
                    url: `${dev.rdpServerUrl}/RDP-SERVER/rdppage/show/dcd762ea7f6f1036af852d267ed6be70?xmId=xmIdPlaceholder&baseName=baseNamePlaceholder`,
                    btnDownloadField: 1
                },
                {
                    name: '核查巡检报告书',
                    baseNameSuffix: '',
                    btnStatus: true,
                    display: ['block', 'block', 'block'],
                    url: '',
                    btnDownloadField: 3
                },
                {
                    name: '项目文档统计表',
                    baseNameSuffix: '',
                    btnStatus: true,
                    display: ['block', 'block', 'block'],
                    url: '',
                    btnDownloadField: 3
                },
                {
                    name: '监理单与巡检日志表',
                    baseNameSuffix: '',
                    btnStatus: true,
                    display: ['block', 'block', 'block'],
                    url: '',
                    btnDownloadField: 3
                }
            ]
        }
    }

    componentDidMount() {
        this.initProject()
    }

    initProject = () => {
        if (this.state.isDummy) {
            this.setState({
                projectList: data.projectlist.data
            })
        } else {
            FileAction.QueryAllXmInfo({}).then((res: any) => {
                if (res.status === 200 && res.data.length > 0) {
                    this.setState({
                        projectList: res.data
                    })
                } else {
                    message.error('没有查询到项目')
                }
            })
        }
    }

    handleOk = (value) => {
        const kbbgcs = this.state.index === 1 ? 0 : this.state.kbbgcs
        const baseName = `xm${this.state.processInstanceId}_${kbbgcs}_${value.baseNameSuffix}`
        let urlFinal = value.url.replace('xmIdPlaceholder', this.state.proj).replace('baseNamePlaceholder', baseName)
        if (this.state.projSub !== '' && this.state.land !== '') {
            urlFinal = urlFinal.replace('xmmcPlaceholder', this.state.projSub).replace('dkbhPlaceholder', this.state.land)
        }
        window.open(urlFinal)
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            // projectList: [],
            projSubList: [],
            landList: [],
            proj: '',
            processInstanceId: '',
            kbbgcs: '',
            projSub: '',
            land: ''
        })
    }

    btnDownload = (index) => {
        this.setState({
            visible: true,
            index
        })
    }

    onProjChange = (value) => {
        const curProj = _.find(this.state.projectList, item => item.id === value)
        const curConfig = this.state.config[this.state.index]
        this.setState({
            // projectList: [],
            projSubList: [],
            landList: [],
            proj: value,
            processInstanceId: curProj.processInstanceId,
            kbbgcs: curProj.kbbgcs,
            projSub: '',
            land: '',
        })

        if (curConfig.btnDownloadField === 3) {
            if (this.state.isDummy) {
                this.setState({
                    // projectList: [],
                    projSubList: data.subProjectList.data,
                    landList: [],
                    proj: value,
                    processInstanceId: curProj.processInstanceId,
                    kbbgcs: curProj.kbbgcs,
                    projSub: '',
                    land: '',
                })
            } else {
                IndexAction.GetSubProjectByXmId({ xmId: value }).then((res: any) => {
                    if (res && res.status === 200 && res.data.length > 0) {
                        this.setState({
                            // projectList: [],
                            projSubList: res.data,
                            landList: [],
                            proj: value,
                            processInstanceId: curProj.processInstanceId,
                            kbbgcs: curProj.kbbgcs,
                            projSub: '',
                            land: '',
                        })
                    } else {
                        message.error('没有查询到子项目')
                    }
                })
            }
        }
    }

    onProjSubChange = (value) => {
        const curProjSub = _.find(this.state.projSubList, item => item.xmmc === value)
        this.setState({
            // projectList: [],
            // projSubList: [],
            landList: curProjSub.children,
            // proj: '',
            // processInstanceId: '',
            // kbbgcs: '',
            projSub: value,
            land: '',
        })
    }

    onLandChange = (value) => {
        this.setState({
            // projectList,
            // projSubList,
            // landList,
            // proj,
            // processInstanceId,
            // kbbgcs,
            // projSub,
            land: value
        })
    }

    enableDownload = (value) => {
        let enable = false
        if (value === 3) {
            enable = this.state.proj !== '' && this.state.projSub !== '' && this.state.land !== ''
        } else if (value === 2) {
            enable = this.state.proj !== '' && this.state.projSub !== ''
        } else {
            enable = this.state.proj !== ''
        }
        return !enable
    }

    render() {
        const curConfig = this.state.config[this.state.index]
        return !loginUtils.isLogin() ? (
            <Redirect to='/login' />
        ) : (
                <div className='base-info'>
                    <div className='projectForm'>
                        <Breadcrumb className='breadcrumb'>
                            <Breadcrumb.Item>统计分析</Breadcrumb.Item>
                            <Breadcrumb.Item>项目表格统计</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className='placeHolder' />
                        <Card title='项目表格统计' className='card' bordered={false}>
                            <List style={{ width: 500, margin: '0 auto' }}>
                                {
                                    this.state.config.map((item, index) => {
                                        return (
                                            <List.Item key={index}>
                                                <span>{item.name}</span>
                                                <Button disabled={item.btnStatus} type='primary' onClick={this.btnDownload.bind(this, index)}>
                                                    下载
                                            </Button>
                                            </List.Item>
                                        )
                                    })
                                }
                            </List>
                        </Card>
                        <Modal
                            title='下载'
                            width={800}
                            visible={this.state.visible}
                            closeIcon={<Icon type='close' onClick={this.handleCancel} />}
                            footer={
                                <Row style={{ textAlign: 'center' }}>
                                    <Button disabled={this.enableDownload(curConfig.btnDownloadField)} key='download' type='primary' onClick={this.handleOk.bind(this, curConfig)}>
                                        下载
                                </Button>
                                    <Button key='cancel' type='primary' onClick={this.handleCancel}>
                                        取消
                                </Button>
                                </Row>
                            }
                        >
                            <span>{curConfig.name}</span>
                            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} >
                                <Form.Item label={this.state.optionsName[0]} key={0} style={{ display: curConfig.display[0] }}>
                                    <Select onChange={this.onProjChange} value={this.state.proj}>
                                        {
                                            this.state.projectList.map((projItem) => {
                                                return (
                                                    <Option value={projItem.id} key={projItem.id}>{projItem.xmmc}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label={this.state.optionsName[1]} key={1} style={{ display: curConfig.display[1] }}>
                                    <Select onChange={this.onProjSubChange} value={this.state.projSub} disabled={this.state.proj === '' || this.state.projSubList.length === 0}>
                                        {
                                            this.state.projSubList.map((projSubItem) => {
                                                return (
                                                    <Option value={projSubItem.xmmc} key={projSubItem.xmmc}>{projSubItem.xmmc}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label={this.state.optionsName[2]} key={2} style={{ display: curConfig.display[2] }}>
                                    <Select onChange={this.onLandChange} value={this.state.land} disabled={this.state.projSub === '' || this.state.landList.length === 0}>
                                        {
                                            this.state.landList.map((landItem) => {
                                                return (
                                                    <Option value={landItem.dkbh} key={landItem.dkbh}>{landItem.dkbh}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>
            )
    }
}
