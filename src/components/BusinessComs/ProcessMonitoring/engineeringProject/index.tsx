import React, { Component } from 'react'
import { Button, Card, Row, Input, Cascader, Table } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import IndexAction from '@api/IndexAction'
import './index.less'
const { Search } = Input
/* import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config' */
interface IState {
    option: [],
    keyword: '',
    columns: any[],
    data: any[],
}
export default class Construction extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        // const { buttons } = this.props
        this.state = {
            keyword: '',
            option: [],
            data: [
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
                {
                    id: 0,
                    no: '[2019]25号',
                    batchName: '白水县项目'
                },
            ],
            columns: [
                {
                    title: '立项批文号',
                    dataIndex: 'no',
                    key: 'no',
                    width: 500,
                },
                {
                    title: '项目批次名称',
                    dataIndex: 'batchName',
                    key: 'batchName',
                    width: 500,
                },
                {
                    title: '项目操作',
                    key: 'action',
                    render: () => (
                        <span>
                           <Button type='link'>打开项目</Button>
                        </span>
                    ),
                },
            ]
        }
    }

    handleKeyword = (keyword) => {
        this.setState({keyword})
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
    
    componentDidMount() {
        this.initCascader()
    }

    render() {
        // const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div>
                    <Card title='施工数据' bordered={false}>
                        {/* <Row style={{marginBottom: '20px'}}>
                            {buttons.includes('批量下载') ? <Button type='primary'>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }}>删除</Button> : null}
                        </Row> */}
                        <Row style={{marginBottom: '20px'}}>
                            <Cascader options={this.state.option} placeholder='请选择' />
                            <span style={{ float: 'right' }}>
                                <Search
                                    placeholder='请输入项目批次名称'
                                    onSearch={this.handleKeyword}
                                    style={{ width: 240 }}
                                />
                                {/* <Button type='primary' style={{marginLeft: '6px'}}>搜索</Button> */}
                            </span>
                        </Row>
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='uploadDate'
                            scroll={{ y: 440 }}
                            pagination={false}
                        />
                    </Card>
                </div>
            )
    }
}
