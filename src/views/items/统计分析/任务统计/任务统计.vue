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
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">任务周期分析</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('任务周期分析', echartOptions1)"
          >
            <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">任务完成度分析</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('任务完成度分析', echartOptions2)"
          >
            <v-echart :autoresize="true" :options="echartOptions2"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线执行率最高的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线执行率最高的前十个任务', echartOptions3)"
          >
            <v-echart :autoresize="true" :options="echartOptions3"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线执行率最低的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线执行率最低的前十个任务', echartOptions4)"
          >
            <v-echart :autoresize="true" :options="echartOptions4"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线通过率最高的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线通过率最高的前十个任务', echartOptions5)"
          >
            <v-echart :autoresize="true" :options="echartOptions5"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">基线通过率最低的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('基线通过率最低的前十个任务', echartOptions6)"
          >
            <v-echart :autoresize="true" :options="echartOptions6"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">健康度最高的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('健康度最高的前十个任务', echartOptions7)"
          >
            <v-echart :autoresize="true" :options="echartOptions7"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">健康度最低的前十个任务</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('健康度最低的前十个任务', echartOptions8)"
          >
            <v-echart :autoresize="true" :options="echartOptions8"></v-echart>
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
    name: "任务统计",
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
          title: '任务总数',
          icon: '钱',
          duration: 1200,
          className: 'icon-message',
          decimals: 0,
        },
        panelData2: {
          val: 0,
          title: '正在进行的任务总数',
          icon: '钱',
          duration: 1400,
          className: 'icon-message',
          decimals: 0,
        },
        panelData3: {
          val: 0,
          title: '已完成或关闭的任务总数',
          icon: '钱',
          duration: 1600,
          className: 'icon-message',
          decimals: 0,
        },
        echartOptions1: {
          tooltip: {},
          xAxis: {
            show: true,
            type: 'category',
            boundaryGap: false,
            data: [],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
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
          lineStyle: {
            color: '#51cee3',
          },
          series: [
            {
              data: [],
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#51cee3',
                  lineStyle: {
                    color: '#51cee3'
                  }
                }
              },
              smooth: true,
              areaStyle: {
                normal: {
                  color: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#51CEE3" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#FFFFFF" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                }
              }
            }
          ]
        },
        echartOptions2: {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'center',
            bottom: 'bottom',
            data: ['比值']
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
              name: '比值',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions3: {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'center',
            bottom: 'bottom',
            data: ['执行率']
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions4: {
          tooltip: {},
          legend: {
            orient: 'vertical',
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions5: {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'center',
            bottom: 'bottom',
            data: ['执行率']
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions6: {
          tooltip: {},
          legend: {
            orient: 'vertical',
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions7: {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'center',
            bottom: 'bottom',
            data: ['执行率']
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        echartOptions8: {
          tooltip: {},
          legend: {
            orient: 'vertical',
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
              name: '',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              // showBackground: true,
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

      getTaskTopStatistics() {
        let vars = {
          key: 'taskTopStatistics',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            this.panelData1.val = data.data.task_count;
            this.panelData2.val = data.data.todo_task_count;
            this.panelData3.val = data.data.finish_task_count;
          }
        });
      },

      getTaskAnalysis() {
        let vars = {
          key: 'taskAnalysis',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.task) {
              this.echartOptions1.xAxis.data = [];
              this.echartOptions1.series[0].data = [];
              this.echartOptions2.xAxis.data = [];
              this.echartOptions2.series[0].data = [];
              data.data.task.forEach(item => {
                this.echartOptions1.xAxis.data.push(item.month);
                this.echartOptions1.series[0].data.push(item.count);
                this.echartOptions2.xAxis.data.push(item.month);
                this.echartOptions2.series[0].data.push(item.finish_total);
              });
            }
          }
        });
      },

      getBaselineExecutionRate() {
        let vars = {
          key: 'baselineExecutionRate',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.top_ten_task) {
              this.echartOptions3.xAxis.data = [];
              this.echartOptions3.series[0].data = [];
              data.data.top_ten_task.forEach(item => {
                this.echartOptions3.xAxis.data.push(item.name);
                this.echartOptions3.series[0].data.push(item.executive_rate);
              });
            }
            if (data.data.reciprocal_ten) {
              this.echartOptions4.xAxis.data = [];
              this.echartOptions4.series[0].data = [];
              data.data.reciprocal_ten.forEach(item => {
                this.echartOptions4.xAxis.data.push(item.name);
                this.echartOptions4.series[0].data.push(item.executive_rate);
              });
            }
          }
        });
      },

      getBaselinePassingRate() {
        let vars = {
          key: 'baselinePassingRate',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.top_ten_task) {
              this.echartOptions5.xAxis.data = [];
              this.echartOptions5.series[0].data = [];
              data.data.top_ten_task.forEach(item => {
                this.echartOptions5.xAxis.data.push(item.name);
                this.echartOptions5.series[0].data.push(item.pass_rate);
              });
            }
            if (data.data.reciprocal_ten) {
              this.echartOptions6.xAxis.data = [];
              this.echartOptions6.series[0].data = [];
              data.data.reciprocal_ten.forEach(item => {
                this.echartOptions6.xAxis.data.push(item.name);
                this.echartOptions6.series[0].data.push(item.pass_rate);
              });
            }
          }
        });
      },

      getBaselineHealthRate() {
        let vars = {
          key: 'baselineHealthRate',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.top_ten_task) {
              this.echartOptions7.xAxis.data = [];
              this.echartOptions7.series[0].data = [];
              data.data.top_ten_task.forEach(item => {
                this.echartOptions7.xAxis.data.push(item.name);
                this.echartOptions7.series[0].data.push(item.health_rate);
              });
            }
            if (data.data.reciprocal_ten) {
              this.echartOptions8.xAxis.data = [];
              this.echartOptions8.series[0].data = [];
              data.data.reciprocal_ten.forEach(item => {
                this.echartOptions8.xAxis.data.push(item.name);
                this.echartOptions8.series[0].data.push(item.health_rate);
              });
            }
          }
        });
      },

      init() {
        this.getTaskTopStatistics();
        this.getTaskAnalysis();
        this.getBaselineExecutionRate();
        this.getBaselinePassingRate();
        this.getBaselineHealthRate();
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
