import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { getInfo, logout } from '@/api/login'
import { login, refreshToken } from '@/api/base'
import { getAuthMenu, getMenuListTree } from '@/api/menu'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome, deepAddCheckBoxAttrForArr } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    refreshtoken: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    menustree: [] // 所有可用的菜单
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, refreshtoken) => {
      state.refreshtoken = refreshtoken
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENUSTREE: (state, menustree) => {
      state.menustree = menustree
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 0) {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            storage.set(REFRESH_TOKEN, result.refreshToken, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_REFRESH_TOKEN', result.refreshToken)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.nickName, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve()
          } else {
            reject(new Error(response.msg || 'Login Failed'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    RefreshAT ({ commit }, RT) {
      return new Promise((resolve, reject) => {
        refreshToken({ refreshToken: RT }).then(response => {
          if (response.code === 0) {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            storage.set(REFRESH_TOKEN, result.refreshToken, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_REFRESH_TOKEN', result.refreshToken)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.nickName, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve()
          } else {
            reject(new Error(response.msg || 'Refresh Token Failed'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetAuthMenu ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getAuthMenu().then(response => {
          const { result } = response
          if (result.role && result.role.permissions.length > 0) {
            const role = { ...result.role }
            role.permissions = result.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            result.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            // 下游
            resolve(result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo().then(response => {
          const { result } = response
          if (result.role && result.role.permissions.length > 0) {
            const role = { ...result.role }
            role.permissions = result.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            result.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.nickName, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            // 下游
            resolve(result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取可用menu
    GetMenuListTree ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取menutree
        getMenuListTree().then(response => {
          const { data, code } = response
          if (code === 0) {
            const menulist = deepAddCheckBoxAttrForArr(data)
            commit('SET_MENUSTREE', menulist)
            // 下游
            resolve(menulist)
          } else {
            reject(new Error('GetMenuListTree: api got error'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
