import React, { Component } from 'react'
import { Row, Col, Button, Card } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
import SystemAction from '@api/SystemAction'
interface IState {
    deptId: string,
    roleId: string,
    deptList: any[],
    roleList: any[],
    permissionList: any[],
}
export default class Permission extends Component<any, IState> {
    constructor(props: any) {
        super(props)
    }
    state: IState = {
        deptId: '',
        roleId: '',
        deptList: [],
        roleList: [],
        permissionList: [],
    }

    getDeptAndRole = (deptId) => {
        SystemAction.GetDeptAndRole({ deptId })
            .then((res: any) => {
                if (res.status === 200) {
                    if (deptId) {
                        this.setState({
                            roleList: res.data[0].roleList,
                            deptId,
                            roleId: res.data[0].roleList[0].id
                        }, () => {
                            this.initMenu()
                        })
                    } else {
                        this.setState({
                            deptList: res.data,
                            roleList: res.data[0].roleList,
                            deptId: res.data[0].id,
                            roleId: res.data[0].roleList[0].id
                        }, () => {
                            this.initMenu()
                        })
                    }
                }
            })
    }

    queryMenuByDeptAndRole = (result) => {
        SystemAction.QueryMenuByDeptAndRole({
            deptId: this.state.deptId,
            roleId: this.state.roleId
        })
        .then((res: any) => {
            result.forEach((item) => {
                res.data.forEach((value) => {
                    if (item.id === value.id) {
                        item.children.length > 0 && item.children.forEach((item1) => {
                            value.children.forEach((value1) => {
                                if (item1.id === value1.id) {
                                    item1.children.length > 0 && item1.children.forEach((item2) => {
                                        value1.children.forEach((value2) => {
                                            if (item2.id === value2.id) {
                                                item2.permissionFlag = true
                                            } else {
                                                item.permissionFlag = false
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    }
                })
            })
            this.setState({
                permissionList: result
            })
        })
    }

    initMenu = () => {
        SystemAction.QueryAllMenu(null).then((res: any) => {
            const result = res.data
            this.queryMenuByDeptAndRole(result)
        })
    }

    handleDept = (id) => {
        this.getDeptAndRole(id)
    }

    renderPermission = () => {
        return this.state.permissionList.map((item) => (
            <div key={item.id}>
                <div>
                    {item.name}
                </div>
                <div>
                    {null}
                </div>
            </div>
            /* {
                item.children.map((value) => (
                    <div key={value.id}>
                        <div>
                            {value.name}
                        </div>
                        <div>
                            {
                            null 
                            }
                        </div>
                    </div>
                ))
            } */
        ))
    }

    componentDidMount() {
        this.getDeptAndRole(null)
        // this.initMenu()
    }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div>
                    <Card title='权限管理' bordered={false}>
                        <Button type='primary' style={{ marginBottom: '20px' }}>编辑</Button>
                        <Button type='primary' style={{ marginLeft: '20px' }}>保存</Button>
                        <Row>
                            <Col span={4}>
                                <div className='permission-title'>部门</div>
                                <div className='permission-dept'>
                                   
                                    <div>
                                        <div>
                                            序号
                                        </div>
                                        <div>
                                            部门名称
                                        </div>
                                    </div>
                                    {
                                        this.state.deptList.map((item, index) => (
                                            <div key={item.id} onClick={this.handleDept.bind(this, item.id)}>
                                                <div>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    {item.deptName}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className='permission-title'>角色权限</div>
                                <ul className='permission-role'>
                                    <li>角色类型</li>
                                    {
                                        this.state.roleList.map((item) => (
                                            <li key={item.id}>{item.roleName}</li>
                                        ))
                                    }
                                </ul>
                            </Col>
                            <Col span={8}>
                                <div className='permission-title'>菜单权限</div>
                                <div className='permission-dept'>   
                                    <div>
                                        <div>
                                            菜单名称
                                        </div>
                                        <div>
                                            功能模块
                                        </div>
                                    </div>
                                    
                                </div>
                            </Col>
                            <Col span={9}>
                                <div className='permission-title'>文档权限</div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
    }
}
