import * as React from 'react'
import './timeline.less'
import TimelineClass from '../CesiumTools/Timeline'
import timeline_marker from '../../../../../public/images/timeline_marker.png'
import timeline_node from '../../../../../public/images/timeline_node.png'
interface IProps {
    viewer : any
}
interface IState {
    panelIsShow: boolean,
    viewerProped: boolean,
    timelineIsPlay: boolean,
    panelToggle: string
}
export default class Timeline extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            viewerProped: false,
            timelineIsPlay: false, // 时间轴是否播放的标识，true表示当前状态为正在播放，false为暂停状态
            panelIsShow: true, // 时间轴面板隐藏显示
            panelToggle: 'block'
        }
    }
    timeline // 时间轴对象

    componentWillReceiveProps(nextProps) {
        const that = this
        if (!that.state.viewerProped) {
            that.timeline = new TimelineClass(nextProps.viewer) // 创建时间轴对象
            that.timeline.initTimeline(that.timeline) // 初始化时间轴
            that.setState({
                viewerProped: true
            })
        }

    }

    render() {
        return (
            <div id = 'panel'>
                <div className='panel_switch' onClick={this.toggleTimelinePanel.bind(this)}/>
                <div className='timeline_panel' style={{display: this.state.panelToggle}}>
                    <div className='timeline_left'>
                        <span className='startBtn active play' onClick={this.startPlay.bind(this)}/>
                        <span className='play'>播放速度:</span>
                        <div className='playSpeed_select'>
                            <select className='form-control playSpeed_value' onChange={this.getPlaySeed}>
                                <option value='1000' selected>低</option>
                                <option value='2000'>中</option>
                                <option value='3000'>高</option>
                            </select>
                        </div>
                    </div>
                    <div className='timeline_right'>
                        <span className='timeline_startTime'>开始时间:</span>
                        <span className='timeline_startTimeValue' id='itemStartDate'>2019-01-01</span>
                        <span className='timeline_endTime'>结束时间:</span>
                        <span className='timeline_endTimeValue' id='itemEndDate'>2019-10-10</span>
                    </div>
                    <div className='processBox'>
                        <div className='processBox_top'/>
                        <div className='lx nr' id='timeline_lx'>
                            <span className='processName lxName'>立项</span>
                            <img src={timeline_marker} id='lx_marker'/>
                            <div className='lx_processBar'>
                                <div className='lx_process_go' style={{width: '0px'}}/>
                                <div className='lx_process' style={{width: '0px'}}/>
                            </div>
                            <span className='proTime lx_time' id='lxStartDate'>2019-01-01</span>
                            <div className='itemNode' id='sdtk'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>实地<br/>踏勘</p>
                                </div>
                            </div>
                            <div className='itemNode' id='xmbb'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>项目<br/>报备</p>
                                </div>
                            </div>
                            <div className='itemNode' id='lxwc'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>立项<br/>完成</p>
                                </div>
                            </div>
                        </div>
                        <div className='sj nr' id='timeline_sj'>
                            <span className='processName sjName'>设计</span>
                            <img src={timeline_marker} id='sj_marker'/>
                            <div className='sj_processBar'>
                                <div className='sj_process_go' style={{width: '0px'}}/>
                                <div className='sj_process' style={{width: '0px'}}/>
                            </div>
                            <span className='proTime sj_time' id='sjStartDate'>2019-02-06</span>
                            <div className='itemNode' id='wcsjtz'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>完成设计<br/>图纸</p>
                                </div>
                            </div>
                            <div className='itemNode' id='sjgcljs'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>设计工程<br/>量计算</p>
                                </div>
                            </div>
                        </div>
                        <div className='sg nr' id='timeline_sg'>
                            <span className='processName sgName'>施工</span>
                            <img src={timeline_marker} id='sg_marker'/>
                            <div className='sg_processBar'>
                                <div className='sg_process_go' style={{width: '0px'}}/>
                                <div className='sg_process' style={{width: '0px'}}/>
                            </div>
                            <span className='proTime sg_time' id='sgStartDate'>2019-03-15</span>
                            <div className='itemNode' id='sgqcl'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>施工前<br/>测量</p>
                                </div>
                            </div>
                            <div className='itemNode' id='dlsg'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>道路<br/>施工</p>
                                </div>
                            </div>
                            <div className='itemNode' id='gdsg'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>管道<br/>施工</p>
                                </div>
                            </div>
                            <div className='itemNode' id='fswzz'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>附属物<br/>栽种</p>
                                </div>
                            </div>
                            <div className='itemNode' id='jgcl'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>竣工<br/>测量</p>
                                </div>
                            </div>
                        </div>
                        <div className='ys nr' id='timeline_ys'>
                            <span className='processName ysName'>验收</span>
                            <img src={timeline_marker} id='ys_marker'/>
                            <div className='ys_processBar'>
                                <div className='ys_process_go' style={{width: '0px'}}/>
                                <div className='ys_process' style={{width: '0px'}}/>
                            </div>
                            <span className='proTime ys_time ' id='ysStartDate'>2019-08-15</span>
                            <span className='ys_endTime' id='ysEndDate'>2019-09-16</span>
                            <div className='itemNode' id='ystzcl'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>验收图纸<br/>测量</p>
                                </div>
                            </div>
                            <div className='itemNode' id='ysgclhs'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>验收工程<br/>量核算</p>
                                </div>
                            </div>
                            <div className='itemNode' id='yswc'>
                                <div>
                                    <img src={timeline_node} alt='itemNodeImg' className='nodeTip'/>
                                    <p className='nodeContent'>验收<br/>完成</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    toggleTimelinePanel = () => {
        const btn = document.getElementsByClassName('panel_switch')[0] as HTMLElement
        if (this.state.panelIsShow) {
            this.setState({
                panelIsShow: false,
                panelToggle: 'none'
            })
            btn.className = 'panel_switch panel_close'
        } else {
            this.setState({
                panelIsShow: true,
                panelToggle: 'block'
            })
            btn.className = 'panel_switch'
        }
    }

    // timeline播放暂停按钮
    startPlay = () => {
        const that = this
        const playState = this.state.timelineIsPlay
        if (!that.timeline) {
            return
        }
        // @ts-ignore
        if (playState) {// 目前处于播放状态，点击后暂停
            document.getElementsByClassName('startBtn')[0].setAttribute('class', 'startBtn active play')
        } else {
            document.getElementsByClassName('startBtn')[0].setAttribute('class', 'startBtn play')
        }
        that.timeline.runTimeline(that.timeline, playState, () => {
            that.setState({
                timelineIsPlay : !that.state.timelineIsPlay
            })
        })

        that.setState({
            timelineIsPlay : !this.state.timelineIsPlay
        })
    }
    // 倍速播放
    getPlaySeed = (event) => {
        if (this.timeline) {
            this.timeline.switchPlaySpeed(this.timeline, event.target.value)
        }
    }
}
