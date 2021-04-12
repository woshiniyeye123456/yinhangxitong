<template>
  <div class="default-box">
    <!-- search-form -->
    <search-form
      @on-search="onSearch"
    ></search-form>
    <!-- act-top -->
    <!--<act-top-->
    <!--@add="add"-->
    <!--&gt;</act-top>-->
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
  </div>
</template>

<script>
  import searchForm from './components/search-form';
  import actTop from './components/act-top';
  import editTable from '../../components/edit-table'
  import mixins from './mixins'

  export default {
    name: "Web漏洞扫描",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      searchForm,
      actTop,
      editTable,
    },
    mixins: [
      mixins
    ],
    computed: {
      permissions() {
        return this.$route.meta.permissions || [];
      }
    },
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'instance_id',
            label: '任务ID',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'task_name',
            label: '任务标题',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'creator',
            label: '创建人',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'created_time',
            label: '创建时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'names',
            label: '处理人',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'created_time',
            label: '当前工单创建时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'status',
            label: '任务状态',
            align: 'center',
            minWidth: '10',
            filters: [
              // {value: '关闭', circleColor: '#00C5D4'},
              // {value: '已过时', circleColor: '#FFE027'},
              // {value: '开发中', circleColor: '#469CFF'},
              // {value: '已作废', circleColor: '#FB731B,}
              {value: '已关闭', circleColor: 'gray'},
              {value: '已办结', circleColor: 'green'},
              {value: '待处理', circleColor: 'blue'},
              {value: '处理中', circleColor: 'red'},
              // new
              {value: '进行中', circleColor: 'blue'},
              {value: '已结束', circleColor: 'green'},
              {value: '已关闭', circleColor: 'gray'},
              {value: '已取消', circleColor: 'gray'},
              {value: '已出错', circleColor: 'red'},
            ],
            isStatus: true
          },
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
          operationWidth: '240',
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
          filterNameActive: [
            '流程',
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: (data) => {
                if (data.status === '已结束') {
                  return {
                    name: '报告',
                    type: 'success',
                  }
                } else {
                  return {
                    name: '报告',
                    type: 'success',
                    disabled: true,
                  }
                }
              }
            },
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
      }
    },
    methods: {

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
          name: 'viewTask',
          params: {
            params: params.row
          }
        })
      },

      onEdit(params) {
        // console.log(params);
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
        } else if (params.$active === '流程') {
          this.$router.push({
            name: 'taskWorkflow',
            query: {
              id: params.row.instance_id
            }
          })
        } else if (params.$active === '报告') {
          this.$router.push({
            name: 'reportDetails',
            query: {
              id: params.row.instance_id
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
          // key: 'instancesByDepartment',
          // account_id: this.user.id,
          // lines: this.lines,
          // pages: this.pages,

          key: 'instances',
          // name: this.user.name,
          actor: this.user.name,
          lines: this.lines,
          pages: this.pages,
        };
        if (this.searchParams) {
          for (let key in this.searchParams) {
            if (this.searchParams[key]) {
              vars[key] = this.searchParams[key];
            }
          }
        }
        this.tableOptions.loading = true;
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
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
      // if (this.permissions.indexOf('编辑') !== -1) {
      //   this.tableOptions.active.push({
      //     isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
      //     // name: ['上架', '下架'],          // 不会在这里取数据
      //     // type: ['success', 'danger'],    // 不会在这里取数据
      //     handler: (data) => {
      //       if (data.status === '已启用') {
      //         return {
      //           name: '查看',
      //           type: 'success',
      //         }
      //       } else {
      //         return {
      //           name: '编辑',
      //           type: 'success',
      //         }
      //       }
      //     }
      //   })
      // }
    },
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
