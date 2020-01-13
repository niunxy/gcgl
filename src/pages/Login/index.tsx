import React from 'react'
import './index.less'
import LoginAction from '@api/LoginAction'
import LoginUtils from '@utils/Login'
import StorageUtils from '@utils/StorageUtil'
import Memory from '@utils/Memory'
import dev from '@config/dev.config'
import {
  Form, Icon, Input, Button, message, Row, Col
} from 'antd'
import { Redirect } from 'react-router-dom'

interface IState {
  username?: any, // 用户名 - 有可能为邮箱、电话号码、中英文字符
  password?: any,
  code?: any,
  codeUrl?: string,
  isLogin?: boolean
}

export default class LoginComponent extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      username: '',
      password: '',
      code: '',
      codeUrl: dev.url + '/getCode?' + Date.now(),
      isLogin: false
    }
  }
  componentDidMount() {
    /** 具体判断条件取决于后端对登录的处理 */
    const loginStatus = LoginUtils.GetToken()
    if (loginStatus) {
      this.setState({
        isLogin: true
      })
    } else {
      this.setState({
        isLogin: false
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.username && this.state.password) {
      LoginAction.Login({
        username: this.state.username,
        password: this.state.password,
        code: this.state.code
      }).then((data: any) => {
        if (data.status === 200) {
          LoginUtils.SetUserInfo(this.state.username)
          LoginUtils.SetToken(this.state.username)
          if (data.data) {
            const newArr = data.data.currentMenuList.filter((item: any) => {
              return item.menuType === 2 && item.name !== '项目管控' && item.name !== '工作流程管理' && item.name !== '消息中心' && item.name !== '权属资料' && item.name !== '工程量管理' && item.name !== '系统监控'
            })
            newArr.forEach((item: any) => {
              item.title = item.name
              item.to = '/index/' + item.url
              item.key = item.url
              item.child = []
              data.data.currentMenuList.forEach((value: any) => {
                if (item.id === value.pid) {
                  item.child.push(value)
                }
              })
              item.child.forEach((list: any) => {
                list.child = []
                data.data.currentMenuList.forEach((value1: any) => {
                  if (list.id === value1.pid) {
                    list.child.push(value1.name)
                  }
                })
              })
            })
            StorageUtils.setLocalStorage('menuData', newArr)
            StorageUtils.setLocalStorage('userId', data.data.id)
            Memory.menuData = newArr
            // this.props.history.replace('/index/map')
          }
          this.setState({
            isLogin: true
          })
        } else {
          message.error(data.msg)
          this.getCode()
        }
      })
    } else {
      message.error('用户名或密码不能为空！')

    }
  }
  handleUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  }
  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  handleCode = (e) => {
    this.setState({
      code: e.target.value
    })
  }
  onKeyUpListener = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }
  getCode = () => {
    this.setState({
      codeUrl: dev.url + '/getCode?' + Date.now()
    })
  }
  // 登录面板
  LoginForm = () => {
    return (
      <div className='login-box'>
        <div className='systemTitle' />

        <div className='loginContainer'>
          <Form className='loginForm'>
            <h3 className='title'>欢迎登录！</h3>
            <Form.Item>
              <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='用户名' onChange={this.handleUsername} />
            </Form.Item>
            <Form.Item>
              <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='密码' onChange={this.handlePassword} onKeyUp={this.onKeyUpListener} />
            </Form.Item>
            <Form.Item>
              <Row>
                <Col span={12}>
                  <Input placeholder='验证码' onChange={this.handleCode} onKeyUp={this.onKeyUpListener} />
                </Col>
                <Col span={12}>
                  <img src={this.state.codeUrl} onClick={this.getCode} alt='' />
                </Col>

              </Row>
            </Form.Item>

            <Form.Item>
              <Button icon='lock' type='primary' className='loginBtn' onClick={this.handleSubmit}>安全登录</Button>
            </Form.Item>

            {/* TODO : hide this func temp */}
            <Form.Item style={{ display: 'none' }}>
              <label>
                <span className='login-none-account'>没有账号?</span>
                <span className='login-get-account'>点此申请</span>
              </label>
            </Form.Item>
          </Form>
        </div>
        {/* TODO: keep this div*/}
        {/* <div className='footer'>
          <a href='#' target='_blank'>关于我们</a>
          <a href='#' target='_blank'>联系我们</a>
          <a href='#' target='_blank'>免责声明</a>
          <a href='#' target='_blank'>友情链接</a>
          <a href='#' target='_blank'>问题反馈</a>
        </div> */}
        <div className='footer'>
          Copyright © 2019 陕西自然资源勘测规划设计院股份有限公司 All Rights Reserved
        </div>
      </div>

    )
  }

  render() {
    const loginForm = this.LoginForm()
    if (this.state.isLogin) {
      return (
        <Redirect to='/index/map' />
      )
    } else {
      return loginForm
    }
  }
}
