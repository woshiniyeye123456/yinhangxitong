<template>
  <detail-form @go-back="goback" @on-submit="submit" @on-update="update" :params="params" :clearData="clearData"
    @clear-finish="clearData=false"></detail-form>
</template>

<script>
import detailForm from "./components/项目form";

export default {
  name: "xinjianxiangmu",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    detailForm
  },
  data() {
    return {
      clearData: false,
      params: {
        creator_id: this.user.id,
        created_time: this.$common.getThisTime(),
        product_manager: [],
        safety_officer: [],
        project_manager: [],
        cooperation_manager: [],
        team_member_ids: [],
        technicalRiskIdentification: [],
        notTechnicalRiskIdentification: [],
        status: "进行中"
      }
    };
  },
  computed: {},
  methods: {
    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {
        software_name: params.software_name,
        status: params.status,
        software_description: params.software_description,
        user: this.user.name,
        data: params
      };
      vars.key = "saveProject";
      this.$api.wf(
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
      let vars = {
        id: params.id,
        software_name: params.software_name,
        status: params.status,
        software_description: params.software_description,
        user: this.user.name,
        data: params
      };
      vars.key = "saveProject";
      this.$api.wf(
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
        this.params = {};
      }
      this.clearData = true;
      this.$router.go(-1);
    },
    init() {}
  },
  created() {
    if (this.$route.params && this.$route.params.params) {
      this.params = this.$route.params.params;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
</style>
