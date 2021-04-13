<template>
  <div class="height-100">
    <div class="box text-right">
      <el-button v-if="permissions.indexOf('新增') !== -1" class="btn-icon" plain type="primary" size="mini" @click="add">
        新增
      </el-button>
      <el-button v-if="permissions.indexOf('编辑') !== -1" class="btn-icon" plain type="success" size="mini" :disabled="!canEdit"
        @click="edit">
        编辑
      </el-button>
      <el-button v-if="permissions.indexOf('删除') !== -1" class="btn-icon" plain type="warning" size="mini" :disabled="!canEdit"
        @click="del">
        删除
      </el-button>
    </div>
    <el-tree class="new-tree" :data="treeData" highlight-current node-key="id" default-expand-all :expand-on-click-node="false"
      @node-click="nodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <!-- 弹框详情 -->
    <popup title="属性树" @on-submit="submit" @on-update="update" :params="dialogParams" :visible.sync="dialogVisible"
      :disabled="dialogDisabled"></popup>
  </div>
</template>

<script>
import popup from "./popup";

export default {
  name: "tree-data",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    popup
  },
  computed: {
    permissions() {
      return this.$route.meta.permissions || [];
    }
  },
  props: {},
  data() {
    return {
      dialogParams: {},
      dialogVisible: false,
      dialogDisabled: false,
      treeData: [],
      parent_id: 0,
      nodeData: {},
      canEdit: false
    };
  },
  methods: {
    del() {
      this.$alert("确认删除吗？", "温馨提示", {
        confirmButtonText: "确定",
        callback: action => {
          // console.log(action);
          if (action === "confirm") {
            let vars = {};
            vars.key = "property_label";
            vars.params = {
              ids: this.nodeData.id + ""
            };
            this.$api.del(vars, this, data => {
              // console.log(data);
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.goback();
            });
          }
        }
      });
    },

    edit() {
      this.dialogParams = this.$common.deepClone(this.nodeData);
      this.dialogVisible = true;
      this.dialogDisabled = true;
    },

    add() {
      this.dialogParams = {
        parent_id: 0,
        creator_id: this.user.id,
        source: 2
      };
      this.dialogVisible = true;
      this.dialogDisabled = false;
    },

    goback() {
      this.getTree();
    },

    nodeClick(data, node) {
      // console.log(data);
      // this.canEdit = false;
      this.canEdit = true;
      this.parent_id = data.id;
      this.nodeData = node.data;
      if (data.source === 2) {
        this.canEdit = true;
      }
      this.$emit("node-click", data);
    },

    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {};
      vars.key = "property_label";
      vars.params = params;
      this.$api.save(
        vars,
        this,
        data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: "success",
            message: "新增成功"
          });
          this.goback();
        },
        errData => {
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
        data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: "success",
            message: "更新成功"
          });
          this.goback();
        },
        errData => {
          loading.close();
        }
      );
    },

    getTree() {
      let vars = {};
      vars.key = "property_label";
      vars.params = {
        conds: [],
        dims: [],
        order: ["id", "ASC"],
        hook: {
          is_cull: true
        }
      };
      this.$api.get(vars, this, data => {
        console.log(data);
        if (data) {
          this.treeData = this.$common.filterTree(data.data || []);
        }
      });
    },

    init() {
      this.getTree();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.new-tree {
  height: calc(100% - 35px);
  box-sizing: border-box;
  padding-top: 10px;
  overflow-y: auto;
}
</style>
