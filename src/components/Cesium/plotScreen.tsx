import * as React from 'react'
import { Button, Row, Col, Modal, message } from 'antd'
import Screen from './screen'
import SendMobile from './sendMobile'
import IndexAction from '@api/IndexAction'
import dev from '@config/dev.config'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import StorageUtils from '@utils/StorageUtil'
import './index.less'
const { confirm } = Modal
interface IProps {
    reloadEntry: any,
    plotCancel: any,
    openSpin: any,
    closeSpin: any,
    viewer: any,
    stores?: any,
    vectorTileManager?: any,
}

interface IState {
    visible: boolean,
    sendVisible: boolean,
    exportVisible: boolean,
    type: number,
    saveFlag: boolean,
    sendFlag: boolean,
    spinning: boolean,
    content: string,
}
@inject('stores')
@observer
export default class PlotScreen extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }
    state = {
        visible: false,
        sendVisible: false,
        exportVisible: false,
        saveFlag: true,
        sendFlag: true,
        spinning: false,
        type: 1,
        content: '您还没有开始筛选!'
    }
    screenTipChange = () => {
        this.setState({
            content: '您已经筛选了'
        })
    }

    showScreen = () => {
        this.setState({
            visible: true
        })
    }
    closeScreen = () => {
        this.setState({
            visible: false
        })
    }
    showExport = () => {
        this.setState({
            exportVisible: true
        })
    }
    closeExport = () => {
        this.setState({
            exportVisible: false
        })
    }
    showSend = () => {
        this.setState({
            sendVisible: true
        })
    }
    closeSend = () => {
        this.setState({
            sendVisible: false
        })
    }

    onChange = e => {
        this.setState({
            type: e.target.value
        })
    }
    // 导出数据
    exportData = () => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        IndexAction.PlotDownload({
            projectId: `XM${info.processInstanceId}`,
            bgcs: info.bgcs,
            layName: 'ZYTK',
        })
            .then((res: any) => {
                if (res.status === 200) {
                    const link = document.createElement('a')
                    link.href = dev.url + res.data
                    link.download = 'admin'
                    if (navigator.userAgent.toUpperCase().indexOf('Firefox')) {
                        const evt = document.createEvent('MouseEvents')
                        evt.initEvent('click', true, true)
                        link.dispatchEvent(evt)
                    } else {
                        link.click()
                    }
                } else {
                    console.log(res.msg)
                }
            })

    }
    // 取消
    cancel = () => {
        this.props.plotCancel()
        this.props.vectorTileManager.removeVectorTileLayer(this.props.viewer)
        this.setState({
            content: '您取消了筛选！'
        })
    }
    // 保存
    save = () => {
        const that = this
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        confirm({
            title: '您确定要保存吗?',
            content: '保存后将无法进行地块筛选！',
            onOk() {
                IndexAction.PlotConfirm({
                    processInstanceId: info.processInstanceId,
                    projectId: `XM${info.processInstanceId}`,
                    bgcs: info.bgcs,
                    layName: 'ZYTK',
                }).then((res: any) => {
                    if (res.status === 200) {
                        message.success(res.msg)
                        that.screenTipChange()
                        that.setState({
                            saveFlag: true,
                            sendFlag: false
                        })
                        const obj = {
                            [info.processInstanceId + 'save']: true,
                            [info.processInstanceId + 'send']: true,
                        }
                        StorageUtils.setLocalStorage('screenStatus', obj)
                        mapStore.onScreenSaveFlag(true)
                    } else {
                        message.error(res.msg)
                    }
                })
            },
            onCancel() {
                console.log()
            },
        })
    }

    isDisabled = (type, jd) => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        if (type === '1') {
            if (jd === 2) {
                this.setState({
                    saveFlag: StorageUtils.getLocalStorage('screenStatus') && StorageUtils.getLocalStorage('screenStatus')[info.processInstanceId + 'save'] ? true : false,
                    sendFlag: StorageUtils.getLocalStorage('screenStatus') && StorageUtils.getLocalStorage('screenStatus')[info.processInstanceId + 'send'] ? true : false
                })
            } else {
                this.setState({
                    saveFlag: true
                })
            }
        } else if (type === '2') {
            if (jd === 3) {
                this.setState({
                    sendFlag: false
                })
            } else {
                this.setState({
                    sendFlag: StorageUtils.getLocalStorage('screenStatus') && StorageUtils.getLocalStorage('screenStatus')[info.processInstanceId + 'send'] ? false : true
                })
            }
        }
    }

    disableDispatch = () => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        this.setState({
            sendFlag: true
        })
        const obj = {
            [info.processInstanceId + 'save']: true,
            [info.processInstanceId + 'send']: false,
        }
        StorageUtils.setLocalStorage('screenStatus', obj)
    }

    startScreen = () => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        this.props.openSpin()

        IndexAction.PlotScreen({
            projectId: `XM${info.processInstanceId}`,
            bgcs: info.bgcs,
            layName: 'ZYTK'
        }).then((res: any) => {
            if (res.status === 200) {
                this.props.vectorTileManager.removeVectorTileLayer(this.props.viewer)
                this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, res.data)
                // this.props.reloadEntry(res.data)
            } else {
                message.warning(res.msg)
            }
            this.props.closeSpin()
        })

    }

    componentDidMount() {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        this.isDisabled('1', info.xmjd)
        this.isDisabled('2', info.xmjd)
    }

    render() {
        /* const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo) */
        return (
            <>
                <div className='plot'>
                    <Row>
                        <Col span={24}>
                            <Button onClick={this.showScreen} disabled={this.state.saveFlag}>筛选图层</Button>
                            <Button onClick={this.cancel} style={{ marginLeft: '6px' }} disabled={this.state.saveFlag}>重置</Button>
                            <Button onClick={this.startScreen} style={{ marginLeft: '6px' }} disabled={this.state.saveFlag}>开始筛选</Button>
                            <Button onClick={this.save} style={{ marginLeft: '6px' }} disabled={this.state.saveFlag}>保存</Button>

                            <Button onClick={this.exportData} style={{ marginLeft: '6px' }}>导出数据</Button>
                            <Button onClick={this.showSend} style={{ marginLeft: '6px' }} disabled={this.state.sendFlag}>下发到移动端</Button>
                        </Col>
                    </Row>
                    <Modal
                        visible={this.state.visible}
                        footer={false}
                        title='筛选图层'
                        onCancel={this.closeScreen}
                        bodyStyle={{ maxHeight: '560px', overflow: 'auto' }}
                    >
                        {this.state.visible ? <Screen vectorTileManager={this.props.vectorTileManager} openSpin={this.props.openSpin} closeSpin={this.props.closeSpin} closeScreen={this.closeScreen} reloadEntry={this.props.reloadEntry} viewer={this.props.viewer} /> : null}
                    </Modal>
                    <Modal
                        visible={this.state.sendVisible}
                        footer={false}
                        onCancel={this.closeSend}
                        title='下发'
                        width={800}
                    >
                        <SendMobile closeSend={this.closeSend} disableDispatch={this.disableDispatch} />
                    </Modal>
                </div>
            </>
        )
    }
}

