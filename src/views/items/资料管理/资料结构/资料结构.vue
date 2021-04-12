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
          <div class="text-right">
            <el-button
              v-if="permissions.indexOf('新增') !== -1"
              class="btn-icon"
              plain
              type="primary"
              size="mini"
              @click="add"
            >
              新增
            </el-button>
          </div>
          <edit-table
            class="margin-top-5"
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
    <data-popup
      title="资料内容"
      @on-submit="submit"
      @on-update="update"
      :params="dialogParams"
      :visible.sync="dialogVisible"
    ></data-popup>
  </div>
</template>

<script>
  import ResSplitPane from 'vue-resize-split-pane'
  import treeData from './components/tree-data'
  import editTable from '../../components/edit-table'
  import dataPopup from './components/data-popup'

  export default {
    name: "资料结构",
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
      editTable,
      dataPopup,
    },
    computed: {
      permissions() {
        return this.$route.meta.permissions || [];
      }
    },
    data() {
      return {
        defaultSize: 300,
        minSize: 250,
        maxSize: 500,
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '标题',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'created_time',
            label: '登记时间',
            align: 'center',
            minWidth: '15',
          },
          {
            prop: '$source',
            label: '是否自定义',
            align: 'center',
            minWidth: '8',
          },
        ],
        tableData: [],
        tableOptions: {
          operationWidth: '240',
          // operationWidth: '290px',
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
            // {
            //   isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
            //   // name: ['上架', '下架'],          // 不会在这里取数据
            //   // type: ['success', 'danger'],    // 不会在这里取数据
            //   handler: (data) => {
            //     if (data.source === 2) {
            //       return {
            //         name: '编辑',
            //         type: 'success',
            //       }
            //     } else {
            //       return {
            //         name: '编辑',
            //         type: 'success',
            //         disabled: true,
            //       }
            //     }
            //   }
            // },
            // {
            //   isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
            //   // name: ['上架', '下架'],          // 不会在这里取数据
            //   // type: ['success', 'danger'],    // 不会在这里取数据
            //   handler: (data) => {
            //     if (data.source === 2) {
            //       return {
            //         name: '删除',
            //         type: 'warning',
            //       }
            //     } else {
            //       return {
            //         name: '删除',
            //         type: 'warning',
            //         disabled: true,
            //       }
            //     }
            //   }
            // },
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
        //
        path: '',
        // dialog
        dialogParams: {},
        dialogVisible: false,
      }
    },
    methods: {

      getDataLibrary(id) {
        let vars = {};
        vars.key = 'data_library';
        vars.params = {
          conds: [
            'id = ' + id,
          ],
          dims: [],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.dialogParams = this.$common.deepClone(data.data[0]);
            if (this.dialogParams.labels) {
              this.dialogParams.labels.forEach(lb => {
                lb.data_label_id = lb.id
              })
            }
            this.dialogVisible = true;
          }
        });
      },

      nodeClick(data) {
        // console.log(data);
        this.path = data.path;
        this.initData();
      },

      add() {
        this.dialogParams = {
          status: '开发',
          creator_id: this.user.id,
          source: 2,
        };
        this.dialogVisible = true;
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'data_library';
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
        vars.key = 'data_library';
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
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'data_library';
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
          name: 'viewData',
          query: {
            id: params.row.id
          }
        })
      },

      onEdit(params) {
        // console.log(params);
        this.dialogParams = this.$common.deepClone(params.row);
        this.dialogVisible = true;
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '编辑') {
          this.getDataLibrary(params.row.id);
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
        let vars = {
          key: 'selectDataLibraries',
          path: this.path,
          pages: this.pages,
          lines: this.lines,
        };
        this.tableOptions.loading = true;
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total || 0;
            this.tableData = data.data.data || [];
            this.tableData.forEach(item => {
              item.$source = item.source === 2 ? '是' : '否';
            });
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

    },
    created() {
      if (this.permissions.indexOf('编辑') !== -1) {
        this.tableOptions.filterNameActive.push({
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
                // disabled: true,
              }
            }
          }
        })
      }
      if (this.permissions.indexOf('删除') !== -1) {
        this.tableOptions.filterNameActive.push({
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
                // disabled: true,
              }
            }
          }
        })
      }
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
