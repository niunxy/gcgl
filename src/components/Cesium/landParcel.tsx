import * as React from 'react'
import {
    Divider,
    // Icon,
    Button,
    Radio,
    message,
    Modal
} from 'antd'
import { drawRect, circleDraw, drawPoints, drawLineString, drawPoly, cartesian3ToWGS84 } from './tool'
import {
    Color,
    GeoJsonDataSource,
    BoundingSphere,
    Ellipsoid,
    HeightReference
} from 'cesium'
import {
    // bboxPolygon, 
    polygon,
    booleanOverlap,
} from '@turf/turf'
import IndexAction from '@api/IndexAction'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'

import './index.less'
const { confirm } = Modal
interface IProps {
    viewer: any,
    allEntities: any,
    stores?: any,
}

interface IState {

}

@inject('stores')
@observer
export default class LandParcel extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }
    state = {
        parcelFlag: false,
        turfArr: [],
        contractorList: [],
        gcd: '',
        points: [],
        content: '保存后流程将进入下一个阶段！',
        flag: true
    }

    parcelHandel = () => {
        this.setState({
            parcelFlag: false
        })
    }

    showParcel = () => {
        this.setState({
            parcelFlag: !this.state.parcelFlag
        })
    }
    // 矩形
    rect = () => {
        const { mapStore } = this.props.stores
        drawRect(this.props.viewer, (positions) => {
            const wgs84Positions: any = []
            const points: any = []
            const firstPoints: any = {}
            const secondPoints: any = {}
            const threePoints: any = {}
            const fourPoints: any = {}
            for (const position of positions) {
                const wgs84Point = cartesian3ToWGS84({
                    x: position.x,
                    y: position.y,
                    z: position.z
                })
                wgs84Positions.push(wgs84Point)
            }
            /* const bbox = bboxPolygon([wgs84Positions[0].lat, wgs84Positions[0].lng, wgs84Positions[1].lat, wgs84Positions[1].lng])
            console.log(wgs84Positions) */
            firstPoints.x = wgs84Positions[0].lng
            firstPoints.y = wgs84Positions[0].lat
            secondPoints.x = wgs84Positions[1].lng
            secondPoints.y = wgs84Positions[0].lat
            threePoints.x = wgs84Positions[1].lng
            threePoints.y = wgs84Positions[1].lat
            fourPoints.x = wgs84Positions[0].lng
            fourPoints.y = wgs84Positions[1].lat
            points.push(firstPoints)
            points.push(secondPoints)
            points.push(threePoints)
            points.push(fourPoints)
            const arr = [...this.state.points, points]
            mapStore.onSaveParcelPoly(arr)
            this.setState({
                points: arr
            })
            /* this.createAllEntitiesTurf()
            this.filterPlot(bbox, (value) => {
                console.log(value)
            }) */
        })
    }
    // 圆
    circleDraw = () => {
        circleDraw(this.props.viewer, (positions) => {
            const wgs84Positions: any = []
            const arr: any = []
            const finalArr: any = []
            const positionArr: any = []
            for (let i = 0; i < positions.length; i++) {
                if ((i + 1) % 3 === 0) {
                    arr.push(positions[i])
                    finalArr.push(JSON.parse(JSON.stringify(arr)))
                    arr.length = 0
                } else {
                    arr.push(positions[i])
                }
            }
            for (const j of finalArr) {
                const obj = {
                    x: 0,
                    y: 0,
                    z: 0
                }
                for (let k = 0; k < j.length; k++) {
                    if (k === 0) {
                        obj.x = j[k]
                    } else if (k === 1) {
                        obj.y = j[k]
                    } else if (k === 2) {
                        obj.y = j[k]
                        positionArr.push(obj)
                    }
                }
            }
            for (const position of positionArr) {
                const wgs84Point = cartesian3ToWGS84({
                    x: position.x,
                    y: position.y,
                    z: position.z
                })
                wgs84Positions.push(wgs84Point)
            }
            console.log(wgs84Positions)
        })
    }
    // 多边形
    drawPolygons = () => {
        const { mapStore } = this.props.stores
        drawPoly(this.props.viewer, null, (positions) => {
            const wgs84Positions: any = []
            const points: any = []
            positions.splice(positions.length - 1, 1)
            for (const position of positions) {
                const wgs84Point = cartesian3ToWGS84({
                    x: position.x,
                    y: position.y,
                    z: position.z
                })
                wgs84Positions.push(wgs84Point)
            }
            for (const i of wgs84Positions) {
                const obj: any = {}
                obj.x = i.lng
                obj.y = i.lat
                points.push(obj)
            }
            const arr = [...this.state.points, points]
            mapStore.onSaveParcelPoly(arr)
            this.setState({
                points: arr
            })
        })
    }
    // 点
    drawPoints = () => {
        drawPoints(this.props.viewer, (positions) => {
            const wgs84Positions: any = []
            for (const position of positions) {
                const wgs84Point = cartesian3ToWGS84({
                    x: position.x,
                    y: position.y,
                    z: position.z
                })
                wgs84Positions.push(wgs84Point)
            }
            console.log(wgs84Positions)
        })
    }

    // 线
    drawLine = () => {
        drawLineString(this.props.viewer, (positions) => {
            const wgs84Positions: any = []
            for (const position of positions) {
                const wgs84Point = cartesian3ToWGS84({
                    x: position.x,
                    y: position.y,
                    z: position.z
                })
                wgs84Positions.push(wgs84Point)
            }
            console.log(wgs84Positions)
        })
    }

    createAllEntitiesTurf = () => {
        const turfArr: any = []
        this.props.allEntities && this.props.allEntities.forEach((item: any) => {
            const polyArr: any = []
            item.polygon.hierarchy._value.positions.forEach((value) => {
                const arr: any = []
                const wgs84Point: any = cartesian3ToWGS84({
                    x: value.x,
                    y: value.y,
                    z: value.z
                })
                arr.push(wgs84Point.lat)
                arr.push(wgs84Point.lng)
                polyArr.push(arr)
            })
            const poly = polygon([polyArr])
            turfArr.push(poly)
        })
        this.setState({
            turfArr
        })
    }

    filterPlot = (poly, callback) => {
        const filterPlot = this.state.turfArr.find((item) => {
            return booleanOverlap(item, poly)
        })
        callback(filterPlot)

    }

    getContractor = () => {
        IndexAction.PlotContractor(null).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    contractorList: res.data
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    getPerson = (e) => {
        this.setState({
            gcd: e.target.value
        })
    }

    dispatchHandle = () => {
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        const polygons = toJS(mapStore.polygons)
        if (!this.state.gcd) {
            message.error('请选择工程队！')
            return
        }
        if (this.state.points.length === 0) {
            message.error('请先框选地块！')
            return
        }
        IndexAction.PlotSub({
            projectId: `XM${info.processInstanceId}`,
            bgcs: info.bgcs,
            layName: 'ZYTK',
            gcd: this.state.gcd,
            points: JSON.stringify(polygons)
        }).then((res: any) => {
            if (res.status === 200) {
                this.loadLabel(res.josnObj, res.data)
                this.setState({
                    flag: false,
                    parcelFlag: false
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    save = () => {
        const that = this
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        confirm({
            title: '您确定要保存吗?',
            // content: this.state.content,
            onOk() {
                IndexAction.PlotFinish({
                    processInstanceId: info.processInstanceId,
                    projectId: `XM${info.processInstanceId}`,
                    bgcs: info.bgcs,
                    layName: 'ZYTK'
                }).then((res: any) => {
                    if (res.status === 200) {
                        message.success(res.msg)
                        that.setState({
                            flag: true
                        })
                    }
                })
            },
            onCancel() {
                console.log()
            },
        })
    }

    calcCenterByPositions = (positions) => {
        const center = BoundingSphere.fromPoints(positions).center
        const surfaceCenter = Ellipsoid.WGS84.scaleToGeodeticSurface(center)
        return surfaceCenter
    }

    loadLabel = (data, id) => {
        const shpData = GeoJsonDataSource.load(data, {
            markerSize: 0,
            clampToGround: true,
        })
        shpData.then((dataSource) => {
            // dataSource.name = layerName
            this.props.viewer.dataSources.add(dataSource)
            const entities = dataSource.entities.values
            entities.forEach((entity: any) => {
                entity.position = this.calcCenterByPositions(entity.polygon.hierarchy._value.positions)
                const labelText: any = this.state.contractorList.find((value: any) => {
                    return value.id === id
                })
                entity.label = {

                    text: labelText.username,
                    color: Color.fromCssColorString('#f00'),
                    font: 'normal 20px MicroSoft YaHei',
                    showBackground: false,
                    // scale: 0.4,
                    heightReference: HeightReference.CLAMP_TO_GROUND,
                    /*horizontalOrigin : Cesium.HorizontalOrigin.LEFT_CLICK,*/
                    /*verticalOrigin : Cesium.VerticalOrigin.BOTTOM,*/
                    // distanceDisplayCondition: new DistanceDisplayCondition(0, 500),
                    /*disableDepthTestDistance : 1000*/

                    /*Represents a scalar value's lower and upper bound at a near distance and far distance in eye space.
                    Name    Type    Default Description
                    near    Number  0.0 optional The lower bound of the camera range.
                        nearValue   Number  0.0 optional The value at the lower bound of the camera range.
                    far Number  1.0 optional The upper bound of the camera range.
                        farValue    Number  0.0 optional The value at the upper bound of the camera range.*/
                    // scaleByDistance: new NearFarScalar(100, 2, 500, 0.0),
                }
            })
        })
    }

    componentDidMount() {
        this.getContractor()
    }

    /* componentDidUpdate() {
        this.createAllEntitiesTurf()
    } */

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        }
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        return (
            <div className='subpackage'>
                <span>
                    {/* <Icon type='share-alt' style={{ color: '#fff' }} /> */}
                    <a style={{ marginRight: '6px' }} onClick={this.rect}>矩形</a>
                </span>
                <Divider type='vertical' />
                <span>
                    <a style={{ marginRight: '6px' }} onClick={this.drawPolygons}>多边形</a>
                </span>
                <Divider type='vertical' />
                {/* <span>
                    <Icon type='share-alt' style={{ color: '#fff' }} />
                    <a style={{ marginRight: '6px' }} onClick={this.circleDraw}>圆形</a>
                </span>
                <Divider type='vertical' />
                <span>
                    <Icon type='share-alt' style={{ color: '#fff' }} />
                    <a style={{ marginRight: '6px' }} onClick={this.drawPoints}>点选</a>
                </span>
                <Divider type='vertical' />
                <span>
                    <a style={{ marginRight: '6px' }} onClick={this.drawLine}>区划筛选</a>
                </span>
                <Divider type='vertical' /> */}
                {info.xmjd === 16 ? <><span>
                    <Button type='primary' ghost style={{ marginRight: '6px' }} size='small' onClick={this.save} disabled={this.state.flag}>完成</Button>
                </span>
                    <Divider type='vertical' /></> : null}
                <span>
                    <Button type='primary' ghost onClick={this.showParcel} size='small' disabled={Number(info.xmjd) < 16}>分包</Button>
                </span>
                <div className='parcelBox' style={{ display: this.state.parcelFlag ? 'block' : 'none' }}>
                    <Radio.Group onChange={this.getPerson}>
                        {
                            this.state.contractorList.map((item: any) => {
                                return (
                                    <Radio style={radioStyle} value={item.id} key={item.id}>
                                        {item.username}
                                    </Radio>
                                )
                            })
                        }
                        <Button type='primary' onClick={this.dispatchHandle} style={{ marginTop: '6px' }}>分发</Button>
                    </Radio.Group>
                </div>
            </div>
        )
    }
}