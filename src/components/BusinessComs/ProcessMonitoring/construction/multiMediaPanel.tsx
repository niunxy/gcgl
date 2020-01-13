import React, { Component } from 'react'
import './multiMediaPanel.less'
import {Breadcrumb, Icon, Button} from 'antd'
function PanelContent(this: any, props) {
    const panelContent = props.panelContentType
    if (panelContent === 'picture') {
        return (
            <div style={{position: 'relative', height: '100%'}}>
                <img src={`http://192.168.5.112:8010/pictures/${props.picture.fileName}`}/>
                <div className='multiMediaFontContent'>
                    <p>拍摄人：{props.picture.upper}</p>
                    <p>上传时间：{props.picture.upDate}</p>
                    <p>坐标：{props.picture.location}</p>
                    <p>备注：{props.picture.markName}</p>
                </div>
                <p className='multiMediaFontContentPN'>{`第 ${props.page.picture.current}/${props.page.picture.total} 页`}</p>
            </div>
        )
    } else if (panelContent === 'audio') {
        const myAud = document.getElementById(`${props.myParent}myAudio`) as HTMLVideoElement
        if (myAud) {
            myAud.src = `http://192.168.5.112:8010/audios/${props.audio.fileName}`
            myAud.load()
        }
        return (
            <div style={{position: 'relative', height: '100%'}}>
                <audio controls id={`${props.myParent}myAudio`}  className='myAudio'>
                    <source src={`http://192.168.5.112:8010/audios/${props.audio.fileName}`} type='audio/mpeg' />
                            您的浏览器不支持 audio 元素。
                </audio>
                <div className='multiMediaFontContent'>
                    <p>拍摄人：{props.audio.upper}</p>
                    <p>上传时间：{props.audio.upDate}</p>
                    <p>坐标：{props.audio.location}</p>
                    <p>备注：{props.audio.markName}</p>
                </div>
                <p className='multiMediaFontContentPN'>{`第 ${props.page.audio.current}/${props.page.audio.total} 页`}</p>
            </div>
        )
    } else {
        const myVid = document.getElementById(`${props.myParent}myVideo`) as HTMLVideoElement
        if (myVid) {
            myVid.src = `http://192.168.5.112:8010/videos/${props.video.fileName}`
            myVid.load()
        }
        return (
            <div style={{position: 'relative', height: '100%'}}>
                 <video width='100%' height='76%' controls id={`${props.myParent}myVideo`} className='myVideo'>
                    <source src={`http://192.168.5.112:8010/videos/${props.video.fileName}`} type='video/mp4'/>
                            您的浏览器不支持Video标签。
                </video>
                <div className='multiMediaFontContent'>
                    <p>拍摄人：{props.video.upper}</p>
                    <p>上传时间：{props.video.upDate}</p>
                    <p>坐标：{props.video.location}</p>
                    <p>备注：{props.video.markName}</p>
                </div>
                <p className='multiMediaFontContentPN'>{`第 ${props.page.video.current}/${props.page.video.total} 页`}</p>
            </div>
        )
    }
}


interface IState {
    panelContentType: string
    picture: string
    video: string
    audio: string
    page: any
    backwardDisable : boolean
    forwardDisable : boolean
    setShow: boolean
}
interface IProps {
    panelContentPath: object
    myParent: string
    setShow: boolean
    setMediaPanelState: any
    mediaPanelState: string
    setShowFunc: any
}
export default class MultiMediaPanel extends Component<any, IState, IProps> {
    constructor(props: any) {
        super(props)
        this.state = {
            panelContentType: 'picture',
            picture: '',
            video: '',
            audio: '',
            page: {
                picture: {
                    current: 0,
                    total: 0
                },
                video: {
                    current: 0,
                    total: 0
                },
                audio: {
                    current: 0,
                    total: 0
                }
            },
            backwardDisable : true,
            forwardDisable : false,
            setShow: false
        }
    }
    componentWillReceiveProps(newProps) {
        const panelShow = newProps.setShow
        const page = this.state.page
        page.picture.total = newProps.panelContentPath.pictures.length
        page.video.total = newProps.panelContentPath.videos.length
        page.audio.total = newProps.panelContentPath.audios.length
        page.picture.current = page.picture.total > 0 ? 1 : 0
        page.video.current = page.video.total > 0 ? 1 : 0
        page.audio.current = page.audio.total > 0 ? 1 : 0
        this.setState({
            picture: this.props.panelContentPath.pictures[0],
            audio: this.props.panelContentPath.audios[0],
            video: this.props.panelContentPath.videos[0],
            page,
            backwardDisable : true,
            forwardDisable : false,
            setShow: panelShow
        })
        this.changePanelContent(newProps.mediaPanelState)
    }
    // picture、video、audio之间的切换
    changePanelContent = (str) => {
        if (str === this.state.panelContentType) {
            return
        }
        this.setState({
            panelContentType: str
        })
        const obj = {
            picture : 'multiMediaPanelItem multiMediaPicture active',
            video : 'multiMediaPanelItem multiMediaVideo',
            audio : 'multiMediaPanelItem multiMediaAudio'
        }
        switch (str) {
            case 'picture' :
                obj.picture = 'multiMediaPanelItem multiMediaPicture active'
                obj.video = 'multiMediaPanelItem multiMediaVideo'
                obj.audio = 'multiMediaPanelItem multiMediaAudio'
                break
            case 'video' :
                obj.picture = 'multiMediaPanelItem multiMediaPicture'
                obj.video = 'multiMediaPanelItem multiMediaVideo active'
                obj.audio = 'multiMediaPanelItem multiMediaAudio'
                break
            case 'audio' :
                obj.picture = 'multiMediaPanelItem multiMediaPicture'
                obj.video = 'multiMediaPanelItem multiMediaVideo'
                obj.audio = 'multiMediaPanelItem multiMediaAudio active'
                break
        }
        this.ergodicDom(obj)
        this.props.setMediaPanelState(str)
    }
    // 遍历dom，用于清除和增加选中状态
    ergodicDom = (obj) => {
        const picturesDom = document.getElementsByClassName('multiMediaPicture') as HTMLCollection
        const videosDom = document.getElementsByClassName('multiMediaVideo') as HTMLCollection
        const audiosDom = document.getElementsByClassName('multiMediaAudio') as HTMLCollection
        for (const key of Object.keys(picturesDom)) {
            picturesDom[key].setAttribute('class', obj.picture)
        }
        for (const key of Object.keys(videosDom)) {
            videosDom[key].setAttribute('class', obj.video)
        }
        for (const key of Object.keys(audiosDom)) {
            audiosDom[key].setAttribute('class', obj.audio)
        }
    }
    // 面板关闭按钮
    closeVisible = () => {
        this.props.setShowFunc('all', false)
    }
    // 上一页
    backward() {
        const contentType = this.state.panelContentType
        const page = this.state.page
        page[contentType].current -= 1
        const picCP = page.picture.current
        const audCP = page.audio.current
        const vidCP = page.video.current
        this.setState({
            picture: this.props.panelContentPath.pictures[picCP - 1],
            audio: this.props.panelContentPath.audios[audCP - 1],
            video: this.props.panelContentPath.videos[vidCP - 1]
        })
        if (page[contentType].current === 1) {
            this.setState({
                backwardDisable: true,
                forwardDisable: false,
            })
        } else {
            this.setState({
                backwardDisable: false,
                forwardDisable: false,
            })
        }
    }
    // 下一页
    forward() {
        const contentType = this.state.panelContentType
        const page = this.state.page
        page[contentType].current += 1
        const picCP = page.picture.current
        const audCP = page.audio.current
        const vidCP = page.video.current
        this.setState({
            picture: this.props.panelContentPath.pictures[picCP - 1],
            audio: this.props.panelContentPath.audios[audCP - 1],
            video: this.props.panelContentPath.videos[vidCP - 1]
        })
        if (page[contentType].current === page[contentType].total) {
            this.setState({
                backwardDisable: false,
                forwardDisable: true,
            })
        } else {
            this.setState({
                backwardDisable: false,
                forwardDisable: false,
            })
        }
    }
    render() {
        if (!this.state.setShow) {
            return null
        }
        return (
            <div className='multiMediaPanel'>
                <div className='multiMediaPanelTitle'>
                    <Icon type='close' onClick={this.closeVisible} style={{position: 'absolute', right: '10px', top: '10px', zIndex: 10, opacity: 0.5}} />
                    <Breadcrumb separator=''>
                        <Breadcrumb.Item>
                            <a className='multiMediaPanelItem multiMediaPicture active' onClick={() => this.changePanelContent('picture')}>照片</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a className='multiMediaPanelItem multiMediaAudio' onClick={() => this.changePanelContent('audio')}>录音</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a className='multiMediaPanelItem multiMediaVideo' onClick={() => this.changePanelContent('video')}>视频</a>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className='multiMediaPanelContent'>
                    <PanelContent panelContentType = {this.state.panelContentType} picture={this.state.picture} video={this.state.video} audio={this.state.audio} page={this.state.page} myParent={this.props.myParent}/>
               </div>
                <div className='multiMediaPanelButton' style={{margin: 2, textAlign: 'center', lineHeight: '64px'}}>
                    <Button type='primary' disabled={this.state.backwardDisable} style={{marginRight: 10}} onClick={this.backward.bind(this)}>
                        <Icon type='left' />
                        上一页
                    </Button>
                    <Button type='primary' disabled={this.state.forwardDisable} style={{marginLeft: 10}} onClick={this.forward.bind(this)}>
                        下一页
                        <Icon type='right' />
                    </Button>
                </div>
            </div>
        )
    }
}
