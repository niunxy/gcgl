import React, { Component } from 'react'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import UnPublish from '@layouts/unPublish'
import './index.less'
interface IState {
    stageStyle: any
}
export default class Historical extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            stageStyle: {
                display: 'none'
            }
        }
    }


    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='historical'>
                    <UnPublish />
                </div>
            )
    }
}
