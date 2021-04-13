<template>
  <el-tree class="margin-top-10" :data="treeData" highlight-current node-key="id" default-expand-all
    :expand-on-click-node="false" @node-click="nodeClick">
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span>{{ node.label }}</span>
    </span>
  </el-tree>
</template>

<script>
export default {
  name: "tree-data",
  components: {},
  props: {},
  data() {
    return {
      dialogParams: {},
      dialogVisible: false,
      treeData: [],
      parent_id: 0,
      nodeData: {}
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
    },

    add() {
      this.dialogParams = {
        parent_id: 0
      };
      this.dialogVisible = true;
    },

    goback() {
      this.getTree();
    },

    nodeClick(data, node) {
      // console.log(data);
      this.parent_id = data.id;
      this.nodeData = node.data;
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
        // console.log(data);
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
.box {
  width: 100%;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-sizing: border-box;
  padding: 6px;
}
</style>
