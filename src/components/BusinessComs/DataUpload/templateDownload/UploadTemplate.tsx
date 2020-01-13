import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Button, message, Upload, Icon } from 'antd'
import './index.less'
import SystemAction from '@api/SystemAction'
import http from '../../../../utils/HttpClient'
import { FormComponentProps } from 'antd/lib/form/Form'
import dev from '@config/dev.config'
interface IProps extends FormComponentProps {
    form: any,
    actionInfo: string,
    id: any,
    handleCancel: any,
    init: any,
}
interface IState {
    value: string,
    role: any,
    treeData: any[],
    checkedKeys: any[],
    menu: any[],
    options: any[],
    roleName: any[],
    fileList: any[],
}
/**
 * @author ny
 * @desc 基本信息
 */
class UploadTemplate extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            value: '',
            role: {},
            treeData: [],
            checkedKeys: [],
            menu: [],
            options: [],
            roleName: [],
            fileList: [],
        }
    }

    onCheck = (checkedKeys, e) => {
        const arr = [...checkedKeys, ...e.halfCheckedKeys]
        this.setState({
            menu: arr,
            checkedKeys,
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {

                if (this.props.actionInfo === '新增') {
                    SystemAction.AddRole(values).then((res: any) => {
                        if (res.status === 200) {
                            message.success('新增成功！')
                            this.props.handleCancel()
                            this.props.init()
                        }
                    })
                } else if (this.props.actionInfo === '编辑') {
                    values.id = this.props.id
                    SystemAction.UpdateRole(values)
                        .then((res: any) => {
                            if (res.status === 200) {
                                message.success('修改成功！')
                                this.props.handleCancel()
                                this.props.init()
                            }
                        })
                }
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields()
        this.props.handleCancel()
    }

    customRequest = (info) => {
        const formData = new FormData()
        formData.append('template', info.file)
        http.upload(dev.url + '/template/uploadTemplate', formData)
            .then((res) => {
                if (res.status === 200) {
                    const obj = {
                        uid: '-1',
                        name: info.file.name,
                        status: 'done',
                        url: ''
                    }
                    const fileList = this.state.fileList
                    fileList[0] = obj
                    this.setState({
                        fileList
                    })
                    message.success('上传成功!')
                    this.handleReset()
                    this.props.init()
                } else {
                    message.error(res.data.msg)
                }
            })
    }

    queryMenuById = () => {
        SystemAction.QueryRoleById({ id: this.props.id }).then((res: any) => {
            if (res.status === 200) {
                const menus: string[] = []
                const check: string[] = []
                res.data.menus.forEach((item) => {
                    if (item.pid) {
                        menus.push(item.id)
                    } else {
                        check.push(item.id)
                    }
                })
                this.setState({
                    role: res.data.role,
                    menu: check,
                    checkedKeys: menus,
                    roleName: res.data.role.roleName.split(',')
                })
            } else {
                message.error('')
            }
        })
    }


    render() {
        // const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label='上传附件'>
                        <Upload action={`${dev.url}/template/uploadTemplate`}
                            accept='.doc,.docx,.xlsx,.xls,.mdb'
                            fileList={this.state.fileList}
                            name='file'
                            showUploadList={{
                                showPreviewIcon: false,
                                showRemoveIcon: true,
                                showDownloadIcon: false
                            }}
                            // onChange={this.fileUpload}
                            customRequest={this.customRequest}
                        >
                            <Button>
                                <Icon type='upload' /> 上传文件
                            </Button>
                        </Upload>
                    </Form.Item>
                    {/* {this.props.actionInfo !== '查看' ? <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit'>
                                保存
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                取消
                            </Button>
                        </Col>
                    </Row> : null} */}
                </Form>
            )
    }
}
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(UploadTemplate)
export default WrappedApp