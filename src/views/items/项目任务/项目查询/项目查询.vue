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
    <!-- popup -->
    <popup
      title="项目管理"
      @on-submit="submit"
      @on-update="update"
      :params="params"
      :visible.sync="visible"
    ></popup>
  </div>
</template>

<script>
  import searchForm from './components/search-form';
  import actTop from './components/act-top'
  import editTable from '../../components/edit-table'
  import popup from './components/popup'
  import mixins from './mixins'

  export default {
    name: "项目管理",
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
    mixins: [
      mixins
    ],
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '名称',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'description',
            label: '描述',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'technology_platform',
            label: '任务数',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'technology_platform',
            label: '进行任务占比',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            minWidth: '18',
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
          // operationWidth: '290px',
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            // 'view',
            'edit',
            // 'delete',
          ],
          filterNameActive: [
            '详情',
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
        // popup
        visible: false,
        params: {},
      }
    },
    methods: {

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.params = {
          status: '开发',
          creator_id: this.user.id,
        };
        this.visible = true;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'project';
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
        vars.key = 'project';
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
        vars.key = 'project';
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
        let vars = {};
        vars.key = 'projects';
        vars.status = '开发中';
        this.tableOptions.loading = true;
        this.$api.wf(vars, this, data => {
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
