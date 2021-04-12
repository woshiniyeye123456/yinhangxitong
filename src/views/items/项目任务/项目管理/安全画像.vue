<template>
  <div class="default-box">
    <div class="print-page">
      <div class="wrap">
        <div class="text-right">
          <el-button type="primary" @click="saveAs" size="small">
            下载PDF
          </el-button>
        </div>
      </div>
      <div ref="download-wrap">
        <el-row :gutter="12">
          <el-col :span="24" class="margin-top-12">
            <panel-todo :panelData="panelData5"></panel-todo>
          </el-col>
          <el-col :span="12" class="margin-top-12">
            <panel-todo :panelData="panelData1"></panel-todo>
          </el-col>
          <el-col :span="12" class="margin-top-12">
            <panel-todo :panelData="panelData2"></panel-todo>
          </el-col>
          <el-col :span="12" class="margin-top-12">
            <panel-todo :panelData="panelData3"></panel-todo>
          </el-col>
          <el-col :span="12" class="margin-top-12">
            <panel-todo :panelData="panelData4"></panel-todo>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24" class="margin-top-12">
            <detail-view v-if="isReady" :disabled="true" :params="params" :hiddenBack="true"></detail-view>
          </el-col>
          <el-col :span="24" class="margin-top-12">
            <el-card shadow="never" class="default-card">
              <div slot="header" class="clearfix">
                <span class="slot-title">安全基线覆盖</span>
              </div>
              <div class="v-echarts-650">
                <v-echart :autoresize="true" :options="chartOptions"></v-echart>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="margin-top-10 text-right">
        <el-button type="default" @click="goBack" size="small">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import detailView from "./components/项目view";
import panelTodo from "./components/panel-todo";
import icon1 from "../../../../img/icons/securityPortrait/icon-1.png";
import icon2 from "../../../../img/icons/securityPortrait/icon-2.png";
import icon3 from "../../../../img/icons/securityPortrait/icon-3.png";
import icon4 from "../../../../img/icons/securityPortrait/icon-4.png";
import icon5 from "../../../../img/icons/securityPortrait/icon-5.png";

export default {
  name: "anquanhuaxiang",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    detailView,
    panelTodo
  },
  data() {
    return {
      chartOptions: {
        color: ["#51CEE3", "#F683A2", "#70B0F9", "#BD88FA", "#4FD39F"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["基线总数", "已使用基线数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: []
        },
        series: []
      },
      panelData1: {
        url: icon1,
        val: 0,
        title: "任务数",
        duration: 1200,
        decimals: 0,
        color: "#1B95EA"
      },
      panelData2: {
        url: icon2,
        val: 0,
        title: "任务完成率",
        duration: 1600,
        decimals: 2,
        append: "%",
        color: "#31BC85"
      },
      panelData3: {
        url: icon3,
        val: 0,
        text: "",
        title: "健康等级",
        duration: 2000,
        decimals: 2,
        color: "#F67E45"
      },
      panelData4: {
        url: icon4,
        val: 0,
        title: "健康评分",
        duration: 2400,
        decimals: 2,
        color: "#F15C84",
        fontSize: "16px"
      },
      panelData5: {
        url: icon5,
        val: 0,
        text: "",
        title: "风险等级",
        duration: 2800,
        decimals: 2,
        color: "#9281FF",
        fontSize: "16px"
      },
      isReady: false,
      params: {},
      id: 0
    };
  },
  computed: {},
  methods: {
    saveAs() {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let element = this.$refs["download-wrap"];
      let opt = {
        width: element.scrollWidth,
        Height: element.scrollHeight,
        margin: 0.5,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save(
          this.params.application_name + this.$common.getThisTime() + ".pdf"
        )
        .then(() => {
          loading.close();
        });
    },

    goBack() {
      this.$router.go(-1);
    },

    getSecurityBaselineCoverage(id) {
      let vars = {};
      vars.key = "projectStatistics";
      vars.project_id = id;
      this.$api.ext(vars, this, data => {
        // console.log(data);
        if (data) {
          this.panelData1.val = data.data.task_count;
          if (data.data.task_count > 0) {
            this.panelData2.val =
              ((data.data.task_count - data.data.todo_task_count) /
                data.data.task_count) *
              100;
          } else {
            this.panelData2.val = 0;
          }
          if (data.data.total_score > 0) {
            this.panelData4.val =
              (data.data.through_score / data.data.total_score) * 100;
          } else {
            this.panelData4.val = 0;
          }
          this.panelData3.text =
            this.panelData4.val > 90
              ? "优"
              : this.panelData4.val > 80
              ? "良"
              : this.panelData4.val > 70
              ? "中"
              : this.panelData4.val >= 60
              ? "合格"
              : "差";
          if (data.data.te_score_sum >= 0.6) {
            if (data.data.not_te_score_sum >= 0.6) {
              this.panelData5.text = "高危新项目";
            } else {
              this.panelData5.text = "高危成熟项目";
            }
          } else {
            if (data.data.not_te_score_sum >= 0.6) {
              this.panelData5.text = "低危新项目";
            } else {
              this.panelData5.text = "低危成熟项目";
            }
          }
        }
      });
    },

    getProject(id) {
      let vars = {};
      vars.key = "securityBaselineCoverage";
      vars.project_id = id;
      this.$api.ext(vars, this, data => {
        if (data.data) {
          let yAxisData = [];
          let data1 = [];
          let data2 = [];
          data.data.forEach(item => {
            yAxisData.push(item.name);
            data1.push(item.total - item.coverage);
            data2.push(item.coverage);
          });
          let series = [
            {
              name: "基线总数",
              type: "bar",
              stack: "总量",
              label: {
                show: true,
                position: "insideRight"
              },
              data: data1
            },
            {
              name: "已使用基线数",
              type: "bar",
              stack: "总量",
              label: {
                show: true,
                position: "insideRight"
              },
              data: data2
            }
          ];
          this.chartOptions.yAxis.data = yAxisData;
          this.chartOptions.series = series;
        }
      });
    },

    getData(id) {
      let vars = {};
      vars.key = "projectData";
      vars.id = id;
      this.$api.wf(vars, this, data => {
        if (data) {
          this.params = data.data.data;
          this.isReady = true;
          // console.log(this.params)
        }
      });
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id;
    }
  },
  mounted() {
    if (this.id) {
      this.getData(this.id);
      this.getProject(this.id);
      this.getSecurityBaselineCoverage(this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.print-page {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.v-echarts {
  width: 100%;
  height: 354px;
}

.v-echarts-650 {
  width: 100%;
  height: 650px;
}
</style>
