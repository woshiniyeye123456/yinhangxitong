<template>
  <div class="box-container default-box">
    <res-split-pane
      allow-resize
      split-to="columns"
      :size="defaultSize"
      :min-size="minSize"
      :max-size="maxSize"
      style="height: calc(100% - 24px);width: calc(100% - 24px); left: 12px;"
    >
      <template slot="firstPane">
        <div class="left-container">
          <tree-data
            ref="treeData"
            @node-click="nodeClick"
          ></tree-data>
        </div>
      </template>
      <template slot="secondPane">
        <div class="right-container">
          <act-top
            @add="add"
            :department_id="department_id"
          ></act-top>
          <edit-table
            class="margin-top-10"
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
    </res-split-pane>
    <!-- 弹框详情 -->
    <account-popup
      title="账号管理"
      @on-submit="submit"
      @on-update="update"
      :params="dialogParams"
      :visible.sync="dialogVisible"
      :disabled="disabled"
    ></account-popup>
  </div>
</template>

<script>
  import ResSplitPane from 'vue-resize-split-pane'
  import treeData from './components/tree-data'
  import actTop from './components/act-top'
  import editTable from '../../components/edit-table'
  import accountPopup from './components/account-popup'

  export default {
    name: "部门管理",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      ResSplitPane,
      treeData,
      actTop,
      editTable,
      accountPopup,
    },
    computed: {},
    data() {
      return {
        defaultSize: 300,
        minSize: 250,
        maxSize: 500,
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '用户名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'department_name',
            label: '部门名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: '_role',
            label: '角色',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'deadline',
            label: '到期时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'status',
            label: '类型',
            align: 'center',
            minWidth: '8',
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
            'delete',
          ],
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
        //
        department_id: '',
        path: '',
        // dialog
        dialogParams: {},
        dialogVisible: false,
        disabled: false,
      }
    },
    methods: {

      add() {
        this.dialogParams = {
          creator_id: this.user.id,
          department_id: this.department_id,
          status: '临时'
        };
        this.disabled = false;
        this.dialogVisible = true;
      },

      nodeClick(data) {
        this.path = data.path;
        this.department_id = data.id;
        this.initData();
      },

      submit(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'department_account_rel';
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
        vars.key = 'department_account_rel';
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
          this.$refs['treeData'].init();
        } else {
          this.getListData();
          this.$refs['treeData'].getTree();
        }
        this.path = '';
        this.department_id = '';
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'department_account_rel';
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
        this.dialogParams = this.$common.deepClone(params.row);
        this.dialogVisible = true;
        this.disabled = true;
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
        vars.key = 'account_of_department';
        vars.params = {
          conds: [
            'path HAS_PREFIX ' + this.path
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
            this.tableData.forEach(item => {
              let _role = [];
              if (item.roles) {
                item.roles.forEach(ro => {
                  _role.push(ro.name);
                })
              }
              item._role = _role.join(';');
            });
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

    }
  }
</script>

<style lang="scss" scoped>

  .box-container {
    position: relative;
    height: calc(100% - 46px);
    box-sizing: border-box;
    overflow-y: auto;
  }

  .left-container {
    height: 100%;
    padding-right: 5px;
    overflow-y: auto;
  }

  .right-container {
    height: 100%;
    padding-left: 5px;
    overflow-y: auto;
  }

</style>
