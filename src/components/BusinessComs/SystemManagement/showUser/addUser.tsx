import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, Button, message, Select, Upload, Icon } from 'antd'
import './index.less'
import SystemAction from '@api/SystemAction'
import { FormComponentProps } from 'antd/lib/form/Form'
import http from '../../../../utils/HttpClient'
import dev from '@config/dev.config'
const { Option } = Select
interface IProps extends FormComponentProps {
    form: any,
    actionInfo: string,
    id: any,
    handleCancel: any,
    init: any,
    data: any,
}
interface IState {
    value: string,
    certi: string,
    user: any,
    treeData: any[],
    checkedKeys: any[],
    ss: any[],
    roles: any[],
    role: any[],
    dept: any[],
    deptList: any[],
    fileList: any[]
}
/**
 * @author ny
 * @desc 基本信息
 */
class AddRole extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            value: '',
            user: {},
            treeData: [],
            checkedKeys: [],
            ss: [],
            roles: [],
            role: [],
            deptList: [],
            dept: [],
            fileList: [
                /* {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                  } */
            ],
            certi: ''
        }
    }

    handleConfirmName = (...rest) => {
        rest[1] && SystemAction.CheckUser({ uname: rest[1], id: this.props.id }).then((res: any) => {
            if (res.status === 200 || res.status === 203) {
                rest[2]()
            } else {
                rest[2]('用户名已存在！')
            }
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.dept = values.dept.join(',')
                values.role = values.role.join(',')
                values.certi = this.state.certi
                if (this.props.actionInfo === '新增') {
                    SystemAction.AddUser(values).then((res: any) => {
                        if (res.status === 200) {
                            message.success('新增成功！')
                            this.props.handleCancel()
                            this.props.init()
                        }
                    })
                } else if (this.props.actionInfo === '编辑') {
                    values.id = this.props.id
                    SystemAction.UpdateUser(values)
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

    queryDeptById = () => {
        SystemAction.QueryUserById({ userId: this.props.id }).then((res: any) => {
            if (res.status === 200) {
                const roleArr: any[] = []
                const deptArr: any[] = []
                const certi = res.data.user.certi
                res.data.roles.forEach((item: any) => {
                    roleArr.push(item.id)
                })
                res.data.depts && res.data.depts.length > 0 && res.data.depts.forEach((item: any) => {
                    deptArr.push(item.id)
                })
                let fileList
                if (certi) {

                    const obj = {
                        uid: '-1',
                        name: certi && certi.split('_')[certi.split('_').length - 1],
                        status: 'done',
                        url: certi,
                        // linkProps: certi
                    }
                    fileList = this.state.fileList
                    fileList[0] = obj
                } else {
                    fileList = []
                }
                this.setState({
                    user: res.data.user,
                    role: roleArr,
                    dept: deptArr,
                    certi: res.data.user.certi,
                    fileList,
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    initRoles = () => {
        SystemAction.QueryAllRoles(
            { page: 1, limit: 1000, roleName: '' }
        ).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    roles: res.data
                })
            }
        })
    }

    initDept = () => {
        SystemAction.GetDeptByRoleManager(
            null
        ).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    deptList: res.data
                })
            }
        })
    }

    customRequest = (info) => {
        const formData = new FormData()
        formData.append('file', info.file)
        http.upload(dev.url + '/user/uploadCerti', formData)
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
                        fileList,
                        certi: res.data.data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
    }

    upload = (files) => {
        const { file, fileList } = files
        if (file.status === 'done') {
            if (file.response.status === 200) {
                message.success('上传成功！')
                this.setState({
                    fileList,
                    certi: file.response.data
                })
            } else {
                message.error('上传失败！')
            }
        } else {
            this.setState({
                fileList
            })
        }
    }

    removeCerti = (file) => {
        SystemAction.DelCerti({
            url: file.response ? file.response.data : file.url,
            userId: this.state.user.id
        })
            .then((res: any) => {
                if (res.status === 200) {
                    message.success('删除成功！')
                    this.setState({
                        certi: ''
                    })
                    return true
                } else {
                    message.error(res.msg)
                    return false
                }
            })
    }

    download = () => {
        const link = document.createElement('a')
        link.href = dev.url + '/user/downloadCerti?filePath=' + this.state.certi
        link.download = 'admin'
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

    /* handleChange = ({ fileList }) => {
        debugger
    }
 */
    componentDidMount() {
        if (this.props.id !== 0) {
            this.queryDeptById()
        }
        this.initRoles()
        this.initDept()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label='用户名称'>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '用户名称不能为空!',
                                        },
                                        { validator: this.handleConfirmName }
                                    ],
                                    initialValue: this.state.user.username
                                })(<Input disabled={this.props.actionInfo === '查看' || this.props.actionInfo === '编辑'} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='所属部门'>
                                {getFieldDecorator('dept', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '所属部门不能为空!',
                                            type: 'array'
                                        },
                                    ],
                                    initialValue: this.state.dept
                                })(<Select
                                    mode='multiple'
                                    style={{ width: '100%' }}
                                    placeholder='选择所属部门'
                                    disabled={this.props.actionInfo === '查看'}
                                >
                                    {
                                        this.state.deptList.map((item) => (
                                            <Option value={item.id} key={item.id}>{item.deptName}</Option>
                                        ))
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        {/* {this.props.id === 0 ? <Col span={12}>
                            <Form.Item label='密码'>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '密码不能为空!',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[._]){5,19}$/,
                                            message: '只能输入6-20个以字母、数字、“_”、“.”的组合字符串',
                                        },
                                    ],
                                    initialValue: this.state.user.password
                                })(<Input disabled={this.props.actionInfo === '查看'} />)}
                            </Form.Item>
                        </Col> : null} */}
                        <Col span={12}>
                            <Form.Item label='角色类型'>
                                {getFieldDecorator('role', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '角色类型不能为空!',
                                            type: 'array'
                                        },
                                    ],
                                    initialValue: this.state.role
                                })(<Select
                                    mode='multiple'
                                    style={{ width: '100%' }}
                                    placeholder='选择角色类型'
                                    disabled={this.props.actionInfo === '查看'}
                                >
                                    {
                                        this.state.roles.map((item) => (
                                            <Option value={item.id} key={item.id}>{item.roleName.split(',').join('')}</Option>
                                        ))
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='联系方式'>
                                {getFieldDecorator('telephone', {
                                    rules: [
                                        /* {
                                            required: true,
                                            message: '联系方式不能为空!',
                                        }, */
                                        {
                                            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                                            message: '请输入正确的电话!'
                                        }
                                    ],
                                    initialValue: this.state.user.telephone
                                })(<Input disabled={this.props.actionInfo === '查看'} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='注册邮箱'>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                                            message: '邮箱格式不正确!',
                                        },
                                    ],
                                    validateTrigger: 'onBlur',
                                    initialValue: this.state.user.email
                                })(<Input disabled={this.props.actionInfo === '查看'} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='真实姓名'>
                                {getFieldDecorator('realName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '真实姓名不能为空!',
                                        }
                                    ],
                                    initialValue: this.state.user.realName
                                })(<Input disabled={this.props.actionInfo === '查看'} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='上传附件'>
                                <Col span={18}>
                                    <Upload
                                        accept='.png, .pdf'
                                        fileList={this.state.fileList}
                                        name='file'
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: this.props.actionInfo === '查看' ? false : true,
                                            showDownloadIcon: false
                                        }}
                                        action={dev.url + `/user/uploadCerti?userId=${this.state.user.id}`}
                                        withCredentials={true}
                                        onChange={this.upload}
                                        onRemove={this.removeCerti}
                                    // customRequest={this.customRequest}
                                    >
                                        <Button disabled={this.props.actionInfo === '查看' || this.state.fileList.length === 1}>
                                            <Icon type='upload' /> 上传资质证书文件
                                        </Button>
                                    </Upload>
                                </Col>
                                <Col span={6}>
                                    {
                                        this.state.certi ?
                                            <Button onClick={this.download}>
                                                <Icon type='download' /> 下载
                                            </Button>
                                            : null
                                    }
                                </Col>
                            </Form.Item>
                        </Col>
                    </Row>
                    {this.props.actionInfo !== '查看' ? <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit'>
                                保存
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                取消
                            </Button>
                        </Col>
                    </Row> : null}
                </Form>
            )
    }
}
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(AddRole)
export default WrappedApp