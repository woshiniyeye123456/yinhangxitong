<template>
  <el-form label-width="140px" :model="params">
    <el-form-item label="任务名称:">
      <el-input
        v-model="params.task_name"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="任务编号:">
      <el-input
        v-model="params.requirement"
        readonly
      ></el-input>
    </el-form-item>
    <!--<el-form-item label="子需求编号:">-->
      <!--<el-input-->
        <!--v-model="params.subRequirement"-->
        <!--readonly-->
      <!--&gt;</el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="从属关系:">-->
      <!--<el-input-->
        <!--v-model="params.subordinate"-->
        <!--readonly-->
      <!--&gt;</el-input>-->
    <!--</el-form-item>-->
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
        @click="downloadApp($event, ['测试用例'])"
        size="small"
      >
        下载报告
      </el-button>
    </el-form-item>
    <el-form-item label="基线报告:">
      <el-button
        type="primary"
        @click="downloadApp"
        size="small"
      >
        下载报告
      </el-button>
    </el-form-item>
    <el-form-item label="评审意见:" v-if="params.finalReviewComments">
      <el-input
        v-model="params.finalReviewComments"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="开发组件:">
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
    <el-form-item label="测试结果:" v-if="params.testSummary">
      <el-input
        v-model="params.testSummary"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="测试驳回意见:" v-if="params.testResult">
      <el-input
        autosize
        type="textarea"
        v-model="params.testResult"
        readonly
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import editTable from '../../../components/edit-table'
  import mixins from '../components/mixins'

  export default {
    name: "developmentBlueprint",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      editTable
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
        params: {},
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'software_platform',
            label: '软件平台',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'component_source',
            label: '来源',
            align: 'center',
            minWidth: '8',
          },
          {
            prop: '$source',
            label: '是否自定义',
            align: 'center',
            minWidth: '8',
          },
          {
            prop: 'created_time',
            label: '登记时间',
            align: 'center',
            minWidth: '15',
          },
          // {
          //   prop: 'creator',
          //   label: '登记人',
          //   align: 'center',
          //   minWidth: '10',
          // },
          // {
          //   prop: 'status',
          //   label: '状态',
          //   filters: [
          //     {text: '正常', value: '正常'},
          //     {text: '禁止', value: '禁止'}
          //   ],
          //   tagSuccessVal: '正常',
          //   scope: true
          // },
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
            'view',
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
      }
    },
    methods: {

      getView() {
        let vars = {
          workflow_id: this.workflow_id,
          name: 'taskData',
        };
        vars.key = 'view';
        this.$api.wf(vars, this, data => {
          if (data) {
            this.params = data.data || {};
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
        console.log(params)
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
          key: 'components',
          workflow_id: this.workflow_id,
        };
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data) {
            this.tableData = data.data || [];
            this.tableData.forEach(item => {
              if (item.source === 2) {
                item.$source = '是'
              } else {
                item.$source = '否'
              }
            });
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      init() {
        this.getView();
        this.getListData();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
</style>
