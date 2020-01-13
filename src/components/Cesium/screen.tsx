import * as React from 'react'
import {
    Button,
    Row,
    Col,
    Form,
    Upload,
    Icon,
    message
} from 'antd'
import {
    GeoJsonDataSource,
    Color,
    Math as CesiumMath
} from 'cesium'
import { FormComponentProps } from 'antd/lib/form/Form'
import dev from '@config/dev.config'
// import IndexAction from '@api/IndexAction'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
// import VectorTileManager from './VectorTileManager'

import LoadingTip from '@components/LoadingTip'
import './index.less'
interface IProps extends FormComponentProps {
    form: any,
    closeScreen: any,
    reloadEntry: any,
    viewer: any,
    stores?: any,
    openSpin: any,
    closeSpin: any,
    vectorTileManager: any,
}

interface IState {
    isUpload: boolean,
    fileList: any[],
    fileList1: any[],
    sfileList1: any[],
    sfileList2: any[],
    sfileList3: any[],
    sfileList4: any[],
    clipData: string,
    clipData1: string,
    sassafras1: string,
    sassafras2: string,
    sassafras3: string,
    sassafras4: string,
    flag: boolean,
    spinning: boolean,
}
@inject('stores')
@observer
class Screen extends React.Component<IProps, IState> {
    state = {
        isUpload: false,
        fileList: [],
        fileList1: [],
        sfileList1: [],
        sfileList2: [],
        sfileList3: [],
        sfileList4: [],
        clipData: '',
        clipData1: '',
        sassafras1: '',
        sassafras2: '',
        sassafras3: '',
        sassafras4: '',
        flag: true,
        spinning: false,
    }
    // vectorTileManager = new VectorTileManager()
    reloadClip = (data, callback) => {
        this.props.vectorTileManager.removeVectorTileLayer(this.props.viewer)
        if (callback) {
            this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, data, {
                // outlineColor: '#f00',
                outline: false,
                lineWidth: 0,
                fill: true,
                tileCacheSize: 500,
                fillColor: Color.PINK,
            }, null, callback)
        } else {
            this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, data, {
                // outlineColor: '#f00',
                outline: false,
                lineWidth: 0,
                fill: true,
                tileCacheSize: 500,
                fillColor: Color.PINK,
            })
        }
    }
    reloadS = (data) => {
        this.props.vectorTileManager.removeVectorTileLayer(this.props.viewer)
        this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, data, {
            outline: false,
            lineWidth: 0,
            fill: true,
            tileCacheSize: 500,
            fillColor: '#f00'
        }, null, () => {
            this.setState({
                spinning: false
            })
            this.props.form.resetFields()
            this.props.closeScreen()
        })
    }
    addClip = (name, data, callback, color: any = Color.PINK) => {
        this.props.vectorTileManager.removeOneVectorTileLayer(this.props.viewer, name)
        if (callback) {
            this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, data, {
                outlineColor: color,
                outline: true,
                lineWidth: 1,
                fill: false,
                tileCacheSize: 500,
                fillColor: color,
            }, null, callback, name)
        } else {
            this.props.vectorTileManager.setVectorTileLayerProvider(this.props.viewer, data, {
                outlineColor: color,
                outline: true,
                lineWidth: 1,
                fill: false,
                tileCacheSize: 500,
                fillColor: color,
            }, null, null, name)
        }
    }

    reloadClipEntry = (type, data) => {
        let color
        const dataSources = this.props.viewer.dataSources
        const len = dataSources.length
        if (len > 0) {
            for (let n = 0; n < len; n++) {
                dataSources._dataSources.forEach((item) => {
                    if (item._name === 'clip') {
                        dataSources.remove(dataSources.get(0))
                    }
                })
            }
        }
        if (type === '1') {
            color = Color.PINK.withAlpha(1)
        } else {
            color = Color.RED.withAlpha(1)
        }
        GeoJsonDataSource.load(data, {
            stroke: Color.RED.withAlpha(1),
            fill: color,
            strokeWidth: 10,
            clampToGround: true,
            markerSymbol: '?'

        }).then((ds) => {
            ds.name = 'clip'
            this.props.viewer.dataSources.add(ds)
            this.props.viewer.flyTo(ds, {
                offset: {
                    heading: CesiumMath.toRadians(0),
                    pitch: CesiumMath.toRadians(-90)
                }
            }).then(() => {
                this.props.viewer.flyTo(ds, {
                    offset: {
                        heading: CesiumMath.toRadians(0),
                        pitch: CesiumMath.toRadians(-15)
                    },
                    duration: 1.0
                })
                // addMapLabel(this.state.viewer, require('./images/label.png'), `${dev.mapUrl}/arcgis/rest/services/wqxdkwfs/MapServer/exts/GeoJSONServer/GeoJSON?query=&layer=0&bbox=&bboxSR=&f=geojson`, 'WQ_label')
            })
        })
    }
    reloadSsaafrasEntry = (type, data) => {
        let color
        const dataSources = this.props.viewer.dataSources
        const len = dataSources.length
        if (len > 0) {
            for (let n = 0; n < len; n++) {
                dataSources._dataSources.forEach((item) => {
                    if (item._name === 'ssaafras') {
                        dataSources.remove(dataSources.get(0))
                    }
                })
            }
        }
        if (type === '1') {
            color = Color.PINK.withAlpha(1)
        } else {
            color = Color.RED.withAlpha(1)
        }
        GeoJsonDataSource.load(data, {
            stroke: Color.RED.withAlpha(1),
            fill: color,
            strokeWidth: 10,
            clampToGround: true,
            markerSymbol: '?'

        }).then((ds) => {
            ds.name = 'ssaafras'
            this.props.viewer.dataSources.add(ds)
            this.props.viewer.flyTo(ds, {
                offset: {
                    heading: CesiumMath.toRadians(0),
                    pitch: CesiumMath.toRadians(-90)
                }
            }).then(() => {
                this.props.viewer.flyTo(ds, {
                    offset: {
                        heading: CesiumMath.toRadians(0),
                        pitch: CesiumMath.toRadians(-15)
                    },
                    duration: 1.0
                })
                // addMapLabel(this.state.viewer, require('./images/label.png'), `${dev.mapUrl}/arcgis/rest/services/wqxdkwfs/MapServer/exts/GeoJSONServer/GeoJSON?query=&layer=0&bbox=&bboxSR=&f=geojson`, 'WQ_label')
            })
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            spinning: true
        })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let layerName = ''
                for (const key in values) {
                    if (values[key]) {
                        layerName = key
                    }
                }
                for (const layer in values) {
                    if (values[layer] && values[layer].file.response.status === 200) {
                        let color
                        if (layer === 'layer') {
                            color = Color.PINK
                        } else if (layer === 'layer1') {
                            color = Color.CORNSILK
                        } else if (layer === 'chlayer') {
                            color = Color.RED
                        } else if (layer === 'chlayer1') {
                            color = Color.CRIMSON
                        } else if (layer === 'chlayer2') {
                            color = Color.DARKRED
                        } else if (layer === 'chlayer3') {
                            color = Color.FIREBRICK
                        }

                        if (layerName === layer) {
                            this.addClip(layer, values[layer].file.response.data, () => {
                                this.props.closeScreen()
                                this.setState({
                                    spinning: false
                                })
                            }, color)
                        } else {
                            this.addClip(layer, values[layer].file.response.data, null, color)
                        }
                    }
                }
                /* values.layer && values.layer.file.response.status === 200 && this.addClip('layer', values.layer.file.response.data, null, Color.PINK)
                values.layer1 && values.layer1.file.response.status === 200 && this.addClip('layer1', values.layer1.file.response.data, null, Color.CORNSILK)
                values.chlayer && values.chlayer.file.response.status === 200 && this.addClip('chlayer', values.chlayer.file.response.data, null, Color.RED)
                values.chlayer1 && values.chlayer1.file.response.status === 200 && this.addClip('chlayer1', values.chlayer1.file.response.data, null, Color.CRIMSON)
                values.chlayer2 && values.chlayer2.file.response.status === 200 && this.addClip('chlayer2', values.chlayer2.file.response.data, null, Color.DARKRED)
                values.chlayer3 && values.chlayer3.file.response.status === 200 && this.addClip('chlayer3', values.chlayer3.file.response.data, null, Color.FIREBRICK) */

                /* if (this.state.clipData && this.state.sassafras1) {
                    // this.reloadClipEntry('1', this.state.clipData)
                    this.reloadClip(this.state.clipData, null)
                    this.reloadS(this.state.sassafras1)
                } else if (this.state.clipData) {
                    this.reloadClip(this.state.clipData, () => {
                        this.setState({
                            spinning: false
                        })
                        this.props.form.resetFields()
                        this.props.closeScreen()
                    })
                } else {
                    this.setState({
                        spinning: false
                    })
                } */
            }
        })
    }

    sassafras = (type, filesa) => {
        const { file, fileList } = filesa
        this.setState({
            flag: true
        })
        if (file.status === 'done') {
            if (file.response.status === 200) {
                const arr: any = [{}]
                arr.fill(fileList[fileList.length - 1])
                if (type === 1) {
                    this.setState({
                        sfileList1: arr,
                        sassafras1: file.response.data,
                        flag: false
                    })
                } else if (type === 2) {
                    this.setState({
                        sfileList2: arr,
                        sassafras2: file.response.data,
                        flag: false
                    })
                } else if (type === 3) {
                    this.setState({
                        sfileList3: arr,
                        sassafras3: file.response.data,
                        flag: false
                    })
                } else if (type === 4) {
                    this.setState({
                        sfileList4: arr,
                        sassafras4: file.response.data,
                        flag: false
                    })
                }
                message.success('上传成功！')
            } else {
                message.error(file.response.msg)
                this.setState({
                    sfileList1: []
                })
            }
            return
        } else {
            if (type === 1) {
                this.setState({ sfileList1: fileList })
            } else if (type === 2) {
                this.setState({ sfileList2: fileList })
            } else if (type === 3) {
                this.setState({ sfileList3: fileList })
            } else if (type === 4) {
                this.setState({ sfileList4: fileList })
            }
        }

    }
    // 裁剪图层上传
    clipUpload = (type, files) => {
        const { file, fileList } = files
        this.setState({
            flag: true
        })

        if (file.status === 'done') {
            if (file.response.status === 200) {
                const arr: any = [{}]
                arr.fill(fileList[fileList.length - 1])
                if (type === 1) {
                    this.setState({
                        fileList: arr,
                        isUpload: true,
                        clipData: file.response.data,
                        flag: false
                    })
                } else {
                    this.setState({
                        fileList1: arr,
                        isUpload: true,
                        clipData: file.response.data,
                        flag: false
                    })
                }
                message.success('上传成功！')
            } else {
                this.setState({
                    fileList: []
                })
                message.error(file.response.msg)
            }
            return
        } else {
            if (type === 1) {
                this.setState({
                    fileList
                })
            } else {
                this.setState({
                    fileList1: fileList
                })
            }
        }
    }

    cancel = () => {
        this.props.closeScreen()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { mapStore } = this.props.stores
        const info = toJS(mapStore.projectInfo)
        return (
            <>
                <Form labelCol={{ span: 7 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
                    <div style={{ padding: '0 0 24px 0px', fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)' }}>
                        <span style={{ color: '#f00' }}>* </span>请提前将上传数据空间参考转换为：CGCS-2000地理坐标系
                    </div>
                    <Row>
                        <Col>
                            相交图层
                        </Col>
                    </Row>
                    <Form.Item label='范围图层'>
                        {getFieldDecorator('layer', {
                            rules: [
                                { required: true, message: '' }
                            ]
                        })(<Upload
                            action={dev.url + `/plot/upload/1?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                            name='file'
                            withCredentials={true}
                            showUploadList={{
                                showPreviewIcon: false,
                                showRemoveIcon: true,
                                showDownloadIcon: false
                            }}
                            accept='.zip'
                            fileList={this.state.fileList}
                            onChange={this.clipUpload.bind(this, 1)}
                        >
                            <Button>
                                <Icon type='upload' /> 上传
                            </Button>
                        </Upload>)}
                    </Form.Item>
                    {
                        info.xmlxdm === '1' ?
                            < Form.Item label='建设用地管制区'>
                                {getFieldDecorator('layer1', {

                                })(<Upload
                                    action={dev.url + `/plot/upload/2?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                    name='file'
                                    withCredentials={true}
                                    showUploadList={{
                                        showPreviewIcon: false,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false
                                    }}
                                    accept='.zip'
                                    fileList={this.state.fileList1}
                                    onChange={this.clipUpload.bind(this, 2)}
                                >
                                    <Button>
                                        <Icon type='upload' /> 上传
                            </Button>
                                </Upload>)}
                            </Form.Item> :
                            < Form.Item label='规划数据'>
                                {getFieldDecorator('layer1', {

                                })(<Upload
                                    action={dev.url + `/plot/upload/2?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                    name='file'
                                    withCredentials={true}
                                    showUploadList={{
                                        showPreviewIcon: false,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false
                                    }}
                                    accept='.zip'
                                    fileList={this.state.fileList1}
                                    onChange={this.clipUpload.bind(this, 2)}
                                >
                                    <Button>
                                        <Icon type='upload' /> 上传
                                </Button>
                                </Upload>)}
                            </Form.Item>
                    }
                    <Row>
                        <Col>
                            去除图层
                        </Col>
                    </Row>
                    {
                        info.xmlxdm === '1' ?
                            <>
                                <Form.Item label='基本农田保护图斑'>
                                    {getFieldDecorator('chlayer', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/11?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList4}
                                        onChange={this.sassafras.bind(this, 4)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                                <Form.Item label='历年实施范围线'>
                                    {getFieldDecorator('chlayer1', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/12?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList1}
                                        onChange={this.sassafras.bind(this, 1)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                                <Form.Item label='生态红线'>
                                    {getFieldDecorator('chlayer2', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/13?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList2}
                                        onChange={this.sassafras.bind(this, 2)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                                <Form.Item label='林业范围线'>
                                    {getFieldDecorator('chlayer3', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/14?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList3}
                                        onChange={this.sassafras.bind(this, 3)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                            </> : <>
                                <Form.Item label='历年范围线'>
                                    {getFieldDecorator('chlayer', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/11?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList1}
                                        onChange={this.sassafras.bind(this, 1)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                                <Form.Item label='生态保护区'>
                                    {getFieldDecorator('chlayer1', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/12?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList2}
                                        onChange={this.sassafras.bind(this, 2)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                                <Form.Item label='林业范围线'>
                                    {getFieldDecorator('chlayer2', {

                                    })(<Upload
                                        action={dev.url + `/plot/upload/13?projectId=XM${info.processInstanceId}&bgcs=${info.bgcs}&layName=ZYTK`}
                                        name='file'
                                        withCredentials={true}
                                        showUploadList={{
                                            showPreviewIcon: false,
                                            showRemoveIcon: true,
                                            showDownloadIcon: false
                                        }}
                                        accept='.zip'
                                        fileList={this.state.sfileList3}
                                        onChange={this.sassafras.bind(this, 3)}
                                    >
                                        <Button disabled={!this.state.isUpload}>
                                            <Icon type='upload' /> 上传
                                        </Button>
                                    </Upload>)}
                                </Form.Item>
                            </>}
                    {/*  <Form.Item label='筛选条件选择'>
                        {getFieldDecorator('condition', {

                        })(
                            <div>
                                <Radio.Group>
                                    <Radio value={1}>条件一</Radio>
                                    <Radio value={2}>条件二</Radio>
                                    <Radio value={3}>条件三</Radio>
                                </Radio.Group>
                            </div>
                        )}
                    </Form.Item> */}
                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type='primary' htmlType='submit' disabled={this.state.flag}>
                                预览
                            </Button>
                            <Button type='primary' onClick={this.cancel} style={{ marginLeft: '6px' }}>
                                取消
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {this.state.spinning ? <LoadingTip title='正在加载，请稍后......' /> : null}
            </>
        )
    }
}

const WrappedApp = Form.create<IProps>({ name: 'coordinated' })(Screen)
export default WrappedApp