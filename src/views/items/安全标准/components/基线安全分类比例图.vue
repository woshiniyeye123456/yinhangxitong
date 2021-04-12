<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">安全类型</span>
    </div>
    <div
      :style="{'height': height}"
      @click="viewChart('安全类型', echartOptions1)"
    >
      <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
    </div>
    <el-dialog
      :title="viewTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      class="dialog-default"
    >
      <div style="height: 600px;">
        <v-echart :autoresize="true" :options="viewOptions"></v-echart>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: "基线安全类型分类比例图",
    props: {
      chartList: {
        type: Array,
        default() {
          return []
        }
      },
      height: {
        type: String,
        default: '217px',
      }
    },
    data() {
      return {
        viewTitle: '',
        viewOptions: {},
        dialogVisible: false,
        echartOptions1: {
          tooltip: {},
          legend: {
            type: 'scroll',
            x: 'center',
            y: '88%',
            bottom: 'bottom',
            data: []
          },
          top: '0',
          left: '0',
          right: '0',
          bottom: "0",
          series: [
            {
              name: '',
              hoverAnimation: true,
              type: 'pie',
              radius: ['40%', '50%'],
              avoidLabelOverlap: true,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              color: ["#FD3D97", "#FF9F42", "#4F6EE4", "#1CCAB8"],
              data: []
            }
          ]
        },
      }
    },
    methods: {

      viewChart(title, options) {
        this.viewTitle = title;
        this.viewOptions = options;
        this.dialogVisible = true;
      },

      init() {
        this.echartOptions1.legend.data = [];
        this.echartOptions1.series[0].data = [];
        if (this.chartList.length) {
          let obj = {};
          this.chartList.forEach(item => {
            obj[item.security_scene] = obj[item.security_scene] || 0;
            obj[item.security_scene]++
          });
          for (let key in obj) {
            this.echartOptions1.legend.data.push(key);
            this.echartOptions1.series[0].data.push({
              name: key,
              value: obj[key],
            });
          }
        }
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      chartList: {
        handler() {
          this.init();
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>

</style>
