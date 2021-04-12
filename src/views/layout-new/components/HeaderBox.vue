<template>
    <div class="main-header-box">
        <div class="main-header-logo">
            <img src="../../../img/logo.png">
        </div>
        <div class="main-header-container">
            <!-- menu -->
            <el-menu
                :default-active="menuIndex"
                class="el-menu-demo"
                mode="horizontal"
                text-color="rgba(255,255,255,0.7)"
                background-color="transparent"
                active-text-color="white"
            >
                <el-menu-item
                    :index="item.name"
                    v-for="(item,index) in menus"
                    :key="index"
                    v-if="!item.hidden"
                    @click="onclick(item)"
                >
                    <svg-icon v-if="item.meta&&item.meta.icon"
                              :icon-class="item.meta.icon"></svg-icon>
                    <span>{{ item.meta.title }}</span>
                </el-menu-item>
            </el-menu>
            <!-- dropdown -->
            <el-dropdown
                trigger="click"
                v-if="dropdowns && dropdowns.length"
                @command="onclick"
            >
                <span class="el-dropdown-link">
                    更多功能<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu
                    slot="dropdown"
                >
                    <el-dropdown-item
                        v-for="(item, index) in dropdowns"
                        :key="index"
                        :command="item"
                    >
                        <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                                  :icon-class="item.children[0].meta.icon"></svg-icon>
                        <span>{{ item.meta.title }}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="main-header-right">
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
                <div class="avatar-wrapper">
                    <svg-icon icon-class="people" class-name="people"></svg-icon>
                    <span class="user-name" v-if="user&&user.user_info">{{user.user_info.real_name}}</span>
                    <i class="el-icon-caret-bottom" style="font-size: 20px;color: white"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/">
                        <el-dropdown-item>
                            {{$t('navbar.dashboard')}}
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                        <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "HeaderBox",
        components: {},
        props: {},
        data() {
            return {
                maxIndex: 8,
            }
        },
        computed: {
            ...mapGetters([
                'user',
                'permission_routers',
            ]),
            menuIndex() {
                return this.$route.path.split('/')[1]
            },
            allRouters() {
                return this.permission_routers.filter(v => !v.hidden)
            },
            menus() {
                return this.allRouters.slice(0, this.maxIndex);
            },
            dropdowns() {
                return this.allRouters.slice(this.maxIndex);
            },
        },
        methods: {
            logout() {
                //TODO: 退出登录是否调接口
                this.$store.dispatch('FedLogOut').then(() => {
                    location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
            },
            onclick(item) {
                // console.log(item);
                this.$emit('on-click', item)
            },
            getChildrenArray() {
                if (this.permission_routers.length && this.menuIndex) {
                    this.onclick(this.permission_routers.find(v => v.name === this.menuIndex))
                }
            },
        },
        mounted() {
            this.getChildrenArray();
        },
    }
</script>

<style scoped>

</style>
