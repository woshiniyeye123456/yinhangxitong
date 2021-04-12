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
      :hiddenPWD="hiddenPWD"
    ></popup>
    <!-- reset-pwd -->
    <reset-popup
      title="重置密码"
      :params="resetParams"
      :visible.sync="resetVisible"
      @on-update="resetUpdate"
    ></reset-popup>
  </div>
</template>

<script>
  import actTop from './components/act-top'
  import editTable from '../../components/edit-table'
  import popup from './components/popup'
  import resetPopup from './components/reset-popup'
  import searchForm from './components/search-form';
  import mixins from './components/mixins'

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
      actTop,
      editTable,
      popup,
      resetPopup,
      searchForm,
    },
    mixins: [mixins],
    data() {
      return {
        resetVisible: false,
        resetParams: {},
        hiddenPWD: false,
        disabledEdit: false,
        visible: false,
        params: {},
        // table
        tableColumn: [
          {
            prop: 'real_name',
            label: '姓名',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'name',
            label: '账号',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: '_department_name',
            label: '部门',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: '$role',
            label: '角色',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'level',
            label: '能力等级',
            align: 'center',
            minWidth: '14',
          },
          {
            prop: 'created_time',
            label: '创建时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'status',
            label: '状态',
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
          // minWidth: '312',
          operationWidth: '280',
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
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: (data) => {
                if (data.status === '已激活') {
                  return {
                    name: '禁用',
                    type: 'danger',
                  }
                } else {
                  return {
                    name: '激活',
                    type: 'primary',
                  }
                }
              }
            },
            '重置密码',
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

      resetUpdate(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        this.$api.updateUser(params, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '重置成功'
          });
        }, () => {
          loading.close();
        });
      },

      add() {
        this.params = {
          creator_id: this.user.id,
          status: '已禁用'
        };
        this.visible = true;
        this.disabledEdit = false;
        this.hiddenPWD = false;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'account';
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
        vars.key = 'account';
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
        vars.key = 'account';
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
        this.disabledEdit = true;
        this.hiddenPWD = true;
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
        } else if (params.$active === '重置密码') {
          this.resetParams = this.$common.deepClone(params.row);
          this.resetVisible = true;
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
          key: 'account',
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
            this.tableData.forEach(item => {
              let role = [];
              if (item.roles) {
                item.roles.forEach(item => {
                  role.push(item.name)
                })
              }
              item.$role = role.join(',');
              if (item.departments && item.department_id) {
                let department = item.departments.find(d => d.id === item.department_id);
                if (department) {
                  item._department_name = department.name
                } else {
                  item._department_name = '';
                }
              }
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
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>


</style>
