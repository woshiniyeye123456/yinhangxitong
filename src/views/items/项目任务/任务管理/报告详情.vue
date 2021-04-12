<template>
  <div class="default-box">
    <template v-if="isReady">
      <!-- 任务信息 -->
      <el-card shadow="never" class="default-card">
        <div slot="header" class="clearfix">
          <span class="slot-title">任务信息</span>
        </div>
        <el-form label-width="120px">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="项目名称:">
                <el-input
                  readonly
                  v-model="params.project_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称:">
                <el-input
                  readonly
                  v-model="params.project_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务名称:">
                <el-input
                  v-model="params.task_name"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务编号:">
                <el-input
                  v-model="params.requirement"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
              <!--<el-form-item label="子需求编号:">-->
                <!--<el-input-->
                  <!--v-model="params.subRequirement"-->
                  <!--readonly-->
                <!--&gt;</el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<el-form-item label="从属关系:">-->
                <!--<el-input-->
                  <!--v-model="params.subordinate"-->
                  <!--readonly-->
                <!--&gt;</el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :span="12">
              <el-form-item label="开始时间:">
                <el-input
                  readonly
                  v-model="params.created_time"
                ></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
              <!--<el-form-item label="完成时间:">-->
                <!--<el-input-->
                  <!--readonly-->
                  <!--v-model="params.end_time"-->
                <!--&gt;</el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          </el-row>
        </el-form>
      </el-card>
      <!-- 任务执行 -->
      <el-card shadow="never" class="default-card margin-top-12">
        <div slot="header" class="clearfix">
          <span class="slot-title">任务执行</span>
        </div>
        <svg-flow
          :defaultNodes="defaultNodes"
        ></svg-flow>
      </el-card>
      <!-- 工单列表 -->
      <el-card shadow="never" class="default-card margin-top-12">
        <div slot="header" class="clearfix">
          <span class="slot-title">工单列表</span>
        </div>
        <edit-table
          class="margin-top-8"
          :tableColumn="tableColumn"
          :tableData="tableData"
          :tableOptions="tableOptions"
          :pages="pages"
          :lines="lines"
          :total="total"
          @on-view="onView"
          @on-edit="onEdit"
          @on-filter-name-active="onFilterNameActive"
          @on-delete="onDelete"
          @change-page="changePage"
          @change-size="changeSize"
        ></edit-table>
      </el-card>
      <!-- 结果统计 -->
      <el-card shadow="never" class="default-card margin-top-12">
        <div slot="header" class="clearfix">
          <span class="slot-title">结果统计</span>
        </div>
        <el-row :gutter="12">
          <el-col :span="11">
            <el-form label-width="120px">
              <el-form-item label="基线执行率:">
                <el-input
                  readonly
                  v-model="resultsParams.enforced"
                ></el-input>
              </el-form-item>
              <el-form-item label="基线通过率:">
                <el-input
                  readonly
                  v-model="resultsParams.passRate"
                ></el-input>
              </el-form-item>
              <el-form-item label="健康等级:">
                <el-input
                  readonly
                  v-model="resultsParams.healthLevel"
                ></el-input>
              </el-form-item>
              <el-form-item label="任务健康评分:">
                <el-input
                  readonly
                  v-model="resultsParams.healthScore"
                ></el-input>
              </el-form-item>
              <el-form-item label="基线总数:">
                <el-input
                  readonly
                  v-model="resultsParams.total_count"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="13">
            <div
              class="echart-wrap"
              @click="viewChart('基线覆盖', echartOptions1)"
            >
              <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <!-- 基线详情 -->
      <el-card shadow="never" class="default-card margin-top-12">
        <div slot="header" class="clearfix">
          <span class="slot-title">基线详情</span>
        </div>
        <baseline-details
          :params="params"
        ></baseline-details>
      </el-card>
    </template>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
    </div>
    <el-dialog
      :title="viewTitle"
      :append-to-body="true"
      :visible.sync="viewDialogVisible"
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
  import editTable from '../../components/edit-table'
  import svgFlow from '../../components/svg-flow'
  import baselineDetails from './components/baseline-details'

  export default {
    name: "报告详情",
    components: {
      editTable,
      svgFlow,
      baselineDetails,
    },
    data() {
      return {
        viewTitle: '',
        viewOptions: {},
        viewDialogVisible: false,
        params: {},
        resultsParams: {},
        workflow_id: 0,
        isReady: false,
        defaultNodes: [],
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '工单描述',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'actor_name',
            label: '执行者',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'task_name',
            label: '所属任务',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'created_time',
            label: '创建时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'updated_time',
            label: '最近操作时间',
            align: 'center',
            minWidth: '10',
          },
          {
            prop: 'status',
            label: '流程状态',
            align: 'center',
            minWidth: '10',
          },
        ],
        tableData: [],
        tableOptions: {
          operationWidth: '120',
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            // 'view',
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [
            '工单详情'
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
        // echart
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
        this.viewDialogVisible = true;
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'baseline_library';
        vars.params = {
          ids: ids.join(','),
        };
        this.$api.del(vars, this, () => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.goback(true);
        });
      },

      onView(params) {
        // console.log(params)
        this.$router.push({
          name: 'workflowDetails',
          query: {
            id: this.id
          }
        })
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '版本') {
          this.$router.push({
            name: 'baselineLibraryVersion',
            query: {
              group_id: params.row.group_id,
            }
          })
        } else if (params.$active === '编辑') {
          let vars = {};
          vars.key = 'taskData';
          vars.task_id = params.row.ID;
          this.$api.wf(vars, this, data => {
            // console.log(data);
            if (data.data) {
              this.$router.push({
                name: 'addTask',
                params: {
                  params: data.data
                }
              })
            }
          });
        } else if (params.$active === '查看') {
          let vars = {};
          vars.key = 'taskData';
          vars.task_id = params.row.ID;
          this.$api.wf(vars, this, data => {
            // console.log(data);
            if (data.data) {
              this.$router.push({
                name: 'viewTask',
                params: {
                  params: data.data
                }
              })
            }
          });
        } else if (params.$active === '工单详情') {
          this.$router.push({
            name: 'workflowDetails',
            query: {
              workflow_id: params.row.workflow_id,
              workspace: params.row.node_name,
            }
          })
        }
      },

      changePage(page) {
        this.pages = page;
        this.getListData();
      },

      changeSize(size) {
        this.lines = size;
        this.getListData();
      },

      initData() {
        this.pages = 1;
        this.lines = 10;
        this.getListData();
      },

      getListData() {
        let vars = {
          instance_id: this.workflow_id,
          paging: this.pages + ',' + this.lines,
          not_equal_status: '已关闭',
        };
        vars.key = 'tasks';
        this.tableOptions.loading = true;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
            this.tableData = this.tableData.filter(it => it.status !== '已关闭');
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      goBack() {
        this.$router.go(-1);
      },

      getView() {
        let vars = {
          workflow_id: this.workflow_id,
          name: 'taskData',
        };
        vars.key = 'view';
        this.isReady = false;
        this.$api.wf(vars, this, data => {
          if (data.data) {
            this.params = data.data;
            // console.log(this.params)
          }
          this.isReady = true;
        });
      },

      getTaskStatistics() {
        let vars = {
          key: 'taskStatistics',
          workflow_id: this.workflow_id,
        };
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.resultsParams = data.data;
            // console.log(this.resultsParams)
            if (data.data.total_count > 0) {
              this.resultsParams.enforced = (data.data.not_pass_count + data.data.pass_count) / data.data.total_count * 100;
              this.resultsParams.passRate = data.data.pass_count / data.data.total_count * 100;
            } else {
              this.resultsParams.enforced = 0;
              this.resultsParams.passRate = 0;
            }
            if (data.data.total_score > 0) {
              this.resultsParams.healthScore = data.data.through_score / data.data.total_score * 100;
            } else {
              this.resultsParams.healthScore = 0;
            }
            this.resultsParams.healthLevel = this.resultsParams.healthScore > 90 ?
              '优' : this.resultsParams.healthScore > 80 ?
                '良' : this.resultsParams.healthScore > 70 ?
                  '中' : this.resultsParams.healthScore >= 60 ?
                    '合格' : '差'
          }
        });
      },

      getSecuritySceneTaskBaseline() {
        let vars = {
          key: 'securitySceneTaskBaseline',
          workflow_id: this.workflow_id,
        };
        this.$api.ext(vars, this, data => {
          if (data.data) {
            // console.log(data.data);
            if (data.data) {
              this.echartOptions1.legend.data = [];
              this.echartOptions1.series[0].data = [];
              data.data.forEach(item => {
                this.echartOptions1.legend.data.push(item.name);
                this.echartOptions1.series[0].data.push({
                  name: item.name,
                  value: item.coverage / item.total,
                });
              });
            }
          }
        });
      },

      init() {
        if (this.workflow_id) {
          this.getView();
          this.getTaskStatistics();
          this.getSecuritySceneTaskBaseline();
          this.initData();
        }
      }
    },
    created() {
      if (this.$route.query && this.$route.query.id) {
        this.workflow_id = +this.$route.query.id;
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .echart-wrap {
    height: 230px;
  }
</style>
