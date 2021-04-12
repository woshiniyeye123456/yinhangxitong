<template>
  <div class="default-box">
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
    name: "任务草稿",
    components: {
      searchForm,
      actTop,
      editTable,
    },
    mixins: [
      mixins
    ],
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '任务名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'actor_name',
            label: '当前执行者',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'version',
            label: '项目名称',
            align: 'center',
            minWidth: '11',
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
            minWidth: '18',
          },
          {
            prop: 'updated_at',
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
          {
            prop: 'creator',
            label: '任务进度',
            align: 'center',
            minWidth: '10',
          },
          // {
          //   prop: 'status',
          //   label: '状态',
          //   align: 'center',
          //   minWidth: '8',
          //   filters: [
          //     {value: '已启用', circleColor: '#00C5D4',},
          //     {value: '已过时', circleColor: '#FFE027',},
          //     {value: '开发中', circleColor: '#469CFF',},
          //     {value: '已作废', circleColor: '#FB731B',}
          //   ],
          //   isStatus: true
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
          operationWidth: '312',
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
        console.log(params)
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        console.log(params)
        if (params.$active === '版本') {
          this.$router.push({
            name: 'baselineLibraryVersion',
            query: {
              group_id: params.row.group_id,
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
        let vars = {};
        vars.key = 'tasks';
        vars.params = {
          conds: [],
          dims: [],
          // paging: [
          //   this.pages,
          //   this.lines
          // ],
          order: ['id', 'DESC'],
        };
        this.tableOptions.loading = true;
        new Promise((resolve, reject) => {   // 增加搜索条件
          resolve(this.addSearch(this.searchParams));
        }).then(conds => {
          vars.params.conds = vars.params.conds.concat(conds);
          this.$api.wf(vars, this, data => {
            // console.log(data);
            if (data) {
              this.tableData = data.data || [];
              this.tableOptions.loading = false;
            }
          }, () => {
            this.tableOptions.loading = false;
          });
        });
      },

      init() {
        this.getListData();
      }
    },
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
