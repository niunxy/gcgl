/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-12-12 13:09:33
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-10 10:02:02
 */
import {
    observable,
    action
} from 'mobx'

export interface IMobxStore {
    preItemDetail: any,
    homeSiderMenu: any,
    mapLoaded: boolean,
    viewConfigLoaded: boolean,
    mapShow: boolean,
    showPlot: boolean,
    viewerCamera: any
}

class MapStore {

    /**
     * @desc map 对象是否创建成功
     *
     * @type {boolean}
     * @memberof MapStore
     */
    @observable
    mapLoaded: boolean = false

    /**
     * @desc view 相关参数创建
     *
     * @type {boolean}
     * @memberof MapStore
     */
    @observable
    viewConfigLoaded: boolean = false


    @observable
    mapShow: boolean = true

    @observable
    preItemDetail: any = {
        isEditable: false,
        detailData: {},
        option: [],
        area: []
    }

    @observable
    homeSiderMenu: any = {
        refresh: false,
        collapsed: false,
        openKeys: [],
        indexMenus: []
    }

    @observable
    projectInfo: any = {
        id: '',
        processInstanceId: '',
        bgcs: '',
        userId: '',
        userName: '',
        xmmc: '',
        province: '',
        city: '',
        county: '',
        xmjd: 0
    }

    @observable
    parentXm: string = ''

    @observable
    xmId: string = ''

    @observable
    xmFbId: string = ''

    @observable
    xmName: string = ''

    @observable
    xmScreenId: string = ''

    @observable
    showPlot: boolean = false

    @observable
    stopXm: any = {
        id: '',
        county: ''
    }

    @observable
    viewerCamera: any = {
        x: 109.16,
        y: 35.80,
        z: 1500000.0,
        heading: 0.0,
        pitch: -1.5707964,
        roll: 0.0
    }

    @observable
    polygons: number[] = []

    @action
    onMapCreate = (mapParam) => {
        global.map = mapParam
        this.mapLoaded = true
    }

    @action
    onViewConfigCreate = (viewConfig) => {
        global.viewConfig = viewConfig
        this.viewConfigLoaded = true
    }

    @action
    onMapShow = (param) => {
        this.mapShow = param
    }

    @action
    onPreItemDetail = (param) => {
        this.preItemDetail = param
    }

    @action
    onHomeSiderMenu = (param) => {
        this.homeSiderMenu = param
    }

    @action
    saveXmId = (xmId) => {
        this.xmId = xmId
    }

    @action
    saveXmFbId = (xmId) => {
        this.xmFbId = xmId
    }

    @action
    saveXmName = (xmName) => {
        this.xmName = xmName
    }

    @action
    loadParentXm = (parentXm) => {
        this.parentXm = parentXm
    }

    @action
    saveXmScreenId = (xmId) => {
        this.xmScreenId = xmId
    }

    @action
    saveProjectInfo = (info) => {
        this.projectInfo = info
    }

    @action
    onShowPlot = (show) => {
        this.showPlot = show
    }

    @action
    saveStopXm = (obj) => {
        this.stopXm = obj
    }

    @action
    onViewerCamera = (param) => {
        this.viewerCamera = param
    }
    // 保存分包所画多边形
    @action
    onSaveParcelPoly = (param) => {
        this.polygons = param
    }
    // 清空分包多边形数据
    @action
    onClearParcelPoly = () => {
        this.polygons = []
    }
}

export default new MapStore()