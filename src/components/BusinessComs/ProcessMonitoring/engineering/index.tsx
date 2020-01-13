import React, { Component } from 'react'
import { Row, Col, Table } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import Timeline from './timeline'
import CesiumCreater from '../CesiumTools/CesiumCreater'
import MapManager from '../CesiumTools/MapManager'
import './index.less'
/* import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config' */
interface IState {
    viewer : any,
    data : any
}
export default class Engineering extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        // const { buttons } = this.props
        this.state = {
            viewer : {},
            data:  [
                {
                    key: '1',
                    name: 'John Brown',
                    age: 32,
                    tel: '0571-22098909',
                    phone: 18889898989,
                    address: 'New York No. 1 Lake Park',
                },
                {
                    key: '2',
                    name: 'Jim Green',
                    tel: '0571-22098333',
                    phone: 18889898888,
                    age: 42,
                    address: 'London No. 1 Lake Park',
                },
                {
                    key: '3',
                    name: 'Joe Black',
                    age: 32,
                    tel: '0575-22098909',
                    phone: 18900010002,
                    address: 'Sidney No. 1 Lake Park',
                },
                {
                    key: '4',
                    name: 'Jim Red',
                    age: 18,
                    tel: '0575-22098909',
                    phone: 18900010002,
                    address: 'London No. 2 Lake Park',
                },
                {
                    key: '5',
                    name: 'Jake White',
                    age: 18,
                    tel: '0575-22098909',
                    phone: 18900010002,
                    address: 'Dublin No. 2 Lake Park',
                },
            ]
        }
    }


    componentDidMount () {
        // 初始化地球
        const map = new CesiumCreater()
        const viewer =  map.initViewer('cesiumContainer', 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali')
        map.resolveGltfError()
        map.loadWebTerrain(viewer) // 加载地形
        map.initCamera(viewer) // 初始化视角
        const mapManager = new MapManager(viewer)
        mapManager.loadArcgisWms('sxmap', '0,1,2', '陕西省行政区划边界', true) // 加载陕西省区划图
        this.setState({
            viewer
        })
    }

    render() {
        // const { buttons } = this.props
          const columns = [
            {
              title: '单位名称',
              dataIndex: 'name',
            },
            {
              title: '单位',
              dataIndex: 'age',
            },
            {
              title: '工程量',
              dataIndex: 'address',
            },
          ]
          
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (

                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                    {/* <Card title='工程演变' bordered={false}>
                        <Row style={{marginBottom: '20px'}}>
                            {buttons.includes('批量下载') ? <Button type='primary'>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }}>删除</Button> : null}
                        </Row>
                        <div>
                            工程演变
                        </div>
                    </Card> */}
                    <div id='cesiumContainer' className='gcybCesium'/>
                    <Timeline viewer = {this.state.viewer}/>
                    <div className='engineering-modal'>
                        <h1>
                            设计项目信息
                        </h1>
                        <Row style={{marginBottom: '10px'}}>
                            <Col span={20} offset={4}>
                                <h2>白水县白塬镇土地整改项目</h2>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '6px'}}>
                            <Col span={10} offset={4}>
                                总规模：3656786
                            </Col>
                            <Col span={10}>
                                净增耕地：98%
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '6px'}}>
                            <Col span={10} offset={4}>
                                新增耕地率：3656786
                            </Col>
                            <Col span={10}>
                                新增水浇地：98%
                            </Col>
                        </Row>
                        <Table columns={columns} dataSource={this.state.data} bordered pagination={false} title={() => '工程里表'} />
                    </div>
                </div>
            )
    }
}
