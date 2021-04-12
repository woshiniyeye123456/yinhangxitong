<template>
  <div class="default-box">
    <!-- search-form -->
    <search-form
      @on-search="onSearch"
    ></search-form>
    <!-- act-top -->
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
      :params="params"
      :visible.sync="visible"
      :disabled="disabledEdit"
      @go-back="goback"
      @on-submit="submit"
      @on-update="update"
    ></popup>
  </div>
</template>

<script>
  import searchForm from './components/search-form';
  import actTop from './components/act-top'
  import editTable from '../../components/edit-table'
  import popup from './components/popup'
  import mixins from '../components/mixins'

  export default {
    name: "账号管理",
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
      popup,
    },
    mixins: [mixins],
    data() {
      return {
        disabledEdit: false,
        visible: false,
        params: {},
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '规则名称',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'type',
            label: '规则类型',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: '_external_system',
            label: '检测系统',
            align: 'center',
            minWidth: '14',
          },
        ],
        tableData: [],
        tableOptions: {
          // minWidth: '312',
          operationWidth: '240',
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
      }
    },
    methods: {

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.params = {
          creator_id: this.user.id,
        };
        this.visible = true;
        this.disabledEdit = false;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'detection_rule';
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
        vars.key = 'detection_rule';
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
        vars.key = 'detection_rule';
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
        // console.log(params);
        this.params = this.$common.deepClone(params.row);
        this.visible = true;
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '激活') {
          let ps = {
            id: params.row.id,
            status: '已激活',
          };
          this.$confirm('确认激活吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
        } else if (params.$active === '禁用') {
          if (params.row.id === this.user.id) {
            return this.$message('错误，不能禁用本账号')
          }
          let ps = {
            id: params.row.id,
            status: '已禁用',
          };
          this.$confirm('确认禁用吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
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
        vars.key = 'detection_rule';
        vars.params = {
          conds: [],
          dims: [],
          paging: [
            this.pages,
            this.lines
          ],
          order: ['id', 'DESC'],
        };
        this.tableOptions.loading = true;
        new Promise((resolve, reject) => {   // 增加搜索条件
          resolve(this.addSearch(this.searchParams));
        }).then(conds => {
          vars.params.conds = vars.params.conds.concat(conds);
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data.data) {
              this.total = data.data.total || 0;
              this.tableData = data.data.data || [];
              this.tableData.forEach(item => {
                if (item.external_system) {
                  item._external_system = item.external_system.name
                }
              })
            }
            this.tableOptions.loading = false;
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
