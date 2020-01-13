/*
 * @Author: your name
 * @Date: 2019-11-27 10:51:54
 * @LastEditTime : 2020-01-02 11:23:50
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gcgl\src\api\InfoAction.ts
 */
import http from '../utils/HttpClient'

/**
 * @author ny
 * @desc 审批提醒
 * @param params 
 */
const List = (params) => {
  return http.post('/messages/list', params)
}

const GetUnreadTotal = (params) => {
  return http.get('/messages/unread/total', params)
}

const GetUnreadList = (id, params) => {
  return http.get(`/messages/${id}`, params)
}

const GetUnread = (params) => {
  return http.get('/messages/unread', params)
}

const GetApproveList = (params) => {
  return http.post('/approves/list', params)
}

const GetProjectList = (params) => {
  return http.get('/approves/projects', params)
}

const GetDetailById = (id, params) => {
  return http.get(`/approves/${id}`, params)
}

const Approve = (params) => {
  return http.post(`/approves`, params)
}

const ApproveAgree = (id, params) => {
  return http.post(`/approves/agree/${id}`, params)
}

const ApproveReject = (id, params) => {
  return http.post(`/approves/reject/${id}`, params)
}

const ApproveFinish = (id, assignTo, params) => {
  return http.post(`/approves/finish/${id}/${assignTo}`, params)
}

const ApproveRetry = (id, params) => {
  return http.post(`/approves/retry/${id}`, params)
}

const XmzlDel = (params) => {
  return http.post(`/xmzlqd/del`, params)
}

const MarkRead = (params) => {
  return http.post(`/messages/toread`, params)
}


export default {
  List,
  GetUnreadList,
  GetUnreadTotal,
  GetUnread,
  GetApproveList,
  GetProjectList,
  GetDetailById,
  Approve,
  ApproveAgree,
  ApproveReject,
  ApproveFinish,
  ApproveRetry,
  XmzlDel,
  MarkRead,
}