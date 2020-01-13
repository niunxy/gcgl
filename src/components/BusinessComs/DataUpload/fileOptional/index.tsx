import React, { Component } from 'react'
import { Form, Input, Row, Col, Select, Upload, Card, DatePicker, Button, Icon } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import FileAction from '@api/UploadAction'
import TransTool from '@utils/TransTool'
import dev from '@config/dev.config'
import configFE from '@config/fe.config'
import _ from 'lodash'
import './index.less'
const { Option } = Select

interface IState {
    projectList: any[],
    folderList: any[],
    curProj: string,
    curFolder: string
}

class FileOptional extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            projectList: [],
            folderList: [],
            curProj: '',
            curFolder: ''
        }
    }

    componentWillMount() {
        this.init()
    }

    init = () => {
        FileAction.QueryUnFinshXm({}).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    projectList: res.data || []
                })
            }
        })
        FileAction.GetSupplementFolder({}).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    folderList: res.data || []
                })
            }
        })
    }

    onProjChange = (value) => {
        this.setState({
            curProj: value
        })
    }

    onFolderChange = (value) => {
        this.setState({
            curFolder: value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='file-optional'>
                    {/* <div className='xmmc'>
                        其他资料
                    </div> */}
                    <Card title='补充资料' className='card' bordered={false}>
                        <Row>
                            <Col span={16} offset={1}>
                                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} >
                                    <Form.Item label='选择项目' key='proj'>
                                        <Select onChange={this.onProjChange}>
                                            {
                                                this.state.projectList.map((item: any) => (
                                                    <Option key={item.id} value={item.id}>{item.xmmc}</Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label='选择文件夹' key='folder'>
                                        <Select onChange={this.onFolderChange}>
                                            {
                                                this.state.folderList.map((item: any) => (
                                                    <Option key={item.id} value={item.id}>{item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label='选择上传文件' key='files'>
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
                                            action={`${dev.url}/xmzlqd/uploadXmzls?xmId=${this.state.curProj}&folderId=${this.state.curFolder}`}
                                        >
                                            <Button type='primary' disabled={!(this.state.curProj && this.state.curFolder)}>
                                                <Icon type='upload' /> 上传文件
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item label='上传人'>
                                        {getFieldDecorator('scr', {
                                            initialValue: loginUtils.isLogin()
                                        })(<Input placeholder='请输入上传人' disabled />)}
                                    </Form.Item>
                                    <Form.Item label='上传日期'>
                                        {getFieldDecorator('scsj', {
                                            initialValue: TransTool.getMomentTime(new Date())
                                        })(<DatePicker disabled style={{ 'width': '100%' }} />)}
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(FileOptional)
export default WrappedApp
