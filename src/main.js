// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import api from './apis/api'
import common from './apis/common'
import router from './router'
import Element from 'element-ui'
import * as filters from './filters' // global filters
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import i18n from './lang' // Internationalization
import '@/styles/index.scss' // global css
import "babel-polyfill"
import './permission'
import './icons' // icon
import './errorLog' // error log
import store from './store'
Vue.config.productionTip = false
Vue.use(Element, {
    size: 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});
// Vue.prototype.$t = (data) => data;

Vue.prototype.$api = api;
Vue.prototype.$common = common;
import SvgIcon from '@/components/SvgIcon' // svg组件
import VCharts from 'v-charts'; // v-charts
Vue.use(VCharts);
import echarts from 'echarts';
// vue-echarts
import VECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
Vue.component('svg-icon', SvgIcon)
Vue.component('v-echart', VECharts);
import VueCodeMirror from 'vue-codemirror-lite'
Vue.use(VueCodeMirror);
// require htmlmixed mode
require('codemirror/mode/vue/vue.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/php/php.js');
require('codemirror/mode/sql/sql.js');

// require hint addon for javacript
require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/javascript-hint.js');
require('codemirror/addon/hint/sql-hint.js');

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});



// register globally
Vue.config.productionTip = false;

let configPath = './static/config.json';
// console.log(process)
if (process.env.NODE_ENV === 'development') {
    configPath = '../static/config.json';
}

import axios from "axios";
axios({
        method: "get",
        url: configPath,
    })
    .then((response) => {
        const datas = response.data;
        console.log(datas)
        Vue.prototype.$api.ip = datas.ip;
        Vue.prototype.$api.ws = datas.ws;
        new Vue({
            el: '#app',
            router,
            store,
            i18n,
            template: '<App/>',
            components: {
                App
            }
        });
    })