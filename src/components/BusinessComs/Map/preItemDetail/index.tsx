import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Input, Row, Col, DatePicker, Select, Button, message, Cascader, Breadcrumb, Card } from 'antd'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
const { RangePicker } = DatePicker
const { TextArea } = Input
const { Option } = Select
import './index.less'
import IndexAction from '@api/IndexAction'
import _ from 'lodash'
import TransTool from '@utils/TransTool'

message.config({
	duration: 1,
	maxCount: 1
  })

interface IProps {
	stores?: any,
	match: any,
	form: any,
	location: any,
	history: any
}
interface IState {
}

@inject('stores')
@observer
class PreItemDetail extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {}
	}

	handleConfirmName = (...rest) => {
		rest[1] && IndexAction.ValidateName({xmmc: rest[1], xmId: this.props.match.params.id}).then((res: any) => {
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
		const { mapStore } = this.props.stores
		const { detailData, area, option } = toJS(mapStore.preItemDetail)
		mapStore.onPreItemDetail({
			detailData,
			area,
			option,
			isEditable: false
		})
	}

	handleUpdate = () => {
		const { mapStore } = this.props.stores
		const { detailData, area, option } = toJS(mapStore.preItemDetail)
		mapStore.onPreItemDetail!({
			detailData,
			area,
			option,
			isEditable: true
		})
	}

	handleSubmit = e => {
		e.preventDefault()
		const { mapStore } = this.props.stores
		const { option } = toJS(mapStore.preItemDetail)
		const { collapsed, indexMenus } = toJS(mapStore.homeSiderMenu)
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
				
				values.id = this.props.match.params.id
				IndexAction.Edit(values).then((res: any) => {
					if (res.status === 200) {
						const arr: any[] = []
						arr.push(res.data.province)
						arr.push(res.data.city)
						arr.push(res.data.county)
						mapStore.onPreItemDetail!({
							detailData: res.data,
							area: arr,
							option,
							isEditable: false
						})
						const ylx = _.find(indexMenus, {name : '预立项'})
						const currentXm = _.find(ylx.child, {id: values.id})
						currentXm.name = values.xmmc
						mapStore.onHomeSiderMenu({
							refresh: true,
							collapsed,
							indexMenus
						})
						message.success(res.msg)
					} else {
						message.error(res.msg)
					}
				})
			}
		})
	}

	init = (id) => {
		const { mapStore } = this.props.stores
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
				IndexAction.GetDetail({id}).then((resp: any) => {
					if (resp.status === 200) {
						const arr: any[] = []
						arr.push(resp.data.province)
						arr.push(resp.data.city)
						arr.push(resp.data.county)
						mapStore.onPreItemDetail!({
							isEditable: false,
							detailData: resp.data,
							area: arr,
							option: result
						})
					}
				})
			}
 		})
	}
	
	// 所属区划  keys = ["13","1301","130101"]
	getSSQH = (keys) => {
		const { option } = toJS(this.props.stores.mapStore.preItemDetail)
		if (keys.length === 3 && option.length > 0 && _.every(keys, item => /^\d+$/.test(item) )) {
			let provinceObj, cityObj, countyObj
			provinceObj = _.find(option, item => item.id === keys[0])
			cityObj = _.find(provinceObj.children, item => item.id === keys[1])
			countyObj = _.find(cityObj.children, item => item.id === keys[2])
			return `${provinceObj.name} / ${cityObj.name} / ${countyObj.name}`
		} else {
			return ''
		}
	}

	componentWillMount() {
		this.init(this.props.match.params.id)
	}

	componentWillReceiveProps(nextProps) {
		const arr = nextProps.location.pathname.split('/')
		if (nextProps.location.pathname !== this.props.location.pathname) {
			if (arr[ arr.length - 1 ] !== 0) {
				this.init(arr[ arr.length - 1 ])
			}
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const {detailData, isEditable, area, option} = toJS(this.props.stores.mapStore.preItemDetail)
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='pre-item-detail'>
						<Breadcrumb className='breadcrumb'>
							<Breadcrumb.Item>首页</Breadcrumb.Item>
							<Breadcrumb.Item>预立项</Breadcrumb.Item>
							<Breadcrumb.Item>{detailData.xmmc}</Breadcrumb.Item>
							<Breadcrumb.Item>项目简介</Breadcrumb.Item>
						</Breadcrumb>
						<div className='placeHolder' />
						<div className='xmmc'>
							{detailData.xmmc}
						</div>
						<Card 
							title = {
								isEditable 
								? '修改项目简介'
								: <span>项目简介<Button style={{float: 'right'}} type='primary' onClick={this.handleUpdate}>修改</Button></span>
							}
							className='card'>
							<Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
								<Row>
									<Col span={12}>
										<Form.Item label='项目名称'>
											{
												isEditable ?
												getFieldDecorator('xmmc', {
													rules: [{ required: true, message: '请输入项目名称!' }, {validator: this.handleConfirmName}],
													initialValue: detailData.xmmc
												})(<Input placeholder='请输入项目名称' />)
												:
												detailData.xmmc
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目编号'>
											{
												isEditable ?
												getFieldDecorator('xmbh', {
													validator: this.handleConfirmNo,
													initialValue: detailData.xmbh
												})(<Input placeholder='请输入项目编号' />)
												:
												detailData.xmbh
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='所属区划'>
											{
												isEditable ?
												getFieldDecorator('ssqhdm', {
													rules: [{ required: true, message: '请输入所属区划!' }],
													initialValue: area
												})(<Cascader options={option} placeholder='请选择' />)
												:
												this.getSSQH(area)
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='涉及村镇'>
											{
												isEditable ?
												getFieldDecorator('sjcz', {
													initialValue: detailData.sjcz
												})(<Input placeholder='请输入涉及村镇' />)
												:
												detailData.sjcz
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='创建人'>
											{
												isEditable ?
												getFieldDecorator('xmcjr', {
													initialValue: detailData.xmcjr
												})(<Input placeholder='请输入创建人' disabled/>)
												:
												detailData.xmcjr
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='创建日期'>	
											{
												isEditable ?
												getFieldDecorator('cjrq', {
													initialValue: TransTool.getMomentTime(detailData.cjrqStr)
												})(<DatePicker style={{ 'width': '100%' }} disabled/>)
												:
												TransTool.formatDate(detailData.cjrqStr)
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='地块总数'>
											{
												isEditable ?
												getFieldDecorator('dkzs', {
													initialValue: detailData.dkzs,
													rules: [
														{pattern: /^\d+$/, message: '请输入正确的数字'}
													]
												})(<Input style={{ 'width': '100%' }} placeholder='请输入地块总数' />)
												:
												detailData.dkzs
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目面积'>
											{
												isEditable ?
												getFieldDecorator('xmmj', {
													initialValue: detailData.xmmj,
													rules: [
														{pattern: /^\d+(\.\d+)?$/, message: '请输入正确的数字'}
													]
												})(<Input addonAfter='亩' style={{ 'width': '100%' }} placeholder='请输入项目面积' />)
												:
												detailData.xmmj ? `${detailData.xmmj}亩` : ''
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='投资预算'>
											{
												isEditable ?
												getFieldDecorator('tzys', {
													initialValue: detailData.tzys,
													rules: [
														{pattern: /^\d+(\.\d+)?$/, message: '请输入正确的数字'}
													]
												})(<Input addonAfter='元' style={{ 'width': '100%' }} placeholder='请输入投资预算' />)
												:
												detailData.tzys ? `${detailData.tzys}元` : ''
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目类型'>
											{
												isEditable ?
												getFieldDecorator('xmlxdm', {
													rules: [{ required: true, message: '请选择项目类型!' }],
													initialValue: detailData.xmlxdm
												})(
													<Select placeholder='项目类型'>
														<Option value='0'>增减挂钩</Option>
														<Option value='1'>占补平衡</Option>
													</Select>
												)
												:
												TransTool.getXMLX(detailData.xmlxdm)
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='起止时间'>
											{
												isEditable ?
													(
														detailData.kssjStr && detailData.jssjStr ?
														getFieldDecorator('time', {
															initialValue: [TransTool.getMomentTime(detailData.kssjStr), TransTool.getMomentTime(detailData.jssjStr)]
														})(
															<RangePicker style={{ 'width': '100%' }} format='YYYY-MM-DD' />
														)
														: 
														getFieldDecorator('time')(<RangePicker style={{ 'width': '100%' }} format='YYYY-MM-DD' />)
													)
												: 	(
														detailData.kssjStr && detailData.jssjStr ?
														`${TransTool.formatDate(detailData.kssjStr)} - ${TransTool.formatDate(detailData.jssjStr)}`
														:
														''
													)
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='权属单位'>
											{
												isEditable ?
												getFieldDecorator('qsdw', {
													initialValue: detailData.qsdw
												})(<Input placeholder='请输入权属单位' />)
												:
												detailData.qsdw
											}
										</Form.Item>
									</Col>
								</Row>	
								<Row>
									<Col span={12}>
										<Form.Item label='批次名称'>
											{
												isEditable ?
												getFieldDecorator('pcmc', {
													initialValue: detailData.pcmc
												})(<Input placeholder='请输入批次名称' />)
												:
												detailData.pcmc
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='批次号'>
											{
												isEditable ?
												getFieldDecorator('pch', {
													initialValue: detailData.pch
												})(<Input placeholder='请输入批次号' />)
												:
												detailData.pch
											}
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										<Form.Item label='项目简介' labelCol={{span: 3}} wrapperCol={{span: 20}}>
											{
												isEditable ?
												getFieldDecorator('xmjj', {initialValue: detailData.xmjj})(
													<TextArea
														autosize={{ minRows: 5, maxRows: 10 }}
													/>)
												:
												detailData.xmjj
											}
										</Form.Item>
									</Col>
								</Row>
								{
								isEditable &&
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
								}
							</Form>
						</Card>
					</div>
				</div>
			)
	}
}
const WrappedApp = Form.create({ name: 'coordinated' })(PreItemDetail)
export default WrappedApp