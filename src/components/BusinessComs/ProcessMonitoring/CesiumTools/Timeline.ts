/**
 * @author Roman
 * @date 2019/12/23
 * @Description: 时间轴类
 */
// import * as Cesium from 'cesium'
import MapManager from '../CesiumTools/MapManager'
import CZMLManager from '../CesiumTools/CZMLManager'
import ModelManager from '../CesiumTools/ModelManager'
import * as Cesium from 'cesium'


function TimelineClass(this: any, viewer) {
    this.viewer = viewer
}
TimelineClass.prototype = {
    itemConfig : null,
    itemInterval: null, // 项目控制定时器
    nodeProgress: null, // 项目节点进度百分比
    itemExecuteTime: null, // 项目主节点的执行时间
    fontColorController: {
        fontColorSet : ['#0F87F1', '#84D945', '#F93', '#FFCE44'],
        fontColorIndex : 0,
        fontColorInterval : null // 文字闪烁定时器
    },
    nodeDomManager: null, // 节点Dom管理对象
    mapManager: null, // 地图加载管理对象
    czmlManager: null, // czml管理对象
    modelManager: null, // 模型管理对象
    czmlAnimationLevel: 1, // czml动画播放速度等级
    czmlAnimationSpeed: 0, // 动画标识
    itemProgressFlag: null, // 项目节点进程标识
    sjInfoWindowFlag: {'isOpen': false, 'windowIndex': 0}, // 设计信息弹出窗体标识
    ysInfoWindowFlag: {'isOpen': false, 'windowIndex': 0}, // 验收信息弹出窗体标识
    speedLevel: 1, // 播放速度                                   
    // 初始化Timeline
    initTimeline : (that) => {
        // @ts-ignore
        that.itemInterval = new ItemInterval() // 创建项目定时器对象
        that.fontColorController.fontColorInterval = new ItemInterval() // 创建文字颜色定时器对象
        that.nodeDomManager = new NodeDomManager() // 创建子项目节点标识管理对象
        that.mapManager = new MapManager(that.viewer)
        that.modelManager = new ModelManager()
        // @ts-ignore
        that.czmlManager = new CZMLManager(that.viewer)
        that.itemProgressFlag = { // 项目进度标识，用于时间轴的播放暂停，如果该项目节点已经播放完成，则设置为true
            lx: false,
            sj: false,
            sg: false,
            ys: false,
            replay: false,
            sg_czmlLoading: false,
            sg_modelLoading: false
        }
        that.itemConfig = that.testConfig()
        // 获取项目节点进度百分比
        that.nodeProgress = that.getItemNodeProgress(that.itemConfig)
        // 获取项目主节点的执行时间
        that.itemExecuteTime = that._calcItemExecTime(60)
        // 加载所有图层
        that.mapManager.loadWMSMap()
        // 加载演示模型
        that.mapManager.load3DModel(that.itemConfig.layerController.modelSet.sgh_model, '施工后倾斜模型', false)
        // 演示前打开深度检测
        that.viewer.scene.globe.depthTestAgainstTerrain = true // 打开深度检测
    },
    // 重置Timeline
    resetTimeline : () => {
        // @ts-ignore
        const that = this

    },
    // 执行Timeline
    runTimeline : (that, playState, playendCallback) => {
        // @ts-ignore
        if (playState) { // 目前处于播放状态，点击后时间轴暂停
            that.itemInterval.pause() // 暂停定时器
            if (that.itemProgressFlag.sg_czmlLoading) { // 如果czml正在加载，则暂停czml
                that.czmlManager.pauseAnimation()
            }
            if (that.itemProgressFlag.sg_modelLoading) { // 如果倾斜模型正在加载，则暂停倾斜模型加载
                that.modelManager.pauseAnimation()
            }
        } else { // 目前处于暂停状态，点击后时间轴开始播放
            if (that.itemProgressFlag.sg_czmlLoading) { // 如果czml加载状态为暂停状态，则继续czml加载
                that.czmlManager.continueAnimation()
            }
            if (that.itemProgressFlag.sg_modelLoading) { // 如果模型加载状态为暂停状态，则继续模型加载
                that.modelManager.continueAnimation()
            }
            that.itemInterval.start((progress) => {
                that._lxTimer(that, progress)
            }, 100, that.itemExecuteTime.lx, that.itemProgressFlag.lx).then( () => {
                return that.itemInterval.start((progress) => {
                    that._sjTimer(that, progress)
                }, 100, that.itemExecuteTime.sj, that.itemProgressFlag.sj)
            }).then(() => {
                return that.itemInterval.start((progress) => {
                    that._sgTimer(that, progress)
                }, 100, that.itemExecuteTime.sg, that.itemProgressFlag.sg)
            }).then(() => {
                return that.itemInterval.start((progress) => {
                    that._ysTimer(that, progress)
                }, 100, that.itemExecuteTime.ys, that.itemProgressFlag.ys)
            }).then(() => {
                // 将播放按钮初始化
                document.getElementsByClassName('startBtn')[0].setAttribute('class', 'startBtn active play')
                // 时间轴播放完成后重新初始化定时器
                that.itemInterval.initInterval(() => {
                    console.log('播放结束')
                })
                that.itemProgressFlag = {
                    lx: false,
                    sj: false,
                    sg: false,
                    ys: false,
                    replay: true,
                    sg_czmlLoading: false,
                    sg_modelLoading: false
                }
                that.nodeProgress.lx.sdtk_flag = 0
                that.nodeProgress.lx.xmbb_flag = 0
                that.nodeProgress.lx.lxwc_flag = 0
                that.nodeProgress.sj.wcsjtz_flag = 0
                that.nodeProgress.sj.sjgcljs_flag = 0
                that.nodeProgress.sg.sgqcl_flag = 0
                that.nodeProgress.sg.dlsg_flag = 0
                that.nodeProgress.sg.gdsg_flag = 0
                that.nodeProgress.sg.fswzz_flag = 0
                that.nodeProgress.sg.jgcl_flag = 0
                that.nodeProgress.ys.ystzcl_flag = 0
                that.nodeProgress.ys.ysgclhs_flag = 0
                that.nodeProgress.ys.yswc_flag = 0
                if (playendCallback) {
                    playendCallback()
                }
            })
        }
    },
    // 获取项目各节点的百分比
    getItemNodeProgress : (config) => {
        const timeNodeSet = {
            lxStartDate: Number(new Date(config.timeline.timeNode.lxStartDate)), // 立项开始日期
            sjStartDate: Number(new Date(config.timeline.timeNode.sjStartDate)), // 设计开始日期
            sgStartDate: Number(new Date(config.timeline.timeNode.sgStartDate)), // 施工开始日期
            ysStartDate: Number(new Date(config.timeline.timeNode.ysStartDate)), // 验收开始日期
            ysEndDate: Number(new Date(config.timeline.timeNode.ysEndDate)), // 验收结束日期
            sdtkDate: Number(new Date(config.timeline.timeNode.sdtkDate)), // 实地踏勘日期
            xmbbDate: Number(new Date(config.timeline.timeNode.xmbbDate)), // 项目报备日期
            lxwcDate: Number(new Date(config.timeline.timeNode.lxwcDate)), // 立项完成日期
            wcsjtzDate: Number(new Date(config.timeline.timeNode.wcsjtzDate)), // 完成设计图纸日期
            sjgcljsDate: Number(new Date(config.timeline.timeNode.sjgcljsDate)), // 设计工程量计算日期
            sgqclDate: Number(new Date(config.timeline.timeNode.sgqclDate)), // 施工前测量日期
            dlsgDate: Number(new Date(config.timeline.timeNode.dlsgDate)), // 道路施工日期
            gdsgDate: Number(new Date(config.timeline.timeNode.gdsgDate)), // 管道施工日期
            fswzzDate: Number(new Date(config.timeline.timeNode.fswzzDate)), // 附属物栽种日期
            jgclDate: Number(new Date(config.timeline.timeNode.jgclDate)), // 竣工测量日期
            ystzclDate: Number(new Date(config.timeline.timeNode.ystzclDate)), // 验收图纸测量日期
            ysgclhsDate: Number(new Date(config.timeline.timeNode.ysgclhsDate)), // 验收工程量核算日期
            yswcDate: Number(new Date(config.timeline.timeNode.yswcDate)), // 验收完成日期
        }
        // 计算项目各个阶段所消耗的总时间（实际时间）
        const lxTime = Number(timeNodeSet.sjStartDate - timeNodeSet.lxStartDate)
        const sjTime = Number(timeNodeSet.sgStartDate - timeNodeSet.sjStartDate)
        const sgTime = Number(timeNodeSet.ysStartDate - timeNodeSet.sgStartDate)
        const ysTime = Number(timeNodeSet.ysEndDate - timeNodeSet.ysStartDate)
        // 设置项目的各时间节点的百分比
        const nodeProgress = {
            lx: {
                sdtk: (timeNodeSet.sdtkDate - timeNodeSet.lxStartDate) / lxTime * 100, // 实地踏勘
                xmbb: (timeNodeSet.xmbbDate - timeNodeSet.lxStartDate) / lxTime * 100, // 项目报备
                lxwc: (timeNodeSet.lxwcDate - timeNodeSet.lxStartDate) / lxTime * 100, // 立项完成
                sdtk_flag: 0, // 时间轴进度是否已经经过此节点的标识
                xmbb_flag: 0,
                lxwc_flag: 0
            },
            sj: {
                wcsjtz: (timeNodeSet.wcsjtzDate - timeNodeSet.sjStartDate) / sjTime * 100, // 完成设计图纸
                sjgcljs: (timeNodeSet.sjgcljsDate - timeNodeSet.sjStartDate) / sjTime * 100, // 设计工程量计算
                wcsjtz_flag: 0, // 时间轴进度是否已经经过此节点的标识
                sjgcljs_flag: 0
            },
            sg: {
                sgqcl: (timeNodeSet.sgqclDate - timeNodeSet.sgStartDate) / sgTime * 100, // 施工前测量
                dlsg: (timeNodeSet.dlsgDate - timeNodeSet.sgStartDate) / sgTime * 100, // 道路施工
                gdsg: (timeNodeSet.gdsgDate - timeNodeSet.sgStartDate) / sgTime * 100, // 管道施工
                jgcl: (timeNodeSet.jgclDate - timeNodeSet.sgStartDate) / sgTime * 100, // 竣工测量
                fswzz: (timeNodeSet.fswzzDate - timeNodeSet.sgStartDate) / sgTime * 100, // 附属物栽种
                sgqcl_flag: 0, // 时间轴进度是否已经经过此节点的标识
                dlsg_flag: 0,
                gdsg_flag: 0,
                jgcl_flag: 0,
                fswzz_flag: 0
            },
            ys: {
                ystzcl: (timeNodeSet.ystzclDate - timeNodeSet.ysStartDate) / ysTime * 100, // 验收图纸测量
                ysgclhs: (timeNodeSet.ysgclhsDate - timeNodeSet.ysStartDate) / ysTime * 100, // 验收工程量核算
                yswc: (timeNodeSet.yswcDate - timeNodeSet.ysStartDate) / ysTime * 100, // 验收完成
                ystzcl_flag: 0, // 时间轴进度是否已经经过此节点的标识
                ysgclhs_flag: 0,
                yswc_flag: 0
            }
        }
        return nodeProgress
    },
    // 倍速播放
    switchPlaySpeed : (that, speedLevel) => {
        that.speedLevel = parseInt ( speedLevel, 10 ) / 1000
        that.itemInterval.playSpeed = that.speedLevel
        that.modelManager.playSpeed = that.speedLevel
        that.czmlAnimationLevel = that.speedLevel
        if ( that.itemProgressFlag.sg_czmlLoading) {
            that.viewer.clock.multiplier = that.czmlAnimationSpeed * that.czmlAnimationLevel
        }
    },
    // 将日期转化为yyyy-mm-dd
    _formatTimelineDate : (date) => {
        // 个位数字之前用0补位
        const remedyZero = (num) => {
            return num.toString().split('').length === 1 ? '0' + num : num
        }
        const year = date.getFullYear()
        const month = remedyZero(date.getMonth() + 1)
        const day = remedyZero(date.getDate())
        const str = year + '-' + month + '-' + day
        return str
    },
    // 计算项目主节点的执行时间
    _calcItemExecTime: (allTime) => {
        const lxProcessBar = document.getElementsByClassName('lx_processBar')[0].clientWidth
        const sjProcessBar = document.getElementsByClassName('sj_processBar')[0].clientWidth
        const sgProcessBar = document.getElementsByClassName('sg_processBar')[0].clientWidth
        const ysProcessBar = document.getElementsByClassName('ys_processBar')[0].clientWidth
        const barLength = lxProcessBar + sjProcessBar + sgProcessBar + ysProcessBar
        const lx = Math.ceil(lxProcessBar / barLength * allTime) * 1000
        const sj = Math.ceil(sjProcessBar / barLength * allTime) * 1000
        const sg = Math.ceil(sgProcessBar / barLength * allTime) * 1000
        const ys = allTime * 1000 - lx - sj - sg
        return {
            lx,
            sj,
            sg,
            ys
        }
    },
    // dom初始化，用于重复播放
    _initTimelineDom : (that) => {
        that.nodeDomManager.hideItemChildNode()
        const lxFontDom = document.getElementsByClassName('lxName')[0] as HTMLElement
        const lxProgressDom = document.getElementsByClassName('lx_process')[0] as HTMLElement
        const lxProgressGoDom = document.getElementsByClassName('lx_process_go')[0] as HTMLElement
        const sjFontDom = document.getElementsByClassName('sjName')[0] as HTMLElement
        const sjProgressDom = document.getElementsByClassName('sj_process')[0] as HTMLElement
        const sjProgressGoDom = document.getElementsByClassName('sj_process_go')[0] as HTMLElement
        const sgFontDom = document.getElementsByClassName('sgName')[0] as HTMLElement
        const sgProgressDom = document.getElementsByClassName('sg_process')[0] as HTMLElement
        const sgProgressGoDom = document.getElementsByClassName('sg_process_go')[0] as HTMLElement
        const ysFontDom = document.getElementsByClassName('ysName')[0] as HTMLElement
        const ysProgressDom = document.getElementsByClassName('ys_process')[0] as HTMLElement
        const ysProgressGoDom = document.getElementsByClassName('ys_process_go')[0] as HTMLElement
        lxFontDom.style.color = '#66AFE9'
        sjFontDom.style.color = '#66AFE9'
        sgFontDom.style.color = '#66AFE9'
        ysFontDom.style.color = '#66AFE9'
        // @ts-ignore
        lxProgressDom.style.width = 0
        // @ts-ignore
        lxProgressGoDom.style.width = 0
        // @ts-ignore
        sjProgressDom.style.width = 0
        // @ts-ignore
        sjProgressGoDom.style.width = 0
        // @ts-ignore
        sgProgressDom.style.width = 0
        // @ts-ignore
        sgProgressGoDom.style.width = 0
        // @ts-ignore
        ysProgressDom.style.width = 0
        // @ts-ignore
        ysProgressGoDom.style.width = 0
    },
    // 立项阶段
    _lxTimer : (that, progress) => {
        // @ts-ignore
        const fontDom = document.getElementsByClassName('lxName')[0] as HTMLElement
        const markerDom = document.getElementById('lx_marker')
        const progressDom = document.getElementsByClassName('lx_process')[0] as HTMLElement
        const progressGoDom = document.getElementsByClassName('lx_process_go')[0] as HTMLElement
        const fontColorInterval = that.fontColorController.fontColorInterval
        const fontColorSet = that.fontColorController.fontColorSet
        let fontColorIndex = that.fontColorController.fontColorIndex
        if (!that.itemInterval) {
            return
        }
        if (!that.nodeProgress) {
            that.nodeProgress = that.getItemNodeProgress(that.testConfig())
        }
        const nodeProgress = that.nodeProgress
        console.log('lx' + progress)
        // 设置进度样式
        // @ts-ignore
        markerDom.style.left = progress + '%'
        // @ts-ignore
        markerDom.style.margin = '-4px -8px'
        // @ts-ignore
        markerDom.style.display = 'block'
        progressDom.style.width = progress + '%'
        progressDom.style['border-right'] = '1px solid'
        progressGoDom.style.width = progress + '%'

        if (progress === 0) {
            // 如果是重复播放，则进行以下操作以初始化时间轴
            if (that.itemProgressFlag.replay) {
                // 关闭所有图层
                that.mapManager.closeWMSMapAll()
                // 关闭已经打开的模型
                that.mapManager.close3DModelByName('施工后倾斜模型')
                // 初始化时间轴dom
                that._initTimelineDom(that)
                // 删除czml产生的entity，关闭已经打开的图层
                that.viewer.entities.remove(that.czmlManager.roadEntity)
                that.czmlManager.roadEntity = null
                that.itemProgressFlag.replay = false
            }
            // 开启文字闪烁
            fontColorInterval.start(() => {
                fontDom.style.color = fontColorSet[fontColorIndex++]
                if (fontColorIndex >= fontColorSet.length) {
                    fontColorIndex = 0
                }
            }, 200)
        } else if (progress >= nodeProgress.lx.sdtk  &&  !nodeProgress.lx.sdtk_flag) { // 实地踏勘
            that.mapManager.openWMSMapByName('立项范围线')
            that.mapManager.openWMSMapByName('立项规划要素')
            that.nodeDomManager.showItemChildNode('sdtk', progress + '%', '8%')
            nodeProgress.lx.sdtk_flag = 1
        } else if (progress >= nodeProgress.lx.xmbb  &&  !nodeProgress.lx.xmbb_flag) { // 项目报备
            that.mapManager.openWMSMapByName('立项田块范围')
            that.nodeDomManager.showItemChildNode('xmbb', progress + '%', '8%')
            nodeProgress.lx.xmbb_flag = 1
        } else if (progress >= nodeProgress.lx.lxwc  &&  !nodeProgress.lx.lxwc_flag) { // 立项完成
            that.nodeDomManager.showItemChildNode('lxwc', progress + '%', '8%')
            nodeProgress.lx.lxwc_flag = 1
        } else if (progress === 100) {
            that.itemProgressFlag.lx = true
            // 关闭文字闪烁，并将文字颜色设定为固定值
            fontColorInterval.clearCurrentInterval()
            fontDom.style.color = '#84D945'
            // @ts-ignore
            markerDom.style.display = 'none'
            progressDom.style['border-right'] = 'none'
        }
    },
    // 设计阶段
    _sjTimer : (that, progress) => {
        // @ts-ignore
        const fontDom = document.getElementsByClassName('sjName')[0] as HTMLElement
        const markerDom = document.getElementById('sj_marker')
        const progressDom = document.getElementsByClassName('sj_process')[0] as HTMLElement
        const progressGoDom = document.getElementsByClassName('sj_process_go')[0] as HTMLElement
        const fontColorInterval = that.fontColorController.fontColorInterval
        const fontColorSet = that.fontColorController.fontColorSet
        let fontColorIndex = that.fontColorController.fontColorIndex
        if (!that.itemInterval) {
            return
        }
        if (!that.nodeProgress) {
            that.nodeProgress = that.getItemNodeProgress(that.testConfig())
        }
        console.log('sj' + progress)
        const nodeProgress = that.nodeProgress
        // 设置进度样式
        // @ts-ignore
        markerDom.style.left = progress + '%'
        // @ts-ignore
        markerDom.style.margin = '-4px -8px'
        // @ts-ignore
        markerDom.style.display = 'block'
        progressDom.style.width = progress + '%'
        progressDom.style['border-right'] = '1px solid'
        progressGoDom.style.width = progress + '%'
        if (progress === 0) {
            // 关闭立项阶段的图层
            that.mapManager.closeWMSMapByName('立项范围线')
            that.mapManager.closeWMSMapByName('立项规划要素')
            that.mapManager.closeWMSMapByName('立项田块范围')
            // 开启文字闪烁
            fontColorInterval.start(() => {
                fontDom.style.color = fontColorSet[fontColorIndex++]
                if (fontColorIndex >= fontColorSet.length) {
                    fontColorIndex = 0
                }
            }, 200)
        } else if (progress >= nodeProgress.sj.wcsjtz && !nodeProgress.sj.wcsjtz_flag) { // 完成设计图纸
            that.mapManager.openWMSMapByName('设计范围线')
            that.mapManager.openWMSMapByName('设计规划要素')
            that.nodeDomManager.showItemChildNode('wcsjtz', progress + '%', '20%')
            nodeProgress.sj.wcsjtz_flag = 1
        } else if (progress >= nodeProgress.sj.sjgcljs && !nodeProgress.sj.sjgcljs_flag) { // 设计工程量计算
            that.mapManager.openWMSMapByName('设计田块范围')
            that.nodeDomManager.showItemChildNode('sjgcljs', progress + '%', '20%')
            nodeProgress.sj.sjgcljs_flag = 1
        } else if (progress === 100) {
            that.itemProgressFlag.sj = true
            // 关闭文字闪烁，并将文字颜色设定为固定值
            fontColorInterval.clearCurrentInterval()
            fontDom.style.color = '#84D945'
            // @ts-ignore
            markerDom.style.display = 'none'
            progressDom.style['border-right'] = 'none'
        }
    },
    // 施工阶段
    _sgTimer : (that, progress) => {
        // @ts-ignore
        const fontDom = document.getElementsByClassName('sgName')[0] as HTMLElement
        const markerDom = document.getElementById('sg_marker')
        const progressDom = document.getElementsByClassName('sg_process')[0] as HTMLElement
        const progressGoDom = document.getElementsByClassName('sg_process_go')[0] as HTMLElement
        const fontColorInterval = that.fontColorController.fontColorInterval
        const fontColorSet = that.fontColorController.fontColorSet
        let fontColorIndex = that.fontColorController.fontColorIndex
        if (!that.itemInterval) {
            return
        }
        if (!that.nodeProgress) {
            that.nodeProgress = that.getItemNodeProgress(that.testConfig())
        }
        const nodeProgress = that.nodeProgress
        console.log('sg' + progress)
        // 设置进度样式
        // @ts-ignore
        markerDom.style.left = progress + '%'
        // @ts-ignore
        markerDom.style.margin = '-4px -8px'
        // @ts-ignore
        markerDom.style.display = 'block'
        progressDom.style.width = progress + '%'
        progressDom.style['border-right'] = '1px solid'
        progressGoDom.style.width = progress + '%'
        if (progress === 0) {
            // 开启文字闪烁
            fontColorInterval.start(() => {
                fontDom.style.color = fontColorSet[fontColorIndex++]
                if (fontColorIndex >= fontColorSet.length) {
                    fontColorIndex = 0
                }
            }, 200)
            // 跳转至修路开始处
            const czmlUrl = that.itemConfig.timeline.czmlUrl

            const timelineView = that.itemConfig.timeline.timelineView
            that.viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(timelineView.buildStart.destination.longitude, timelineView.buildStart.destination.latitude, timelineView.buildStart.destination.height),
                orientation: timelineView.buildStart.orientation,
                duration: 1,
            })
            // 计算czml和模型在时间轴中的加载的执行时间 暂按施工时间的百分之20
            const czmlLoadTimeInTimeline = that.itemExecuteTime.sg * 0.2
            let modelLoadTimeInTimeline : any = 0
            that.czmlManager.loadCZML(czmlUrl, 'Vehicle', (czmlLoadTimeLength) => {
                that.itemProgressFlag.sg_czmlLoading = true
                // 计算czml的执行时间
                const czmlLoadTime = czmlLoadTimeLength * 1000
                that.czmlAnimationSpeed = Math.ceil(czmlLoadTime / czmlLoadTimeInTimeline)
                that.viewer.clock.multiplier = that.czmlAnimationSpeed * that.czmlAnimationLevel
                modelLoadTimeInTimeline = (that.itemExecuteTime.sg - czmlLoadTime / that.viewer.clock.multiplier).toFixed(2)
            } , () => {
                // 修路完成后跳转至模型加载处
                that.viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(timelineView.modelLoad.destination.longitude, timelineView.modelLoad.destination.latitude, timelineView.modelLoad.destination.height),
                    orientation: timelineView.modelLoad.orientation,
                    duration: 1,
                    maximumHeight: 5000
                })
                that.itemProgressFlag.sg_czmlLoading = false
                that.itemProgressFlag.sg_modelLoading = true
                // 计算
                that.modelManager.modelUp = that.itemConfig.layerController.modelSet.modelUp
                that.modelManager.modelDown = that.itemConfig.layerController.modelSet.modelDown
                const modelHasLoad = that.modelManager.gradeModel(that.viewer, '施工后倾斜模型', modelLoadTimeInTimeline)
                if (modelHasLoad) {// 如果模型不存在则重新加载
                    console.log('模型不存在')
                }
            })
        } else if (progress >= nodeProgress.sg.sgqcl && !nodeProgress.sg.sgqcl_flag) { // 施工前测量
            that.mapManager.closeWMSMapByName('设计范围线')
            that.mapManager.closeWMSMapByName('设计规划要素')
            that.mapManager.closeWMSMapByName('设计田块范围')
             that.mapManager.openWMSMapByName('竣工范围线')
            that.nodeDomManager.showItemChildNode('sgqcl', progress + '%', '33%')
            nodeProgress.sg.sgqcl_flag = 1
        } else if (progress >= nodeProgress.sg.dlsg && !nodeProgress.sg.dlsg_flag) { // 道路施工
             that.mapManager.openWMSMapByName('竣工规划要素')
            that.nodeDomManager.showItemChildNode('dlsg', progress + '%', '33%')
            nodeProgress.sg.dlsg_flag = 1
        } else if (progress >= nodeProgress.sg.gdsg && !nodeProgress.sg.gdsg_flag) { // 管道施工
             that.mapManager.openWMSMapByName('竣工田块范围')
            that.nodeDomManager.showItemChildNode('gdsg', progress + '%', '33%')
            nodeProgress.sg.gdsg_flag = 1
        } else if (progress >= nodeProgress.sg.fswzz && !nodeProgress.sg.fswzz_flag) { // 附属物栽种
            that.nodeDomManager.showItemChildNode('fswzz', progress + '%', '33%')
            nodeProgress.sg.fswzz_flag = 1
        } else if (progress >= nodeProgress.sg.jgcl && !nodeProgress.sg.jgcl_flag) { // 竣工测量
            that.nodeDomManager.showItemChildNode('jgcl', progress + '%', '33%')
            nodeProgress.sg.jgcl_flag = 1
        } else if (progress === 100) {
            that.itemProgressFlag.sg = true
            // 关闭文字闪烁，并将文字颜色设定为固定值
            fontColorInterval.clearCurrentInterval()
            fontDom.style.color = '#84D945'
            // @ts-ignore
            markerDom.style.display = 'none'
            progressDom.style['border-right'] = 'none'
            // 施工完成后改变视角
            const timelineView = that.itemConfig.timeline.timelineView
            that.viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(timelineView.buildEnd.destination.longitude, timelineView.buildEnd.destination.latitude, timelineView.buildEnd.destination.height),
                orientation: timelineView.buildEnd.orientation,
                duration: 2.0
            })
        }
    },
    // 验收阶段
    _ysTimer : (that, progress) => {
        // @ts-ignore
        const fontDom = document.getElementsByClassName('ysName')[0] as HTMLElement
        const markerDom = document.getElementById('ys_marker')
        const progressDom = document.getElementsByClassName('ys_process')[0] as HTMLElement
        const progressGoDom = document.getElementsByClassName('ys_process_go')[0] as HTMLElement
        const fontColorInterval = that.fontColorController.fontColorInterval
        const fontColorSet = that.fontColorController.fontColorSet
        let fontColorIndex = that.fontColorController.fontColorIndex
        if (!that.itemInterval) {
            return
        }
        if (!that.nodeProgress) {
            that.nodeProgress = that.getItemNodeProgress(that.testConfig())
        }
        const nodeProgress = that.nodeProgress
        console.log('ys' + progress)
        // 设置进度样式
        // @ts-ignore
        markerDom.style.left = progress + '%'
        // @ts-ignore
        markerDom.style.margin = '-4px -8px'
        // @ts-ignore
        markerDom.style.display = 'block'
        progressDom.style.width = progress + '%'
        progressDom.style['border-right'] = '1px solid'
        progressGoDom.style.width = progress + '%'
        if (progress === 0) {
            // 开启文字闪烁
            fontColorInterval.start(() => {
                fontDom.style.color = fontColorSet[fontColorIndex++]
                if (fontColorIndex >= fontColorSet.length) {
                    fontColorIndex = 0
                }
            }, 200)
            // 删除czml产生的entity，关闭已经打开的图层
            that.viewer.entities.remove(that.czmlManager.roadEntity)
            that.czmlManager.roadEntity = null
        } else if (progress >= nodeProgress.ys.ystzcl && !nodeProgress.ys.ystzcl_flag) { // 验收图纸测量
            that.mapManager.closeWMSMapByName('竣工范围线')
            that.mapManager.closeWMSMapByName('竣工规划要素')
            that.mapManager.closeWMSMapByName('竣工田块范围')
            that.mapManager.openWMSMapByName('复核范围线')
            that.nodeDomManager.showItemChildNode('ystzcl', progress + '%', '40%')
            nodeProgress.ys.ystzcl_flag = 1
        } else if (progress  >= nodeProgress.ys.ysgclhs && !nodeProgress.ys.ysgclhs_flag) { // 验收工程量核算
            that.mapManager.openWMSMapByName('复核规划要素')
            that.nodeDomManager.showItemChildNode('ysgclhs', progress + '%', '40%')
            nodeProgress.ys.ysgclhs_flag = 1
        } else if (progress >= nodeProgress.ys.yswc && !nodeProgress.ys.yswc_flag) { // 验收完成
            that.mapManager.openWMSMapByName('复核田块范围')
            that.nodeDomManager.showItemChildNode('yswc', progress + '%', '40%')
            nodeProgress.ys.yswc_flag = 1
        } else if (progress === 100) {
            that.itemProgressFlag.ys = true
            // 关闭文字闪烁，并将文字颜色设定为固定值
            fontColorInterval.clearCurrentInterval()
            fontDom.style.color = '#84D945'
            // @ts-ignore
            markerDom.style.display = 'none'
            progressDom.style['border-right'] = 'none'
        }
    },
    // 测试数据
    testConfig : () => {
        const config = {
            'countyCode': 610626,
            'city': '延安市吴起县',
            'itemName': '吴起县长城镇西郊村土地整治项目',
            'countyGeoJsonUrl': ['wqxwfs', '0'],
            'labelWFS': ['wqxdkwfs', '0'],
            'itemConfig': {
                'dkName': '地块一',
                'timeline': {
                    'czmlUrl': '/timeline/hzyz.json',
                    'timelineView': {
                        'buildStart': {
                            'destination': {
                                'longitude': 108.35282527896344,
                                'latitude': 37.369023262190694,
                                'height': 2365.608565497709
                            } ,
                            'orientation': {
                                'heading': 5.638259927233962,
                                'pitch': -0.8588487973496148,
                                'roll': 6.28019771414181
                            }
                        },
                        'modelLoad': {
                            'destination': {
                                'longitude': 108.35282527896344,
                                'latitude': 37.369023262190694,
                                'height': 2365.608565497709
                            } ,
                            'orientation': {
                                'heading': 5.638259927233962,
                                'pitch': -0.8588487973496148,
                                'roll': 6.28019771414181
                            }
                        },
                        'buildEnd': {
                            'destination': {
                                'longitude': 108.34405082095145,
                                'latitude': 37.36884357225683,
                                'height': 2977.4728880825305
                            } ,
                            'orientation': {
                                'heading': 0.14011962243494214,
                                'pitch': -1.1112431929530575,
                                'roll': 0.001025856974243844
                            }
                        }
                    },
                    'timeNode': {
                        'lxStartDate': '2018/01/01',
                        'sjStartDate': '2018/02/06',
                        'sgStartDate': '2018/03/15',
                        'ysStartDate': '2018/08/15',
                        'ysEndDate': '2018/09/16',
                        'sdtkDate': '2018/01/05',
                        'xmbbDate': '2018/01/15',
                        'lxwcDate': '2018/02/03',
                        'wcsjtzDate': '2018/02/16',
                        'sjgcljsDate': '2018/03/01',
                        'sgqclDate': '2018/03/18',
                        'dlsgDate': '2018/03/25',
                        'gdsgDate': '2018/05/20',
                        'fswzzDate': '2018/06/20',
                        'jgclDate': '2018/07/20',
                        'ystzclDate': '2018/08/20',
                        'ysgclhsDate': '2018/09/01',
                        'yswcDate': '2018/09/15'
                    }
                },
                'layerController': {
                    'arcgisWms': {
                        'lx_layerName': 'wqxwms',
                        'lx_fwx': '9',
                        'lx_ghys': '2,3',
                        'lx_tkfw': '4,5,10',
                        'sj_layerName': 'wqxwms',
                        'sj_fwx': '9',
                        'sj_ghys': '2,3',
                        'sj_tkfw': '4,5,10',
                        'jg_layerName': 'wqxyswms',
                        'jg_fwx': '0,1',
                        'jg_ghys': '2',
                        'jg_tkfw': '3,4,5',
                        'fh_layerName': 'wqfh',
                        'fh_fwx': '0,1,2,3',
                        'fh_ghys': '4,5,6',
                        'fh_tkfw': '7,8,9',
                        'eddt_layerName': 'wqxyswms',
                        'eddt_layers': '6,7'
                    },
                    'modelSet': {
                        'sgq_model': 'hzyz',
                        'sgh_model': 'hzyz',
                        'modelUp': 20,
                        'modelDown': -20
                    }
                }
            }
        }
        return config.itemConfig
    },

}

// 定义时间轴所需的定时器类
function ItemInterval(this: any) {
    const that = this
    that.intervalCotroller = null
    that.timer = 0
    that.playSpeed = 1
    // 开始
    that.start = (callback, timeout, timeLength, itemProgressFlag) => {
        return new Promise( (resolve) => {
            if (itemProgressFlag) {
                resolve(1)
            }
            that.clearCurrentInterval()
            that.intervalCotroller = setInterval( () => {
                if (timeLength) {
                    const progress = that.timer / timeLength * 100
                    callback(progress)
                    that.timer += timeout * that.playSpeed
                    if (that.timer >= timeLength) {
                        callback(100)
                        that.clearCurrentInterval()
                        that.timer = 0
                        resolve(1)
                    }
                } else {
                    callback()
                }
            }, timeout)
        })
    }
    // 暂停
    that.pause = function () {
        this.clearCurrentInterval()
    }
    // 重新播放
    that.initInterval = (callback, obj) => {
        that.clearCurrentInterval()
        that.timer = 0
        if (callback) {
            callback(obj) // 传入设定值
        }
    }
    // 清除定时器
    that.clearCurrentInterval = () => {
        if (that.intervalCotroller) {
            clearInterval(that.intervalCotroller)
            that.intervalCotroller = null
        }
    }


}
// 子节点位置控制类
function NodeDomManager(this: any) {
    // 修改子节点位置
    this.showItemChildNode = (nodeId, left, top) => {
        const dom = document.getElementById(nodeId) as HTMLElement
        // @ts-ignore
        dom.style.position = 'absolute'
        // @ts-ignore
        dom.style.left = left
        // @ts-ignore
        dom.style.top = top
        // @ts-ignore
        dom.style.display = 'block'
        // @ts-ignore
        let domWidth : any = '0'
        if (!document.defaultView) {
            // @ts-ignore
            domWidth = dom.currentStyle.width
        } else {
            domWidth = document.defaultView.getComputedStyle(dom).width
        }
        // @ts-ignore
        const domMargin = '-' + parseInt(domWidth, 10) / 2 + 'px'
        dom.style.marginLeft = domMargin
    }
    // 隐藏所有子节点的标记
    this.hideItemChildNode = () => {
        this._hideNode('sdtk')
        this._hideNode('xmbb')
        this._hideNode('lxwc')
        this._hideNode('wcsjtz')
        this._hideNode('sjgcljs')
        this._hideNode('sgqcl')
        this._hideNode('dlsg')
        this._hideNode('gdsg')
        this._hideNode('fswzz')
        this._hideNode('jgcl')
        this._hideNode('ystzcl')
        this._hideNode('ysgclhs')
    }
    // 隐藏节点方法
    this._hideNode = (nodeId) => {
        // @ts-ignore
        document.getElementById(nodeId).style.display = 'none'
    }
}


export default TimelineClass
