import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, Button, message, Select, TreeSelect, InputNumber } from 'antd'
import './index.less'
import SystemAction from '@api/SystemAction'
import { FormComponentProps } from 'antd/lib/form/Form'
const { Option } = Select
const { TreeNode } = TreeSelect
const { TextArea } = Input
interface IProps extends FormComponentProps {
    form: any,
    actionInfo: string,
    id: any,
    handleCancel: any,
    init: any,
    data: any[]
}
interface IState {
    value: string,
    detailData: any,
    treeData: any[],
    checkedKeys: any[],
    ss: any[],
    roles: any[],
    // roleList: any[],
    disabled: boolean
}
/**
 * @author ny
 * @desc 基本信息
 */
class AddDept extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            value: '',
            detailData: [],
            treeData: [],
            checkedKeys: [],
            ss: [],
            roles: [],
            // roleList: [],
            disabled: false,
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                /* if (this.state.ss.length <= 0) {
                    message.error('请选择权限！')
                    return
                } else {
                    values.menu = this.state.ss.join()
                } */
                /* values.role = values.role.join(',') */
                if (this.props.actionInfo === '新增') {
                    SystemAction.AddDept(values).then((res: any) => {
                        if (res.status === 200) {
                            message.success('新增成功！')
                            this.props.handleCancel()
                            this.props.init()
                        }
                    })
                } else if (this.props.actionInfo === '编辑') {
                    values.id = this.props.id
                    SystemAction.UpdateDept(values)
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
        SystemAction.QueryDeptById({ id: this.props.id }).then((res: any) => {
            if (res.status === 200) {
                /* let arr: string[] = []
                res.data.roles.length > 0 && res.data.roles.forEach((item) => {
                    arr.push(item.id)
                }) */
                this.setState({
                    detailData: res.data,
                    // roleList: arr
                })
                if (res.data.dept.deptType === 0) {
                    this.setState({
                        disabled: true
                    })
                } else {
                    this.setState({
                        disabled: false
                    })
                }
            } else {
                message.error('')
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

    handleSelect = (values) => {
        if (values === '0') {
            this.setState({
                disabled: true
            })
        } else {
            this.setState({
                disabled: false
            })
        }
    }

    componentDidMount() {
        if (this.props.id !== 0) {
            this.queryDeptById()
        }
        this.initRoles()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label='部门名称'>
                        {getFieldDecorator('deptName', {
                            rules: [
                                {
                                    required: true,
                                    message: '部门名称不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.deptName
                        })(<Input disabled={this.props.actionInfo === '查看'} />)}
                    </Form.Item>
                    <Form.Item label='部门类型'>
                        {getFieldDecorator('deptType', {
                            rules: [
                                {
                                    required: true,
                                    message: '类型不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.deptType === undefined ? '' : String(this.state.detailData.deptType)
                        })(<Select placeholder='部门类型' disabled={this.props.actionInfo === '查看'} onChange={this.handleSelect}>
                            <Option value='0'>一级部门</Option>
                            <Option value='1'>二级部门</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label='父级部门'>
                        {getFieldDecorator('parentId', {
                            initialValue: this.state.detailData.parentId
                        })(<TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder='请选择父级部门'
                            allowClear
                            treeDefaultExpandAll
                            disabled={this.props.actionInfo === '查看' || this.state.disabled}
                        >
                            {
                                this.props.data.map((item: any) => (
                                    <TreeNode value={item.id} title={item.deptName} key={item.id}>
                                        {
                                            item.children && item.children.map((value: any) => (
                                                <TreeNode value={value.id} title={value.deptName} key={value.id} />
                                            ))
                                        }
                                    </TreeNode>
                                ))
                            }
                        </TreeSelect>)}
                    </Form.Item>
                    {/* <Form.Item label='角色选择'>
                        {getFieldDecorator('role', {
                            rules: [
                                {
                                    required: true,
                                    message: '角色选择不能为空!',
                                },
                            ],
                            initialValue: this.state.roleList
                        })(<Select
                            mode='multiple'
                            placeholder='角色选择'
                            style={{ width: '100%' }}
                          >
                                {
                                  this.state.roles.map((item: any) => (
                                        <Option value={item.id} key={item.id}>{item.roleName}</Option>
                                  ))
                                }    
                          </Select>)}
                    </Form.Item> */}
                    <Form.Item label='序号'>
                        {getFieldDecorator('orderNum', {
                            rules: [
                                {
                                    required: true,
                                    message: '序号不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.orderNum
                        })(<InputNumber disabled={this.props.actionInfo === '查看'} min={1} step={1} style={{ 'width': '100%' }} placeholder='请输入序号' />)}
                    </Form.Item>
                    <Form.Item label='备注'>
                        {getFieldDecorator('remark', {
                            initialValue: this.state.detailData.remark
                        })(
                            <TextArea
                                placeholder=''
                                autosize={{ minRows: 5, maxRows: 10 }}
                                disabled={this.props.actionInfo === '查看'}
                            />)}
                    </Form.Item>
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
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(AddDept)
export default WrappedApp