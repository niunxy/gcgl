import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Form, Row, Col, Breadcrumb, Card } from 'antd'
import './index.less'
import IndexAction from '@api/IndexAction'
import _ from 'lodash'
import TransTool from '@utils/TransTool'

interface IProps {
	stores?: any,
	match: any,
	form: any,
	location: any,
	history: any
}

interface IState {
	detailData: any,
	option: any[],
	area: any[]
}

class ImplementItemDetail extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {
			detailData: {},
			option: [],
			area: []
		}
	}

	componentWillMount() {
		this.init(this.props.match.params.id)
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.id !== nextProps.match.params.id) {
			this.init(nextProps.match.params.id)
		}
	}

	init = (id) => {
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
						this.setState({
							detailData: resp.data,
							option: result,
							area: arr
						})
					} else {
						this.setState({
							detailData: {},
							option: [],
							area: []
						})
					}
				})
			} else {
				this.setState({
					detailData: {},
					option: [],
					area: []
				})
			}
 		})
	}
	
	// 所属区划  keys = ["13","1301","130101"]
	getSSQH = (keys) => {
		const { option } = this.state
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

	render() {
		const {detailData, area} = this.state
		return !loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='implement-item-detail'>
						<Breadcrumb className='breadcrumb'>
							<Breadcrumb.Item>首页</Breadcrumb.Item>
							<Breadcrumb.Item>
							{
								this.props.match.params.isWorking === 'true'
								?
								'实施项目'
								:
								'验收项目'
							}
							</Breadcrumb.Item>
							<Breadcrumb.Item>{detailData.xmmc}</Breadcrumb.Item>
							<Breadcrumb.Item>项目简介</Breadcrumb.Item>
						</Breadcrumb>
						<div className='placeHolder' />
						<div className='xmmc'>
							{detailData.xmmc}
						</div>
						<Card 
							title = '项目简介'
							className='card'>
							<Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} >
								<Row>
									<Col span={12}>
										<Form.Item label='项目名称'>
											{ detailData.xmmc }
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目编号'>
											{ detailData.xmbh }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='所属区划'>
											{ this.getSSQH(area) }
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='涉及村镇'>
											{ detailData.sjcz }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='创建人'>
											{ detailData.xmcjr }
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='创建日期'>	
											{ TransTool.formatDate(detailData.cjrqStr) }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='地块总数'>
											{ detailData.dkzs }
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目面积'>
											{ detailData.xmmj ? `${detailData.xmmj}亩` : '' }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='投资预算'>
											{ detailData.tzys ? `${detailData.tzys}元` : ''}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='项目类型'>
											{ TransTool.getXMLX(detailData.xmlxdm) }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label='起止时间'>
											{
												detailData.kssjStr && detailData.jssjStr ?
												`${TransTool.formatDate(detailData.kssjStr)} - ${TransTool.formatDate(detailData.jssjStr)}`
												:
												''
											}
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='权属单位'>
											{ detailData.qsdw }
										</Form.Item>
									</Col>
								</Row>	
								<Row>
									<Col span={12}>
										<Form.Item label='批次名称'>
											{ detailData.pcmc }
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label='批次号'>
											{ detailData.pch }
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										<Form.Item label='项目简介' labelCol={{span: 3}} wrapperCol={{span: 20}}>
											{ detailData.xmjj }
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Card>
					</div>
				</div>
			)
	}
}
const WrappedApp = Form.create({ name: 'coordinated' })(ImplementItemDetail)
export default WrappedApp