import * as React from 'react'
import { Form, Input, Row, Col, Button, message } from 'antd'
import './index.less'
import { Redirect } from 'react-router-dom'
import StorageUtils from '@utils/StorageUtil'
import LoginUtils from '@utils/Login'
import LoginAction from '@api/LoginAction'

interface IProps {
    handleCancel: any,
    form: any,
}

class ChangePassword extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    state = {
        
    }

    compareToFirstPassword = (...rest) => {
        const { form } = this.props
        if (rest[1] && rest[1] !== form.getFieldValue('newPwd')) {
            rest[2]('两次密码不一致')
        } else {
            rest[2]()
        }
    }
    
    validateToNextPassword = (...rest) => {
        const { form } = this.props
        if (rest[1]) {
            form.validateFields(['confirmPswd'], { force: true })
        }
        rest[2]()
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = StorageUtils.getLocalStorage('userId')
                delete values.confirmPswd
                LoginAction.ChangePassword(values).then((res: any) => {
                    if (res.status === 200) {
                        message.success(res.msg)
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields()
        this.props.handleCancel()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !LoginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Form.Item label='原始密码'>
                        {getFieldDecorator('pass', {
                            rules: [
                                {
                                    required: true,
                                    message: '原始密码不能为空!',
                                }
                            ],
                            // initialValue: this.state.user.username
                        })(<Input placeholder='请输入原始密码' type='password' />)}
                    </Form.Item>
                    <Form.Item label='新密码'>
                        {getFieldDecorator('newPwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '新密码不能为空!',
                                },
                                {
                                    validator: this.validateToNextPassword
                                }
                            ],
                            // initialValue: this.state.user.username
                        })(<Input type='password' placeholder='请输入新密码' />)}
                    </Form.Item>
                    <Form.Item label='确认密码'>
                        {getFieldDecorator('confirmPswd', {
                            rules: [
                                {
                                    required: true,
                                    message: '确认密码不能为空!',
                                },
                                {
                                    validator: this.compareToFirstPassword
                                }
                            ],
                            // initialValue: this.state.user.username
                        })(<Input type='password' placeholder='请输入确认密码' />)}
                    </Form.Item>
                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit'>
                                保存
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )
    }
}
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(ChangePassword)
export default WrappedApp
