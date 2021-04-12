import {asyncRouterMap, constantRouterMap} from '@/router'

/**
 * 权限过滤
 */
function conversion(oArr, arr, parent) {
  if (oArr && oArr.length) {
    oArr.forEach(item => {
      item.access = true;
      if (parent) {
        item.parent = parent;
      }
      if (!item.hidden) {
        item.access = false;
        if (item.children) {
          conversion(item.children, arr, item);
        } else {
          item.access = false;
          let it = arr.find(it => {
            return it.resources === item.key
          });
          if (it) {
            item.access = true;
            item.meta.permissions = it.operations;
            if (item.parent) {
              item.parent.access = true;
            }
          }
        }
      }
    });
  }
  return oArr
}

function conversionAll(oArr) {
  oArr.map(oItem => {
    oItem.access = true;
    if (oItem.children) {
      conversionAll(oItem.children);
    }
  });
  return oArr
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    modules: false,
    all_routers: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      // console.log(routers);
      state.routers = constantRouterMap.concat(routers);
    },
    
    SET_MODULES: (state, modules) => {  //储存权限
      state.modules = modules;
    }
  },
  actions: {
    
    generateRoutes({state, commit}, data) {
      return new Promise(resolve => {
        let accessedRouters;
        if (data === 'admin') { // 调试阶段不验证权限
          accessedRouters = conversionAll(asyncRouterMap);
        } else {
          accessedRouters = conversion(asyncRouterMap, data);
        }
        state.all_routers = constantRouterMap.concat(accessedRouters);
        commit('SET_ROUTERS', accessedRouters.filter(item => {
          return item.access
        }));
        resolve()
      })
    },
    
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        const {roles} = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
