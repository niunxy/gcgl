import * as React from 'react'
import InfoAction from '@api/InfoAction'
// import TransTool from '@utils/TransTool'
import { Button, Form, Select, Input, Upload, Icon, Checkbox, message, Row, Col, Card, Steps, Avatar } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import dev from '@config/dev.config'
import http from '../../../../utils/HttpClient'
import TransTool from '@utils/TransTool'
// import { values } from 'mobx'
/* import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom' */

const { Option } = Select
const { TextArea } = Input
// const { Dragger } = Upload
const { Step } = Steps

interface IProps extends FormComponentProps {
    id?: any,
    handleCancel: any,
    actionInfo: string,
    init?: any,
    record: any,
    form: any,
}

interface IState {
    /* fileList: any[],
    projectList: any[],
    opinionList: any[],
    folderList: any[],
    resourceList: any[],
    dutyPerson: string,
    assignTo: string,
    opinion: string,
    allFiles: {}, */
}

class Detail extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }
    state = {
        fileList: [],
        projectList: [],
        opinionList: [],
        folderList: [],
        resourceList: [],
        dutyPerson: '',
        assignTo: '',
        allFiles: {},
        opinion: '',
    }

    getProjectList = () => {
        InfoAction.GetProjectList(null).then((res: any) => {
            this.setState({
                projectList: res.data
            })
        })
    }

    /* handleProject = (...rest) => {
        this.setState({
            dutyPerson: rest[1].props.duty
        })
    } */

    GetDetailById = () => {
        InfoAction.GetDetailById(this.props.id, null).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    opinionList: res.data.recordList,
                    folderList: res.data.folderList,
                    resourceList: res.data.resourceList,
                })
            }
        })
    }

    customRequest = (id, info) => {
        const formData = new FormData()
        formData.append('xmzls', info.file)
        http.upload(dev.url + '/xmzlqd/uploadXmzls?xmId=' + this.props.record.projectId + '&folderId=' + id, formData)
            .then((res) => {
                if (res.status === 200) {
                    const obj = {
                        uid: '-1',
                        name: info.file.name,
                        status: 'done',
                        url: ''
                    }
                    const allFiles = this.state.allFiles
                    allFiles[id] ? allFiles[id] = [...allFiles[id]] : allFiles[id] = []
                    allFiles[id].push(obj)
                    this.setState({
                        allFiles,
                        // flag: true
                    })
                } else {
                    message.error(res.data.msg)
                    /* this.setState({
                        flag: false
                    }) */
                }
            })
    }

    upload = (id, file) => {
        if (file.file.status === 'done') {
            message.success('上传成功！')
            this.setState({
                [id]: file.fileList
            })

        } else {
            this.setState({
                [id]: file.fileList
            })
        }
    }
    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            }
        })
    }

    approveAgree = (id) => {
        if (this.state.opinion === '' || this.state.opinion === null) {
            message.error('请填写审批意见！')
            return
        }
        const arr: any = []
        this.state.folderList.forEach((item: any) => {
            arr.push(item.FOLDERID)
        })
        const isAll = arr.every((value) => {
            return this.state[value] && this.state[value].length > 0
        })
        if (!isAll) {
            message.error('请上传文件！')
            return
        }
        InfoAction.ApproveAgree(id, { opinion: this.state.opinion })
            .then((res: any) => {
                if (res.status === 200) {
                    message.success('同意成功！')
                    this.handleReset()
                    this.props.init()
                } else {
                    message.error('同意失败！')
                }
            })
    }

    approveReject = (id) => {
        if (this.state.opinion === '' || this.state.opinion === null) {
            message.error('请填写审批意见！')
            return
        }
        InfoAction.ApproveReject(id, { opinion: this.state.opinion, bgjdType: this.props.record.bgjdType })
            .then((res: any) => {
                if (res.status === 200) {
                    message.success('驳回成功！')
                    this.handleReset()
                    this.props.init()
                } else {
                    message.error('驳回失败！')
                }
            })
    }

    approveRetry = (id) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {

                InfoAction.ApproveRetry(id, { content: values.content, urgent: values.urgent, projectId: this.props.record.projectId })
                    .then((res: any) => {
                        if (res.status === 200) {
                            message.success('重新申请成功！')
                            this.handleReset()
                            this.props.init()
                        } else {
                            message.error('重新申请失败！')
                        }
                    })
            }
        })
    }

    approveFinish = (id, assignTo, opinion) => {
        if (opinion === '') {
            message.error('请填写审批意见！')
            return
        }
        if (assignTo === '') {
            message.error('请选择派发部门！')
            return
        }
        InfoAction.ApproveFinish(id, assignTo, { opinion })
            .then((res: any) => {
                if (res.status === 200) {
                    message.success('提交成功！')
                    this.handleReset()
                    this.props.init()
                } else {
                    message.error('失败！')
                }
            })
    }

    handleReset = () => {
        this.props.form.resetFields()
        this.props.handleCancel()
    }

    handleOpinion = (e) => {
        this.setState({
            opinion: e.target.value
        })
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
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

    handleDispatch = (value) => {
        this.setState({
            assignTo: value
        })
    }

    xmzlDel = (id, file) => {
        const index = this.state[id].findIndex((item) => {
            return file.uid === item.uid
        })
        this.state[id].splice(index, 1)
        InfoAction.XmzlDel({
            id: file.response.data[0].id
        }).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    [id]: this.state[id]
                }, () => {
                    console.log(this.props.form.validateFields(id))
                    if (this.state[id].length === 0) {
                        this.props.form.resetFields(id)
                    }
                })

            }
        })
    }

    componentDidMount() {
        /* if (this.props.actionInfo === '审批') {
            this.getProjectList()
        } */
        this.GetDetailById()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className='approval-detail-box'>
                <Row gutter={16}>
                    <Col span={16}>
                        <Card title='审核' bordered={false}>
                            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
                                <Form.Item label='选择项目'>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目名称不能为空!',
                                            }
                                        ],
                                        initialValue: this.props.record.projectName
                                    })(
                                        <Select disabled>
                                            {
                                                this.state.projectList.map((item: any) => {
                                                    return (
                                                        <Option value={item.projectId} key={item.projectId}>{item.projectName}</Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label='项目负责人'>
                                    {getFieldDecorator('dutyPerson', {
                                        initialValue: this.props.record.dutyPerson
                                    })(
                                        <Input disabled />
                                    )}
                                </Form.Item>
                                <Form.Item label='变更内容填写'>
                                    {getFieldDecorator('content', {
                                        rules: [{
                                            required: true,
                                            message: '变更内容不能为空!',
                                        }],
                                        initialValue: this.props.record.content
                                    })(
                                        <TextArea
                                            placeholder=''
                                            autosize={{ minRows: 5, maxRows: 10 }}
                                            disabled={this.props.actionInfo !== '重新申请'}
                                        />
                                    )}
                                </Form.Item>
                                {this.props.actionInfo !== '重新申请' && this.state.resourceList.length > 0 ? <Form.Item label='附件'>
                                    {getFieldDecorator('content', {
                                        // initialValue: this.props.record.content
                                    })(
                                        <ul className='enclosure' style={{ display: this.state.resourceList.length > 0 ? 'block' : 'none' }}>
                                            {
                                                this.state.resourceList.map((item: any) => <li key={item.XXZJBH}>{item.ZLMC}<Button type='link' onClick={this.handlePreview.bind(this, item.XMZL_URL)}>预览</Button><Button type='link' onClick={this.handleDownload.bind(this, item.XXZJBH)}>下载</Button></li>)
                                            }
                                        </ul>
                                    )}
                                </Form.Item> : null}
                                {this.props.actionInfo === '审批' ? <Form.Item label='审批意见'>
                                    {getFieldDecorator('opinion', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '审批意见不能为空!',
                                            }
                                        ]
                                        // initialValue: this.props.record.content
                                    })(
                                        <TextArea
                                            placeholder=''
                                            autosize={{ minRows: 5, maxRows: 10 }}
                                            onChange={this.handleOpinion}
                                        />
                                    )}
                                </Form.Item> : null}
                                {/* <Form.Item label='上传附件'>
                                    <Dragger
                                        multiple
                                        accept='.xsl'
                                        customRequest={this.customRequest}
                                        fileList={this.state.fileList}
                                    >
                                        <p className='ant-upload-drag-icon'>
                                            <Icon type='inbox' />
                                        </p>
                                        <p className='ant-upload-text'>点击或将文件拖拽到这里上传</p>
                                        <p className='ant-upload-hint'>
                                            支持扩展名：.mdb
                                </p>
                                    </Dragger>
                                </Form.Item> */}
                                {
                                    this.state.folderList.length > 0 && this.props.actionInfo === '审批' && this.state.folderList.map((item: any) => (

                                        <Form.Item label='上传资料' key={item.FOLDERNAME}>
                                            {getFieldDecorator(item.FOLDERID, {
                                                rules: [{ required: true, message: '请选择资料!' }],
                                                // initialValue: item.id
                                            })(
                                                <Row>
                                                    <Col span={24}>
                                                        <Input placeholder='请选择上传资料' value={item.FOLDERNAME} disabled />
                                                    </Col>
                                                    <Col span={24}>

                                                        <Upload multiple
                                                            // customRequest={this.customRequest.bind(this, item.FOLDERID)}
                                                            name='xmzls'
                                                            fileList={this.state[item.FOLDERID]}
                                                            withCredentials={true}
                                                            showUploadList={{
                                                                showPreviewIcon: false,
                                                                showRemoveIcon: true,
                                                                showDownloadIcon: false
                                                            }}
                                                            action={dev.url + '/xmzlqd/uploadXmzls?xmId=' + this.props.record.projectId + '&folderId=' + item.FOLDERID}
                                                            onChange={this.upload.bind(this, item.FOLDERID)}
                                                            onRemove={this.xmzlDel.bind(this, item.FOLDERID)}
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
                                <Form.Item label='是否加急处理'>
                                    {getFieldDecorator('urgent', {
                                        valuePropName: 'checked',
                                        initialValue: this.props.record.urgent
                                    })(
                                        <Checkbox disabled={this.props.actionInfo !== '重新申请'}>特急提醒</Checkbox>
                                    )}
                                </Form.Item>
                                {this.props.record.xmjd === '35' && this.props.actionInfo !== '查看' ? <Form.Item label='派发部门'>
                                    {getFieldDecorator('dispatch', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '派发部门不能为空!',
                                            }
                                        ]
                                        // initialValue: this.props.record.urgent
                                    })(
                                        <Select onChange={this.handleDispatch}>
                                            <Option value='6'>项目部实地勘测</Option>
                                            <Option value='12'>初步设计</Option>
                                        </Select>
                                    )}
                                </Form.Item> : null}
                                {this.props.actionInfo === '审批' ? <Row>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        {this.props.record.type === 2 ? <Button type='primary' onClick={this.approveReject.bind(this, this.props.record.id)} style={{ marginRight: '8px' }}>
                                            驳回
                                        </Button> : null}
                                        {this.props.record.xmjd === '35' ? <Button type='primary' onClick={this.approveFinish.bind(this, this.props.record.id, this.state.assignTo, this.state.opinion)} style={{ marginRight: '8px' }}>
                                            派发
                                        </Button> : null}
                                        {this.props.record.type === 0 ? <Button type='primary' onClick={this.approveFinish.bind(this, this.props.record.id, '5', this.state.opinion)} style={{ marginRight: '8px' }}>
                                            分发
                                        </Button> : null}
                                        {this.props.record.xmjd !== '35' && (this.props.record.type === 1 || this.props.record.type === 2) ? <Button onClick={this.approveAgree.bind(this, this.props.record.id)} type='primary' >
                                            同意
                                        </Button> : null}
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            取消
                                        </Button>
                                    </Col>
                                </Row> : (this.props.actionInfo === '重新申请' ? <Row>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        <Button type='primary' onClick={this.approveRetry.bind(this, this.props.record.id)} htmlType='submit'>
                                            重新上报
                                        </Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            取消
                                        </Button>
                                    </Col>
                                </Row> : null)}
                            </Form>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title='处理意见' bordered={false}>
                            <Steps direction='vertical' size='small' current={40} >
                                {
                                    this.state.opinionList.map((item: any) => {
                                        return (
                                            <Step key={item.id} description={<div className='triangle-box' style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px' }}>
                                                <span className='triangle' />
                                                <span className='triangle1' />
                                                <div style={{ overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                                                    <Avatar size={48} style={{ float: 'left', backgroundColor: '#1892fd' }}>U</Avatar>
                                                    <div style={{ float: 'left', marginLeft: '6px' }}>
                                                        <span title={item.approver} style={{ display: 'inline-block', width: '60px', fontSize: '16px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative', top: '4px' }}>
                                                            {item.approver}
                                                        </span>&nbsp;&nbsp;
                                                        <span title={item.approverDept} style={{ display: 'inline-block', width: '60px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative', top: '4px' }}>
                                                            {item.approverDept}
                                                        </span>
                                                        &nbsp;&nbsp;<Button type='primary' size='small' ghost>
                                                            {item.approveStatus}
                                                        </Button>
                                                        <p style={{ marginTop: '6px' }}>{item.approveTime ? TransTool.timeTrans(item.approveTime) : '--------'}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    意见：{item.opinion}
                                                </div>
                                            </div>} />
                                        )
                                    })
                                }
                                {/* <Step title='In Progress' description='This is a description.' />
                                <Step title='Waiting' description='This is a description.' /> */}
                            </Steps>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(Detail)
export default WrappedApp