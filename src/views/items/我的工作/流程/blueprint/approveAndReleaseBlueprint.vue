<template>
  <div>
    <div class="panel-row">
      <el-row :gutter="12">
        <el-col :span="6">
          <panel-todo
            :panelData="panelData1"
          ></panel-todo>
        </el-col>
        <el-col :span="6">
          <panel-todo
            :panelData="panelData2"
          ></panel-todo>
        </el-col>
        <el-col :span="6">
          <panel-todo
            :panelData="panelData3"
          ></panel-todo>
        </el-col>
        <el-col :span="6">
          <panel-todo
            :panelData="panelData4"
          ></panel-todo>
        </el-col>
      </el-row>
    </div>
    <el-card shadow="never">
      推荐发布: {{ recommendedScore }}
    </el-card>
    <el-form label-width="180px" :model="params" class="margin-top-8">
      <el-row :gutter="12">
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
      </el-row>
      <!--<el-form-item label="主办产品经理:">-->
      <!--<el-input-->
      <!--v-model="params._masterPM"-->
      <!--readonly-->
      <!--&gt;</el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="项目产品经理:">
        <el-input
          v-model="params._pm"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="任务责任人:">
        <el-input
          v-model="params._taskOwner"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="业务需求说明书:">
        <el-link
          v-for="(item, index) in params.requirementDoc"
          :key="index"
          :href="item._url"
          target="_blank"
          style="margin-right: 12px"
        >
          {{ item.name }};
        </el-link>
      </el-form-item>
      <el-form-item label="安全开发会议纪要:">
        <el-link
          v-for="(item, index) in params.devTaskReviewMM"
          :key="index"
          :href="item._url"
          target="_blank"
          style="margin-right: 12px"
        >
          {{ item.name }};
        </el-link>
      </el-form-item>
      <el-form-item label="安全开发其他附件:">
        <el-link
          v-for="(item, index) in params.devTaskReviewFiles"
          :key="index"
          :href="item._url"
          target="_blank"
          style="margin-right: 12px"
        >
          {{ item.name }};
        </el-link>
      </el-form-item>
      <el-form-item label="安全测试会议纪要:">
        <el-link
          v-for="(item, index) in params.testTaskReviewMM"
          :key="index"
          :href="item._url"
          target="_blank"
          style="margin-right: 12px"
        >
          {{ item.name }};
        </el-link>
      </el-form-item>
      <el-form-item label="安全测试其他附件:">
        <el-link
          v-for="(item, index) in params.testTaskReviewFiles"
          :key="index"
          :href="item._url"
          target="_blank"
          style="margin-right: 12px"
        >
          {{ item.name }};
        </el-link>
      </el-form-item>
      <el-form-item label="安全需求说明书:">
        <el-button
          type="primary"
          @click="downloadApp"
          size="small"
        >
          下载报告
        </el-button>
      </el-form-item>
      <el-form-item label="检测结论:">
        <el-input
          v-model="params.testResult"
          readonly
        ></el-input>
      </el-form-item>
      <!--<el-form-item label="检测报告:">-->
      <!--<el-button-->
      <!--type="primary"-->
      <!--@click="downloadTestReport"-->
      <!--size="small"-->
      <!--&gt;-->
      <!--下载报告-->
      <!--</el-button>-->
      <!--</el-form-item>-->
      <template v-if="isReady">
        <el-form-item label="源码自动检测报告:">
          <template
            v-if="params.bangcleCodeChecker && params.bangcleCodeChecker.external_system"
          >
            <el-button
              type="primary"
              size="small"
              @click="viewReport('bangcleCodeChecker')"
            >
              查看源码自动检测报告
            </el-button>
          </template>
        </el-form-item>
        <template v-if="params.detection === '移动应用'">
          <el-form-item label="移动应用自动检测报告:">
            <template
              v-if="params.bangcleAppTest && params.bangcleAppTest.external_system"
            >
              <el-button
                type="primary"
                size="small"
                @click="viewReport('bangcleAppTest')"
              >
                查看移动应用自动检测报告
              </el-button>
            </template>
          </el-form-item>
        </template>
        <template v-else-if="params.detection === 'web应用'">
          <el-form-item label="web应用自动检测报告:">
            <template
              v-if="params.bangcleLoopholeChecker && params.bangcleLoopholeChecker.external_system"
            >
              <el-button
                type="primary"
                size="small"
                @click="viewReport('bangcleLoopholeChecker')"
              >
                查看web应用自动检测报告
              </el-button>
            </template>
          </el-form-item>
        </template>
      </template>
      <el-form-item label="评审意见:" v-if="params.finalReviewComments">
        <el-input
          v-model="params.finalReviewComments"
          readonly
        ></el-input>
      </el-form-item>
      <!--<el-form-item label="安全需求说明书:">-->
      <!--<el-button-->
      <!--type="primary"-->
      <!--@click="downloadSecReqAnalysisDoc"-->
      <!--size="small"-->
      <!--&gt;-->
      <!--下载附件-->
      <!--</el-button>-->
      <!--</el-form-item>-->
      <el-form-item label="本任务工单列表:">
        <edit-table
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import mixins from '../components/mixins'
  import editTable from '../../../components/edit-table'
  import panelTodo from '../components/panel-todo';
  import icon1 from '../../../../../img/icons/securityPortrait/icon-1.png'
  import icon2 from '../../../../../img/icons/securityPortrait/icon-2.png'
  import icon3 from '../../../../../img/icons/securityPortrait/icon-3.png'
  import icon4 from '../../../../../img/icons/securityPortrait/icon-4.png'

  export default {
    name: "approveAndReleaseBlueprint",
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
      editTable,
    },
    mixins: [mixins],
    props: {
      workflow_id: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        panelData1: {
          url: icon1,
          val: 0,
          title: '基线执行率',
          duration: 1200,
          decimals: 2,
          append: '%',
          color: '#1B95EA',
        },
        panelData2: {
          url: icon2,
          val: 0,
          title: '基线通过率',
          duration: 1600,
          decimals: 2,
          append: '%',
          color: '#31BC85',
        },
        panelData3: {
          url: icon3,
          val: 0,
          text: '',
          title: '健康等级',
          duration: 2000,
          decimals: 2,
          color: '#F67E45',
        },
        panelData4: {
          url: icon4,
          val: 0,
          title: '任务健康评分',
          duration: 2400,
          decimals: 2,
          color: '#F15C84',
        },
        params: {},
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '工单描述',
            align: 'center',
            minWidth: '18',
          },
          // {
          //   prop: 'project_name',
          //   label: '所属项目',
          //   align: 'center',
          //   minWidth: '18',
          // },
          // {
          //   prop: 'task_name',
          //   label: '所属任务',
          //   align: 'center',
          //   minWidth: '18',
          // },
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
            minWidth: '18',
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
        recommendedScore: '',
        isReady: false,
      }
    },
    methods: {

      viewReport(url) {
        if (url) {
          window.open(this.$common.win_origin + '/#/' + url + '?workflow_id=' + this.workflow_id);
        }
      },

      getRecommendedScore() {
        let vars = {
          instance_id: this.params.instance_id,
          project_id: this.params.project_id,
        };
        vars.key = 'recommendedScore';
        this.$api.ext(vars, this, data => {
          // console.log(data);
          let text;
          let number;
          if (data.data.te_score_sum >= 0.6) {
            if (data.data.not_te_score_sum >= 0.6) {
              text = '高危新项目'
            } else {
              text = '高危成熟项目'
            }
          } else {
            if (data.data.not_te_score_sum >= 0.6) {
              text = '低危新项目'
            } else {
              text = '低危成熟项目'
            }
          }
          if (data.data.total_score > 0) {
            number = data.data.through_score / data.data.total_score * 100;
          } else {
            number = 0;
          }
          // console.log(text)
          // console.log(number)
          if (text === '高危新项目') {
            if (number >= 90) {
              this.recommendedScore = '是'
            } else {
              this.recommendedScore = '否'
            }
          } else if (text === '高危成熟项目') {
            if (number >= 80) {
              this.recommendedScore = '是'
            } else {
              this.recommendedScore = '否'
            }
          } else if (text === '低危新项目') {
            if (number >= 70) {
              this.recommendedScore = '是'
            } else {
              this.recommendedScore = '否'
            }
          } else if (text === '低危成熟项目') {
            if (number >= 60) {
              this.recommendedScore = '是'
            } else {
              this.recommendedScore = '否'
            }
          }
        });
      },

      downloadSecReqAnalysisDoc() {
        if (this.params.secReqAnalysisDoc) {
          this.params.secReqAnalysisDoc.forEach(item => {
            window.open(this.$api.download(item.path))
          })
        }
      },

      downloadTestReport() {
        if (this.params.testReport) {
          this.params.testReport.forEach(item => {
            window.open(this.$api.download(item.path))
          })
        }
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
            this.params = data.data || {};
            this.isReady = true;
            this.params = this.filterParams(this.params);
            if (this.params.requirementDoc) {
              this.params.requirementDoc.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
            if (this.params.secReqAnalysisDoc) {
              this.params.secReqAnalysisDoc.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
            if (this.params.devTaskReviewMM) {
              this.params.devTaskReviewMM.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
            if (this.params.devTaskReviewFiles) {
              this.params.devTaskReviewFiles.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
            if (this.params.testTaskReviewMM) {
              this.params.testTaskReviewMM.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
            if (this.params.testTaskReviewFiles) {
              this.params.testTaskReviewFiles.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
          }
          this.getRecommendedScore();
        });
      },

      submit(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'security_component';
        vars.params = params;
        this.$api.save(vars, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },

      update(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'security_component';
        vars.params = params;
        this.$api.update(vars, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },

      goback(v) {
        if (v) {
          this.initData();
        } else {
          this.getListData();
        }
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'security_component';
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
          name: 'viewSecurityComponent',
          query: {
            id: params.row.id
          }
        })
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '工单详情') {
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
          key: 'tasks',
          workflow_id: this.workflow_id,
          paging: this.pages + ',' + this.lines,
          order: 'created_time DESC',
        };
        this.tableOptions.loading = true;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      getTaskStatistics() {
        let vars = {
          key: 'taskStatistics',
          workflow_id: this.workflow_id,
        };
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data) {
            if (data.data.total_count > 0) {
              this.panelData1.val = (data.data.not_pass_count + data.data.pass_count) / data.data.total_count * 100;
              this.panelData2.val = data.data.pass_count / data.data.total_count * 100;
            } else {
              this.panelData1.val = 0;
              this.panelData2.val = 0;
            }
            if (data.data.total_score > 0) {
              this.panelData4.val = data.data.through_score / data.data.total_score * 100;
            } else {
              this.panelData4.val = 0;
            }
            this.panelData3.text = this.panelData4.val > 90 ?
              '优' : this.panelData4.val > 80 ?
                '良' : this.panelData4.val > 70 ?
                  '中' : this.panelData4.val >= 60 ?
                    '合格' : '差'
          }
        });
      },

      init() {
        this.getView();
        this.getListData();
        this.getTaskStatistics();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .panel-row {
    margin: 5px 4px 12px;
  }
</style>
