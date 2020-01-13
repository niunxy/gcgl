/**
 * @author Roman
 * @date 2020/1/4
 * @Description: 将entity属性填入列表
 */
import * as React from 'react'
import './index.less'
import {Icon, Table} from 'antd'
import './selectFeature.less'
interface IProps {
    selectedDK: any,
    setDkDataPanelShow: any,
    panelLeft: number,
    panelTop: number,
}

let data: any = []
const columns = [
    {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '字段内容',
        dataIndex: 'content',
        key: 'content',
    }
]
export default class SelectFeature extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }
    selectedEntityFlag = -1
    isLoading = true
    componentWillReceiveProps() {
        if (this.props.selectedDK) {
            if (this.props.selectedDK.selectedEntityFlag !== this.selectedEntityFlag) {
                this.isLoading = true
                this.selectedEntityFlag = this.props.selectedDK.selectedEntityFlag
            }
            this.setDataPanel(this.props.selectedDK.properties)
        } else {
            data = []
        }
    }
    // 关闭组件
    closeVisible = () => {
        this.props.setDkDataPanelShow(false)
    }

    // 为table设置值
    setDataPanel = (properties) => {
        if (!properties) {
            data = []
            return
        }
        let pat = /[a-zA-Z]/
        data = []
        let num = 0
        Object.keys(properties).forEach((key) => {
            if (!pat.test(key)) {
                data.push({
                    key: String(num++),
                    name: key.substr(key.indexOf('_') + 1, key.length),
                    content: String.fromCharCode(properties[key]._value)
                })
            }
        })
        if (!data.length) {
            pat = /[a-z]/
            num = 0
            Object.keys(properties).forEach((key) => {
                if (!pat.test(key)) {
                    const content = properties[key]._value
                    if (content) {
                        data.push({
                            key: String(num++),
                            name: key.substr(key.indexOf('_') + 1, key.length),
                            content
                        })
                    }
                }
            })
            if ( !data.length) {
                this.closeVisible()
            }
            this.isLoading = false
        }
    }
    // 调整窗体位置
    setWindowPosition = (panelLeft, panelTop) => {
        const cesiumContainerDom = document.getElementById('cesiumContainer') as HTMLElement
        const cesiumContainerWidth = cesiumContainerDom ? cesiumContainerDom.clientWidth : 0
        const cesiumContainerHeight = cesiumContainerDom ? cesiumContainerDom.clientHeight : 0
        const attributePanelWidth = 320
        const attributePanelHeight = 370
        let panelLocation = {
            panelLeft,
            panelTop
        }
        if (!panelLeft || !panelTop) {
            return panelLocation = {
                panelLeft : 10,
                panelTop : 10
            }
        }
        if ((panelLeft + attributePanelWidth) >= cesiumContainerWidth) {
            panelLocation.panelLeft = panelLeft - attributePanelWidth
        }
        if ((panelTop + attributePanelHeight) >= cesiumContainerHeight) {
            panelLocation.panelTop = panelTop - attributePanelHeight
        }
        return panelLocation
    }
    // loading
    setLoading = () => {
        if (this.isLoading && data.length === 0) {
            const panelDom = document.getElementsByClassName('ant-table-wrapper')[0] as HTMLElement
            const loadingLabel = document.getElementsByClassName('ant-empty-description')[0] as HTMLElement
            if (panelDom) {
                panelDom.style.padding = '80px 0'
            }
            if (loadingLabel) {
                loadingLabel.innerHTML = 'Loading...'
            }
        }
    }
    render() {
        // 调整属性窗体位置
        const windowPosition = this.setWindowPosition(this.props.panelLeft, this.props.panelTop)
        // 增加加载loading
        this.setLoading()
        return (
            <div className= 'dkAttributePanel' style={{left: windowPosition.panelLeft, top: windowPosition.panelTop}}>
                <div className='dkAttributePanelTitle'><span>属性信息</span><Icon type='close' onClick={this.closeVisible} style={{position: 'absolute', right: '10px', top: '10px', zIndex: 10, opacity: 0.5}} /></div>
                <div className='dkAttributePanelBody'><Table columns={columns} dataSource={data} showHeader={false} pagination={false} scroll={{y: 320}} loading = {this.isLoading}/></div>
            </div>
        )
    }
}
