import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken,
    getName
} from '@/utils/auth' // getToken from cookie
import api from './apis/api';

NProgress.configure({
        showSpinner: false
    }) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    const token = getToken();
    const name = getName();
    if (token) { // determine if there has token
        /* has token*/
        if (to.path === '/login') {
            next({
                path: '/'
            });
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            // debugger
            if (store.getters.modules === false) { // 是否第一次加载
                // console.log(to);
                if (name) { //有账号
                    api.getCheckLogin().then(data => {
                        // console.log(data);
                        if (data.data.data) {
                            store.commit('SET_TOKEN', token); // 储存token
                            store.commit('SET_NAME', name); // 储存name
                            store.commit('SET_USER', data.data.data.extra); // 储存用户信息

                            if (name === 'root') {
                                store.commit('SET_USER', {
                                    id: 0,
                                    name: 'root',
                                }); // 储存用户信息
                                store.commit('SET_MODULES', 'admin'); // 跳过
                                store.dispatch('generateRoutes', 'admin'); // 跳过
                                router.addRoutes(store.getters.addRouters); // 跳过
                                next({
                                    ...to,
                                    replace: true
                                });
                                return
                            }

                            let vars = {
                                key: 'userProfile',
                                name,
                            };
                            api.mpm(vars, this, data => {
                                // console.log(data);
                                store.commit('SET_MODULES', 'admin'); // 跳过
                                // this.$store.dispatch('generateRoutes', 'admin');  // 跳过
                                // this.$router.addRoutes(this.$store.getters.addRouters); // 跳过
                                store.dispatch('generateRoutes', data.data.permissions);
                                router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                                next({
                                    ...to,
                                    replace: true
                                }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                            });
                        } else {
                            store.dispatch('FedLogOut').then(() => {
                                Message.error('验证失败，请重新登录');
                                next({
                                    path: '/login'
                                })
                            })
                        }
                    }).catch(() => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error('验证失败，请重新登录');
                            next({
                                path: '/login'
                            })
                        })
                    });
                } else {
                    store.dispatch('FedLogOut').then(() => {
                        Message.error('登陆超时，请重新登录');
                        next({
                            path: '/login'
                        })
                    })
                }
            } else {
                // console.log(to);
                // console.log(from);
                next();
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login'); // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})