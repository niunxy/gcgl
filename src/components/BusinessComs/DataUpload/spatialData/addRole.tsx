import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, Button, message, Tree, Cascader } from 'antd'
import './index.less'
import SystemAction from '@api/SystemAction'
import {FormComponentProps} from 'antd/lib/form/Form'
const { TreeNode } = Tree
const { TextArea } = Input
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
            role: {},
            treeData: [],
            checkedKeys: [],
            menu: [],
            options: [],
            roleName: [],
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
                if (this.state.menu.length <= 0) {
                    message.error('请选择权限！')
                    return
                } else {
                    values.menu = this.state.menu.join()
                }
                values.roleName = values.roleName.join(',')
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

    queryAllMenu = () => {
        SystemAction.QueryAllMenu(null).then((res: any) => {
            if (res.status === 200) {
                const treeData = res.data
                treeData.forEach((item) => {
                    item.title = item.name
                    item.key = item.id
                    item.value = item.id
                    item.children.length > 0 && item.children.forEach((value: any) => {
                        value.title = value.name
                        value.key = value.id
                        value.value = value.id
                        value.children.length > 0 && value.children.forEach((value1: any) => {
                            value1.title = value1.name
                            value1.key = value1.id
                            value1.value = value1.id
                        })
                    })
                })
                this.setState({
                    treeData
                })
                if (this.props.id !== 0) {
                    this.queryMenuById()
                }
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

    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
                )
            }
            return <TreeNode key={item.key} {...item} />
        })
    }

    getDeptByRoleManager = () => {
        SystemAction.GetDeptByRoleManager(null)
            .then((res: any) => {
                if (res.status === 200 ) {
                    const arr = [
                        {
                            value: '管理员',
                            label: '管理员'
                        },
                        {
                            value: '一般用户',
                            label: '一般用户'
                        },
                        {
                            value: '移动端',
                            label: '移动端'
                        },
                        {
                            value: '临时用户',
                            label: '临时用户'
                        },
                        {
                            value: '公共用户',
                            label: '公共用户'
                        }
                    ]
                    const result = res.data
                    result.forEach(item => {
                        item.value = item.deptName
                        item.label = item.deptName
                        item.children = arr
                    })
                    this.setState({
                        options: result
                    })
                }
            })
    }

    componentDidMount() {
        this.getDeptByRoleManager()
        this.queryAllMenu()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label='角色名称'>
                        {getFieldDecorator('roleName', {
                            rules: [
                                {
                                    required: true,
                                    message: '角色名称不能为空!',
                                },
                            ],
                            initialValue: this.state.roleName ? this.state.roleName : []
                        })(<Cascader options={this.state.options} placeholder='角色名称' defaultValue={this.state.roleName} />)}
                    </Form.Item>
                    {/* <Form.Item label='权限选择'>
                        {getFieldDecorator('menus', {this.state.
                            rules: [
                                {
                                    required: true,
                                    message: '权限选择不能为空!',
                                },
                            ],
                            initialValue: []
                        })(
                            < TreeSelect
                            style = {{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder='Please select'
                            treeDefaultExpandAll
                            treeCheckable={true}
                            showCheckedStrategy='SHOW_ALL'
                            onChange={this.onChange}
                            treeCheckStrictly
                            />
                                          )}
                    </Form.Item> */}
                    {<Form.Item label='权限选择'>
                        <Tree
                            checkable
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                        >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </Form.Item>}
                    <Form.Item label='备注'>
                        {getFieldDecorator('remark', {
                             initialValue: this.state.role.remark
                        })(
                            <TextArea
                                placeholder=''
                                autosize={{ minRows: 5, maxRows: 10 }}
                                disabled={this.props.actionInfo === '查看'}
                            />)}
                    </Form.Item>
                    { this.props.actionInfo !== '查看' ? <Row>
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