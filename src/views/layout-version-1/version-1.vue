<template>
  <div style="height: 100%;">
    <div class="v1-main" v-if="themeVersion === 'v1'">
      <div :style="{width: silderLeftWidth}" class="v1-silder">
        <new-silder-item :routes="allRouters" :routerTitle="routerTitle" :isCollapse="silderStatus" @changeNav="changeNav">
        </new-silder-item>
      </div>
      <div class="v1-maintcontent">
        <div class="v1-maintcontent-head">
          <user-infor></user-infor>
        </div>
        <div class="v1-main-content-main default-page">
          <current-position></current-position>
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
    <div style="height: 100%;" v-if="themeVersion === 'v2'">
      <version-two :routes="allRouters">
      </version-two>
    </div>
  </div>
</template>

<script>
import NewSilderItem from "./components/NewSilderItem.vue";
import userInfor from "./components/user.vue";
import { mapGetters } from "vuex";
import config from "../../../config/theme";
import versionTwo from "./version-2.vue";

import currentPosition from "./components/current-position.vue";

export default {
  name: "version-1",
  components: {
    NewSilderItem,
    versionTwo,
    userInfor,
    currentPosition
  },
  data() {
    return {
      themeVersion: config.layout,
      childRoutes: [], // 子元素路由
      routerTitle: "", // 标题
      silderStatus: false,
      silderLeftWidth: "180px",
      mainContentStyle: {
        width: "calc(100% - 180px)",
        left: "180px"
      },
      mainHeaderStyle: {},
      screenWidth: ""
    };
  },
  provide() {
    return {
      user: this.user
    };
  },
  computed: {
    ...mapGetters(["user", "permission_routers"]),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    menuIndex() {
      return this.$route.path.split("/")[1];
    },
    allRouters() {
      return this.permission_routers.filter(v => !v.hidden);
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
  },
  methods: {
    onclick(item) {
      this.routerTitle = item.meta.title;
      this.childRoutes = null;
      setTimeout(() => {
        this.childRoutes = item.children;
      }, 100);
      // console.log(this.childRoutes)
    },
    changeNav() {
      if (!this.silderStatus) {
        this.silderLeftWidth = "70px";
        this.mainContentStyle.left = "70px";
        this.mainHeaderStyle.left = "70px";
        this.mainContentStyle.width = "calc(100% - 70px)";
        this.mainHeaderStyle.width = "calc(100% - 70px)";
      } else {
        this.silderLeftWidth = "180px";
        this.mainContentStyle.left = "180px";
        this.mainHeaderStyle.left = "180px";
        this.mainContentStyle.width = "calc(100% - 180px)";
        this.mainHeaderStyle.width = "calc(100% - 180px)";
      }
      this.silderStatus = !this.silderStatus;
    },
    getNowWidth() {
      this.screenWidth = document.body.clientWidth;
      if (this.screenWidth < 700) {
        this.changeNav();
      }
    },

    setTodoNumber() {
      let vars = {
        actor: this.user.name,
        status: "待处理",
        paging: "1,1"
      };
      vars.key = "tasks";
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.$store.commit("SET_TODONUMBER", data.data.total || 0);
          this.$store.commit("SET_NEWMSG", true);
        }
      });
    },

    initSocket() {
      if (this.$api.ws) {
        let socket = new WebSocket(this.$api.ws + "/?userId=" + this.user.id);
        //打开事件
        socket.onopen = function() {
          // socket.send("这是来自客户端的消息" + location.href + new Date());
          console.log("Socket已打开");
        };
        //获得消息事件
        socket.onmessage = msg => {
          if (msg.data) {
            // console.log(msg.data);
            this.$notify.info({
              title: "温馨提示",
              message: "有一条新的待办工单，请注意查看。"
            });
            this.setTodoNumber();
          }
        };
        //关闭事件
        socket.onclose = function() {
          console.log("Socket已关闭");
        };
        //发生了错误事件
        socket.onerror = function() {
          console.log("发生了错误");
        };

        this.$store.commit("SET_WS", socket);
      }

      this.setTodoNumber();
    }
  },
  created() {
    this.initSocket();
  },
  mounted() {
    //            console.log(this.permission_routers)
    //       this.getNowWidth();
  }
};
</script>

<style rel="stylesheet" lang="scss" scoped>
@import "./src/styles/variables.scss";

.v1-main {
  background-color: $bg-color;
  height: 100%;
  display: flex;
  overflow: hidden;
  .v1-silder {
    transition: all 0.3s;
    height: 100%;
  }
  .v1-maintcontent {
    flex: 1;
    width: 100%;
    height: 100%;
    background: rgba(245, 246, 250, 1);
    position: relative;
  }
  .v1-maintcontent-head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    transition: left 0.3s;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 4px 0px rgba(72, 99, 129, 0.2);
    z-index: 10;
  }
  .v1-main-content-main {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    background: rgba(245, 246, 250, 1);
    overflow-y: auto;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
}
</style>
