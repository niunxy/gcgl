/*
 * @Author: your name
 * @Date: 2019-11-20 16:26:28
 * @LastEditTime: 2019-12-03 11:35:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gcgl\src\api\UploadAction.ts
 */
import http from '../utils/HttpClient'

/**
 * @author ny
 * @desc 资料
 * @param params 
 */
const QueryAllTemplate = (params) => {
  return http.get('/template/queryAllTemplate', params)
}

const UploadTemplate = (params) => {
  return http.post('/template/uploadTemplate', params)
}

const DelTemplate = (params) => {
  return http.post('/template/del', params)
}

const QueryUnFinshXm = (params) => {
  return http.get('/xmjbxx/queryHistoryXm', params)
}

const QueryAllXmInfo = (params) => {
  return http.get('/xmjbxx/queryAllXmInfo', params)
} 

const GetSupplementFolder = (params) => {
  return http.get('/folder/getSupplementFolder', params)
}

const QueryFolderInfoByXmId = (params) => {
  return http.get('/folder/queryFolderInfoByXmId', params)
}

const GetXmmcForZlqd = (params) => {
  return http.get('/xmzlqd/getXmmcForZlqd', params)
}

const GetFolederByXmId = (params) => {
  return http.get('/xmzlqd/getFolederByXmId', params)
}

const GetXmzlByIds = (params) => {
  return http.get('/xmzlqd/getXmzlByIds', params)
}

const DeleteFile = (params) => {
  return http.post('/xmzlqd/del', params)
}

const BatchDeleteFile = (params) => {
  return http.post('/xmzlqd/batchDel', params)
}

const SubmitXmzl = (params) => {
  return http.get('/xmzlqd/submitXmzl', params)
}

export default {
    QueryAllTemplate,
    UploadTemplate,
    DelTemplate,
    QueryUnFinshXm,
    QueryAllXmInfo,
    GetSupplementFolder,
    QueryFolderInfoByXmId,
    GetXmmcForZlqd,
    GetFolederByXmId,
    GetXmzlByIds,
    DeleteFile,
    BatchDeleteFile,
    SubmitXmzl,
}