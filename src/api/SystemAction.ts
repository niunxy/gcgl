import http from '../utils/HttpClient'

/**
 * @author ny
 * @desc 系统管理 菜单管理
 * @param params 
 */
const AddMenu = (params) => {
  return http.post('/menu/addMenu', params)
}
const UpdateMenu = (params) => {
  return http.post('/menu/updateMenu', params)
}

const MenuManageEdit = () => {
  return http.get('/getCode?t=' + Date.now(), null)
}

const QueryAllMenu = (params) => {
  return http.get('/menu/queryAllMenu', params)
}

const QueryMenuById = (params) => {
  return http.get('/menu/queryMenuById', params)
}
const Delete = (params) => {
  return http.post('/menu/del', params)
}

/**
 * @author ny
 * @desc 系统管理 用户管理
 * @param params 
 */


/**
 * @author ny
 * @desc 系统管理 角色管理
 * @param params 
 */
const AddRole = (params) => {
  return http.post('/role/addRole', params)
}

const DelRole = (params) => {
  return http.post('/role/del', params)
}

const UpdateRole = (params) => {
  return http.post('/role/updateRole', params)
}

const QueryAllRoles = (params) => {
  return http.get('/role/queryAllRole', params)
}

const QueryRoleById = (params) => {
  return http.get('/role/queryRoleById', params)
}
/**
 * @author ny
 * @desc 系统管理 部门管理
 * @param params 
 */
const AddDept = (params) => {
  return http.post('/dept/addDept', params)
}

const DelDept = (params) => {
  return http.post('/dept/del', params)
}

const UpdateDept = (params) => {
  return http.post('/dept/updateDept', params)
}

const QueryAllDept = (params) => {
  return http.get('/dept/queryAllDept', params)
}

const QueryDeptById = (params) => {
  return http.get('/dept/queryDeptById', params)
}
const GetDeptByRoleManager = (params) => {
  return http.get('/dept/getDeptByRoleManager', params)
}
/**
 * @author ny
 * @desc 系统管理 权限管理
 * @param params 
 */
const GetDeptAndRole = (params) => {
  return http.get('/dept/getDeptAndRole', params)
}

const QueryMenuByDeptAndRole = (params) => {
  return http.get('/menu/queryMenuByDeptAndRole', params)
}

const AddMenuForRole = (params) => {
  return http.post('/role/addMenuForRole', params)
}
/**
 * @author ny
 * @desc 系统管理 账号管理
 * @param params 
 */
const AddUser = (params) => {
  return http.post('/user/addUser', params)
}

const QueryAllUser = (params) => {
  return http.get('/user/queryAllUser', params)
}

const DelUser = (params) => {
  return http.post('/user/del', params)
}

const ResetUser = (params) => {
  return http.post('/user/resetPass', params)
}

const UpdateUser = (params) => {
  return http.post('/user/updateUser', params)
}

const QueryUserById = (params) => {
  return http.get('/user/queryUserById', params)
}

const ActivateUser = (params) => {
  return http.post('/user/activateUser', params)
}

const CheckUser = (params) => {
  return http.get('/user/checkUser', params)
}

const DelCerti = (params) => {
  return http.delete('/user/delCerti', params)
}

/**
 * @author ny
 * @desc 系统管理 模型管理
 * @param params 
 */
const QueryAllAm = (params) => {
  return http.get('/act/showAm', params)
}

const DelModel = (params) => {
  return http.post('/act/delModel', params)
}

const PublishModel = (params) => {
  return http.post('/act/open', params)
}

/**
 * @author ny
 * @desc 系统管理 流程管理
 * @param params 
 */
const QueryAllAct = (params) => {
  return http.get('/act/showAct', params)
}

const DelDeploy = (params) => {
  return http.post('/act/delDeploy', params)
}

const ManagerProcess = (params) => {
  return http.get('/act/managerProcess', params)
}


export default {
  AddMenu,
  UpdateMenu,
  MenuManageEdit,
  QueryAllMenu,
  QueryMenuById,
  Delete,
  AddRole,
  QueryAllRoles,
  QueryRoleById,
  DelRole,
  UpdateRole,
  AddDept,
  DelDept,
  UpdateDept,
  QueryAllDept,
  QueryDeptById,
  GetDeptByRoleManager,
  GetDeptAndRole,
  QueryMenuByDeptAndRole,
  AddMenuForRole,
  AddUser,
  QueryAllUser,
  DelUser,
  ResetUser,
  UpdateUser,
  QueryUserById,
  ActivateUser,
  CheckUser,
  QueryAllAm,
  DelModel,
  PublishModel,
  QueryAllAct,
  DelDeploy,
  ManagerProcess,
  DelCerti,
}