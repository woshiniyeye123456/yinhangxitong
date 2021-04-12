<template>
  <div>
    <template v-if="isReady">
      <!-- 蓝图 -->
      <div class="work-wrap">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="(item, index) in tabList" :label="item.label" :name="index + 1 + ''" :key="index">
            <div v-if="index === 0" :is="workspace + 'Blueprint'" :workflow_id="workflow_id" @set-bp-params="setBPParams"></div>
            <div v-else :is="item.page" :workspace="workspace" :work_flow="work_flow"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 工单间 -->
      <div class="margin-top-14" :is="workspace" :workflow_id="workflow_id" :task_id="task_id" :node_id="node_id"
        :node_name="workspace" :data_saved="data_saved" :bpParams="bpParams" @on-submit="submit" @on-update="submit"
        @on-save="save"></div>
    </template>
  </div>
</template>

<script>
import blueprint from "./blueprint/index";
import workspace from "./workspace/index";
import workProcess from "./components/work-process";

export default {
  name: "liucheng",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    ...blueprint,
    ...workspace,
    workProcess
  },
  data() {
    return {
      activeName: "1",
      tabList: [
        {
          label: "任务信息",
          page: ""
        },
        {
          label: "工单流程",
          page: "work-process"
        }
      ],
      workspace: "",
      workflow_id: "",
      task_id: "",
      node_id: "",
      data_saved: false,
      work_flow: {},
      bpParams: {},
      isReady: false
    };
  },
  methods: {
    setBPParams(bpParams) {
      this.bpParams = bpParams;
    },

    goback() {
      this.$router.go(-1);
    },

    save(params) {
      // console.log(params);
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {
        task_id: this.task_id,
        actor: this.user.name,
        data: params
      };
      vars.key = "saveTask";
      this.$api.wf(
        vars,
        this,
        data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: "success",
            message: "保存成功"
          });
        },
        () => {
          loading.close();
        }
      );
    },

    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {
        task_id: this.task_id,
        actor: this.user.name,
        data: params
      };
      vars.key = "submitTask";
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
          this.goback();
        },
        () => {
          loading.close();
        }
      );
    },

    logParams() {
      this.isReady = true;
      console.log("workflow_id", this.workflow_id);
      console.log("workspace", this.workspace);
      console.log("node_id", this.node_id);
      console.log("task_id", this.task_id);
      console.log("data_saved", this.data_saved);
      console.log("work_flow", this.work_flow);
    },

    getWorkflow() {
      let vars = {
        status: "待处理",
        workflow_id: this.workflow_id
      };
      vars.key = "tasks";
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data.data && data.data[0]) {
          let params = data.data[0];
          this.workflow_id = +params.workflow_id;
          this.workspace = params.node_name;
          this.node_id = params.node_id;
          this.task_id = +params.ID;
          this.data_saved = params.data_saved;
          this.work_flow = params.work_flow;
          this.logParams();
        }
      });
    },

    init() {
      if (
        this.workflow_id &&
        !this.workspace &&
        !this.node_id &&
        !this.task_id
      ) {
        if (this.workflow_id) {
          this.getWorkflow();
        } else {
          this.$router.push({
            name: "todoWork"
          });
        }
      } else {
        this.logParams();
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.workflow_id) {
      this.workflow_id = +this.$route.query.workflow_id;
    }
    if (this.$route.params && this.$route.params.node_name) {
      this.workspace = this.$route.params.node_name;
    }
    if (this.$route.params && this.$route.params.node_id) {
      this.node_id = this.$route.params.node_id;
    }
    if (this.$route.params && this.$route.params.node_name) {
      this.task_id = +this.$route.params.task_id;
    }
    if (this.$route.params && this.$route.params.data_saved) {
      this.data_saved = this.$route.params.data_saved;
    }
    if (this.$route.params && this.$route.params.work_flow) {
      this.work_flow = this.$route.params.work_flow;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.work-wrap {
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 4px 0px rgba(72, 99, 129, 0.2);
  border-radius: 6px;
  padding: 0 16px;
}
</style>
