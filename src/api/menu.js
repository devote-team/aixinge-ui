import request from '@/utils/request'

const menuApi = {
  GetAuthMenu: '/v1/menu/auth', // 获取当前用户已授权菜单
  CreateMenu: '/v1/menu/create', // 创建菜单
  DeleteMenu: '/v1/menu/delete', // 参数菜单
  GetMenuById: '/v1/menu/get', // 根据ID获取菜单
  GetMenuList: '/v1/menu/list', // 获取菜单列表
  GetMenuListTree: '/v1/menu/list-tree', // 获取菜单列表树
  GetMenuPageList: '/v1/menu/page', // 分页获取菜单
  UpdateMenu: '/v1/menu/update' // 更新菜单信息
}

export function getAuthMenu (parameter) {
  return request({
    url: menuApi.GetAuthMenu,
    method: 'post',
    params: parameter
  })
}

export function createMenu (parameter) {
  return request({
    url: menuApi.CreateMenu,
    method: 'post',
    params: parameter
  })
}

export function updateMenu (parameter) {
  return request({
    url: menuApi.UpdateMenu,
    method: 'post',
    params: parameter
  })
}

export function deleteMenu (parameter) {
  return request({
    url: menuApi.DeleteMenu,
    method: 'post',
    params: parameter
  })
}

export function getMenuById (parameter) {
  return request({
    url: menuApi.GetMenuById,
    method: 'post',
    params: parameter
  })
}

export function getMenuList (parameter) {
  return request({
    url: menuApi.GetMenuList,
    method: 'post',
    data: parameter
  })
}

export function getMenuListTree (parameter) {
  return request({
    url: menuApi.GetMenuListTree,
    method: 'post',
    data: parameter
  })
}

export function getMenuPageList (parameter) {
    return request({
      url: menuApi.GetMenuPageList,
      method: 'post',
      data: parameter
    })
  }
