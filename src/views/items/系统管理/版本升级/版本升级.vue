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
      title="内容更新"
      :params="params"
      :visible.sync="visible"
      @go-back="goback"
      @on-submit="submit"
      @on-update="update"
    ></popup>
  </div>
</template>

<script>
  import actTop from './components/act-top'
  import editTable from '../../components/edit-table'
  import popup from './components/popup'
  import searchForm from './components/search-form';

  export default {
    name: "版本升级",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      actTop,
      editTable,
      popup,
      searchForm,
    },
    data() {
      return {
        visible: false,
        params: {},
        // table
        tableColumn: [
          {
            prop: 'created_time',
            label: '发布时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'creator',
            label: '发布人',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'description',
            label: '发布描述',
            align: 'center',
            minWidth: '22',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            minWidth: '12',
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
          // minWidth: '312',
          operationWidth: '180',
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
          status: '导入中',
        };
        this.visible = true;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = params;
        vars.key = 'dataUpgrade';
        this.$api.ext(vars, this, () => {
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
        vars.key = 'data_import';
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
        vars.key = 'data_import';
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
        } else if (params.$active === '禁用') {
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
        let vars = {
          key: 'dataImport',
          pages: this.pages,
          page_size: this.lines,
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
