<template>
  <el-form label-width="120px" :model="params">
    <el-form-item label="任务名称:">
      <el-input
        v-model="params.task_name"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="任务编号:">
      <el-input
        v-model="params.requirement"
        readonly
      ></el-input>
    </el-form-item>
    <!--<el-form-item label="子需求编号:">-->
      <!--<el-input-->
        <!--v-model="params.subRequirement"-->
        <!--readonly-->
      <!--&gt;</el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="从属关系:">-->
      <!--<el-input-->
        <!--v-model="params.subordinate"-->
        <!--readonly-->
      <!--&gt;</el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="主办产品经理:">-->
      <!--<el-input-->
        <!--v-model="params._masterPM"-->
        <!--readonly-->
      <!--&gt;</el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="项目产品经理:">
      <el-input
        v-model="params._pm"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="任务责任人:">
      <el-input
        v-model="params._taskOwner"
        readonly
      ></el-input>
    </el-form-item>
    <el-form-item label="需求分析说明书:">
      <el-link
        v-for="(item, index) in params.requirementDoc"
        :key="index"
        :href="item._url"
        target="_blank"
        style="margin-right: 12px"
      >
        {{ item.name }};
      </el-link>
    </el-form-item>
    <el-form-item label="评审意见:" v-if="params.finalReviewComments">
      <el-input
        v-model="params.finalReviewComments"
        readonly
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import mixins from '../components/mixins'

  export default {
    name: "secReqReviewBlueprint",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {},
    mixins: [mixins],
    props: {
      workflow_id: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        params: {},
      }
    },
    methods: {

      getView() {
        let vars = {
          workflow_id: this.workflow_id,
          name: 'taskData',
        };
        vars.key = 'view';
        this.$api.wf(vars, this, data => {
          if (data) {
            this.params = data.data || {};
            this.params = this.filterParams(this.params);
            if (this.params.requirementDoc) {
              this.params.requirementDoc.forEach(item => {
                item._url = this.$api.download(item.path)
              })
            }
          }
        });
      },


      init() {
        this.getView();
      },
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
</style>
