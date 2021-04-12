<template>
  <div class="default-box">
    <el-row :gutter="14">
      <el-col :span="8">
        <panel-todo
          :panelData="panelData1"
        ></panel-todo>
      </el-col>
      <el-col :span="8">
        <panel-todo
          :panelData="panelData2"
        ></panel-todo>
      </el-col>
      <el-col :span="8">
        <panel-todo
          :panelData="panelData3"
        ></panel-todo>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线类型统计</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线类型统计', echartOptions1)"
          >
            <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线风险等级统计</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线风险等级统计', echartOptions2)"
          >
            <v-echart :autoresize="true" :options="echartOptions2"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线使用覆盖率</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线使用覆盖率', echartOptions3)"
          >
            <v-echart :autoresize="true" :options="echartOptions3"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">在所有任务使用最多的基线数量前十</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('在所有任务使用最多的基线数量前十', echartOptions4)"
          >
            <v-echart :autoresize="true" :options="echartOptions4"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">检测不通过次数最多的前十个基线</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('检测不通过次数最多的前十个基线', echartOptions5)"
          >
            <v-echart :autoresize="true" :options="echartOptions5"></v-echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
  import panelTodo from '../components/panel-todo'
  import mixins from '../mixins'

  export default {
    name: "基线统计",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      panelTodo,
    },
    mixins: [
      mixins
    ],
    data() {
      return {
        viewTitle: '',
        viewOptions: {},
        dialogVisible: false,
        panelData1: {
          val: 0,
          title: '基线总数',
          icon: '钱',
          duration: 1200,
          className: 'icon-message',
          decimals: 0,
        },
        panelData2: {
          val: 0,
          title: '视图总数',
          icon: '钱',
          duration: 1400,
          className: 'icon-message',
          decimals: 0,
        },
        panelData3: {
          val: 0,
          title: '标准总数',
          icon: '钱',
          duration: 1600,
          className: 'icon-message',
          decimals: 0,
        },
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
        echartOptions2: {
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
        echartOptions3: {
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
        echartOptions4: {
          tooltip: {},
          legend: {
            left: 'center',
            bottom: 'bottom',
            data: []
          },
          grid: {
            top: '10%',
            left: "3%",
            right: "3%",
            bottom: "10%",
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(214, 214, 214)',
                type: 'dashed'
              }
            }
          },
          series: [
            {
              data: [],
              type: 'bar',
              name: '处理任务数',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions5: {
          tooltip: {},
          legend: {
            left: 'center',
            bottom: 'bottom',
            data: []
          },
          grid: {
            top: '10%',
            left: "3%",
            right: "3%",
            bottom: "10%",
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(214, 214, 214)',
                type: 'dashed'
              }
            }
          },
          series: [
            {
              data: [],
              type: 'bar',
              name: '处理任务数',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
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

      getTopStatistics() {
        let vars = {
          key: 'topStatistics',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            this.panelData1.val = data.data.baseline_count;
            this.panelData2.val = data.data.view_count;
            this.panelData3.val = data.data.standard_count;
          }
        });
      },

      getIndexChart() {
        let vars = {
          key: 'indexChart',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.baseline_security_scene) {
              this.echartOptions1.legend.data = [];
              this.echartOptions1.series[0].data = [];
              data.data.baseline_security_scene.forEach(item => {
                this.echartOptions1.legend.data.push(item.name);
                this.echartOptions1.series[0].data.push({
                  name: item.name,
                  value: item.count,
                });
              });
            }
            if (data.data.risks) {
              this.echartOptions2.legend.data = [];
              this.echartOptions2.series[0].data = [];
              data.data.risks.forEach(item => {
                let name = item.name || '其他';
                this.echartOptions2.legend.data.push(name);
                this.echartOptions2.series[0].data.push({
                  name: name,
                  value: item.count,
                });
              });
            }
            if (data.data.security_scenes) {
              this.echartOptions3.legend.data = [];
              this.echartOptions3.series[0].data = [];
              let total = 0;
              data.data.security_scenes.forEach(item => {
                total += item.count
              });
              data.data.security_scenes.forEach(item => {
                this.echartOptions3.legend.data.push(item.name);
                this.echartOptions3.series[0].data.push({
                  name: item.name,
                  value: parseInt(item.count / total * 100) / 100,
                });
              });
            }
            if (data.data.baselines) {
              this.echartOptions4.xAxis.data = [];
              this.echartOptions4.series[0].data = [];
              data.data.baselines.forEach(item => {
                this.echartOptions4.xAxis.data.push(item.name);
                this.echartOptions4.series[0].data.push(item.count);
              })
            }
            if (data.data.test_fails) {
              this.echartOptions5.xAxis.data = [];
              this.echartOptions5.series[0].data = [];
              data.data.test_fails.forEach(item => {
                this.echartOptions5.xAxis.data.push(item.name);
                this.echartOptions5.series[0].data.push(item.count);
              })
            }
          }
        });
      },

      init() {
        this.getTopStatistics();
        this.getIndexChart();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

  .echart-wrap {
    height: 300px;
  }
</style>
