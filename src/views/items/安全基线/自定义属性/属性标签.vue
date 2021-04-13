<template>
  <div class="box-container default-box">
    <res-split-pane allow-resize split-to="columns" :size="defaultSize" :min-size="minSize" :max-size="maxSize" style="height: calc(100% - 24px);width: calc(100% - 24px); left: 12px;">
      <template slot="firstPane">
        <div class="left-container">
          <tree-data ref="treeData" @node-click="nodeClick"></tree-data>
        </div>
      </template>
      <template slot="secondPane">
        <div class="right-container">
          <edit-table :tableColumn="tableColumn" :tableData="tableData" :tableOptions="tableOptions" :pages="pages"
            :lines="lines" :total="total" @on-view="onView" @on-edit="onEdit" @on-filter-name-active="onFilterNameActive"
            @on-delete="onDelete" @change-page="changePage" @change-size="changeSize"></edit-table>
        </div>
      </template>
    </res-split-pane>
    <!-- 弹框详情 -->
    <popup title="属性标签" @on-submit="submit" @on-update="update" :params="dialogParams" :visible.sync="dialogVisible"
      :disabled="dialogDisabled"></popup>
    <!-- 查看基线 -->
    <el-dialog title="报告详情" :append-to-body="true" :close-on-click-modal="true" :visible.sync="viewDialogVisible" width="75%"
      class="dialog-default">
      <el-row :gutter="12" v-if="viewDialogVisible">
        <el-col :span="6">
          <el-card shadow="never">
            <div class="height-550">
              <el-tree highlight-current :data="viewDownTableTabs" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <el-card shadow="never">
            <div class="height-550">
              <div v-html="report_details" v-if="report_details"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="margin-top-20 text-right">
        <el-button type="default" @click="viewDialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ResSplitPane from "vue-resize-split-pane";
import treeData from "./components/tree-data";
import editTable from "../../components/edit-table";
import popup from "./components/popup";

export default {
  name: "属性标签",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    ResSplitPane,
    treeData,
    editTable,
    popup
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
          prop: "name",
          label: "名称",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "baseline_count",
          label: "基线数量",
          align: "center",
          minWidth: "7"
        }
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
        operationWidth: "240",
        // operationWidth: '290px',
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
        filterNameActive: ["查看"]
      },
      pages: 1,
      lines: 10,
      total: 0,
      //
      path: "",
      // dialog
      dialogParams: {},
      dialogVisible: false,
      dialogDisabled: false,
      //
      viewDialogVisible: false,
      viewDownTableTabs: [],
      defaultProps: {
        children: "",
        label: "name"
      },
      report_details: ""
    };
  },
  methods: {
    handleNodeClick(data) {
      // console.log(data);
      this.report_details = data._report_details;
    },

    nodeClick(data) {
      // console.log(data);
      this.path = data.path;
      this.initData();
    },

    add() {
      this.params = {
        status: "开发",
        creator_id: this.user.id,
        source: 2
      };
      this.visible = true;
    },

    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {};
      vars.key = "property_label";
      vars.params = params;
      this.$api.save(
        vars,
        this,
        () => {
          loading.close();
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.goback();
        },
        () => {
          loading.close();
        }
      );
    },

    update(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {};
      vars.key = "property_label";
      vars.params = params;
      this.$api.update(
        vars,
        this,
        () => {
          loading.close();
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.goback();
        },
        () => {
          loading.close();
        }
      );
    },

    goback(v) {
      if (v) {
        this.initData();
        this.$refs["treeData"].init();
      } else {
        this.getListData();
        this.$refs["treeData"].getTree();
      }
    },

    onDelete(params) {
      // console.log(params);
      let ids = [];
      params.forEach(item => {
        ids.push(item.id);
      });
      let vars = {};
      vars.key = "property_label";
      vars.params = {
        ids: ids.join(",")
      };
      this.$api.del(vars, this, () => {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.goback(true);
      });
    },

    onView(params) {
      console.log(params);
    },

    onEdit(params) {
      // console.log(params);
      this.dialogParams = this.$common.deepClone(params.row);
      this.dialogVisible = true;
      this.dialogDisabled = true;
    },

    onFilterNameActive(params) {
      // console.log(params)
      if (params.$active === "编辑") {
        this.onEdit(params);
      } else if (params.$active === "删除") {
        this.$confirm("确认删除吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.onDelete([params.row]);
          })
          .catch(() => {});
      } else if (params.$active === "查看") {
        // console.log(params.row);
        let vars = {};
        vars.key = "baseline";
        vars.params = {
          conds: ["latest = true", "property_label_id = " + params.row.id],
          dims: [],
          paging: [],
          order: ["created_time", "DESC"]
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.viewDownTableTabs = data.data || [];
            this.viewDownTableTabs.forEach(item => {
              item._report_details = this.$common.filterBaseline(item, null, 1);
            });
            this.report_details = "";
            this.viewDialogVisible = true;
          }
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
        key: "propertyLabel",
        path: this.path,
        page: this.pages,
        page_size: this.lines
      };
      this.tableOptions.loading = true;
      this.$api.ext(
        vars,
        this,
        data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total || 0;
            this.tableData = data.data.data || [];
          }
          this.tableOptions.loading = false;
        },
        () => {
          this.tableOptions.loading = false;
        }
      );
    }
  },
  created() {
    if (this.permissions.indexOf("编辑") !== -1) {
      this.tableOptions.filterNameActive.push({
        isSwitch: true, // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
        // name: ['上架', '下架'],          // 不会在这里取数据
        // type: ['success', 'danger'],    // 不会在这里取数据
        handler: data => {
          if (data.source === 2) {
            return {
              name: "编辑",
              type: "success"
            };
          } else {
            return {
              name: "编辑",
              type: "success"
              // disabled: true,
            };
          }
        }
      });
    }
    if (this.permissions.indexOf("删除") !== -1) {
      this.tableOptions.filterNameActive.push({
        isSwitch: true, // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
        // name: ['上架', '下架'],          // 不会在这里取数据
        // type: ['success', 'danger'],    // 不会在这里取数据
        handler: data => {
          if (data.source === 2) {
            return {
              name: "删除",
              type: "warning"
            };
          } else {
            return {
              name: "删除",
              type: "warning"
              // disabled: true,
            };
          }
        }
      });
    }
  }
};
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
