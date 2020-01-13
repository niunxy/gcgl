import React, { Component } from 'react'
import { Radio, Card, Input, Select, DatePicker, Button, Table, Breadcrumb } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import ReactEcharts from 'echarts-for-react'
import './index.less'

const InputGroup = Input.Group
const { Option } = Select
const { RangePicker } = DatePicker

interface IState {
    columns: any,
    type: string,
    data: any,
    total: number,
    limit: number,
    option: any
}
export default class Routine extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            total: 17,
            limit: 10,
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '上传人',
                    dataIndex: 'uploader',
                    key: 'uploader',
                },
                {
                    title: '上传时间',
                    dataIndex: 'uploadDate',
                    key: 'uploadDate',
                    render: (text) => {
                        return text
                    }
                },
                {
                    title: '文件数量',
                    dataIndex: 'count',
                    key: 'count',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            <Button  disabled={record.type === '0' || record.type === '1'} type='link'>预览</Button>
                        </span>
                    )
                }
            ],
            type: '',
            data: [
                {
                    'id': '980ddf73241a481a950f3ec8ae2ec6a1',
                    'zlmc': '23456',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1575442836000,
                    'folderId': null,
                    'folderName': null,
                    'projectId': 'X20191203651356251346',
                    'projectName': '这是第二次正式测试1203',
                    'xmzlUrl': 'E://uploadFiles//quantityFile//X20191203651356251346////64438247-4865-45cb-9602-0fa2cfeee509_23456.xlsx',
                    'projectcount': '2',
                    'foldercount': null,
                    'type': '0',
                    'name': '这是第二次正式测试1203',
                    'count': '2'
                },
                {
                    'id': 'a3c914b7bfee4f08878d4fd597e80f3a',
                    'zlmc': '测试excel',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1575351279000,
                    'folderId': '7777e849a55f4cb9adb3a9ae8b6a5282',
                    'folderName': '测试文件夹',
                    'projectId': 'X20191203651391748710',
                    'projectName': '流程1',
                    'xmzlUrl': 'E://uploadFiles//xmzlqd//流程1//测试文件夹//292835a5-1952-4cc7-ae3c-f6e42483d03e_测试excel.xlsx',
                    'projectcount': '2',
                    'foldercount': null,
                    'type': '0',
                    'name': '流程1',
                    'count': '2'
                },
                {
                    'id': 'be5e2170f29548d4ba19a669921cefe4',
                    'zlmc': 'b53562',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1574492398000,
                    'folderId': 'b4c690a4930646d59c5b04883daf703d',
                    'folderName': '测绘地形图',
                    'projectId': 'X20191118645989726188',
                    'projectName': '测试003',
                    'xmzlUrl': 'E://uploadFiles//xmzlqd//测试003//测绘地形图//be054164-c8a7-4829-8e70-f11d6a5bf1a9_b53562.png',
                    'projectcount': '3',
                    'foldercount': null,
                    'type': '0',
                    'name': '测试003',
                    'count': '3'
                },
                {
                    'id': 'b240ac94927b4bb291ff82e1aa1fddda',
                    'zlmc': 'usermanage',
                    'uploader': 'cbb',
                    'uploaderId': 'c0fb9eae673b4259a369c3f8c9ec416b',
                    'delFlag': 0,
                    'uploadDate': 1575514063000,
                    'folderId': '10fc0c0d9a064e97a2f67dd818ccd1e6',
                    'folderName': '项目分包资料',
                    'projectId': 'X20191205652088739954',
                    'projectName': '王乐测试项目变更1',
                    'xmzlUrl': 'E://uploadFiles//xmzlqd//王乐测试项目变更1//项目分包资料//f41a6983-3fce-4945-a3a7-d56d03028f0a_usermanage.sql',
                    'projectcount': '16',
                    'foldercount': null,
                    'type': '0',
                    'name': '王乐测试项目变更1',
                    'count': '16'
                },
                {
                    'id': 'ef541fef97cd4989ae6cda92b6c0c605',
                    'zlmc': '新建文本文档',
                    'uploader': 'cbb',
                    'uploaderId': 'c0fb9eae673b4259a369c3f8c9ec416b',
                    'delFlag': 0,
                    'uploadDate': 1575448584000,
                    'folderId': '10fc0c0d9a064e97a2f67dd818ccd1e6',
                    'folderName': '项目分包资料',
                    'projectId': 'X20191204651817923073',
                    'projectName': '测试项目变更1',
                    'xmzlUrl': 'E://uploadFiles//xmzlqd//测试项目变更1//项目分包资料//2ad51bca-a91b-41e3-ae11-1f78a0188f4f_新建文本文档.txt',
                    'projectcount': '17',
                    'foldercount': null,
                    'type': '0',
                    'name': '测试项目变更1',
                    'count': '17'
                },
                {
                    'id': '894820fb78a4403b8b1390fc1b372dd6',
                    'zlmc': 'LX_TEMPLATE',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1574740794000,
                    'folderId': '2',
                    'folderName': '竣工空间数据上传',
                    'projectId': 'X20191113644229883425',
                    'projectName': '测试001',
                    'xmzlUrl': 'E://uploadFiles//spatialData//测试001//竣工空间数据上传//efb0013b-6a46-4b9c-9d82-0237094b0d21_LX_TEMPLATE.mdb',
                    'projectcount': '11',
                    'foldercount': null,
                    'type': '0',
                    'name': '测试001',
                    'count': '11'
                },
                {
                    'id': '1531e4b54adf41a586228150fd5a8eba',
                    'zlmc': '1574658972',
                    'uploader': 'gcglzx',
                    'uploaderId': '8c9cc1140e0f4757b877bb87404536e3',
                    'delFlag': 0,
                    'uploadDate': 1575359079000,
                    'folderId': 'c1871c63fd4a4a16a8c30cdb8364cbfb',
                    'folderName': '现场踏勘',
                    'projectId': 'X20191203651440570362',
                    'projectName': '这是第三次正式测试1203',
                    'xmzlUrl': 'E://uploadFiles//xmzlqd//这是第三次正式测试1203//现场踏勘//15f31f70-2bc2-40e9-b64d-5b36dcfe42dc_1574658972.jpg',
                    'projectcount': '5',
                    'foldercount': null,
                    'type': '0',
                    'name': '这是第三次正式测试1203',
                    'count': '5'
                },
                {
                    'id': '1c62c6b6ba0246039c3c730a954e7c5f',
                    'zlmc': '23456',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1575443910000,
                    'folderId': '1',
                    'folderName': 'sheji',
                    'projectId': 'X20191127649270542515',
                    'projectName': 'update1',
                    'xmzlUrl': 'E://uploadFiles//quantityFile//X20191127649270542515//sheji//10022584-9f7b-444e-99ae-06c0971048fb_23456.xlsx',
                    'projectcount': '1',
                    'foldercount': null,
                    'type': '0',
                    'name': 'update1',
                    'count': '1'
                },
                {
                    'id': '92003a96216a4272b1ec2a2f9ab945b6',
                    'zlmc': '2',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1574739925000,
                    'folderId': '1',
                    'folderName': '设计空间数据上传',
                    'projectId': 'X20191125648475142636',
                    'projectName': 'sdfs',
                    'xmzlUrl': 'E://uploadFiles//spatialData//sdfs//设计空间数据上传//f5d04adb-f84d-4bd3-b315-d9de4b8671e7_2.mdb',
                    'projectcount': '2',
                    'foldercount': null,
                    'type': '0',
                    'name': 'sdfs',
                    'count': '2'
                },
                {
                    'id': '801208619a5a4060be3688edc507cb3e',
                    'zlmc': 'LX_TEMPLATE',
                    'uploader': 'dev',
                    'uploaderId': '2e3aadec8cd14fbcab184de7651065c0',
                    'delFlag': 0,
                    'uploadDate': 1574765543000,
                    'folderId': '1',
                    'folderName': 'sheji',
                    'projectId': 'X20191126648896930923',
                    'projectName': 'sdf',
                    'xmzlUrl': 'E://uploadFiles//spatialData//X20191126648896930923//sheji//2e1e364a-b82f-48aa-aae8-ad38d123fbb8_LX_TEMPLATE.mdb',
                    'projectcount': '1',
                    'foldercount': null,
                    'type': '0',
                    'name': 'sdf',
                    'count': '1'
                }
            ],
            option: {}
        }
    }

    componentWillMount() {
		this.setState({
            type: 'line',
            option: {
                title: {
                    text: '折线图'
                },
                animation: false,
                legend: {
                    data: ['项目数量'],
                    y: 'bottom'
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name: '项目数量',
                        type: 'line',
                        itemStyle: {
                            color: 'orange'
                        },
                        smooth: true,
                        areaStyle: {},
                        data: [60, 40, 70, 40, 40, 50, 80, 90, 30, 40, 50, 100]
                    }
                ]
            }
        })
	}

    onRadioGroupChange = (e) => {
        switch (e.target.value) {
            case 'line':
                this.setState({
                    type: 'line',
                    option: {
                        title: {
                            text: '折线图'
                        },
                        animation: false,
                        legend: {
                            data: ['项目数量'],
                            y: 'bottom'
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name: '项目数量',
                                type: 'line',
                                itemStyle: {
                                    color: 'orange'
                                },
                                smooth: true,
                                areaStyle: {},
                                data: [60, 40, 70, 40, 40, 50, 80, 90, 30, 40, 50, 100]
                            }
                        ]
                    }
                })
                break
            case 'bar':
                this.setState({
                    type: 'bar',
                    option: {
                        title: {
                            text: '柱状图'
                        },
                        animation: false,
                        legend: {
                            data: ['项目数量'],
                            y: 'bottom'
                        },
                        xAxis: {
                            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        },
                        yAxis: {},
                        series: [
                            {
                                name: '项目数量',
                                type: 'bar',
                                itemStyle: {
                                    color: 'orange'
                                },
                                data: [10, 40, 70, 40, 40, 50, 80, 90, 30, 40, 50, 100]
                            }
                        ]
                    }
                })
                break
            case 'pie':
                this.setState({
                    type: 'pie',
                    option: {
                        title : {
                            text: '饼状图',
                            x: 'left'
                        },
                        animation: false,
                        legend: {
                            orient: 'vertical',
                            x: 'right',
                            data: ['预立项', '立项阶段', '设计阶段', '施工阶段', '验收阶段']
                        },
                        series : [
                            {
                                type: 'pie',
                                label: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {value: 800, name: '预立项'},
                                    {value: 796, name: '立项阶段'},
                                    {value: 765, name: '设计阶段'},
                                    {value: 639, name: '施工阶段'},
                                    {value: 553, name: '验收阶段'}
                                ]
                            }
                        ]
                    }
                })
        }
    }

    onRangePickerChange = (date, dateString) => {
        console.log(date, dateString)
    }

	handleSelectAll = (selected, selectedRows) => {
		console.log(selected, selectedRows)
    }

    handleSelect = (record, selected) => {
		console.log(record, selected)
	}
	
	handleRow = (record) => {
		console.log(record)
    }
    
	changePage = (page) => {
		console.log(page)
	}
	
	handleSizeChange = (current, size) => {
		console.log(current, size)
	}

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : 
            <div className='base-info'>
                <div className='routine'>
                    <Breadcrumb className='breadcrumb'>
                        <Breadcrumb.Item>统计分析</Breadcrumb.Item>
                        <Breadcrumb.Item>常规统计</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className='placeHolder' />
                    <Card title='常规统计' className='card'>
                        <InputGroup className='inputGroup'>
                            <span>筛选条件：</span>
                            <Select className='select' defaultValue='基本情况'>
                                <Option value='基本情况'>基本情况</Option>
                                <Option value='收支情况'>收支情况</Option>
                            </Select>
                            <span>时间：</span>
                            <RangePicker className='rangePicker' onChange={this.onRangePickerChange}/>
                            <div className='button'>
                                <Button type='primary'>查询</Button>
                            </div>
                        </InputGroup>
                        <Radio.Group onChange={this.onRadioGroupChange} value={this.state.type} className='radioGroup' >
                            <Radio.Button value='line'>折现图</Radio.Button>
                            <Radio.Button value='bar'>柱状图</Radio.Button>
                            <Radio.Button value='pie'>饼状图</Radio.Button>
                        </Radio.Group>
                        <ReactEcharts
                            notMerge={true}
                            option={this.state.option}
                            style={{height: '250px', margin: '0 auto 20px auto', clear: 'both'}}
                            className='echarts-for-echarts'
                            theme='my_theme' />
                        <Table
                            className='components-table-demo-nested'
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            rowKey='uploadDate'
                            pagination={{
                                total: this.state.total,
                                pageSize: this.state.limit,
                                onChange: this.changePage,
                                showSizeChanger: true, 
                                showQuickJumper: true,
                                onShowSizeChange: this.handleSizeChange,
                                showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条数据`
                            }}
                            rowSelection={{
                                onSelectAll: this.handleSelectAll,
                                onSelect: this.handleSelect
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
    }
}
 