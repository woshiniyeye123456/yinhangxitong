<template>
  <div class="home-body">
    <div class="home-top">
      <HomeCard imgIndex="1" footIndex="1" :num="homeCard.new_task" :progress="homeCard.task_count" :info-num="homeCard.new_task - homeCard.yesterday_count"
        :isInfo="false"></HomeCard>
      <HomeCard title="当日完成" :num="homeCard.new_finish_task" :progress="(homeCard.new_finish_task/homeCard.finish_task*100) ?
        (homeCard.new_finish_task/homeCard.finish_task*100).toFixed(2) : 0.00"
        BgColor="linear-gradient(90deg,rgba(251,142,142,1),rgba(255,117,178,1))"></HomeCard>
      <HomeCard imgIndex="2" :num="homeCard.todo_task" :progress="(homeCard.todo_task/homeCard.task_count*100) ?
        (homeCard.todo_task/homeCard.task_count*100).toFixed(2) : 0.00"
        title="处理中" BgColor="linear-gradient(90deg,rgba(228,194,103,1),rgba(251,158,119,1))"></HomeCard>
      <HomeCard imgIndex="3" :num="homeCard.finish_task" :progress="(homeCard.finish_task/homeCard.task_count*100) ?
        (homeCard.todo_task/homeCard.task_count*100).toFixed(2) : 0.00"
        title="已完成" BgColor="linear-gradient(90deg,rgba(64,212,179,1),rgba(19,161,230,1))"></HomeCard>
    </div>
    <div class="home-charts">
      <div class="bar-chart">
        <div class="bar-chart-top">
          <span class="charts-title">正在执行任务的最多的前十个项目</span>
        </div>
        <div class="charts-box" @click="viewChart('正在执行任务的最多的前十个项目', echartOptions1)">
          <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
        </div>
      </div>
      <div class="bar-chart">
        <div class="bar-chart-top">
          <span class="charts-title">任务状态比例图</span>
        </div>
        <div class="charts-body">
          <div class="charts-box" @click="viewChart('任务状态比例图', echartOptions2)">
            <v-echart :autoresize="true" :options="echartOptions2"></v-echart>
          </div>
        </div>
      </div>
      <div class="bar-chart">
        <div class="bar-chart-top">
          <span class="charts-title">参与任务最多的十个安全分析师</span>
        </div>
        <div class="charts-body">
          <div class="charts-box" @click="viewChart('参与任务最多的十个安全分析师', echartOptions3)">
            <v-echart :autoresize="true" :options="echartOptions3"></v-echart>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="viewTitle" :append-to-body="true" :visible.sync="viewDialogVisible" width="80%"
      :close-on-click-modal="false" class="dialog-default">
      <div style="height: 600px;">
        <v-echart :autoresize="true" :options="viewOptions"></v-echart>
      </div>
    </el-dialog>
    <!--<div-->
    <!--style="width: 320px; height: 640px;"-->
    <!--&gt;-->
    <!--<iframe-->
    <!--frameborder="0"-->
    <!--src="http://172.16.103.103:4000"-->
    <!--width="100%"-->
    <!--height="100%"-->
    <!--&gt;</iframe>-->
    <!--</div>-->
  </div>
</template>

<script>
import HomeCard from "./components/HomeCard";
import { addDay } from "../../../apis/date";

export default {
  name: "index",
  components: {
    HomeCard
  },
  data() {
    return {
      viewTitle: "",
      viewOptions: {},
      viewDialogVisible: false,
      dialogVisible: false,
      homeCard: {
        finish_task: 3,
        new_task: 3,
        task_count: 4,
        time_out_task: 0,
        todo_task: 0,
        yesterday_count: 0
      },
      echartOptions1: {
        tooltip: {},
        legend: {
          orient: "vertical",
          left: "center",
          bottom: "bottom",
          data: ["执行率"]
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
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
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgb(214, 214, 214)",
              type: "dashed"
            }
          }
        },
        series: [
          {
            data: [],
            type: "bar",
            name: "",
            barWidth: 14,
            itemStyle: {
              normal: {
                color: "#51CEE3", // 定义柱形的背景色
                barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
              }
            },
            // showBackground: true,
            backgroundStyle: {
              color: "rgba(255,255,255,1)"
            }
          }
        ]
      },
      echartOptions2: {
        tooltip: {},
        legend: {
          width: "80%",
          type: "scroll",
          x: "center",
          y: "88%",
          bottom: "bottom",
          data: []
        },
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        series: [
          {
            name: "",
            hoverAnimation: true,
            type: "pie",
            radius: ["40%", "50%"],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
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
          orient: "vertical",
          left: "center",
          bottom: "bottom",
          data: ["执行率"]
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
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
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgb(214, 214, 214)",
              type: "dashed"
            }
          }
        },
        series: [
          {
            data: [],
            type: "bar",
            name: "",
            barWidth: 14,
            itemStyle: {
              normal: {
                color: "#51CEE3", // 定义柱形的背景色
                barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
              }
            },
            // showBackground: true,
            backgroundStyle: {
              color: "rgba(255,255,255,1)"
            }
          }
        ]
      }
    };
  },
  methods: {
    viewChart(title, options) {
      this.viewTitle = title;
      this.viewOptions = options;
      this.viewDialogVisible = true;
    },

    getIndexStatistics() {
      let vars = {
        key: "indexStatistics"
      };
      this.$api.ext(vars, this, data => {
        // console.log(data);
        if (data) {
          this.homeCard = data.data;
        }
      });
    },

    getProjectTaskStatistics() {
      let vars = {
        key: "projectTaskStatistics"
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

    getTaskStateDiagram() {
      let vars = {
        key: "taskStateDiagram"
      };
      this.$api.ext(vars, this, data => {
        if (data.data) {
          // console.log(data.data);
          this.echartOptions2.legend.data = [];
          this.echartOptions2.series[0].data = [];
          data.data.forEach(item => {
            this.echartOptions2.legend.data.push(item.status);
            this.echartOptions2.series[0].data.push({
              name: item.status,
              value: item.count
            });
          });
        }
      });
    },

    getDemandAnalystOfTask() {
      let vars = {
        key: "demandAnalystOfTask"
      };
      this.$api.ext(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.echartOptions3.xAxis.data = [];
          this.echartOptions3.series[0].data = [];
          data.data.forEach(item => {
            this.echartOptions3.xAxis.data.push(item.actor_user);
            this.echartOptions3.series[0].data.push(item.count);
          });
        }
      });
    },

    init() {
      this.getIndexStatistics();
      this.getProjectTaskStatistics();
      this.getTaskStateDiagram();
      this.getDemandAnalystOfTask();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.home-body {
  background-color: #f5f6fa;
  display: flex;
  flex-direction: column;
  height: calc(100% - 46px);
  box-sizing: border-box;
}

.home-header {
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 17px;

  > .time-picker {
    vertical-align: top;
    display: inline-block;
    margin-left: 20px;

    .el-date-editor {
      border-radius: 20px;
      height: 32px;
    }
  }
}

.home-top {
  display: flex;
  justify-content: flex-start;
  > div {
    margin-left: 13px;
  }
  > div:nth-of-type(1) {
    margin-left: 0;
  }
}

.home-charts {
  margin-top: 17px;
  flex: 1;
  > div {
    float: left;
    margin-left: 1.2%;
  }
  > div:nth-of-type(1) {
    margin-left: 0;
  }
}

.charts-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
}

.bar-chart {
  width: 32.5%;
  padding: 14px;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bar-chart-top {
  display: flex;
  justify-content: space-between;
  height: 46px;
  align-items: center;
  flex-shrink: 0;
}

.charts-body {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.charts-body-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 22px;
  font-weight: bold;
  color: rgba(49, 63, 103, 1);
}

.charts-box {
  flex: 1;
  max-height: 600px;
}

.charts-xaxistick {
  flex-shrink: 0;
  height: 12px;
  display: flex;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  margin-top: -35px;
}

.charts-xaxistick i {
  flex-shrink: 0;
  color: #262626;
  cursor: pointer;
}

.date-box {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: rgba(137, 151, 189, 1);
}
</style>
