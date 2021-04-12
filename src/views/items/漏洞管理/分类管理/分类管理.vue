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
            @node-click="nodeClick"
          ></tree-data>
        </div>
      </template>
      <template slot="secondPane">
        <div class="right-container">
          <edit-table
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
    <popup
      title="属性标签"
      @on-submit="submit"
      @on-update="update"
      :params="dialogParams"
      :visible.sync="dialogVisible"
    ></popup>
  </div>
</template>

<script>
  import ResSplitPane from 'vue-resize-split-pane'
  import treeData from './components/tree-data'
  import editTable from '../../components/edit-table'
  import popup from './components/popup'

  export default {
    name: "属性标签",
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
      popup,
    },
    data() {
      return {
        defaultSize: 300,
        minSize: 250,
        maxSize: 500,
        // table
        tableColumn: [
          {
            prop: 'name',
            label: '名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'poj',
            label: '基线数量',
            align: 'center',
            minWidth: '7',
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
          filterNameActive: [

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
      nodeClick(data) {
        // console.log(data);
        this.path = data.path;
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
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'loophole_category';
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
        vars.key = 'loophole_category';
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
        vars.key = 'loophole_category';
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
        let vars = {
          key: 'loopholeCategory',
          path: this.path,
          page: this.pages,
          page_size: this.lines,
        };
        this.tableOptions.loading = true;
        this.$api.ext(vars, this, data => {
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

    }
  }
</script>

<style lang="scss" scoped>

  .box-container {
    position: relative;
    height: calc(100% - 46px);
    box-sizing: border-box;
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
