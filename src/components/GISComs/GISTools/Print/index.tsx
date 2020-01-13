
import * as React from 'react'
import { Icon } from 'antd'

import './index.less'

interface IProps {
    fullExtent?: any
    fullViewpoint?: any
    parentDomId: any 
}

interface IState {

}

export default class SimplePrint extends React.Component<IProps, IState> {
    view = global.viewConfig.activeView
    area: any = null // 打印范围
    maskDiv: any
    constructor(props: IProps) {
        super(props)
    }

    componentDidMount() {
        this.maskDiv =  document.createElement('div')
        this.maskDiv.style.position = 'absolute'
        this.maskDiv.style.background = 'rgba(255, 51, 0, 0.1)'
        this.maskDiv.style.border = '2px dashed rgb(255, 51, 0)'
        const parentDom = document.getElementById(this.props.parentDomId)
        parentDom!.appendChild(this.maskDiv)
    }

    takeScreenshot = () => {
        const view = this.view
        if (view) {
            view.takeScreenshot({

            }).then((screenshot) => {
                const img = new Image()
                img.src = screenshot.dataUrl
                const newWin: any = window.open('', '_blank')
                newWin.document.write(img.outerHTML)
                newWin.document.title = '地图'
                newWin.document.close()
            })
        } else {
            console.error('view 对象不存在')
        }
    }

    clamp = (value, from, to) => {
        return value < from ? from : value > to ? to : value
    }

    start = () => {
        this.view.container.classList.add('screenshotCursor')
        let areaParam: any = null
        const dragHandler = this.view.on('drag', (event) => {
            event.stopPropagation()
            if (event.action !== 'end') {
                const xmin = clamp(
                    Math.min(event.origin.x, event.x),
                    0,
                    this.view.width
                )
                const xmax = clamp(
                    Math.max(event.origin.x, event.x),
                    0,
                    this.view.width
                )
                const ymin = clamp(
                    Math.min(event.origin.y, event.y),
                    0,
                    this.view.height
                )
                const ymax = clamp(
                    Math.max(event.origin.y, event.y),
                    0,
                    this.view.height
                )
                areaParam = {
                    x: xmin,
                    y: ymin,
                    width: xmax - xmin,
                    height: ymax - ymin
                }
                this.setMaskPosition(areaParam) // 绘制显示


            } else {
                dragHandler.remove()
                this.view
                    .takeScreenshot({ area: areaParam, format: 'png' })
                    .then((screenshot) => {
                        this.showPreview(screenshot)

                        // create the image for download
                        // document.getElementById('downloadBtn').onclick = function () {
                        //     const text = document.getElementById('textInput').value
                        //     // if a text exists, then add it to the image
                        //     if (text) {
                        //         const dataUrl = getImageWithText(screenshot, text)
                        //         downloadImage(
                        //             webscene.portalItem.title + '.png',
                        //             dataUrl
                        //         )
                        //     }
                        //     // otherwise download only the webscene screenshot
                        //     else {
                        //         downloadImage(
                        //             webscene.portalItem.title + '.png',
                        //             screenshot.dataUrl
                        //         )
                        //     }
                        // }

                        // the screenshot mode is disabled
                        // screenshotBtn.classList.remove('active')
                        this.view.container.classList.remove('screenshotCursor')
                        this.setMaskPosition(null)
                    })
            }
        })
        function clamp(value, from, to) {
            return value < from ? from : value > to ? to : value
        }
    }

    setMaskPosition = (area) => {
        if (area) {
            this.maskDiv.classList.remove('hide')
            this.maskDiv.style.left = area.x + 'px'
            this.maskDiv.style.top = area.y + 'px'
            this.maskDiv.style.width = area.width + 'px'
            this.maskDiv.style.height = area.height + 'px'
        } else {
            this.maskDiv.classList.add('hide')
        }
    }


    showPreview = (screenshot) => {
        // console.log(screenshot)
        // screenshotImage.width = screenshot.data.width
        // screenshotImage.height = screenshot.data.height
        // screenshotImage.src = screenshot.dataUrl

        const img = new Image()
        img.src = screenshot.dataUrl
        const newWin: any = window.open('', '_blank')
        newWin.document.write(img.outerHTML)
        newWin.document.title = '地图'
        newWin.document.close()
    }

    executePrint = () => {
        console.log('print')
    }
    render() {
        return (
            <React.Fragment>
                <div className='printer esri-widget--button esri-widget esri-interactive' title='打印' onClick={this.start}>
                    <Icon type='printer' />
                </div>
                <div id='maskDiv' className='hide screenshotCursor' />
            </React.Fragment>
        )
    }
}








