import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, InputNumber, Select, Button, message, TreeSelect } from 'antd'
import './index.less'
import SystemAction from '@api/SystemAction'
import { FormComponentProps } from 'antd/lib/form/Form'
const { TreeNode } = TreeSelect
const { Option } = Select
interface IProps extends FormComponentProps {
    form: any,
    actionInfo: string,
    id: any,
    handleCancel: any,
    queryAllMenu: any,
    data: any[]
}
/**
 * @author ny
 * @desc 基本信息
 */
class AddMenu extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            value: '',
            detailData: {},
            disabled: false
        }
    }

    onChange = value => {
        this.setState({ value })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.actionInfo === '新增') {
                    SystemAction.AddMenu(values).then((res: any) => {
                        if (res.status === 200) {
                            message.success('新增成功！')
                            this.props.handleCancel()
                            this.props.queryAllMenu()
                        }
                    })
                } else if (this.props.actionInfo === '编辑') {
                    values.id = this.props.id
                    SystemAction.UpdateMenu(values).then((res: any) => {
                        if (res.status === 200) {
                            message.success('编辑成功！')
                            this.props.handleCancel()
                            this.props.queryAllMenu()
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

    handleSelect = (values) => {
        if (values === '2') {
            this.setState({
                disabled: true
            })
        } else {
            this.setState({
                disabled: false
            })
        }
    }

    queryMenuById = () => {
        SystemAction.QueryMenuById({ id: this.props.id }).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    detailData: res.data,
                    value: res.data.id,
                })
                if (res.data.menuType === 2) {
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

    componentDidMount() {
        if (this.props.id !== 0) {
            this.queryMenuById()
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <Form onSubmit={this.handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label='类型'>
                        {getFieldDecorator('menuType', {
                            rules: [
                                {
                                    required: true,
                                    message: '类型不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.menuType === undefined ? '' : String(this.state.detailData.menuType)
                        })(<Select placeholder='菜单类型' disabled={this.props.actionInfo === '查看'} onChange={this.handleSelect}>
                            <Option value='2'>一级菜单</Option>
                            <Option value='0'>二级菜单</Option>
                            <Option value='1'>按钮</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label='父级菜单'>
                        {getFieldDecorator('pId', {
                            initialValue: this.state.detailData.pid
                        })(<TreeSelect
                            style={{ width: '100%' }}
                            /* value={this.state.value} */
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder='请选择父级菜单'
                            allowClear
                            treeDefaultExpandAll
                            disabled={this.props.actionInfo === '查看' || this.state.disabled}
                        /* onChange={this.onChange} */
                        >
                            {/* <TreeNode value='parent 1' title='parent 1' key='0-1'>
                                <TreeNode value='parent 1-0' title='parent 1-0' key='0-1-1'>
                                    <TreeNode value='leaf1' title='my leaf' key='random' />
                                    <TreeNode value='leaf2' title='your leaf' key='random1' />
                                </TreeNode>
                                <TreeNode value='parent 1-1' title='parent 1-1' key='random2'>
                                    <TreeNode value='sss' title={<b style={{ color: '#08c' }}>sss</b>} key='random3' />
                                </TreeNode>
                            </TreeNode> */}
                            {
                                this.props.data.map((item: any) => (
                                    <TreeNode value={item.id} title={item.name} key={item.id}>
                                        {
                                            item.children && item.children.length > 0 && item.children.map((value) => (
                                                <TreeNode value={value.id} title={value.name} key={value.id} />
                                            ))
                                        }
                                    </TreeNode>
                                ))
                            }
                        </TreeSelect>)}
                    </Form.Item>
                    <Form.Item label='菜单名称'>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '菜单名称不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.name
                        })(<Input disabled={this.props.actionInfo === '查看'} />)}
                    </Form.Item>
                    <Form.Item label='url'>
                        {getFieldDecorator('url', {
                            rules: [
                                {
                                    required: true,
                                    message: 'url不能为空!',
                                },
                            ],
                            initialValue: this.state.detailData.url
                        })(<Input disabled={this.props.actionInfo === '查看'} />)}
                    </Form.Item>
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
                    <Form.Item label='权限'>
                        {getFieldDecorator('permission', {
                            initialValue: this.state.detailData.permission
                        })(<Input disabled={this.props.actionInfo === '查看'} />)}
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
const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(AddMenu)
export default WrappedApp