/*
 * @Author: your name
 * @Date: 2019-12-12 16:52:25
 * @LastEditTime : 2019-12-27 10:23:59
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesium-react-webpack-demof:\work\gcgl\src\api\IndexAction.ts
 */
import http from '../utils/HttpClient'

/**
 * @author ny
 * @desc 创建项目
 * @param params 
 */

const Create = (params) => {
   return http.post('/xmjbxx/addXmjbxx', params)
}

const Edit = (params) => {
   return http.post('/xmjbxx/updateXmjbxx', params)
}

const QueryAllXzqh = (params) => {
   return http.get('/xmjbxx/queryAllXzqh', params)
}

/**
 * @author ny
 * @desc 验证项目名称
 * @param params 
 */

const ValidateName = (params) => {
   return http.get('/xmjbxx/queryXmmc', params)
}

/**
 * @author ny
 * @desc 验证项目编号
 * @param params 
 */

const ValidateCode = (params) => {
   return http.get('/xmjbxx/queryXmbh', params)
}

/**
 * @author ny
 * @desc 获取首页菜单数据
 * @param params 
 */

const GetIndexMenu = (params) => {
   return http.get('/xmjbxx/queryHistoryXm', params)
}

const GetDetail = (params) => {
   return http.get('/xmjbxx/queryXmxxById', params)
}

const GetHomeFolderByXmId = (params) => {
   return http.get('/xmzlqd/getHomeFolderByXmId', params)
}

const GetSubProjectByXmId = (params) => {
   return http.get('/xmjbxx/getSubProjectByXmId', params)
}

const GetPlot = (params) => {
   return http.get('/plot', params)
}

const PostPlot = (params) => {
   return http.post('/plot', params)
}

const PlotScreen = (params) => {
   return http.post('/plot/screen', params)
}

const PlotDownload = (params) => {
   return http.post('/plot/download', params)
}

const GetReceiver = (params) => {
   return http.get('/plot/receiver', params)
}

const PostDistribute = (params) => {
   return http.post('/plot/distribute', params)
}

const PlotConfirm = (params) => {
   return http.post('/plot/confirm', params)
}

const PlotCancel = (params) => {
   return http.post('/plot/cancel', params)
}

const PlotContractor = (params) => {
   return http.get('/plot/subcontractor', params)
}

const StopActivity = (params) => {
   return http.get('/xmzlqd/nineteenStepButton', params)
}

const PlotSub = (params) => {
   return http.post('/plot/subpackage', params)
}
const GetPlotSub = (params) => {
   return http.get('/plot/subpackage', params)
}

const PlotFinish = (params) => {
   return http.post('/plot/finish', params)
}


export default {
   Create,
   Edit,
   QueryAllXzqh,
   ValidateName,
   ValidateCode,
   GetIndexMenu,
   GetHomeFolderByXmId,
   GetSubProjectByXmId,
   GetDetail,
   GetPlot,
   PostPlot,
   PlotScreen,
   PlotDownload,
   GetReceiver,
   PostDistribute,
   PlotConfirm,
   PlotCancel,
   PlotContractor,
   StopActivity,
   PlotSub,
   GetPlotSub,
   PlotFinish,
}