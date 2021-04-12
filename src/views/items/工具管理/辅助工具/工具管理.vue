<template>
  <div class="default-box">
    <!-- search-form -->
    <!--<search-form-->
    <!--@on-search="onSearch"-->
    <!--&gt;</search-form>-->
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
  </div>
</template>

<script>
  import searchForm from './components/search-form';
  import actTop from './components/act-top';
  import editTable from '../../components/edit-table'
  import mixins from './mixins'

  export default {
    name: "工具管理",
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
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '工具名称',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'type',
            label: '工具类型',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: '$source',
            label: '是否自定义',
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
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: (data) => {
                if (data.source === 2) {
                  return {
                    name: '编辑',
                    type: 'success',
                  }
                } else {
                  return {
                    name: '编辑',
                    type: 'success',
                    disabled: true
                  }
                }
              }
            },
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: (data) => {
                if (data.source === 2) {
                  return {
                    name: '删除',
                    type: 'warning',
                  }
                } else {
                  return {
                    name: '删除',
                    type: 'warning',
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
          name: 'addTool'
        })
      },

      submit(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'tool';
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
        vars.key = 'tool';
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
        vars.key = 'tool';
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
          name: 'viewTool',
          query: {
            id: params.row.id
          }
        })
      },

      onEdit(params) {
        // console.log(params);
        this.$router.push({
          name: 'editTool',
          params: {
            params: params.row
          }
        })
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '版本') {
          this.$router.push({
            name: 'componentVersion',
            query: {
              group_id: params.row.group_id,
            }
          })
        } else if (params.$active === '启用') {
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
        vars.key = 'tool';
        vars.params = {
          conds: [
            'customer_id = ' + this.user.id,
          ],
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
                item.$source = item.source === 2 ? '是' : '否'
              });
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
