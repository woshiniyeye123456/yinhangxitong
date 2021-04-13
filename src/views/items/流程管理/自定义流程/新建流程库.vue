<template>
  <div class="default-box">
    <el-form label-width="92px" :model="params" :rules="rules" ref="refForm">
      <el-card shadow="never" class="default-card">
        <div slot="header" class="clearfix">
          <span class="slot-title">基本信息</span>
        </div>
        <el-form-item label="流程名称:" prop="title">
          <el-input :disabled="disabled" v-model="params.title" placeholder="流程名称"></el-input>
        </el-form-item>
      </el-card>
      <el-card shadow="never" class="default-card margin-top-14">
        <div slot="header" class="clearfix">
          <span class="slot-title">流程设计</span>
        </div>
        <flow-form @change-role="changeRole" :params="node"></flow-form>
        <svg-flow v-if="isReady" :disabled="disabled" :defaultNodes="defaultNodes" @on-click="onClick" @on-close="onClose"
          ref="svg-flow"></svg-flow>
      </el-card>
      <div class="margin-top-8 text-right">
        <el-button type="default" @click="goBack" size="small">
          返回
        </el-button>
        <el-button v-show="!disabled" type="primary" @click="submit" size="small">
          确认
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import svgFlow from "../../components/svg-flow";
import flowForm from "./components/flow-form";

export default {
  name: "新建流程库",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    svgFlow,
    flowForm
  },
  computed: {},
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入:名称", trigger: "blur" }],
        coding: [{ required: true, message: "请输入:编码", trigger: "blur" }]
      },
      node: {},
      params: {},
      defaultNodes: [],
      isReady: false,
      disabled: false
    };
  },
  methods: {
    onClose(params) {
      let vars = {
        key: "deleteNode",
        workflow: params.workflow,
        node: params.node
      };
      this.isReady = false;
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.defaultNodes = data.data;
          this.isReady = true;
        }
      });
    },

    defaultWorkflow() {
      let vars = {};
      vars.key = "defaultWorkflow";
      this.isReady = false;
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.defaultNodes = data.data.nodes;
          this.isReady = true;
        }
      });
    },

    changeRole(id) {
      this.$refs["svg-flow"].changeRole(id);
    },

    goBack() {
      this.$router.go(-1);
    },

    onClick(node) {
      this.node = node;
    },

    getParams() {
      return JSON.stringify({
        nodes: this.$refs["svg-flow"].getNode()
      });
    },

    submit() {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          let define = this.getParams();
          // console.log(define)
          let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
          let vars = {
            define,
            title: this.params.title,
            updated_by: this.user.name,
            updater_name: this.user.real_name
          };
          if (this.params.id) {
            vars.id = this.params.id;
          }
          vars.key = "saveDefine";
          this.$api.wf(
            vars,
            this,
            data => {
              // console.log(data);
              loading.close();
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.goBack();
            },
            () => {
              loading.close();
            }
          );
        } else {
          return this.$message.error("操作失败");
        }
      });
    }
  },
  created() {
    if (this.$route.params && this.$route.params.params) {
      this.params = this.$route.params.params;
      this.disabled = this.$route.params.disabled;
      // console.log(this.params)
      if (this.params.define) {
        this.defaultNodes = JSON.parse(this.params.define).nodes;
      }
    }
  },
  mounted() {
    if (!this.params.define) {
      this.defaultWorkflow();
    } else {
      this.isReady = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
