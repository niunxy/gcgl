import * as React from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import { Table, Row, Col, Button, Card, Steps, Input, Breadcrumb, Divider, message } from 'antd'
import IndexAction from '@api/IndexAction'
import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config'
import TransTool from '@utils/TransTool'
import _ from 'lodash'
import './index.less'

const { Search } = Input
const { Step } = Steps

interface IProps {
	match: any,
	location: any
}

interface IState {
	data: any[],
	statics: {},
	selectedRowsID: string[],
	selectedRowKeys: string[],
	columns: any
}

export default class ImplementItemDoc extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)
		this.state = {
			data: [],
			statics: {},
			selectedRowsID: [],
			selectedRowKeys: [],
			columns: [
				{
					title: '名称',
					dataIndex: 'name',
					key: 'name'
				},
				{
					title: '上传人',
					dataIndex: 'uploader',
					key: 'uploader'
				},
				{
					title: '上传时间',
					dataIndex: 'uploadDate',
					key: 'uploadDate',
					render: text => {
						return TransTool.formatDate(text)
					}
				},
				{
					title: '文件数量',
					dataIndex: 'count',
					key: 'count'
				},
				{
					title: '操作',
					key: 'action',
					render: (record) => (
						<span>
							<Button  onClick={this.handlePreview.bind(this, record.xmzlUrl)} disabled={record.type === '0' || record.type === '1'} type='link'>预览</Button>
							<Divider type='vertical' />
							<Button  onClick={this.handleDownload.bind(this, record.id)} disabled={record.type === '0' || record.type === '1'} type='link'>下载</Button>
						</span>
					)
				}
			]
		}
	}

	componentWillMount() {
		this.init({xmId: this.props.match.params.id, folderName: ''})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.id !== this.props.match.params.id) {
			this.init({xmId: nextProps.match.params.id, folderName: ''})
		}
	}

	init = (params) => {
		this.setState({
			data: [],
			selectedRowsID: [],
			selectedRowKeys: [],
			statics: {}
		})
		IndexAction.GetHomeFolderByXmId(params).then((res: any) => {
			if (res.status === 200) {
				res.data.forEach(item => {
					item.name = item.folderName
					item.count = item.foldercount
				})
				this.setState({
					data: res.data,
					statics: res.josnObj
				})
			}
		})
	}

	handlePreview = (xmzlUrl, e) => {
		e && e.preventDefault()
        if (TransTool.isPreview(xmzlUrl)) {
            window.open(dev.url + '/xmzlqd/showAttach?filePath=' + xmzlUrl)
        } else {
            message.error('该文件不支持预览，请下载')
        }
	}

	handleDownload = (id) => {
        if (!id) {
            return
        }
		const link = document.createElement('a')
        link.href = dev.url + '/xmzlqd/download?id=' + id 
		link.download = 'admin'
		link.target = '_blank'
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

	handleKeyword = (keyword) => {
		this.init({xmId: this.props.match.params.id, folderName: keyword})
	}

	handleBatchDownload = () => {
		const keys = this.state.selectedRowsID
		if (keys.length > 0) {
			const keysStr = keys.join(',')
			const link = document.createElement('a')
			link.href = dev.url + '/xmzlqd/batchDownload?xmId=' + this.props.match.params.id + '&folderId=' + keysStr
			link.download = 'admin'
			link.target = '_blank'
			if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
				const evt = document.createEvent('MouseEvents')
				evt.initEvent('click', true, true)
				link.dispatchEvent(evt)
			} else {
				link.click()
			}
		}
	}

    onChange = (selectedRowKeys, selectedRows) => {
		const selectedRowsID: string[] = []
		selectedRows.forEach(item => {
			selectedRowsID.push(item.folderId)
		})
		this.setState({
			selectedRowsID,
			selectedRowKeys
		})
    }
	
	handleRow = (record) => {
		if (record.type !== '2' && !record.children) {
			UploadAction.GetXmzlByIds({xmId: record.projectId, folderId: record.folderId}).then((res: any) => {
				if (res.status === 200) {
					if (res.data.length > 0) {
						res.data.forEach((value) => {
							value.name = value.zlmc
							value.count = 1
						})
						record.children = res.data
						this.setState({
							data: this.state.data
						})
					}
				} else {
					message.error(res.msg)
				}  
			})
		}
	}

	getCheckboxProps = (record) => {
		if (record.type === '2') {
			return {
				disabled: true
			}
		} else {
			return {
				disabled: false
			}
		}
	}

	render() {
		const {xmzlTotal, xmzlThisWeek, xmzlThisUser}: any = this.state.statics
		const stepsOfXMJD = TransTool.getStepsOfXMJD(this.props.match.params.xmjd)
		const rangeXMJD = TransTool.getXMJD(this.props.match.params.xmjd)
		return (!loginUtils.isLogin()
			? <Redirect to='/login' />
			: (
				<div className='base-info'>
					<div className='implement-item-doc'>
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
							<Breadcrumb.Item>{this.props.match.params.xmmc}</Breadcrumb.Item>
							<Breadcrumb.Item>项目资料</Breadcrumb.Item>
						</Breadcrumb>
						<div className='placeHolder' />
						<div className='xmmc'>
							{this.props.match.params.xmmc}
						</div>
						{
							this.props.match.params.isWorking === 'true' ? 
							<Card title='项目状态' className='card' 
								extra={<Button type='primary' target='_blank' href={`${dev.url}/lixiang/shinePics/${this.props.match.params.processInstanceId}`}>查看全流程</Button>}
							>
								<Row className='xmztRow'>
									<span>当前状态 ：</span>
									<span style = {
										TransTool.isSpecialStyle(this.props.match.params.xmjd) ?
										{
											textAlign: 'center',
											display : 'inline-block',
											width : '55px',
											borderRadius: 5,
											lineHeight: '20px',
											fontSize: 12,
											marginRight: '5px',
											color: `${rangeXMJD.color}`,
											border : `1px solid ${rangeXMJD.color}`
										}
										:
										{
											textAlign: 'center',
											display : 'inline-block',
											width : '55px',
											borderRadius: 5,
											lineHeight: '20px',
											fontSize: 12,
											marginRight: '5px',
											color: 'white',
											backgroundColor : `${rangeXMJD.color}`
										}
									} >
										{rangeXMJD.name}
									</span>
								</Row>
								<Steps size='small' current={stepsOfXMJD.keys.indexOf(this.props.match.params.xmjd)} progressDot>
									{
										stepsOfXMJD.values.map(item => {
											return (
												<Step key={item} title={item}/>
											)
										})
									}
								</Steps>
							</Card>
							:
							null
						}
						<Card title='项目资料' className='card'>
							<Row style={{marginBottom: '20px'}}>
								<Col span={8} className='file-statics'>
									<div>总计</div>
									<div>{xmzlTotal}项资料</div>
								</Col>
								<Col span={8} className='file-statics'>
									<div>本周上传</div>
									<div>{xmzlThisWeek}项资料</div>
								</Col>
								<Col span={8} className='file-statics'>
									<div>本账户上传</div>
									<div>{xmzlThisUser}项资料</div>
								</Col>
							</Row>
							<Row style={{marginBottom: '20px'}}>
								<Button type='primary' onClick={this.handleBatchDownload.bind(this)}>下载</Button>
								<Search
									placeholder='请输入资料文件夹名称'
									onSearch={this.handleKeyword}
									style={{ width: 240, float: 'right' }}
								/>
							</Row>
							<Table
								pagination={false}
								className='components-table-demo-nested'
								columns={this.state.columns}
								dataSource={this.state.data}
								rowKey={record => record.type + '-' + record.id}
								rowSelection={{
									getCheckboxProps: this.getCheckboxProps,
									onChange: this.onChange
								}}
								onRow={(record) => {
									return {
										onClick: () => {
											this.handleRow(record)
										}
									}
								}}
							/>
						</Card>
					</div>
				</div>
			)
		)	
	}
}