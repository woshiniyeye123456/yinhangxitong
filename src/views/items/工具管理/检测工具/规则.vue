<template>
  <div class="default-box">
    <act-top
      @add="add"
    ></act-top>
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
      title="规则"
      :params="params"
      :visible.sync="visible"
      @go-back="goback"
      @on-submit="submit"
      @on-update="update"
    ></popup>
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
  import actTop from './components/act-top';
  import editTable from '../../components/edit-table'
  import popup from './components/popup'

  export default {
    name: "规则",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      editTable,
      actTop,
      popup,
    },
    data() {
      return {
        id: 0,
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '名称',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'code',
            label: '编码',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'rule',
            label: '描述',
            align: 'center',
            minWidth: '11',
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
          operationWidth: '180',
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            // 'view',
            'edit',
            'delete',
          ],
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
        params: {},
        visible: false,
      }
    },
    computed: {},
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.params = {
          tool_id: this.id,
        };
        this.visible = true;
      },

      submit(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'check_tool_rule';
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
        vars.key = 'check_tool_rule';
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
        this.visible = false;
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'check_tool_rule';
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
          name: 'viewDetectionTool',
          query: {
            id: params.row.id
          }
        })
      },

      onEdit(params) {
        // console.log(params);
        this.params = this.$common.deepClone(params.row);
        this.visible = true;
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '启用') {
          let ps = {
            id: params.row.id,
            status: '已启用',
          };
          this.$confirm('确认启用吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
        } else if (params.$active === '作废') {
          let ps = {
            id: params.row.id,
            status: '已作废',
          };
          this.$confirm('确认作废吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
        } else if (params.$active === '过时') {
          let ps = {
            id: params.row.id,
            status: '已过时',
          };
          this.$confirm('确认过时吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
        } else if (params.$active === '删除') {
          this.$confirm('确认删除吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.onDelete([params.row]);
          }).catch(() => {

          });
        } else if (params.$active === '编辑') {
          this.onEdit(params)
        } else if (params.$active === '访问工具') {
          window.open(params.row.url)
        } else if (params.$active === '规则') {
          this.$router.push({
            name: 'toolRules',
            query: {
              id: params.row.id
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
        vars.key = 'check_tool_rule';
        vars.params = {
          conds: [
            'tool_id = ' + this.id,
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
            this.tableOptions.loading = false;
          }
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      init() {
        this.getListData();
      },

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
