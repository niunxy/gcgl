import React, { Component } from 'react'
import { Dropdown, Menu, Icon, Divider, Progress, Card } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import SpaceMap from '../../../Cesium'
import './index.less'
/* import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config' */
interface IState {

}
export default class Space extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        // const { buttons } = this.props
        this.state = {
        }
    }

    renderMenu = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                        测量
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                        测面
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                    <Icon type='environment' />标点
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                        标线
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                        标面
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                    <Icon type='clock-circle' />多时相
                    </a>
                </Menu.Item>
            </Menu>
        )
    }

    render() {
        // const { buttons } = this.props
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='space' style={{ position: 'relative' }}>
                    <SpaceMap />
                    <div style={{ position: 'absolute', right: '10px', top: '10px', backgroundColor: '#959d94', padding: '6px 10px' }} className='toolBox'>
                        <Dropdown overlay={this.renderMenu()}>                           
                            <a className='ant-dropdown-link'>
                                <Icon type='tool' />工具 <Icon type='down' />
                            </a>
                        </Dropdown>
                        <Divider type='vertical' />
                        <span>
                            <Icon type='share-alt' style={{color: '#fff'}} />
                            <a style={{marginLeft: '6px'}}>导出</a>
                        </span>
                        <Divider type='vertical' />
                        <span>
                            <Icon type='delete' style={{color: '#fff'}} />
                            <a style={{marginLeft: '6px'}}>清空</a>
                        </span>
                    </div>
                    <Card className='card' title='项目系统概述' bordered={false} bodyStyle={{padding: '0 24px 10px 24px'}} headStyle={{ color: 'white', textAlign: 'center', borderBottom: '0'}}>
                        {/* 全部项目 */}
                        <Progress type='circle' percent={100} format={() => '500'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>全部项目<br/>（个）</div>
                        {/* 在建项目 */}
                        <Progress type='circle' percent={60} format={() => '300'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>在建项目<br/>（个）</div>
                        {/* 完结项目 */}
                        <Progress type='circle' percent={40} format={() => '200'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>完结项目<br/>（个）</div>
                        {/* 总面积 */}
                        <Progress type='circle' percent={100} format={() => '4821'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>总面积<br/>（km<sup>2</sup>）</div>
                        {/* 占补平衡 */}
                        <Progress type='circle' percent={20} format={() => '100'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>占补平衡<br/>（个）</div>
                        {/* 增减挂钩 */}
                        <Progress type='circle' percent={80} format={() => '400'} width={60} strokeColor={{'0%': '#108ee9', '100%': '#87d068'}}/>
                        <div className='desc'>增减挂钩<br/>（个）</div>
                    </Card>
                </div>
            )
    }
}
