<template>
  <div class="current-wrap">
    <svg-icon icon-class="page_home"></svg-icon>
    <span class="t1">当前位置: </span>
    <span class="t2" @click="toPath('/')">首页</span>
    <template v-if="$route.meta.title !== '首页'">
      <template v-for="(item, index) in $route.matched">
        <span class="t-l"> > </span>
        <span class="t2">{{ item.meta.title }}</span>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: "current-position",
    methods: {
      toName(name) {
        // this.$router.push({
        //   name
        // });
      },
      toPath(path) {
        // this.$router.push({
        //   path
        // });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .current-wrap {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 10px;
    font-family: SourceHanSansCN-Normal, SourceHanSansCN;
    font-size: 14px;
    > .t1 {
      color: #4D535A;
    }

    > .t2 {
      /*color: #00C5D4;*/
      color: #4D535A;
      font-weight: 400;
      cursor: default;
    }

    > .t-l {

    }
  }
</style>
