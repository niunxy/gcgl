import * as React from 'react'
import { Checkbox, Slider, Row, Col, Icon } from 'antd'
import './index.less'
import {getProjectLayers, openLayers, closeLayers, changeLayerAlpha} from '@components/Cesium/layerLib'
/*const { Option } = Select*/
interface IProps {
    viewer: any,
    getLayers: any
}

interface IState {
    layers: object[],
    viewerProped: boolean
}
export default class Layer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            layers: [],
            viewerProped: false,
        }
    }
    /*
    * 显示隐藏图层
    */
    showLayer = (item, e) => {
        const layers = this.state.layers
        if (e.target.checked) {
            openLayers(item.layer)
            // @ts-ignore
            layers[item.index].show = true
        } else {
            closeLayers(item.layer)
            // @ts-ignore
            layers[item.index].show = false
        }
        this.setState({
            layers
        })
        this.props.getLayers(this.state.layers)
    }
    /*
    * 改变透明度
    */
    changeAlpha = (layer, alpha) => {
        changeLayerAlpha(layer, alpha / 100)
    }

    // handleUp = (index, layer) => {
    //     this.props.upLayerData(index, layer)
    //     // this.props.viewModel.raise(layer, index)
    // }
    //
    // handleDown = (index, layer) => {
    //     this.props.downData(index, layer)
    //     // this.props.viewModel.lower(layer, index)
    // }

    // switchBaseMap = (title) => {
    //     const allLayers  = this.props.allLayers
    //     const viewer = this.props.viewer
    //     this.setState({
    //         baseValue: title
    //     })
    //
    //     const imageryLayers = viewer.imageryLayers
    //     let activeLayerIndex = 0
    //     // let activeLayer: any = allLayers[activeLayerIndex]
    //     const numLayers = allLayers.length
    //     for (let i = 0; i < numLayers; ++i) {
    //         if (allLayers[i].name === 'ESRI影像底图' || allLayers[i].name === '谷歌影像底图') {
    //             activeLayerIndex = i
    //             // activeLayer = allLayers[i]
    //             // imageryLayers.remove(activeLayer, false)
    //             this.props.baseLayers.forEach((layer) => {
    //                 if (layer.name === title) {
    //                     imageryLayers.add(layer, numLayers - activeLayerIndex - 1)
    //
    //                 } else {
    //                     imageryLayers.remove(layer, false)
    //                 }
    //             })
    //             break
    //         }
    //     }
    //     this.props.changeAllLayer(title)
    // }
    //
    // isSelect = (name) => {
    //     return this.props.baseLayers.findIndex((item) => {
    //         return item.name === name
    //     })
    // }

    // getDefaultBase = () => {
    //     const len = this.props.allLayers.length
    //     const value = this.props.allLayers[len - 1].name
    //     const arr: any[] = []
    //     arr.fill(value)
    //     this.setState({
    //         baseValue: value,
    //         baseChecked: arr
    //     })
    // }
    // componentDidMount() {
    //
    // }
    componentWillReceiveProps() {
        this.props.getLayers(this.state.layers)
        if (this.props.viewer && !this.state.viewerProped) {
            getProjectLayers(this.props.viewer, (layers) => {
                this.setState({
                    layers
                })
            })
            this.setState({
                viewerProped: true
            })
        }
    }
    closeVisible = () => {
        (document.getElementById('layerPanel') as HTMLElement).style.display = 'none'
    }
    render() {
        return (
            <div className='layer' id='layerPanel' style={{width: '308px', display: 'none'}}>
                {/* <div style={{position: 'relative'}}>图层控制
                    <Icon type='close-circle' onClick={this.props.closeVisible} style={{position: 'absolute', right: '10px', top: '10px'}} />
               </div> */}
               <Icon type='close-circle' onClick={this.closeVisible} style={{position: 'absolute', right: '10px', top: '10px'}} />
                <div>
                    {
                        this.state.layers.map((item: any) => {
                            return (
                                <Row key={item.name} className='selectLayer'>
                                    <Col span={11} style={{ marginTop: '6px' }}>
                                        <Checkbox onChange={this.showLayer.bind(this, item)} checked={item.show}>
                                            {item.name}
                                        </Checkbox>
                                    </Col>

                                    {/*{this.isSelect(item.name) === -1 ? <>*/}
                                        <Col span={10}>
                                            <Slider defaultValue={100} onAfterChange={this.changeAlpha.bind(this, item.layer)} />
                                        </Col>
                                        {/*<Col span={4} offset={1}>*/}
                                        {/*    <Row style={{position: 'relative', top: '6px'}}>*/}
                                        {/*        <Col span={12}>*/}
                                        {/*            {index > 0 ? <Icon type='caret-up' onClick={this.handleUp.bind(this, index, item)} /> : null}*/}
                                        {/*        </Col>*/}
                                        {/*        <Col span={12}>*/}
                                        {/*            {index !== this.state.layers.length - 1 ? <Icon type='caret-down' onClick={this.handleDown.bind(this, index, item)} /> : null}*/}
                                        {/*        </Col>*/}
                                        {/*    </Row>*/}
                                        {/*</Col>*/}
                                    {/*</> : null}*/}
                                </Row>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}