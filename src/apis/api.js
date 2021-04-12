/* eslint-disable */

import axios from 'axios/index';
import {
    getToken,
    getName
} from '@/utils/auth' // getToken from cookie
import store from '../store';

const xmlHttpRequestError = [
    '无效session',
    '无效token',
    '用户非法使用token',
    'token过期',
    'token未激活',
    'token不存在',
];
const xmlHttpRequestSsoError = [
    '无效session: session不存在',
    '无效session: session过期',
];

let api = {};

/*
 * 设置请求限制
 * */

// 在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 1;
axios.defaults.retryDelay = 500;

// 创建axios实例 axiso的一些基础参数配置,
const service = axios.create({
    // baseURL: process.env.BASE_API, // 配置在config/prod.env里的baseApi
    timeout: 50000 // 超时时间
});

// // POST 传参序列化
// service.interceptors.request.use(function (config) {
//   config.data = qs.stringify(config.data, {arrayFormat: 'brackets'});
//   config.headers = {
//     'X-Requested-With': 'XMLHttpRequest',
//     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//   };
//   return config
// }, function (error) {
//   return Promise.reject(error)
// });

// 配置请求参数
service.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }

    // Increase the retry count
    config.__retryCount++;

    // Create new promise to handle exponential backoff
    let backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});

// 服务处理回复
function handleReply(data, vm, callback, errCallback) {
    if (data.status === 200) {
        if (data.data.error && data.data.error !== '') {
            window.console.log('错误数据', data);
            if (xmlHttpRequestError.indexOf(data.data.error) !== -1) {
                store.dispatch('FedLogOut').then(() => {
                    vm.$message.error('您的账号在另一地点登录，请重新登录');
                    // router.push({path: '/login'});
                    setTimeout(() => {
                        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
                    }, 1000)
                })
            } else if (xmlHttpRequestSsoError.indexOf(data.data.error) !== -1) {
                store.dispatch('FedLogOut').then(() => {
                    vm.$message.error('统一认证登陆失效，请重新登录');
                    setTimeout(() => {
                        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
                    }, 1000)
                })
            } else {
                if (data.data.error === '字段值重复:[Name]') {
                    vm.$message.error(data.data.error);
                    errCallback && errCallback(data.data, data.data.error);
                } else {
                    vm.$message.error(data.data.error);
                    errCallback && errCallback(data.data);
                }
            }
        } else {
            callback && callback(data.data);
        }
    } else if (data.status === 404) {
        vm.$router.push('404');
    } else if (data.status === 403) {
        vm.$router.push('403');
    } else {
        vm.$router.push('503');
    }
}

// 主服务处理函数 - POST
function serviceHandler(serverUrl, {
    params,
    vm,
    callback,
    errCallback
}) {
    return service.post(serverUrl + '?token=' + getToken() + '&user=' + getName(), params).then(data => {
        handleReply(data, vm, callback, errCallback);
    }).catch(error => {
        console.log(error);
        console.log(error.config);
        vm.$message.error('服务器请求失败');
        errCallback && errCallback(error);
    })
}

// 主服务处理函数 - GET
function serviceGetHandler(serverUrl, {
    params,
    vm,
    callback,
    errCallback
}) {
    let dataParams = '';
    for (let key in params) {
        if (dataParams) {
            dataParams += "&"
        }
        dataParams += encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    }
    if (dataParams) dataParams = '?' + dataParams;
    return service.get(serverUrl + dataParams).then(data => {
        handleReply(data, vm, callback, errCallback);
    }).catch(error => {
        // console.log(error);
        // console.log(error.config);
        vm.$message.error('服务器请求失败');
        errCallback && errCallback(error);
    })
}

api.login = function(params, vm, callback, errCallback) {
    params.agent = 'web';
    serviceHandler(api.ip + '/aa/login', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.updateUser = function(params, vm, callback, errCallback) {
    params.agent = 'web';
    serviceHandler(api.ip + '/aa/updateUser', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.save = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/rdm/save', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.saveM = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/rdm/savem', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.update = function(params, vm, callback, errCallback) {
    delete params.params.created_time;
    serviceHandler(api.ip + '/rdm/update', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.updateM = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/rdm/updatem', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.get = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/rdq/query', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.wf = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/wf/' + params.key, {
        params,
        vm,
        callback,
        errCallback
    });
};

api.del = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/rdm/del', {
        params,
        vm,
        callback,
        errCallback
    });
};

api.ext = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/ext/' + params.key, {
        params,
        vm,
        callback,
        errCallback
    });
};

api.mpm = function(params, vm, callback, errCallback) {
    serviceHandler(api.ip + '/mpm/' + params.key, {
        params,
        vm,
        callback,
        errCallback
    });
};

//上传附件的地址
api.upload = function() {
    return api.ip + '/file/upload?token=' + getToken() + '&user=' + getName();
};

//下载
api.download = function(path) {
    path = path || '';
    return api.ip + '/file/download' + '?' + 'path=' + path;
};

//预览
api.preview = function(path) {
    path = path || '';
    return api.ip + '/api/download' + '?preview=true' + '&path=' + path;
};

// 通过token获取用户信息
api.getCheckLogin = function() {
    let params = {};
    params.user = getName();
    params.token = getToken();
    params.agent = 'web';
    console.log(api.ip)
    return service.post(api.ip + '/aa/checkLogin', params);
};

export default api;