<template>
  <div class="default-box">
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
  import actTop from './components/act-top';
  import editTable from '../../components/edit-table'
  import mixins from './mixins'

  export default {
    name: "外部系统",
    components: {
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
            label: '系统名称',
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
            prop: 'des',
            label: '系统描述',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'script_lang',
            label: '脚本语言',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'created_time',
            label: '接入时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            minWidth: '8',
            filters: [
              {value: '已启用', circleColor: '#00C5D4',},
              {value: '已禁用', circleColor: '#FB731B',}
            ],
            isStatus: true
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
          operationWidth: '320',
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            'view',
            'edit',
            'delete',
          ],
          filterNameActive: [
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: (data) => {
                if (data.status === '已启用') {
                  return {
                    name: '禁用',
                    type: 'danger',
                  }
                } else {
                  return {
                    name: '启用',
                    type: 'primary',
                  }
                }
              }
            },
            // {
            //   isDropdown: true,
            //   title: '状态',
            //   menu: [
            //     '启用',
            //     '作废',
            //     '过时',
            //   ],
            //   handler: (data, item) => {
            //     if (item === '启用') {
            //       if (data.status === '开发中') {
            //         return false
            //       }
            //     } else if (item === '作废') {
            //       if (data.status === '已启用') {
            //         return false
            //       }
            //     } else if (item === '过时') {
            //       if (data.status === '已启用') {
            //         return false
            //       }
            //     }
            //     return true
            //   }
            // },
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
          name: 'addExternal'
        })
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'external_system';
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
        vars.key = 'external_system';
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
        vars.key = 'external_system';
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
          name: 'viewExternal',
          params: {
            params: params.row
          }
        })
      },

      onEdit(params) {
        // console.log(params);
        this.$router.push({
          name: 'editExternal',
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
          let ps = this.$common.deepClone(params.row);
          ps.status = '已启用';
          this.$confirm('确认启用吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.update(ps);
          }).catch(() => {

          });
        } else if (params.$active === '禁用') {
          let ps = this.$common.deepClone(params.row);
          ps.status = '已禁用';
          this.$confirm('确认禁用吗?', '温馨提示', {
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
        vars.key = 'external_system';
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
                let labels = [];
                if (item.labels && item.labels.length) {
                  item.labels.forEach(item => {
                    labels.push(item.name)
                  })
                }
                item.$labels = labels.join(',');
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
