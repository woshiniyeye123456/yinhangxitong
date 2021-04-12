<template>
  <div class="default-box">
    <div class="work-wrap">
      <div
        :is="workspace + 'Blueprint'"
        :workflow_id="workflow_id"
      ></div>
    </div>
    <div
      class="margin-top-14"
      :workflow_id="workflow_id"
      :is="workspace"
      :readonly="true"
      :disabled="true"
    ></div>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
  import blueprint from '../../我的工作/流程/blueprint/index'
  import workspace from '../../我的工作/流程/workspace/index'

  export default {
    name: "流程详情",
    components: {
      ...blueprint,
      ...workspace,
    },
    data() {
      return {
        workspace: '',
        workflow_id: 0,
        isReady: false,
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1);
      },

      init() {

      },

      getValues() {
        if (this.$route.query && this.$route.query.workflow_id) {
          this.workflow_id = +this.$route.query.workflow_id;
        }
        if (this.$route.query && this.$route.query.workspace) {
          this.workspace = this.$route.query.workspace;
        }
      },
    },
    created() {
      this.getValues();
    },
    mounted() {
      this.init();
    },
    watch: {
      '$route': {
        handler() {
          this.getValues();
          this.init();
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>
  .work-wrap {
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 4px 0px rgba(72, 99, 129, 0.2);
    border-radius: 6px;
    padding: 16px;
  }
</style>
