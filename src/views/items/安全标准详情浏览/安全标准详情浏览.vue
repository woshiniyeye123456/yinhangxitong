<template>
  <div class="full-page">
    <!-- act-top -->
    <act-top
      @go-back="goBack"
      @export-Data="exportData"
    ></act-top>
    <el-card shadow="never" class="default-card card-border card-body-no-padding full-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">安全基线库(BL0001)</span>
      </div>
      <div class="content-container">
        <div class="container-left">
          <tree-data
            @node-click="nodeClick"
          ></tree-data>
        </div>
        <div class="container-right">
          <div class="wrap">
            <div class="title">访问控制</div>
            <span class="c-title">系统访问最小权限原理</span>
            <table class="table-box" border="0" cellspacing="0" cellpadding="0">
              <colgroup>
                <col name="table-label" width="200">
                <col name="table-content">
              </colgroup>
              <tbody>
              <tr>
                <td rowspan="1" colspan="1" class="table-label">
                  <div class="cell">基线名称</div>
                </td>
                <td rowspan="1" colspan="1" class="table-content">
                  <div class="cell">系统访问最小权限原理</div>
                </td>
              </tr>
              <tr>
                <td rowspan="1" colspan="1" class="table-label">
                  <div class="cell">基线名称</div>
                </td>
                <td rowspan="1" colspan="1" class="table-content">
                  <div class="cell">系统访问最小权限原理</div>
                </td>
              </tr>
              <tr>
                <td rowspan="1" colspan="1" class="table-label">
                  <div class="cell">基线名称</div>
                </td>
                <td rowspan="1" colspan="1" class="table-content">
                  <div class="cell">系统访问最小权限原理</div>
                </td>
              </tr>
              <tr>
                <td rowspan="1" colspan="1" class="table-label">
                  <div class="cell">基线名称</div>
                </td>
                <td rowspan="1" colspan="1" class="table-content">
                  <div class="cell">系统访问最小权限原理</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import actTop from './components/act-top';
  import treeData from './components/tree-data'

  export default {
    name: "安全标准详情浏览",
    components: {
      actTop,
      treeData,
    },
    data() {
      return {}
    },
    methods: {
      nodeClick() {

      },
      goBack() {
        this.$router.go(-1)
      },
      exportData() {

      },
      init() {

      }
    },
    mounted() {
      this.init();
    }
  }

</script>

<style lang="scss" scoped>

  .full-page {
    height: calc(100% - 46px);

    .full-card {
      height: calc(100% - 46px);
    }
  }


  .content-container {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

    > .container-left {
      width: 238px;
      box-sizing: border-box;
      padding: 10px 8px;
    }

    > .container-right {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      flex: 1;
      box-sizing: border-box;
      border-left: 1px solid #eeeeee;
      padding: 14px;
    }
  }

  .wrap {
    > .title {
      padding-left: 24px;
      position: relative;
    }
    > .title:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGUlEQVQ4T62TP0sDQRDFf7OXy0XB2EQbYxGwiShWmtrG3o/gJ/Mj2NsIVp5WYiAIQgq10TRG0FwutyPnkfujEdTLdjtv3uO9nR3h6znr11gYNhg7dTzX/YSDMKQaDXmvD9hvjfIUSS+qwlW3ycQ0EMnq+W5VpWIH7G49IKIxlDTGZL+3gbL0zdGsgvBKp30XiyQClzfrRM7Kr8jTJid6Zm/7Xogze2/tgm0xy9hJB2EtccgjpuKj9iUXWQkWe8LFdRN1V1MgJmt4iIpXcCQaIO5JQUTCJ+G8u4lrapmyPQBaP8TpI+Y0xUI7EvzbHWzkZAR7hFKdKSCMwRynmHGiOQiUjlD6EUuPsfRHmstXnor8e5nyQ//jOn8Aqg+p6eQtPQ8AAAAASUVORK5CYII=');
    }

    > .c-title {
      display: inline-block;
      margin: 14px 8px;
      min-width: 180px;
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
      text-align: center;
      padding: 0 16px;
      background-color: rgba(0, 197, 212, 0.1);
      font-size: 14px;
      color: #24273f;
    }
  }

  .table-box {
    width: 100%;
    border: 1px solid #dbe3f3;

    > tbody {

      > tr:nth-child(odd) {
        background-color: #f4fafb;
      }

      td {
        padding: 12px 0;

        > .cell {
          padding: 0 10px;
        }
      }

      .table-label {
        border-right: 1px solid #dbe3f3;

        > .cell {
          text-align: center;
        }
      }
    }

  }
</style>
