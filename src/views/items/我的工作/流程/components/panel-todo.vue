<template>
  <div class="panel-group">
    <div :xs="24" :sm="12" :lg="12" class="card-panel-col">
      <div
        class='card-panel'
        @click="handleSetLineChartData"
        :class="[panelData._active ? 'active' : '', panelData.className]"
      >
        <div class="card-panel-img-wrapper">
          <img :src="panelData._active ? panelData.active_url : panelData.url">
        </div>
        <div class="card-panel-text">{{ panelData.title }}</div>
        <div class="card-panel-description"
             :style="{color: panelData.color}"
        >
          <span class="card-panel-prepend" v-if="panelData.prepend">{{ panelData.prepend }}</span>
          <template v-if="panelData.text">
            <div>
              {{ panelData.text }}
            </div>
          </template>
          <template v-else>
            <count-to
              :startVal="0"
              :endVal="panelData.val"
              :duration="panelData.duration"
              :decimals="panelData.decimals"
            ></count-to>
          </template>
          <span class="card-panel-append" v-if="panelData.append">{{ panelData.append }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    name: 'panel',
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
      handleSetLineChartData() {
        this.$emit('handleSetLineChartData', this.panelData);
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
    overflow: hidden;

    .card-panel {
      height: 90px;
      position: relative;
      cursor: pointer;
      transition: all 0.8s;

      > .card-panel-img-wrapper {
        float: left;
        margin-top: 22px;
        margin-left: 18px;

        > img {
          vertical-align: top;
        }
      }

      > .card-panel-text {
        float: left;
        margin-top: 22px;
        margin-left: 10px;
        height: 47px;
        line-height: 47px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 600;
        color: #262626;
        text-decoration: underline;
      }

      > .card-panel-description {
        float: right;
        margin-top: 22px;
        margin-right: 21px;
        height: 47px;
        line-height: 47px;
        font-size: 24px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: rgba(70, 156, 255, 1);
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

    .color-e5f1ff {

      .card-panel-description {
        color: #2f8cf7 !important;
      }
    }

    .color-e5f1ff.active {
      background-color: #e5f1ff;

      .card-panel-text {
        color: #2f8cf7 !important;
      }
    }

    .color-ffe4e4 {

      .card-panel-description {
        color: #f64040 !important;
      }
    }

    .color-ffe4e4.active {
      background-color: #ffe4e4;

      .card-panel-text {
        color: #f64040 !important;
      }
    }

    .color-d5f4fd {

      .card-panel-description {
        color: #07b5e7 !important;
      }
    }

    .color-d5f4fd.active {
      background-color: #d5f4fd;

      .card-panel-text {
        color: #07b5e7 !important;
      }
    }

    .color-feefd4 {

      .card-panel-description {
        color: #f27021 !important;
      }
    }

    .color-feefd4.active {
      background-color: #feefd4;

      .card-panel-text {
        color: #f27021 !important;
      }
    }

  }


</style>
