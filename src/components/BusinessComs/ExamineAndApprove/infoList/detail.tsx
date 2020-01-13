import * as React from 'react'
import InfoAction from '@api/InfoAction'
import TransTool from '@utils/TransTool'
import { Button, message } from 'antd'
import dev from '@config/dev.config'
import { observer, inject } from 'mobx-react'
interface IProps {
    id: any,
    handleCancel: any,
    init?: any,
    readStatus?: string,
    stores?: any
}

interface IState {
    messageRecord: any,
    resources: any[]
}
@inject('stores')
@observer
export default class Detail extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            messageRecord: {

            },
            resources: []
        }
    }

    getUnreadList = () => {
        InfoAction.GetUnreadList(this.props.id, null).then((res: any) => {
            if (res.status === 200) {
                this.props.init()
                if (this.props.readStatus === '未查看') {
                    this.props.stores.infoStore.onSaveInfoId(this.props.id)
                }
                this.setState({
                    messageRecord: res.data.messageRecord,
                    resources: res.data.resources
                })
            } else {
                message.error('失败')
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
        if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            link.dispatchEvent(evt)
        } else {
            link.click()
        }
    }

    componentDidMount() {
        this.getUnreadList()
    }

    render() {
        return (
            <div className='detail-box'>
                <div>
                    <h1 style={{ fontSize: '14px', color: '#333' }}>
                        项目名称：{this.state.messageRecord.projectName}&nbsp;&nbsp;项目负责人：{this.state.messageRecord.dutyPerson}&nbsp;&nbsp;时间：{TransTool.timeTrans(this.state.messageRecord.createTime)}
                    </h1>
                    <p>消息内容：{this.state.messageRecord.content}</p>
                </div>
                {this.state.resources.length > 0 ? <ul>
                    {
                        this.state.resources.map((item, index) => {
                            return (
                                <li className='clearfix' key={index}>
                                    <div>表单：</div>
                                    <div>{item.ZLMC}<Button type='link' onClick={this.handleDownload.bind(this, item.UPLOADER_ID)} style={{ float: 'right', marginTop: '4px' }}>下载</Button><Button type='link' onClick={this.handlePreview.bind(this, item.XMZL_URL)} style={{ float: 'right', marginTop: '4px' }}>预览</Button></div>
                                </li>
                            )
                        })
                    }

                </ul> : null}
            </div>
        )
    }
}