<template>
  <div class="sidebar-container">
    <div class="slider-box">
      <img src="../../../img/logo_home.png">
      <!--<img src="../../../img/jiufu/nav_logo.png">-->
      <!--<img src="../../../img/qianhai/nav_logo.png">-->
    </div>
    <div class="gq-slider-menu" :style="isCollapse ? '' : menuStyle">
      <scroll-bar bgColor="#363D59" v-if="routes && routes.length">
        <el-menu mode="vertical" :show-timeout="200" :default-active="$route.name" :unique-opened="true"
          background-color="#363D59" :collapse="isCollapse" text-color="#C7CAD5" active-text-color="#00C5D4">
          <template v-for="(item,index) in routes">
            <template v-if="item.children">

              <template v-if="item.children.length === 1">
                <span @click="toName(item.children[0].name)" class="first-nav">
                  <el-menu-item :index="item.children[0].name">
                    <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
                    <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">
                      {{generateTitle(item.children[0].meta.title)}}
                      <span class="badge-number" v-if="item.meta && item.meta.showNumber && todoNumber">{{ todoNumber
                        }}</span>
                    </span>
                  </el-menu-item>
                </span>
              </template>

              <template v-else>
                <el-submenu :index="item.name">
                  <template slot="title">
                    <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                    <span v-if="item.meta&&item.meta.title" slot="title">
                      {{generateTitle(item.meta.title)}}
                      <span class="badge-number" v-if="item.meta && item.meta.showNumber && todoNumber">{{ todoNumber
                        }}</span>
                    </span>
                  </template>
                  <template v-for="child in item.children" v-if="!child.hidden">
                    <template v-if="child.access===true">
                      <span @click="toPath(item.path+'/'+ child.path)" :key="child.name">
                        <el-menu-item :index="child.name">
                          <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                          <span v-if="child.meta&&child.meta.title" slot="title">
                            {{generateTitle(child.meta.title)}}
                            <span class="badge-number" v-if="child.meta && child.meta.showNumber && todoNumber">{{
                              todoNumber }}</span>
                          </span>
                        </el-menu-item>
                      </span>
                    </template>
                  </template>
                </el-submenu>
              </template>

            </template>
            <template v-else>

              <span @click="toName(item.name)">
                <el-menu-item :index="item.name">
                  <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                  <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
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
import { generateTitle } from "@/utils/i18n";
import ScrollBar from "@/components/ScrollBar";
import { mapGetters } from "vuex";

export default {
  name: "NewSilderItem",
  components: { ScrollBar },
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
      menuStyle: {}
    };
  },
  computed: {
    ...mapGetters(["todoNumber"])
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
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    toName(name) {
      this.$router.push({
        name
      });
    },
    changeNavWidth() {
      console.log("切换");
      this.$emit("changeNav");
    }
  },
  mounted() {}
  // watch: {
  //     "$route"(val) {
  //         console.log(val.name)
  //     }
  // }
};
</script>

<style scoped>
.slider-switch {
  cursor: pointer;
  margin-left: 31px;
  transition: color 0.3s;
}

.slider-box-name {
  margin-left: 25px;
}

.slider-box-img {
  cursor: pointer;
  margin-left: 22px;
}

.slider-box > img {
  width: 100%;
}

.badge-number {
  vertical-align: 0;
  display: inline-block;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
}
</style>
