import React, { Component } from 'react'
import { message, Modal, Divider } from 'antd'
import loginUtils from '@utils/Login'
import { Redirect } from 'react-router-dom'
import './index.less'
// import AddRole from  './addRole'
import SystemAction from '@api/SystemAction'
import UnPublish from '@layouts/unPublish'

const { confirm } = Modal
// const { Search } = Input
interface IState {
    page: number,
    limit: number,
    total: number,
    keyword: string,
    visible: boolean,
    actionInfo: string,
    title: string,
    id: any,
    data: any[],
    ids: string[],
    columns: any
}
export default class TemplateDownload extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        const { buttons } = this.props
        this.state = {
            title: '新增角色',
            visible: false,
            data: [],
            id: '',
            actionInfo: '新增',
            columns: [
                {
                    title: '序号',
                    key: 'index',
                    render: (...rest) => {
                        return (
                            <span>
                                {rest[2] + 1}
                            </span>
                        )
                    }
                },
                {
                    title: '角色名称',
                    dataIndex: 'roleName',
                    key: 'roleName',
                    render: (text) => {
                        return text.split(',').join('')
                    }
                },
                {
                    title: '启用时间',
                    dataIndex: 'createDate',
                    key: 'createDate',
                    render: (text) => {
                        return this.dateFomart(text)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            {buttons.includes('查看') ? <a onClick={this.showModal.bind(this, '查看', record.id, event)}>查看</a> : null}
                            {buttons.includes('查看') ? <Divider type='vertical' /> : null}
                            {buttons.includes('编辑') ? <a onClick={this.showModal.bind(this, '编辑', record.id, event)}>编辑</a> : null}
                            {buttons.includes('编辑') ? <Divider type='vertical' /> : null}
                            {buttons.includes('删除') ? <a onClick={this.handleDelete.bind(this, record.id, event)}>删除</a> : null}
                        </span>
                    ),
                },
            ],
            page: 1,
            limit: 10,
            total: 0,
            keyword: '',
            ids: []
        }
    }

    dateFomart = (date) => {
        if (new Date(date).getMonth() + 1 > 9) {
            if (new Date(date).getDate() > 9) {
                return new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate()
            } else {
                return new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-0' + new Date(date).getDate()
            }
        } else {
            if (new Date(date).getDate() > 9) {
                return new Date(date).getFullYear() + '-0' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate()
            } else {
                return new Date(date).getFullYear() + '-0' + (new Date(date).getMonth() + 1) + '-0' + new Date(date).getDate()
            }
        }
    }

    handleKeyword = (keyword) => {
        this.setState({ keyword, page: 1 }, () => this.init())
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    showModal = (info, id, e) => {
        e && e.preventDefault()
        this.setState({
            visible: true,
            actionInfo: info,
            title: info + '角色',
            id: id ? id : 0
        })
    }

    init = () => {
        SystemAction.QueryAllRoles(
            { page: this.state.page, limit: this.state.limit, roleName: this.state.keyword }
        ).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data,
                    total: res.count
                })
            }
        })
    }

    changePage = (page) => {
        this.setState({
            page
        }, () => {
            this.init()
        })
    }

    handleDelete = (id, event) => {
        event && event.preventDefault()
        if (id === '') {
            return
        }
        const that = this
        confirm({
            title: '您确定要删除选中的内容吗?',
            content: '当您点击了此按钮，选中内容将永久删除！',
            onOk() {
                SystemAction.DelRole({ id }).then((res: any) => {
                    if (res.status === 200) {
                        message.success('删除成功')
                        that.init()
                    } else if (res.status === 400) {
                        message.error(res.msg)
                    }
                })

            },
            onCancel() {
                console.log()
            },
        })
    }

    handleSelectAll = (selected, selectedRows) => {
        let ids: string[] = []
        if (selected) {
            selectedRows.forEach((value) => {
                ids.push(value.id)
            })
        } else {
            ids = []
        }
        this.setState({ ids })
    }

    handleSelect = (record, selected) => {
        let ids = this.state.ids
        if (selected) {
            ids.push(record.id)
        } else {
            ids = ids.filter((value) => value !== record.id)
        }
        this.setState({
            ids
        })

    }

    componentDidMount() {
        this.init()
    }

    render() {
        return !loginUtils.isLogin()
            ? <Redirect to='/login' />
            : (
                <div className='formUpload'>
                    < UnPublish />
                </div >
            )
    }
}
