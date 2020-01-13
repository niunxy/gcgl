import * as React from 'react'
import { Dropdown, Menu, Icon, Divider } from 'antd'
import {
    measureDistanceTool,
    measureSurfaceTool,
    markPointTool,
    // markLineTool,
    // standardPlaneTool,
    drawPolygons,
    drawLineString
} from './tool'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { shouldCreate } from '@utils/utils'

import './index.less'
import distanceSvg from '../../../public/images/icon_distance.svg'
import areaSvg from '../../../public/images/icon_area.svg'
import pointSvg from '../../../public/images/icon_point.svg'
import lineSvg from '../../../public/images/icon_line.svg'
import polygonSvg from '../../../public/images/icon_polygon.svg'

interface IProps extends RouteComponentProps {
    viewer: any,
    type?: any,
    subContract?: any,
    stores?: any,
}

interface IState {
    dlmEntities: any[],
    entities: any[],
    screenFlag: boolean,
    subcontractFlag: boolean,
}

@inject('stores')
@observer
class ToolBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            dlmEntities: [],
            entities: [],
            subcontractFlag: false,
            screenFlag: false,
        }
    }
    createProject = () => {
        this.props.history.push('/index/map/createProject/0')
    }
    // 测距
    measureDistanceTool = (viewer, entities) => {

        this.clearLine(viewer, entities)
        measureDistanceTool(viewer, (entity) => {
            this.setState({
                entities: entity
            })
        })
    }

    clearLine = (viewer, entities) => {
        entities.length > 0 && entities.forEach((item) => {
            viewer.entities.remove(item)
        })
        this.setState({
            entities: []
        })
    }

    // 测面
    measureSurfaceTool = (viewer, entities) => {
        this.clearArea(viewer, entities)
        measureSurfaceTool(viewer, (entity) => {
            this.setState({
                entities: entity
            })
        })
    }

    clearArea = (viewer, entities) => {
        entities.length > 0 && entities.forEach((item) => {
            viewer.entities.remove(item)
        })
        this.setState({
            entities: []
        })
    }

    // 标点
    markPointTool = (viewer, e) => {
        e.preventDefault()
        markPointTool(viewer, (entity) => {
            this.setState({
                dlmEntities: [...this.state.dlmEntities, entity]
            })
        })
    }

    addEntity = (entity) => {
        this.setState({
            dlmEntities: [...this.state.dlmEntities, entity]
        })
    }

    // 绘线
    drawPolylineTool = (viewer) => {
        drawLineString(viewer, (entity) => {
            this.setState({
                dlmEntities: [...this.state.dlmEntities, entity]
            })
        })
    }

    // 绘面
    drawPolygonTool = (viewer) => {
        drawPolygons(viewer, (entity) => {
            this.setState({
                dlmEntities: [...this.state.dlmEntities, entity]
            })
        })
    }

    renderMenu = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.measureDistanceTool.bind(this, this.props.viewer, this.state.entities)}>
                        <Icon component={distanceSvg} style={{ fontSize: '16px' }} />&ensp;|&ensp;测距
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.measureSurfaceTool.bind(this, this.props.viewer, this.state.entities)}>
                        <Icon component={areaSvg} style={{ fontSize: '16px' }} />&ensp;|&ensp;测面
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.markPointTool.bind(this, this.props.viewer)}>
                        <Icon component={pointSvg} style={{ fontSize: '16px' }} />&ensp;|&ensp;标点
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.drawPolylineTool.bind(this, this.props.viewer)}>
                        <Icon component={lineSvg} style={{ fontSize: '16px' }} />&ensp;|&ensp;绘线
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.drawPolygonTool.bind(this, this.props.viewer)}>
                        <Icon component={polygonSvg} style={{ fontSize: '16px' }} />&ensp;|&ensp;绘面
                    </a>
                </Menu.Item>
                {/*<Menu.Item>
                    <a target='_blank' rel='noopener noreferrer'>
                        <Icon type='clock-circle' />多时相
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target='_blank' rel='noopener noreferrer' onClick={this.clearLine.bind(this, this.props.viewer, this.state.dlmEntities)}>
                        <Icon type='delete' />清空
                    </a>
                </Menu.Item>*/}
            </Menu>
        )
    }

    subcontract = () => {
        this.props.subContract()
    }

    handleExport = () => {
        this.printScreenScene(this.props.viewer, 'Image')
    }

    printScreenScene = (viewer, filename) => {
        let image
        viewer.render()
        image = viewer.scene.canvas.toDataURL('image/jpeg')
        this.saveFile(image, filename)
    }

    saveFile = (data, filename) => {
        const saveLink = document.createElement('a')
        saveLink.href = data
        saveLink.download = filename
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        saveLink.dispatchEvent(event)
    }
    // 清空
    clearAll = (viewer) => {
        const { mapStore } = this.props.stores
        viewer.entities.removeAll()
        // 清空分包时画的多边形
        mapStore.onClearParcelPoly()
    }



    render() {
        return (
            <div style={{ position: 'absolute', right: '10px', top: '10px', backgroundColor: '#fff', padding: '6px 10px', zIndex: 10, borderRadius: '3px' }} className='toolBox'>
                {shouldCreate() ? (<span>
                    <Icon type='project' style={{ color: '#666666' }} />
                    <a style={{ marginLeft: '6px' }} onClick={this.createProject}>创建项目</a>
                </span>) : null}
                {shouldCreate() ? <Divider type='vertical' /> : null}
                {/* {this.props.type ? (<span>
                    <Icon type='star' style={{ color: '#fff' }} />
                    <a style={{ marginLeft: '6px' }} onClick={this.subcontract}>地块分包</a>
                </span>) : null}
                {this.props.type ? <Divider type='vertical' /> : null} */}
                <Dropdown overlay={this.renderMenu()}>
                    <a className='ant-dropdown-link'>
                        <Icon type='tool' style={{ color: '#666666' }} />工具 <Icon type='down' />
                    </a>
                </Dropdown>
                <Divider type='vertical' />
                <span>
                    <Icon type='download' style={{ color: '#666666' }} />
                    <a style={{ marginLeft: '6px' }} onClick={this.handleExport}>导出</a>
                </span>
                <Divider type='vertical' />
                <span>
                    <Icon type='delete' style={{ color: '#666666' }} />
                    <a style={{ marginLeft: '6px' }} onClick={this.clearAll.bind(this, this.props.viewer)}>清空</a>
                </span>
            </div>
        )
    }
}
export default withRouter(ToolBar)