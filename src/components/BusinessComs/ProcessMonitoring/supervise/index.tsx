import React, { Component } from 'react'
// import { Icon, Radio } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import Cesium from '@components/Cesium'
import './index.less'
/* import UploadAction from '@api/UploadAction'
import dev from '@config/dev.config' */
interface IState {
    stageStyle: any
}
export default class Supervise extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        // const { buttons } = this.props
        this.state = {
            stageStyle: {
                display: 'none'
            }
        }
    }

    handleMouseOver = (e) => {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({
            stageStyle: {display: 'block'}
        }) 
    }

    handleMouseOut = (e) => {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({
            stageStyle: {display: 'none'}
        }) 
    }

    render() {
        // const { buttons } = this.props
        // const radioStyle = {
        //     display: 'block',
        //     height: '30px',
        //     lineHeight: '30px',
        // }
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div>
                    {/* <Card title='监督核查' bordered={false}>
                        <Row style={{marginBottom: '20px'}}>
                            {buttons.includes('批量下载') ? <Button type='primary'>下载</Button> : null}
                            {buttons.includes('批量删除') ? <Button type='primary' style={{ marginLeft: '20px' }}>删除</Button> : null}
                        </Row>
                        <div>
                            监督核查
                        </div>
                    </Card> */}
                    <Cesium />
                    {/*<div className='stage'>*/}
                    {/*    <span  onClick={this.handleMouseOver.bind(this)}>*/}
                    {/*        <Icon type='appstore' style={{fontSize: '24px'}}/>*/}
                    {/*    </span>*/}
                    {/*    <div style={this.state.stageStyle} onMouseLeave={this.handleMouseOut.bind(this)}>*/}
                    {/*        <Radio.Group>*/}
                    {/*            <Radio style={radioStyle} value={1}>*/}
                    {/*                资源组勘探*/}
                    {/*            </Radio>*/}
                    {/*            <Radio style={radioStyle} value={2}>*/}
                    {/*                三方踏勘*/}
                    {/*            </Radio>*/}
                    {/*            <Radio style={radioStyle} value={3}>*/}
                    {/*                施工前*/}
                    {/*            </Radio>*/}
                    {/*            <Radio style={radioStyle} value={3}>*/}
                    {/*                施工中*/}
                    {/*            </Radio>*/}
                    {/*            <Radio style={radioStyle} value={3}>*/}
                    {/*                施工后*/}
                    {/*            </Radio>*/}
                    {/*        </Radio.Group>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            )
    }
}
