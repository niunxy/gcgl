import React, { Component } from 'react'
import { Form, Input, Row, Col, Select, Upload, message, Button, Icon, Card, DatePicker } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import FileAction from '@api/UploadAction'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import TransTool from '@utils/TransTool'
import dev from '@config/dev.config'
import configFE from '@config/fe.config'
import _ from 'lodash'
import './index.less'
const { Option } = Select

interface IState {
    projectList: any[],
    processList: any[],
    projectId: string,
    btnStatus: boolean
}

@inject('stores')
@observer
class File extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            projectList: [],
            processList: [],
            projectId: '',
            btnStatus: true
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                FileAction.SubmitXmzl({
                    xmId: values.projectList
                }).then((res: any) => {
                    const xmjd = res.data
                    if (res.status === 200 && !(_.isNil(xmjd))) {
                        const curPoj = _.find(this.state.projectList, item => item.id === values.projectList)
                        const { id, xmmc, processInstanceId } = curPoj
                        const menuIndex = xmjd === -1 || xmjd === 28 ? '2' : '1'
                        const isWorking = xmjd === -1 || xmjd === 28 ? false : true
                        const { mapStore } = this.props.stores
                        const { refresh, collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
                        mapStore.onHomeSiderMenu({
                            refresh,
                            collapsed,
                            indexMenus,
                            openKeys: [menuIndex]
                        })
                        this.props.history.replace(`/index/map/implementItemDoc/${id}/${xmmc}/${xmjd}/${processInstanceId}/${isWorking}`)
                    } else {
                        message.error(res.msg)
                    }
                })
            } else {
                message.error('请上传所有的过程文件！')
            }
        })
    }

    initProject = () => {
        FileAction.QueryUnFinshXm({}).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    projectList: res.data || []
                })
            }
        })
    }

    onChange = (id, info) => {
        if (info.fileList.length === 0) {
            this.props.form.resetFields(`${id}`)
        }
    }

    getProcess = (value) => {
        this.setState({
            processList: [],
            projectId: '',
            btnStatus: true
        })
        FileAction.QueryFolderInfoByXmId({
            xmId: value
        }).then((res: any) => {
            if (res.status === 200 && res.data.length > 0) {
                this.setState({
                    processList: res.data,
                    projectId: value,
                    btnStatus: false
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    componentWillMount() {
        this.initProject()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='file'>
                    {/* <div className='xmmc'>
                    必传资料
                </div> */}
                    <Card title='上传必传资料' className='card' bordered={false}>
                        <Row>
                            <Col span={16} offset={1}>
                                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} onSubmit={this.handleSubmit}>
                                    <Form.Item label='选择项目'>
                                        {getFieldDecorator('projectList', {
                                            rules: [{ required: true, message: '请选择项目!' }]
                                        })(
                                            <Select onChange={this.getProcess}>
                                                {
                                                    this.state.projectList.map((item: any) => (
                                                        <Option key={item.id} value={item.id}>{item.xmmc}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    {
                                        this.state.processList.map((item: any) => (
                                            <Form.Item label={item.value} key={item.id}>
                                                {getFieldDecorator(item.id, item.type === 0 ? {
                                                    rules: [{ required: true, message: '请选择过程!' }]
                                                } : {})(
                                                    <Row>
                                                        <Col span={20}>
                                                            <Upload
                                                                multiple
                                                                name='xmzls'
                                                                accept={configFE.uploadSuffix}
                                                                withCredentials={true}
                                                                showUploadList={{
                                                                    showPreviewIcon: false,
                                                                    showRemoveIcon: true,
                                                                    showDownloadIcon: false
                                                                }}
                                                                onChange={this.onChange.bind(this, item.id)}
                                                                action={`${dev.url}/xmzlqd/uploadXmzls?xmId=${this.state.projectId}&folderId=${item.id}`}
                                                            >
                                                                <Button style={{ marginBottom: '24px' }}>
                                                                    <Icon type='upload' /> 上传文件
                                                            </Button>
                                                            </Upload>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Form.Item>
                                        ))
                                    }
                                    <Form.Item label='上传人'>
                                        {getFieldDecorator('xmcjr', {
                                            initialValue: loginUtils.isLogin()
                                        })(<Input placeholder='请输入上传人' disabled />)}
                                    </Form.Item>
                                    <Form.Item label='上传日期'>
                                        {getFieldDecorator('date', {
                                            initialValue: TransTool.getMomentTime(new Date())
                                        })(<DatePicker disabled style={{ 'width': '100%' }} />)}
                                    </Form.Item>
                                    <Row>
                                        <Col span={21} offset={3} style={{ textAlign: 'center' }}>
                                            <Button disabled={this.state.btnStatus} type='primary' htmlType='submit'>
                                                提交
                                        </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(File)
export default WrappedApp
