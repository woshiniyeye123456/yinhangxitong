<template>
    <div class="sidebar-container">
        <div class="slider-box">
            {{ routerTitle }}
        </div>
        <div class="gq-slider-menu">
            <scroll-bar v-if="routes && routes.length">
                <el-menu
                    mode="vertical"
                    :show-timeout="200"
                    :default-active="$route.name"
                    background-color="#e6ecf6"
                    text-color="#364663"
                    active-text-color="#2d8cf0"
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
            }
        },
        data() {
            return {
                params: {}
            }
        },
        computed: {
        },
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

</style>
