import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout';
/* newLayout */
// import newLayout from '../views/layout-new/newLayout';
import newLayout from '../views/layout-version-1/version-1';
/* Holder */
import Holder from '../views/items/components/holder.vue';

const _import = require('./_import_' + process.env.NODE_ENV);
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);


/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
/*
 * by Gq
 * $disabled: true    权限树形结构不可操作
 * access: true    是否显示在左侧导航
 * */
export const constantRouterMap = [
    // {path: '/login', name: 'login', component: _import('login/index'), hidden: true},
    {
        path: '/login',
        name: 'login',
        component: _import('login-new/index'),
        hidden: true
    },
    {
        path: '/authredirect',
        name: 'authredirect',
        component: _import('login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        name: '404',
        component: _import('errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        name: '401',
        component: _import('errorPage/401'),
        hidden: true
    },
    {
        path: '',
        name: 'index',
        redirect: 'index/indexchild',
        access: true, //是否显示在左侧导航
        $disabled: true, //权限控制的默认不可取消
        meta: {
            title: '首页',
            icon: 'home_nav_16'
        },
        component: newLayout,
        children: [{
            path: 'index/indexchild',
            name: 'indexchild',
            key: 'index-indexchild',
            access: true, //是否显示在左侧导航
            $disabled: true, //权限控制的默认不可取消
            meta: {
                title: '首页',
                icon: 'home_nav_16',
                noCache: true
            },
            component: () =>
                import ('../views/items/dashboard/index.vue'),
        }]
    },
    { // hidden
        path: '/openViewBaseline',
        name: 'openViewBaseline',
        key: 'openViewBaseline',
        hidden: true,
        meta: {
            title: '查看基线',
            icon: '',
        },
        component: () =>
            import ('../views/items/安全基线/自定义基线/查看基线.vue'),
    },
    { // hidden
        path: '/bangcleCodeChecker',
        name: 'bangcleCodeChecker',
        key: 'bangcleCodeChecker',
        hidden: true,
        meta: {
            title: '源码',
            icon: '',
        },
        component: () =>
            import ('../views/items/检测报告/源码.vue'),
    },
    { // hidden
        path: '/bangcleAppTest',
        name: 'bangcleAppTest',
        key: 'bangcleAppTest',
        hidden: true,
        meta: {
            title: 'app检测',
            icon: '',
        },
        component: () =>
            import ('../views/items/检测报告/app检测.vue'),
    },
    { // hidden
        path: '/bangcleLoopholeChecker',
        name: 'bangcleLoopholeChecker',
        key: 'bangcleLoopholeChecker',
        hidden: true,
        meta: {
            title: 'web扫描',
            icon: '',
        },
        component: () =>
            import ('../views/items/检测报告/web扫描.vue'),
    },
];

export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

export const asyncRouterMap = [

    {
        path: '',
        name: 'myWork',
        meta: {
            title: '我的工单',
            icon: 'gongzuo_nav_16',
            showNumber: true,
        },
        component: newLayout,
        children: [{
                path: 'myWork/todoWork',
                name: 'todoWork',
                key: 'myWork-todoWork',
                meta: {
                    title: '待办工单',
                    icon: '',
                    showNumber: true,
                },
                component: () =>
                    import ('../views/items/我的工作/待办工作/待办工作.vue'),
            },
            {
                path: 'myWork/endWork',
                name: 'endWork',
                key: 'myWork-endWork',
                meta: {
                    title: '已完结工单',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/我的工作/待办工作/已完结工作.vue'),
            },
            { // hidden
                path: 'myWork/workflow',
                name: 'workflow',
                key: 'myWork-workflow',
                hidden: true,
                meta: {
                    title: '流程',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/我的工作/流程/流程.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'projectTask',
        meta: {
            title: '项目任务',
            icon: 'xiangmu_nav_16'
        },
        component: newLayout,
        children: [{
                path: 'projectTask/projectManagement',
                name: 'projectManagement',
                key: 'projectTask-projectManagement',
                meta: {
                    title: '项目管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '查看',
                    ],
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/项目管理.vue'),
            },
            { // hidden
                path: 'projectTask/addProject',
                name: 'addProject',
                key: 'projectTask-addProject',
                hidden: true,
                meta: {
                    title: '新建项目',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/新建项目.vue'),
            },
            { // hidden
                path: 'projectTask/editProject',
                name: 'editProject',
                key: 'projectTask-editProject',
                hidden: true,
                meta: {
                    title: '编辑项目',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/编辑项目.vue'),
            },
            { // hidden
                path: 'projectTask/viewProject',
                name: 'viewProject',
                key: 'projectTask-viewProject',
                hidden: true,
                meta: {
                    title: '查看项目',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/查看项目.vue'),
            },
            { // hidden
                path: 'projectTask/projectTask',
                name: 'projectTask',
                key: 'projectTask-projectTask',
                hidden: true,
                meta: {
                    title: '项目任务',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/项目任务.vue'),
            },
            { // hidden
                path: 'projectTask/securityPortrait',
                name: 'securityPortrait',
                key: 'projectTask-securityPortrait',
                hidden: true,
                meta: {
                    title: '安全画像',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/项目管理/安全画像.vue'),
            },
            // {
            //   path: 'projectTask/projectQuery',
            //   name: 'projectQuery',
            //   key: 'projectTask-projectQuery',
            //   meta: {
            //     title: '项目查询',
            //     icon: '',
            //   },
            //   component: () => import('../views/items/项目任务/项目查询/项目查询.vue'),
            // },
            {
                path: 'projectTask/taskManagement',
                name: 'taskManagement',
                key: 'projectTask-taskManagement',
                meta: {
                    title: '任务管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新建',
                        '关闭/恢复',
                        // '人员',
                    ],
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/任务管理.vue'),
            },
            { // hidden
                path: 'projectTask/addTask',
                name: 'addTask',
                key: 'projectTask-addTask',
                hidden: true,
                meta: {
                    title: '新建任务',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/新建任务.vue'),
            },
            { // hidden
                path: 'projectTask/editTask',
                name: 'editTask',
                key: 'projectTask-editTask',
                hidden: true,
                meta: {
                    title: '编辑任务',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/新建任务.vue'),
            },
            { // hidden
                path: 'projectTask/viewTask',
                name: 'viewTask',
                key: 'projectTask-viewTask',
                hidden: true,
                meta: {
                    title: '查看任务',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/查看任务.vue'),
            },
            {
                path: 'taskManagement/taskParameter',
                name: 'taskParameter',
                key: 'taskManagement-taskParameter',
                meta: {
                    title: '任务台账',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/任务台账.vue'),
            },
            { // hidden
                path: 'projectTask/taskWorkflow',
                name: 'taskWorkflow',
                key: 'projectTask-taskWorkflow',
                hidden: true,
                meta: {
                    title: '任务流程',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/任务流程.vue'),
            },
            { // hidden
                path: 'projectTask/workflowDetails',
                name: 'workflowDetails',
                key: 'projectTask-workflowDetails',
                hidden: true,
                meta: {
                    title: '流程详情',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/流程详情.vue'),
            },
            { // hidden
                path: 'projectTask/reportDetails',
                name: 'reportDetails',
                key: 'projectTask-reportDetails',
                hidden: true,
                meta: {
                    title: '报告详情',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/项目任务/任务管理/报告详情.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'baselineManagement',
        meta: {
            title: '安全基线',
            icon: 'anquanjixian_nav_16'
        },
        component: newLayout,
        children: [
            // 自定义基线
            {
                path: 'baselineManagement/customizeBaseline',
                name: 'customizeBaseline',
                key: 'baselineManagement-customizeBaseline',
                meta: {
                    title: '基线管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '版本',
                        '状态控制',
                        '删除',
                    ],
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/所有基线.vue'),
            },
            { // hidden
                path: 'baselineManagement/addBaseline',
                name: 'addBaseline',
                key: 'baselineManagement-addBaseline',
                hidden: true,
                meta: {
                    title: '新建基线',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/新建基线.vue'),
            },
            { // hidden
                path: 'baselineManagement/editBaseline',
                name: 'editBaseline',
                key: 'baselineManagement-editBaseline',
                hidden: true,
                meta: {
                    title: '编辑基线',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/编辑基线.vue'),
            },
            { // hidden
                path: 'baselineManagement/derivedBaseline',
                name: 'derivedBaseline',
                key: 'baselineManagement-derivedBaseline',
                hidden: true,
                meta: {
                    title: '派生基线',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/派生基线.vue'),
            },
            { // hidden
                path: 'baselineManagement/baselineVersion',
                name: 'baselineVersion',
                key: 'baselineManagement-baselineVersion',
                hidden: true,
                meta: {
                    title: '基线版本',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/基线版本.vue'),
            },
            { // hidden
                path: 'baselineManagement/viewBaseline',
                name: 'viewBaseline',
                key: 'baselineManagement-viewBaseline',
                hidden: true,
                meta: {
                    title: '查看基线',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/查看基线.vue'),
            },
            { // hidden
                path: 'baselineManagement/viewBaselineSSandC',
                name: 'viewBaselineSSandC',
                key: 'baselineManagement-viewBaselineSSandC',
                hidden: true,
                meta: {
                    title: '查看基线',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义基线/查看基线-视图和标准.vue'),
            },

            {
                path: 'safetyStandards/safetyStandards',
                name: 'safetyStandards',
                key: 'safetyStandards-safetyStandards',
                meta: {
                    title: '标准管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '版本',
                    ],
                },
                component: () =>
                    import ('../views/items/安全标准/自定义标准/安全标准.vue'),
            },
            { // hidden
                path: 'safetyStandards/addSafetyStandard',
                name: 'addSafetyStandard',
                key: 'safetyStandards-addSafetyStandard',
                hidden: true,
                meta: {
                    title: '新建安全标准',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全标准/自定义标准/新建安全标准.vue'),
            },
            { // hidden
                path: 'safetyStandards/editSafetyStandard',
                name: 'editSafetyStandard',
                key: 'safetyStandards-editSafetyStandard',
                hidden: true,
                meta: {
                    title: '编辑安全标准',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全标准/自定义标准/新建安全标准.vue'),
            },
            { // hidden
                path: 'safetyStandards/safetyStandardVersion',
                name: 'safetyStandardVersion',
                key: 'safetyStandards-safetyStandardVersion',
                hidden: true,
                meta: {
                    title: '安全标准版本',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全标准/自定义标准/安全标准版本.vue'),
            },
            { // hidden
                path: 'safetyStandards/viewSafetyStandard',
                name: 'viewSafetyStandard',
                key: 'safetyStandards-viewSafetyStandard',
                hidden: true,
                meta: {
                    title: '查看安全标准',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全标准/自定义标准/查看安全标准.vue'),
            },

            // 自定义视图
            {
                path: 'baselineManagement/customizeView',
                name: 'customizeView',
                key: 'baselineManagement-customizeView',
                meta: {
                    title: '视图管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '版本',
                    ],
                },
                component: () =>
                    import ('../views/items/安全基线/自定义视图/基线视图.vue'),
            },
            { // hidden
                path: 'baselineManagement/addBaselineView',
                name: 'addBaselineView',
                key: 'baselineManagement-addBaselineView',
                hidden: true,
                meta: {
                    title: '新建基线视图',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义视图/新建基线视图.vue'),
            },
            { // hidden
                path: 'baselineManagement/editBaselineView',
                name: 'editBaselineView',
                key: 'baselineManagement-editBaselineView',
                hidden: true,
                meta: {
                    title: '编辑基线视图',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义视图/新建基线视图.vue'),
            },
            { // hidden
                path: 'baselineManagement/baselineViewVersion',
                name: 'baselineViewVersion',
                key: 'baselineManagement-baselineViewVersion',
                hidden: true,
                meta: {
                    title: '基线视图版本',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义视图/基线视图版本.vue'),
            },
            { // hidden
                path: 'baselineManagement/viewBaselineView',
                name: 'viewBaselineView',
                key: 'baselineManagement-viewBaselineView',
                hidden: true,
                meta: {
                    title: '查看基线视图',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/自定义视图/查看基线视图.vue'),
            },
            // 属性标签
            {
                path: 'metadataManagement/attribute',
                name: 'attribute',
                key: 'metadataManagement-attribute',
                meta: {
                    title: '属性管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '删除',
                    ],
                },
                component: () =>
                    import ('../views/items/安全基线/自定义属性/属性标签.vue'),
            },

            // 流程
            {
                path: 'processManagement/customProcessLibrary',
                name: 'customProcessLibrary',
                key: 'processManagement-customProcessLibrary',
                meta: {
                    title: '流程管理',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        // '新增',
                        // '编辑',
                    ],
                },
                component: () =>
                    import ('../views/items/流程管理/自定义流程/流程库.vue'),
            },
            { // hidden
                path: 'processManagement/addCustomProcessLibrary',
                name: 'addCustomProcessLibrary',
                key: 'processManagement-addCustomProcessLibrary',
                hidden: true,
                meta: {
                    title: '新建流程',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/流程管理/自定义流程/新建流程库.vue'),
            },
            { // hidden
                path: 'processManagement/editCustomProcessLibrary',
                name: 'editCustomProcessLibrary',
                key: 'processManagement-editCustomProcessLibrary',
                hidden: true,
                meta: {
                    title: '编辑流程',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/流程管理/自定义流程/新建流程库.vue'),
            },

            { // hidden
                path: 'safetyManagement/safetyStandardsDetails',
                name: 'safetyStandardsDetails',
                key: 'safetyManagement-safetyStandardsDetails',
                hidden: true,
                meta: {
                    title: '标准文档',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全标准详情浏览/安全标准详情浏览.vue'),
            },

            {
                path: 'baselineManagement/detectionRules',
                name: 'detectionRules',
                key: 'baselineManagement-detectionRules',
                meta: {
                    title: '检测规则',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/安全基线/检测规则/检测规则.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'componentManagement',
        meta: {
            title: '组件管理',
            icon: 'zujian_nav_16@2x'
        },
        component: newLayout,
        children: [{
                path: 'componentManagement/securityComponents',
                name: 'securityComponents',
                key: 'componentManagement-securityComponents',
                meta: {
                    title: '安全组件',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '删除',
                    ],
                },
                component: () =>
                    import ('../views/items/组件管理/安全组件/安全组件.vue'),
            },
            { // hidden
                path: 'componentManagement/addSecurityComponent',
                name: 'addSecurityComponent',
                key: 'componentManagement-addSecurityComponent',
                hidden: true,
                meta: {
                    title: '新建组件',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/组件管理/安全组件/新建组件.vue'),
            },
            { // hidden
                path: 'componentManagement/editSecurityComponent',
                name: 'editSecurityComponent',
                key: 'componentManagement-editSecurityComponent',
                hidden: true,
                meta: {
                    title: '编辑组件',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/组件管理/安全组件/新建组件.vue'),
            },
            { // hidden
                path: 'componentManagement/viewSecurityComponent',
                name: 'viewSecurityComponent',
                key: 'componentManagement-viewSecurityComponent',
                hidden: true,
                meta: {
                    title: '查看组件',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/组件管理/安全组件/查看组件.vue'),
            },
            // {
            //   path: 'componentManagement/componentLibrary',
            //   name: 'componentLibrary',
            //   key: 'componentManagement-componentLibrary',
            //   meta: {
            //     title: '标签管理',
            //     icon: '',
            //   },
            //   component: () => import('../views/items/组件管理/标签管理/标签管理.vue'),
            // },
        ]
    },

    {
        path: '',
        name: 'toolManagement',
        meta: {
            title: '工具管理',
            icon: 'loudong_nav_16'
        },
        component: newLayout,
        children: [{
                path: 'toolManagement/tool',
                name: 'tool',
                key: 'toolManagement-tool',
                meta: {
                    title: '辅助工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/辅助工具/工具管理.vue'),
            },
            { // hidden
                path: 'toolManagement/addTool',
                name: 'addTool',
                key: 'toolManagement-addTool',
                hidden: true,
                meta: {
                    title: '新建辅助工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/辅助工具/新建工具.vue'),
            },
            { // hidden
                path: 'toolManagement/editTool',
                name: 'editTool',
                key: 'toolManagement-editTool',
                hidden: true,
                meta: {
                    title: '编辑辅助工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/辅助工具/新建工具.vue'),
            },
            { // hidden
                path: 'toolManagement/viewTool',
                name: 'viewTool',
                key: 'toolManagement-viewTool',
                hidden: true,
                meta: {
                    title: '查看辅助工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/辅助工具/查看工具.vue'),
            },

            {
                path: 'toolManagement/detectionTool',
                name: 'detectionTool',
                key: 'toolManagement-detectionTool',
                meta: {
                    title: '检测工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/检测工具/工具管理.vue'),
            },
            { // hidden
                path: 'toolManagement/addDetectionTool',
                name: 'addDetectionTool',
                key: 'toolManagement-addDetectionTool',
                hidden: true,
                meta: {
                    title: '新建检测工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/检测工具/新建工具.vue'),
            },
            { // hidden
                path: 'toolManagement/editDetectionTool',
                name: 'editDetectionTool',
                key: 'toolManagement-editDetectionTool',
                hidden: true,
                meta: {
                    title: '编辑检测工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/检测工具/新建工具.vue'),
            },
            { // hidden
                path: 'toolManagement/viewDetectionTool',
                name: 'viewDetectionTool',
                key: 'toolManagement-viewDetectionTool',
                hidden: true,
                meta: {
                    title: '查看检测工具',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/检测工具/查看工具.vue'),
            },
            { // hidden
                path: 'toolManagement/toolRules',
                name: 'toolRules',
                key: 'toolManagement-toolRules',
                hidden: true,
                meta: {
                    title: '规则',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/工具管理/检测工具/规则.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'vulnerabilityManagement',
        meta: {
            title: '漏洞库',
            icon: '应用软件安全中台-漏洞库'
        },
        component: newLayout,
        children: [{
                path: 'vulnerabilityManagement/vulnerability',
                name: 'vulnerability',
                key: 'vulnerabilityManagement-vulnerability',
                meta: {
                    title: '漏洞库',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/漏洞管理/漏洞管理/漏洞管理.vue'),
            },
            { // hidden
                path: 'vulnerabilityManagement/addVulnerability',
                name: 'addVulnerability',
                key: 'vulnerabilityManagement-addVulnerability',
                hidden: true,
                meta: {
                    title: '登记漏洞',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/漏洞管理/漏洞管理/登记漏洞.vue'),
            },
            { // hidden
                path: 'vulnerabilityManagement/editVulnerability',
                name: 'editVulnerability',
                key: 'vulnerabilityManagement-editVulnerability',
                hidden: true,
                meta: {
                    title: '编辑漏洞',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/漏洞管理/漏洞管理/登记漏洞.vue'),
            },
            { // hidden
                path: 'vulnerabilityManagement/viewVulnerability',
                name: 'viewVulnerability',
                key: 'vulnerabilityManagement-viewVulnerability',
                hidden: true,
                meta: {
                    title: '查看漏洞',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/漏洞管理/漏洞管理/查看漏洞.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'dataManagement',
        meta: {
            title: '资料库',
            icon: 'ziliao_nav_16'
        },
        component: newLayout,
        children: [{
                path: 'dataManagement/datas',
                name: 'datas',
                key: 'dataManagement-datas',
                meta: {
                    title: '资料库',
                    icon: '',
                    permissions: [],
                    permissionList: [
                        '新增',
                        '编辑',
                        '删除',
                    ],
                },
                component: () =>
                    import ('../views/items/资料管理/资料结构/资料结构.vue'),
            },
            { // hidden
                path: 'dataManagement/viewData',
                name: 'viewData',
                key: 'dataManagement-viewData',
                hidden: true,
                meta: {
                    title: '查看资料',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/资料管理/资料结构/查看资料.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'statisticalAnalysis',
        meta: {
            title: '统计分析',
            icon: 'tongji'
        },
        component: newLayout,
        children: [
            // {
            //   path: 'statisticalAnalysis/baselineStatistics',
            //   name: 'baselineStatistics',
            //   key: 'statisticalAnalysis-baselineStatistics',
            //   meta: {
            //     title: '基线统计',
            //     icon: '',
            //   },
            //   component: () => import('../views/items/统计分析/基线统计/基线统计.vue'),
            // },
            {
                path: 'statisticalAnalysis/taskStatistics',
                name: 'taskStatistics',
                key: 'statisticalAnalysis-taskStatistics',
                meta: {
                    title: '任务统计',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/统计分析/任务统计/任务统计.vue'),
            },
            {
                path: 'statisticalAnalysis/projectStatistics',
                name: 'projectStatistics',
                key: 'statisticalAnalysis-projectStatistics',
                meta: {
                    title: '项目统计',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/统计分析/项目统计/项目统计.vue'),
            },
        ]
    },

    {
        path: '',
        name: 'systemManagement',
        meta: {
            title: '系统管理',
            icon: 'xitong_nav_16'
        },
        component: newLayout,
        children: [{
                path: 'systemManagement/accountManagement',
                name: 'accountManagement',
                key: 'systemManagement-accountManagement',
                meta: {
                    title: '账号管理',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/账号管理/账号管理.vue'),
            },
            {
                path: 'systemManagement/roleManagement',
                name: 'roleManagement',
                key: 'systemManagement-roleManagement',
                meta: {
                    title: '角色管理',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/角色管理/角色管理.vue'),
            },
            {
                path: 'systemManagement/departmentManagement',
                name: 'departmentManagement',
                key: 'systemManagement-departmentManagement',
                meta: {
                    title: '部门管理',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/部门管理/部门管理.vue'),
            },
            {
                path: 'systemManagement/externalSystem',
                name: 'externalSystem',
                key: 'systemManagement-externalSystem',
                meta: {
                    title: '接入管理',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/接入管理/接入管理.vue'),
            },
            { // hidden
                path: 'systemManagement/addExternal',
                name: 'addExternal',
                key: 'systemManagement-addExternal',
                hidden: true,
                meta: {
                    title: '接入系统',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/接入管理/接入系统.vue'),
            },
            { // hidden
                path: 'systemManagement/editExternal',
                name: 'editExternal',
                key: 'systemManagement-editExternal',
                hidden: true,
                meta: {
                    title: '接入系统',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/接入管理/接入系统.vue'),
            },
            { // hidden
                path: 'systemManagement/viewExternal',
                name: 'viewExternal',
                key: 'systemManagement-viewExternal',
                hidden: true,
                meta: {
                    title: '查看接入',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/接入管理/查看接入.vue'),
            },
            {
                path: 'systemManagement/versionUpdate',
                name: 'versionUpdate',
                key: 'systemManagement-versionUpdate',
                meta: {
                    title: '内容更新',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/版本升级/版本升级.vue'),
            },
            {
                path: 'systemManagement/platform',
                name: 'platform',
                key: 'systemManagement-platform',
                meta: {
                    title: '平台说明',
                    icon: '',
                },
                component: () =>
                    import ('../views/items/系统管理/平台说明/平台说明.vue'),
            },
        ]
    },

    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];