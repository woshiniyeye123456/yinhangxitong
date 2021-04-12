<template>
  <div class="default-box">
    <work-process
      v-if="work_flow"
      :work_flow="work_flow"
      :workspace="workspace"
    ></work-process>
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
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
  import editTable from '../../components/edit-table'
  import workProcess from '../../我的工作/流程/components/work-process'

  export default {
    name: "任务管理",
    components: {
      editTable,
      workProcess,
    },
    computed: {},
    data() {
      return {
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
        work_flow: '',
        workspace: '',
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.$router.push({
          name: 'addTask'
        })
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'baseline_library';
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
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'baseline_library';
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
          instance_id: this.id,
          paging: this.pages + ',' + this.lines,
          not_equal_status: '已关闭',
          // order: 'created_time DESC',
          order: 'id DESC',
        };
        vars.key = 'tasks';
        this.tableOptions.loading = true;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
            this.tableData = this.tableData.filter(it => it.status !== '已关闭');
            this.workspace = [];
            this.tableData.forEach(item => {
              if (item.status === '待处理') {
                this.workspace.push(item.node_name)
              }
              this.work_flow = item.work_flow;
            });
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      init() {
        this.getListData();
      }
    },
    created() {
      if (this.$route.query && this.$route.query.id) {
        this.id = +this.$route.query.id;
      }
    },
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
