<template>
  <div class="panel-group">
    <div :xs="24" :sm="12" :lg="12" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-img-wrapper" :class="panelData.className">
          <img src="../../../../../img/zidonghua_xjjxk.png">
        </div>
        <div class="card-panel-text">{{ panelData.title }}</div>
        <div class="card-panel-description">
          <span class="card-panel-prepend" v-if="panelData.prepend">{{ panelData.prepend }}</span>
          <count-to class="card-panel-num" :startVal="0" :endVal="panelData.val" :duration="panelData.duration"
                    :decimals="panelData.decimals"></count-to>
          <span class="card-panel-append" v-if="panelData.append">{{ panelData.append }}</span>
        </div>
        <div class="card-panel-bg">
          <img src="../../../../../img/bgzdh_xjjxk.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    name: '自动化率',
    props: {
      panelData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    components: {
      CountTo
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 4px 0px rgba(72, 99, 129, 0.2);
    border-radius: 6px;

    .card-panel {
      height: 70px;
      overflow: hidden;
      position: relative;

      > .card-panel-img-wrapper {
        float: left;
        margin-top: 15px;
        margin-left: 20px;

        > img {
          vertical-align: top;
        }
      }

      > .card-panel-text {
        float: left;
        margin-top: 15px;
        margin-left: 10px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: rgba(77, 83, 90, 1);
      }

      > .card-panel-description {
        float: right;
        margin-top: 15px;
        margin-right: 70px;
        height: 40px;
        line-height: 40px;
        font-size: 24px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: rgba(0, 197, 212, 1);
      }

      > .card-panel-bg {
        position: absolute;
        right: 0;
        bottom: 0;

        > img {
          vertical-align: top;
        }
      }
    }
  }
</style>
