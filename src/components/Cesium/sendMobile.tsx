import * as React from 'react'
import { Button, Row, Col, Form, Input, Select, Cascader, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import IndexAction from '@api/IndexAction'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import LoadingTip from '@components/LoadingTip'
import './index.less'

const { Option } = Select
const { TextArea } = Input
interface IProps extends FormComponentProps {
    form: any,
    closeSend: any,
    disableDispatch: any,
    stores?: any,
}

interface IState {

}
@inject('stores')
@observer
class SendMobile extends React.Component<IProps, IState> {
    // constructor(props: IProps)
    state = {
        receiverList: [],
        option: [],
        spinning: false
    }

    handleReset = () => {
        this.props.closeSend()
    }

    getReceiver = () => {
        IndexAction.GetReceiver({}).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    receiverList: res.data
                })
            }
        })
    }

    initCascader = () => {
        IndexAction.QueryAllXzqh(null).then((res: any) => {
            if (res.status === 200) {
                const result = res.data
                result.forEach((item) => {
                    item.value = item.id
                    item.label = item.name
                    item.children && item.children.forEach((value) => {
                        value.value = value.id
                        value.label = value.name
                        value.children && value.children.forEach((list) => {
                            list.value = list.id
                            list.label = list.name
                        })
                    })
                })
                this.setState({
                    option: result
                })
            }
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        this.setState({
            spinning: true
        })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = {
                    projectId: info.id,
                    processInstanceId: info.processInstanceId,
                    bgcs: info.bgcs,
                    distributorId: info.userId,
                    receiverId: values.receiverId,
                    description: values.description,
                    remark: values.remark,
                    layName: 'ZYTK'
                }
                IndexAction.PostDistribute(params).then((res: any) => {
                    this.setState({
                        spinning: false
                    })
                    if (res.status === 200) {
                        message.success('下发成功')
                        this.props.closeSend()
                        this.props.disableDispatch()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    componentDidMount() {
        this.getReceiver()
        this.initCascader()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        const arr: any[] = []
        arr.push(info.province)
        arr.push(info.city)
        arr.push(info.county)
        return (
            <>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleSubmit}>
                    <Form.Item label='项目名称'>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '项目名称',
                                },
                            ],
                            initialValue: info.xmmc
                        })(<Input disabled />)}
                    </Form.Item>
                    <Form.Item label='所属区划'>
                        {getFieldDecorator('area', {
                            rules: [
                                {
                                    required: true,
                                    message: '所属区划',
                                },
                            ],
                            initialValue: arr
                        })(<Cascader options={this.state.option} disabled />)}
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label='分发人' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                                {getFieldDecorator('distributorId', {
                                    initialValue: info.userName
                                })(<Input placeholder='请输入分发人' disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='接收人' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                                {getFieldDecorator('receiverId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '选择接收人',
                                        },
                                    ],
                                })(
                                    <Select>
                                        {
                                            this.state.receiverList.map((item: any) => {
                                                return <Option value={item.id} key={item.id}>{item.username}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='项目类型' labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                                {getFieldDecorator('xmlxdm', {
                                    initialValue: info.xmlxdm
                                })(
                                    <Select placeholder='项目类型' disabled>
                                        <Option value='0'>增减挂钩</Option>
                                        <Option value='1'>占补平衡</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label='简介'>
                        {getFieldDecorator('description')(
                            <TextArea
                                autosize={{ minRows: 4, maxRows: 10 }}
                            />)}
                    </Form.Item>
                    <Form.Item label='备注'>
                        {getFieldDecorator('remark')(
                            <TextArea
                                autosize={{ minRows: 4, maxRows: 10 }}
                            />)}
                    </Form.Item>

                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit'>
                                下发
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {this.state.spinning ? <LoadingTip title='正在下发到移动端，请稍后......' /> : null}
            </>
        )
    }
}

const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(SendMobile)
export default WrappedApp