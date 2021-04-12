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
            <span class="slot-title"> 正在执行任务的最多的前十个项目</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('正在执行任务的最多的前十个项目', echartOptions1)"
          >
            <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title"> 任务平均健康评估最高的前十个项目</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('任务平均健康评估最高的前十个项目', echartOptions2)"
          >
            <v-echart :autoresize="true" :options="echartOptions2"></v-echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title"> 任务平均健康评估最低的前十个项目</span>
          </div>
          <div
            class="echart-wrap"
            @click="viewChart('任务平均健康评估最低的前十个项目', echartOptions3)"
          >
            <v-echart :autoresize="true" :options="echartOptions3"></v-echart>
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
    name: "项目统计",
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
          title: '项目总数',
          icon: '钱',
          duration: 1200,
          className: 'icon-message',
          decimals: 0,
        },
        panelData2: {
          val: 0,
          title: '正在进行的项目总数',
          icon: '钱',
          duration: 1400,
          className: 'icon-message',
          decimals: 0,
        },
        panelData3: {
          val: 0,
          title: '已完成或关闭的项目总数',
          icon: '钱',
          duration: 1600,
          className: 'icon-message',
          decimals: 0,
        },
        echartOptions1: {
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
        echartOptions2: {
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
      }
    },
    methods: {

      viewChart(title, options) {
        this.viewTitle = title;
        this.viewOptions = options;
        this.dialogVisible = true;
      },

      getProjectTopStatistics() {
        let vars = {
          key: 'projectTopStatistics',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            this.panelData1.val = data.data.project_total;
            this.panelData2.val = data.data.todo_project;
            this.panelData3.val = data.data.project_total - data.data.todo_project;
          }
        });
      },

      getProjectTaskStatistics() {
        let vars = {
          key: 'projectTaskStatistics',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data.projects) {
              this.echartOptions1.xAxis.data = [];
              this.echartOptions1.series[0].data = [];
              data.data.projects.forEach(item => {
                this.echartOptions1.xAxis.data.push(item.project_name);
                this.echartOptions1.series[0].data.push(item.todo_task);
              });
            }
          }
        });
      },

      getProjectTaskHealthStatistics() {
        let vars = {
          key: 'projectTaskHealthStatistics',
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            if (data.data.top_ten) {
              this.echartOptions2.xAxis.data = [];
              this.echartOptions2.series[0].data = [];
              data.data.top_ten.forEach(item => {
                this.echartOptions2.xAxis.data.push(item.project_name);
                this.echartOptions2.series[0].data.push(item.score);
              });
            }
            if (data.data.reciprocal_ten) {
              this.echartOptions3.xAxis.data = [];
              this.echartOptions3.series[0].data = [];
              data.data.reciprocal_ten.forEach(item => {
                this.echartOptions3.xAxis.data.push(item.project_name);
                this.echartOptions3.series[0].data.push(item.score);
              });
            }
          }
        });
      },

      init() {
        this.getProjectTopStatistics();
        this.getProjectTaskStatistics();
        this.getProjectTaskHealthStatistics();
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
