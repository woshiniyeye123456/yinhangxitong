<template>
  <div class="default-box">
    <div class="row-wrap" :class="{'open': !!roleName}">
      <div class="row-left">
        <el-card shadow="never" class="default-card">
          <div slot="header" class="clearfix">
            <span class="slot-title">角色</span>
          </div>
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
            @row-click="rowClick"
          ></edit-table>
        </el-card>
      </div>
      <div class="row-right">
        <permissions-tree
          :disabledSave="disabledSave"
          :permissionsChecked="permissionsChecked"
          :permissionsNode="permissionsNode"
          @save-perm="savePerm"
        ></permissions-tree>
      </div>
    </div>
    <!-- popup -->
    <popup
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
  import permissionsTree from './components/权限树';

  export default {
    name: "角色管理",
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
      permissionsTree,
    },
    data() {
      return {
        visible: false,
        params: {},
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '角色名称',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'created_time',
            label: '创建时间',
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
            'delete',
          ],
          filterNameActive: [
            '权限'
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
        //
        permissionsNode: [],
        permissionsChecked: [],
        roleName: '',
      }
    },
    computed: {
      disabledSave() {
        return this.roleName === '';
      }
    },
    methods: {

      savePerm(roles) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {
          key: 'updateRole',
          name: this.roleName,
          role: this.roleName,
          permissions: JSON.stringify(roles),
        };
        this.permissionsChecked = [];
        this.permissionsNode = [];
        this.$api.mpm(vars, this, data => {
          // console.log(data);
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          loading.close();
        }, () => {
          loading.close();
        });
      },

      rowClick(rowData) {
        // console.log(rowData);
        this.roleName = rowData.name; //储存roleName
        let vars = {
          key: 'roles',
          name: this.roleName,
          role: this.roleName,
          page: 1,
          count: 1,
        };
        this.permissionsChecked = [];
        this.permissionsNode = [];
        this.$api.mpm(vars, this, data => {
          // console.log(data);
          if (data.data && data.data[0] && data.data[0].permissions) {
            let permissions = JSON.parse(data.data[0].permissions);
            permissions.forEach(item => {
              this.permissionsChecked.push(item.resources);
              this.permissionsNode.push(item);
            });
          }
        });
      },

      add() {
        this.params = {
          creator_id: this.user.id,
          user: this.user.name,
        };
        this.visible = true;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'role';
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
        vars.key = 'role';
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
        vars.key = 'role';
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
        } else if (params.$active === '权限') {

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
        vars.key = 'role';
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
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style lang="scss" scoped>

  .row-wrap {
    width: 100%;
    display: flex;

    > .row-left {
      width: 100%;
      box-sizing: border-box;
      padding-right: 10px;
      transition: width 0.25s ease;
    }

    > .row-right {
      width: 0;
      opacity: 0;
      box-sizing: border-box;
      padding-left: 10px;
      transition: width 0.25s ease, opacity 0.25s ease;
    }
  }

  .row-wrap.open {

    > .row-left {
      width: 70%;
    }

    > .row-right {
      width: 30%;
      opacity: 1;
    }
  }

</style>
