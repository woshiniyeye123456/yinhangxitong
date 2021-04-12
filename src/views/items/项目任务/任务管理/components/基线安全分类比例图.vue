<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">安全类型</span>
    </div>
    <ve-chart
      :height="height"
      :data="chartData"
      :settings="chartSettings"
      :extend="chartExtend"
      :events="chartEvents"
    ></ve-chart>
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
        chartEvents: {
          click(e) {
            // console.log(e)
          }
        },
        chartData: {
          columns: ['name', 'value'],
          rows: [],
        },
        chartSettings: {
          type: 'pie',
          legendLimit: 0,
          selectedMode: 'single',
          hoverAnimation: true
        },
        chartExtend: {
          // title: {
          //   text: '基线安全类型分类比例图',
          //   subtext: ''
          // },
          // xAxis: {
          //     type: 'time',
          //     splitLine: {
          //         show: false
          //     }
          // },
          // yAxis: {
          //     splitLine: {
          //         show: false
          //     },
          //     show: false,
          // },
          series: {
            radius: ['45%', '85%'],
            center: ['50%', '50%'],
          },
          label: {
            normal: {
              show: true,
            }
          },
          legend: {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5,
          },
        },
      }
    },
    methods: {
      init() {
        if (this.chartList.length) {
          let rows = [];
          let obj = {};
          this.chartList.forEach(item => {
            obj[item.security_scene] = obj[item.security_scene] || 0;
            obj[item.security_scene]++
          });
          for (let key in obj) {
            rows.push({
              name: key,
              value: obj[key]
            })
          }
          this.chartData.rows = rows;
        } else {
          this.chartData.rows = [];
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
