import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, DatePicker, Select, Button, message, Cascader, Card, Icon } from 'antd'
const { RangePicker } = DatePicker
const { TextArea } = Input
const { Option } = Select
import './index.less'
import IndexAction from '@api/IndexAction'
import TransTool from '@utils/TransTool'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
interface IProps {
	stores?: any,
	match: any,
	form: any,
	location: any,
	history: any
}
interface IState {
	option: any[]
}

@inject('stores')
@observer
class CreateProject extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {
			option: []
		}
	}

	componentWillMount() {
		this.initCascader()
	}

	handleConfirmName = (...rest) => {
		rest[1] && IndexAction.ValidateName({xmmc: rest[1], xmId: null}).then((res: any) => {
			if (res.status === 200) {
				rest[2]()
			} else {
				rest[2]('不能添加此项目名称！')
			}
		})
	}

	handleConfirmNo = (...rest) => {
		rest[1] && IndexAction.ValidateCode({xmbh: rest[1], xmId: this.props.match.params.id}).then((res: any) => {
			if (res.status === 200) {
				rest[2]()
			} else {
				rest[2]('不能添加此项目编号！')
			}
		})
	}

	handleReset = () => {
		this.props.form.resetFields()
	}

	handleClose = () => {
		// refresh home sider Menu
		const { mapStore } = this.props.stores
		const { collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
		mapStore.onHomeSiderMenu({
			refresh: true,
			collapsed,
			indexMenus
		})
		this.props.history.replace('/index/map/home')
	}

	handleSubmit = e => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const kssj = 'kssj', jssj = 'jssj', time = 'time', d = '_d', cjrq = 'cjrq', county = 'county', province = 'province', city = 'city'
				values[kssj] = !(_.isEmpty(values[time])) ? values[time][0][d] : undefined
				values[jssj] = !(_.isEmpty(values[time])) ? values[time][1][d] : undefined
				values[cjrq] = !(_.isEmpty(values[cjrq])) ? values[cjrq][d] : undefined
				delete values.time
				values[province] = values.ssqhdm[0]
				values[city] = values.ssqhdm[1]
				values[county] = values.ssqhdm[2]
				delete values.ssqhdm
				IndexAction.Create(values).then((res: any) => {
					if (res.status === 200) {
						message.success('创建项目成功！')
						// refresh home sider Menu
						const { mapStore } = this.props.stores
						const { collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
						mapStore.onHomeSiderMenu({
							refresh: true,
							collapsed,
							indexMenus
						})
						this.props.history.replace('/index/map/home')
					} else {
						message.error(res.msg)
					}
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

	render() {
		const { getFieldDecorator } = this.props.form
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='create-project'>
						<Card title='新建项目' className='card' extra={<Icon type='close' onClick={this.handleClose} />}>
							<Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
								<Row>
									<Col span={12}>
										<Form.Item label='项目名称'>
											{getFieldDecorator('xmmc', {
												rules: [{ required: true, message: '请输入项目名称!' }, {validator: this.handleConfirmName}]
											})(<Input placeholder='请输入项目名称' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目编号'>
											{getFieldDecorator('xmbh', {
												validator: this.handleConfirmNo
											})(<Input placeholder='请输入项目编号' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='所属区划'>
											{getFieldDecorator('ssqhdm', {
												rules: [{ required: true, message: '请输入所属区划!' }]
											})(<Cascader options={this.state.option} placeholder='请选择' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='涉及村镇'>
											{getFieldDecorator('sjcz')(<Input placeholder='请输入涉及村镇' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='创建人'>
											{getFieldDecorator('xmcjr', {
												initialValue: loginUtils.isLogin()
											})(<Input placeholder='请输入创建人' disabled />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='创建日期'>	
											{getFieldDecorator('cjrq', {
												initialValue: TransTool.getMomentTime(new Date())
											})(<DatePicker style={{ 'width': '100%' }} disabled/>)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目负责人'>
											{getFieldDecorator('xmfzr')(<Input placeholder='请输入项目负责人' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='负责人电话'>
											{getFieldDecorator('fzrdh', {
												rules: [
													{ pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话!' }
												]
											})(<Input placeholder='请输入负责人电话' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='地块总数'>
											{getFieldDecorator('dkzs', {
												rules: [
													{pattern: /^\d+$/, message: '请输入正确的数字'}
												]
											})(<Input style={{ 'width': '100%' }} placeholder='请输入地块总数' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目面积'>
											{getFieldDecorator('xmmj', {
												rules: [
													{pattern: /^\d+(\.\d+)?$/, message: '请输入正确的数字'}
												]
											})(<Input addonAfter='亩' style={{ 'width': '100%' }} placeholder='请输入项目面积' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='投资预算'>
											{getFieldDecorator('tzys', {
												rules: [
													{pattern: /^\d+(\.\d+)?$/, message: '请输入正确的数字'}
												]
											})(<Input addonAfter='元' style={{ 'width': '100%' }} placeholder='请输入投资预算' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目类型'>
											{getFieldDecorator('xmlxdm', {
												rules: [{ required: true, message: '请选择项目类型!' }]
											})(
												<Select placeholder='项目类型'>
													<Option value='0'>增减挂钩</Option>
													<Option value='1'>占补平衡</Option>
												</Select>
											)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='起止时间'>
											{getFieldDecorator('time')(
												<RangePicker style={{ 'width': '100%' }} format='YYYY-MM-DD' />
											)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='权属单位'>
											{getFieldDecorator('qsdw')(<Input placeholder='请输入权属单位' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='批次名称'>
											{getFieldDecorator('pcmc')(<Input placeholder='请输入批次名称' />)}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='批次号'>
											{getFieldDecorator('pch')(<Input placeholder='请输入批次号' />)}
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='项目简介' labelCol={{span: 3}} wrapperCol={{span: 20}}>
											{getFieldDecorator('xmjj')(
												<TextArea
													autosize={{ minRows: 5, maxRows: 10 }}
												/>)}
										</Form.Item>
									</Col>
								</Row>
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
						</Card>
					</div>
				</div>
			)
	}
}
const WrappedApp = Form.create({ name: 'coordinated' })(CreateProject)
export default WrappedApp