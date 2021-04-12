<template>
    <div class="v2-bg">
        <my-header></my-header>
        <div class="main-width">
            <my-slider
                    :routes="allRouters"
            >
            </my-slider>
        </div>
        <div class="main-width main-content">
            <transition name="fade" mode="out-in">
                <keep-alive :include="cachedViews">
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import myHeader from './components2/header.vue'
    import mySlider from './components2/silder.vue'
    import {mapGetters} from 'vuex';

    export default {
        props: {
            routes: {
                type: Array
            },
        },
        data() {
            return {
                msg: '这是条数据',
            }

        },
        components: { // 组件
            myHeader,
            mySlider
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
            },
            allRouters() {
                return this.permission_routers.filter(v => !v.hidden)
            },
            cachedViews() {
                return this.$store.state.tagsView.cachedViews
            }
        },
        methods: {
            setMeg() {
                this.msg = '我是改变后的数据'
            }
        },
        beforeCreate() { // 实例刚刚被创建
        },
        created() { //实例已经创建完成
        },
        beforeMount() { // 模板编译之前
        },
        mounted() { // 模板编译完成            
        },
        beforeUpdate() { // 数据更新之前
        },
        updated() { // 数据更新完毕
        },
        beforeDestroy() { // 实例销毁之前
        },
        destroyed() { // 实例销毁完成
        },
        watch: {
            example: {
                handler(val) {
                    if (val.example) {
                    }
                },
                deep: true
            },
        }
    }
</script>

<style scoped>
.v2-bg{
    background-color: #F7F4F8;
    min-height: 100%;
}
    .main-content{
        margin-top: 20px;
    }
</style>