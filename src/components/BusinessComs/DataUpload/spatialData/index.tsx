import React, { Component } from 'react'
import { Form, Input, Row, Col, Select, Upload, message, Button, Icon, Card, DatePicker } from 'antd'
import loginUtils from '@utils/Login'
import TransTool from '@utils/TransTool'
import { Redirect } from 'react-router-dom'
import FileAction from '@api/UploadAction'
import { toJS } from 'mobx'
import http from '../../../../utils/HttpClient'
import dev from '@config/dev.config'
import './index.less'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'

const { Option } = Select

interface IState {
    project: any[],
    processList: any[],
    projectId: string,
    processId: string,
    fileList: any[],
    quantitiesFileList: any[],
    flag: boolean,
    xmmc: string
    xmjd: string
    processInstanceId: string
}

@inject('stores')
@observer
class SpatialData extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            project: [],
            processList: [

            ],
            projectId: '',
            processId: '',
            fileList: [],
            quantitiesFileList: [],
            flag: false,
            xmmc: '',
            xmjd: '',
            processInstanceId: ''
        }
    }

    handleReset = () => {
        this.props.form.resetFields()
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err) => {
            if (!err) {
                const { xmjd } = this.state
                const menuIndex = xmjd === '-1' || xmjd === '28' ? '2' : '1'
                const isWorking = xmjd === '-1' || xmjd === '28' ? false : true
                const { mapStore } = this.props.stores
                const { refresh, collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
                mapStore.onHomeSiderMenu({
                    refresh,
                    collapsed,
                    indexMenus,
                    openKeys: [menuIndex]
                })
                this.props.history.replace(`/index/map/implementItemDoc/${this.state.projectId}/${this.state.xmmc}/${this.state.xmjd}/${this.state.processInstanceId}/${isWorking}`)
            }
        })
    }

    initProject = () => {
        FileAction.QueryUnFinshXm({}).then((res: any) => {
            if (res.status === 200) {
                if (res.data) {

                    this.setState({
                        project: res.data
                    })
                }
            }
        })
    }

    handleProject = (value) => {
        const arr = value.split(',')
        if (Number(arr[1] < 11)) {
            this.setState({
                processList: []
            })
        } else if (Number(arr[1]) < 14 && Number(arr[1]) >= 11) {
            this.setState({
                processList: [
                    {
                        value: '0',
                        name: '立项数据上传'
                    }
                ]
            })
        } else if (Number(arr[1]) >= 14 && Number(arr[1]) < 20) {
            this.setState({
                processList: [
                    {
                        value: '0',
                        name: '立项数据上传'
                    },
                    {
                        value: '1',
                        name: '设计数据上传'
                    }
                ]
            })
        } else if (Number(arr[1]) >= 20 && Number(arr[1]) < 23) {
            this.setState({
                processList: [
                    {
                        value: '0',
                        name: '立项数据上传'
                    },
                    {
                        value: '1',
                        name: '设计数据上传'
                    },
                    {
                        value: '2',
                        name: '竣工数据上传'
                    }
                ]
            })
        } else if (Number(arr[1]) >= 23 && Number(arr[1]) < 25) {
            this.setState({
                processList: [
                    {
                        value: '0',
                        name: '立项数据上传'
                    },
                    {
                        value: '1',
                        name: '设计数据上传'
                    },
                    {
                        value: '2',
                        name: '竣工数据上传'
                    },
                    {
                        value: '3',
                        name: '复核数据上传'
                    }
                ]
            })
        } else if (Number(arr[1]) >= 25) {
            this.setState({
                processList: [
                    {
                        value: '0',
                        name: '立项数据上传'
                    },
                    {
                        value: '1',
                        name: '设计数据上传'
                    },
                    {
                        value: '2',
                        name: '竣工数据上传'
                    },
                    {
                        value: '3',
                        name: '复核数据上传'
                    },
                    {
                        value: '4',
                        name: '耕评数据上传'
                    }
                ]
            })
        }
        this.setState({
            projectId: arr[0],
            xmmc: arr[2],
            xmjd: arr[1],
            processInstanceId: arr[3],
            processId: ''
        })
        this.props.form.resetFields()
    }

    handleProcess = (value) => {
        this.setState({
            processId: value,
            flag: true
        })
    }

    customRequest = (info) => {
        if (this.state.projectId === '') {
            message.error('请先选择项目')
        }
        if (this.state.processId === '') {
            message.error('请选择过程')
        }
        const formData = new FormData()
        formData.append('spatial', info.file)
        http.upload(dev.url + '/xmzlqd/uploadSpatialData?xmId=' + this.state.projectId + '&folderId=' + this.state.processId, formData)
            .then((res) => {
                if (res.status === 200) {
                    const obj = {
                        uid: Math.random() * -10000,
                        name: info.file.name,
                        status: 'done',
                        url: ''
                    }
                    const allFiles = this.state.fileList
                    allFiles.push(obj)
                    message.success('上传成功')
                    this.setState({
                        fileList: allFiles
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
    }

    uploadSpatialData = (file) => {
        if (file.file.status === 'done') {
            message.success('上传成功！')
            /* const obj = {
                uid: Math.random() * -10000,
                name: file.file.name,
                status: 'done',
                url: ''
            }
            const allFiles = this.state.fileList
            allFiles.push(obj) */
            this.setState({
                fileList: file.fileList
            })
        } else {
            this.setState({
                fileList: file.fileList
            })
        }
    }

    quantitiesRequest = (info) => {
        if (this.state.projectId === '') {
            message.error('请先选择项目')
        }
        if (this.state.processId === '') {
            message.error('请选择过程')
        }
        const formData = new FormData()
        formData.append('quantity', info.file)
        http.upload(dev.url + '/xmzlqd/uploadQuantityFile?xmId=' + this.state.projectId + '&folderId=' + this.state.processId, formData)
            .then((res) => {
                if (res.status === 200) {
                    const obj = {
                        uid: Math.random() * -10000,
                        name: info.file.name,
                        status: 'done',
                        url: ''
                    }
                    const allFiles: any[] = []
                    allFiles[0] = obj
                    message.success('上传成功')
                    this.setState({
                        quantitiesFileList: allFiles
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
    }

    uploadQuantityFile = (file) => {
        if (file.file.status === 'done') {
            message.success('上传成功！')
            /* const obj = {
                uid: Math.random() * -10000,
                name: file.file.name,
                status: 'done',
                url: ''
            }
            const allFiles = this.state.fileList
            allFiles.push(obj) */
            this.setState({
                quantitiesFileList: file.fileList
            })
        } else {
            this.setState({
                quantitiesFileList: file.fileList
            })
        }
    }

    allowUpload = () => {
        if (!this.state.processId) {
            return true
        } else {
            return false
        }
    }

    componentDidMount() {
        this.initProject()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='spatial-data'>
                    {/* <div className='xmmc'>
                        空间数据
                    </div> */}
                    <Card title='空间数据' className='card' bordered={false}>
                        <Row>
                            <Col span={16} offset={3}>
                                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
                                    <Form.Item label='选择项目'>
                                        {getFieldDecorator('project', {
                                            rules: [{ required: true, message: '请选择项目!' }],
                                        })(
                                            <Select onChange={this.handleProject}>
                                                {
                                                    this.state.project.length > 0 && this.state.project.map((item: any) => (
                                                        <Option key={item.id} value={item.id + ',' + item.xmjd + ',' + item.xmmc + ',' + item.processInstanceId}>{item.xmmc}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label='选择过程'>
                                        {getFieldDecorator('process', {
                                            rules: [{ required: true, message: '请选择过程!' }],
                                            // initialValue: this.state.processId
                                        })(
                                            <Select onChange={this.handleProcess}>
                                                {
                                                    this.state.processList.map((item: any) => (
                                                        <Option key={item.value} value={item.value}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label='上传人'>
                                        {getFieldDecorator('xmcjr', {
                                            rules: [{ required: true, message: '请输入上传人!' }],
                                            initialValue: loginUtils.isLogin()
                                        })(<Input placeholder='请输入上传人' disabled />)}
                                    </Form.Item>
                                    <Form.Item label='上传日期'>
                                        {getFieldDecorator('date', {
                                            initialValue: TransTool.getMomentTime(new Date())
                                        })(<DatePicker disabled style={{ 'width': '100%' }} />)}
                                    </Form.Item>
                                    <Form.Item label='上传附件'>
                                        {getFieldDecorator('upload', {
                                            rules: [{ required: true, message: '请上传!' }],
                                        })(
                                            <div>
                                                <Upload
                                                    multiple
                                                    accept='.mdb'
                                                    name='spatial'
                                                    fileList={this.state.fileList}
                                                    withCredentials={true}
                                                    action={dev.url + '/xmzlqd/uploadSpatialData?xmId=' + this.state.projectId + '&folderId=' + this.state.processId}
                                                    onChange={this.uploadSpatialData}
                                                    showUploadList={{
                                                        showPreviewIcon: false,
                                                        showRemoveIcon: false,
                                                        showDownloadIcon: false
                                                    }}
                                                >
                                                    <Button type='primary' disabled={this.allowUpload()}>
                                                        <Icon type='upload' /> 上传文件
                                                    </Button>
                                                </Upload>
                                            </div>
                                        )}
                                    </Form.Item>
                                    <Form.Item label='工程量文件'>
                                        {getFieldDecorator('quantities', {
                                            rules: [{ required: true, message: '请上传工程量文件!' }],
                                        })(
                                            <Upload
                                                accept='.xlsx'
                                                name='quantity'
                                                fileList={this.state.quantitiesFileList}
                                                action={dev.url + '/xmzlqd/uploadQuantityFile?xmId=' + this.state.projectId + '&folderId=' + this.state.processId}
                                                withCredentials={true}
                                                onChange={this.uploadQuantityFile}
                                                showUploadList={{
                                                    showPreviewIcon: false,
                                                    showRemoveIcon: false,
                                                    showDownloadIcon: false
                                                }}
                                            >
                                                <Button type='primary' style={{ marginBottom: '24px' }} disabled={this.allowUpload()}>
                                                    <Icon type='upload' /> 上传工程量文件
                                                </Button>
                                            </Upload>
                                        )}
                                    </Form.Item>
                                    {<Row>
                                        <Col span={21} offset={3} style={{ textAlign: 'center' }}>
                                            <Button type='primary' htmlType='submit'>
                                                提交
                                            </Button>
                                        </Col>
                                    </Row>}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(SpatialData)
export default WrappedApp
