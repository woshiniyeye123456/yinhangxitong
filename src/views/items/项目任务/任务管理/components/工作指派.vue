<template>
  <div>
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
    <!-- popup -->
    <popup
      title="工单指派"
      :params="params"
      :visible.sync="visible"
      @go-back="goback"
      @on-submit="submit"
      @on-update="update"
    ></popup>
  </div>
</template>

<script>
  import editTable from '../../../components/edit-table'
  import popup from './popup'

  export default {
    name: "工单指派",
    components: {
      editTable,
      popup,
    },
    data() {
      return {
        params: {},
        visible: false,
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '基线库名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'coding',
            label: '基线库编号',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'version',
            label: '版本号',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'created_time',
            label: '创建时间',
            align: 'center',
            minWidth: '15',
          },
          {
            prop: 'creator',
            label: '创建人',
            align: 'center',
            minWidth: '10',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            minWidth: '8',
            filters: [
              {value: '已启用', circleColor: '#00C5D4',},
              {value: '已过时', circleColor: '#FFE027',},
              {value: '开发中', circleColor: '#469CFF',},
              {value: '已作废', circleColor: '#FB731B',}
            ],
            isStatus: true
          },
          {
            prop: 'count',
            label: '基线数量',
            align: 'center',
            minWidth: '7',
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

            '指派',
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
        if (params.$active === '指派') {
          this.visible = true;
          this.params = params.row
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
        vars.key = 'baseline_library';
        vars.params = {
          conds: [
            'latest = true'
          ],
          dims: [],
          paging: [
            this.pages,
            this.lines
          ],
          order: ['id', 'DESC'],
        };
        this.tableOptions.loading = true;
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total || 0;
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
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
