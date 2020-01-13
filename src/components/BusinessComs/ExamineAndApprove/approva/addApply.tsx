import * as React from 'react'
import InfoAction from '@api/InfoAction'
import { Button, Form, Select, Input, Checkbox, message, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import dev from '@config/dev.config'
import http from '../../../../utils/HttpClient'
/* import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom' */

const { Option } = Select
const { TextArea } = Input

interface IProps extends FormComponentProps {
    handleApplyCancel: any,
    init: any,
    form: any,
}

interface IState {
    fileList: any[],
    projectList: any[],
    dutyPerson: string
}

class AddApply extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            fileList: [],
            projectList: [],
            dutyPerson: ''
        }
    }

    getProjectList = () => {
        InfoAction.GetProjectList(null).then((res: any) => {
            this.setState({
                projectList: res.data
            })
        })
    }

    handleProject = (...rest) => {
        const arr = rest[1].props.value.split(',')
        if (arr[2] === undefined || arr[2] === null || arr[2] === 'null' || arr[2] === 'undefined') {
            this.setState({
                dutyPerson: ''
            })
        } else {
            this.setState({
                dutyPerson: arr[2]
            })
        }
    }

    customRequest = (info) => {
        const formData = new FormData()
        formData.append('spatial', info.file)
        http.upload(dev.url + '/xmzlqd/uploadSpatialData', formData)
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
    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const arr = values.project.split(',')
            values.projectId = arr[0]
            values.projectName = arr[1]
            delete values.dutyPerson
            delete values.project
            if (!err) {
                InfoAction.Approve(values).then((res: any) => {
                    if (res.status === 200) {
                        message.success('变更申请成功！')
                        this.handleReset()
                        this.props.init()
                    } else {
                        message.error('变更申请失败！')
                    }
                })
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields()
        this.props.handleApplyCancel()
    }

    componentDidMount() {
        this.getProjectList()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className='approval-detail-box'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>

                    <Form.Item label='选择项目'>
                        {getFieldDecorator('project', {
                            rules: [
                                {
                                    required: true,
                                    message: '项目名称不能为空!',
                                }
                            ]
                        })(
                            <Select onChange={this.handleProject}>
                                {
                                    this.state.projectList.map((item: any) => {
                                        return (
                                            <Option value={item.projectId + ',' + item.projectName + ',' + item.dutyPerson} key={item.projectId}>{item.projectName}</Option>
                                        )
                                    })
                                }

                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='项目负责人'>
                        {getFieldDecorator('dutyPerson', {
                            initialValue: this.state.dutyPerson
                        })(
                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item label='变更内容填写'>
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true,
                                message: '变更内容不能为空!',
                            }]
                        })(
                            <TextArea
                                placeholder=''
                                autosize={{ minRows: 5, maxRows: 10 }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='是否加急处理'>
                        {getFieldDecorator('urgent', {

                        })(
                            <Checkbox>特急提醒</Checkbox>
                        )}
                    </Form.Item>
                    {/* <Form.Item label='选择人员'>
                        <Select>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                        </Select>
                    </Form.Item> */}
                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit'>
                                上报
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(AddApply)
export default WrappedApp