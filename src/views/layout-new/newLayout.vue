<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <div class="main-header">
            <header-box
                @on-click="onclick"
            ></header-box>
        </div>
        <div class="main-content-wrap">
            <navbar class="app-navbar"></navbar>
            <div class="main-content">
                <div class="main-content-silder">
                    <new-silder-item
                        :routes="childRoutes"
                        :routerTitle="routerTitle"
                    >
                    </new-silder-item>
                </div>
                <div class="main-content-main">
                    <div class="main-container">
                        <app-main></app-main>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {Navbar, AppMain} from './components';
    import HeaderBox from './components/HeaderBox'
    import NewSilderItem from './components/NewSilderItem'

    export default {
        name: 'newLayout',
        components: {
            Navbar,
            AppMain,
            HeaderBox,
            NewSilderItem,
        },
        data() {
            return {
                childRoutes: [], // 子元素路由
                routerTitle: '' // 标题
            }
        },
        provide() {
            return {
                user: this.user
            }
        },
        computed: {
            ...mapGetters([
                'user',
                'permission_routers',
            ]),
            sidebar() {
                return this.$store.state.app.sidebar
            },
            menuIndex() {
                return this.$route.path.split('/')[1]
            }
        },
        methods: {
            onclick(item) {
                this.routerTitle = item.meta.title;
                this.childRoutes = null;
                setTimeout(() => {
                    this.childRoutes = item.children;
                }, 100)
                // console.log(this.childRoutes)
            },
        },
        mounted() {
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "./src/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .el-menu--horizontal {
        border-bottom: none;
    }

    .user-name {
        font-size: 20px;
        color: white;
        letter-spacing: 3px;
    }

    .people {
        font-size: 20px;
        color: white;
        margin-right: 10px;
    }

    .el-menu-item:hover {
        background-color: rgba(48, 65, 86, 1) !important;
        border-bottom-color: white !important;
    }
</style>
