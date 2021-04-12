<template>
    <div class="sidebar-container">
        <!--<div class="slider-box">-->
            <!--<img class="slider-box-img" src="../../../assets/layout/logo.png" alt="" @click="changeNavWidth">-->
            <!--<span class="slider-box-name" v-show="!isCollapse">昆玥科技</span>-->
            <!--<div v-show="!isCollapse" class="slider-switch" @click="changeNavWidth">-->
                <!--<i class="el-icon-menu"></i>-->
            <!--</div>-->
        <!--</div>-->
        <div style="height: 62px; padding: 0;" class="gq-slider-menu">
            <scroll-bar v-if="routes && routes.length">
                <el-menu
                    mode="horizontal"
                    :show-timeout="200"
                    :default-active="$route.name"
                    :unique-opened="true"
                    background-color="white"
                    :collapse="isCollapse"
                    text-color="#626262"
                    active-text-color="#7367F0"
                >
                    <template v-for="(item,index) in routes">
                        <template v-if="item.children">
                            <el-submenu :index="item.name">
                                <template slot="title">
                                    <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                                    <span v-if="item.meta&&item.meta.title"
                                          slot="title">{{generateTitle(item.meta.title)}}</span>
                                </template>
                                <template v-for="child in item.children" v-if="!child.hidden">
                                    <template v-if="child.access===true">
                                        <span @click="toPath(item.path+'/'+ child.path)" :key="child.name">
                                            <el-menu-item :index="child.name">
                                                <svg-icon v-if="child.meta&&child.meta.icon"
                                                          :icon-class="child.meta.icon"></svg-icon>
                                                <span v-if="child.meta&&child.meta.title"
                                                      slot="title">{{generateTitle(child.meta.title)}}</span>
                                            </el-menu-item>
                                        </span>
                                    </template>
                                </template>
                            </el-submenu>
                        </template>
                        <template v-else>
                            <span @click="toName(item.name)">
                                <el-menu-item :index="item.name">
                                   <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                                    <span v-if="item.meta&&item.meta.title"
                                          slot="title">{{generateTitle(item.meta.title)}}</span>
                                </el-menu-item>
                            </span>
                        </template>
                    </template>
                </el-menu>
            </scroll-bar>
        </div>
    </div>
</template>

<script>
    import {generateTitle} from '@/utils/i18n'
    import ScrollBar from '@/components/ScrollBar'

    export default {
        name: 'NewSilderItem',
        components: {ScrollBar},
        props: {
            routes: {
                type: Array
            },
            routerTitle: {
                type: String
            },
            isNest: {
                type: Boolean,
                default: false
            },
            isCollapse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                params: {},
                menuStyle: {
                    padding: '32px 15px 20px 15px'
                }
            }
        },
        computed: {},
        methods: {
            generateTitle,
            toPath(path) {
                this.$router.push({
                    path
                });
            },
            hasOneShowingChildren(children) {
                const showingChildren = children.filter(item => {
                    return !item.hidden
                });
                if (showingChildren.length === 1) {
                    return true
                }
                return false
            },
            toName(name) {
                this.$router.push({
                    name
                });
            },
            changeNavWidth() {
                console.log('切换')
                this.$emit('changeNav')
            }
        },
        mounted() {
        },
        // watch: {
        //     "$route"(val) {
        //         console.log(val.name)
        //     }
        // }
    }
</script>

<style scoped>
    .slider-switch {
        cursor: pointer;
        margin-left: 31px;
        transition: color .3s;
    }

    .slider-box-name {
        margin-left: 25px;
    }

    .slider-box-img {
        cursor: pointer;
        margin-left: 22px;
    }
</style>
