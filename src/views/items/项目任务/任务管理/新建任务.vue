<template>
  <detail-form
    @go-back="goback"
    @on-submit="submit"
    @on-update="update"
    :params="params"
    :clearData="clearData"
    @clear-finish="clearData=false"
  ></detail-form>
</template>

<script>
  import detailForm from './components/任务form';

  export default {
    name: "新建任务",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      detailForm,
    },
    data() {
      return {
        clearData: false,
        params: {
          creator_id: this.user.id,
          created_time: this.$common.getThisTime(),
          technicalRiskIdentification: [],
          notTechnicalRiskIdentification: [],
        },
      }
    },
    computed: {},
    methods: {

      submit(params) {
        // console.log(params);
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {
          workflow_id: params.workflow_id,
          data: params,
          user: this.user.name,
        };
        vars.key = 'start';
        this.$api.wf(vars, this, data => {
          // console.log(data);
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
        vars.key = 'task';
        vars.params = params;
        this.$api.update(vars, this, data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: 'success',
            message: '更新成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },
      goback(v) {
        if (v) {
          this.params = {};
        }
        this.clearData = true;
        this.$router.go(-1);
      },
      init() {

      }
    },
    created() {
      if (this.$route.params && this.$route.params.params) {
        this.params = this.$route.params.params;
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
