import request from '@/utils/request'

const roleApi = {
    // role 角色(权限)相关
    AssignMenu: '/v1/role/assign-menu', // 角色分配菜单
    AssignUser: '/v1/role/assign-user', // 角色分配用户
    CreateRole: '/v1/role/create', // 创建角色
    DeleteRole: '/v1/role/delete', // 删除角色
    GetRoleById: '/v1/role/get', // 根据id获取角色
    GetRoleList: '/v1/role/list', // 获取角色列表
    GetRolePageList: '/v1/role/page', // 分页获取角色列表
    GetSelectedMenuById: '/v1/role/selected-menus', // 根据ID获取角色已分配菜单
    GetSelectedUserById: '/v1/role/selected-users', // 根据ID获取角色已分配的用户ID
    UpdateRole: '/v1/role/update' // 更新角色
}

export function assignMenu (parameter) {
  return request({
    url: roleApi.AssignMenu,
    method: 'post',
    data: parameter
  })
}

export function assignUser (parameter) {
  return request({
    url: roleApi.AssignUser,
    method: 'post',
    data: parameter
  })
}

export function createRole (parameter) {
  return request({
    url: roleApi.CreateRole,
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return request({
    url: roleApi.DeleteRole,
    method: 'post',
    data: parameter
  })
}

export function getRoleById (parameter) {
  return request({
    url: roleApi.GetRoleById,
    method: 'post',
    data: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: roleApi.GetRoleList,
    method: 'post',
    data: parameter
  })
}

export function getRolePageList (parameter) {
  return request({
    url: roleApi.GetRolePageList,
    method: 'post',
    data: parameter
  })
}

export function getSelectedMenuById (parameter) {
  return request({
    url: roleApi.GetSelectedMenuById,
    method: 'post',
    data: parameter
  })
}

export function getSelectedUserById (parameter) {
  return request({
    url: roleApi.GetSelectedUserById,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return request({
    url: roleApi.UpdateRole,
    method: 'post',
    data: parameter
  })
}
