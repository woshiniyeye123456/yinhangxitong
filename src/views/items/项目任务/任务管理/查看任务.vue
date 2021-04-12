<template>
  <detail-form
    @go-back="goback"
    @on-submit="getBaseline"
    @on-update="update"
    :params="params"
    :disabled="true"
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
        },
      }
    },
    computed: {},
    methods: {

      getBaseline(params) {
        // console.log(params);
        let vars = {};
        vars.key = 'baseline';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        if (params.baselines) {
          if (params.baselines.length === 1) {
            vars.params.conds.push('id = ' + params.baselines[0])
          } else {
            vars.params.conds.push('id IN [' + params.baselines.join(',') + ']')
          }
        }
        this.$api.get(vars, this, data => {
          // console.log(data);
          params.baselines = data.data;
          this.submit(params);
        });
      },

      submit(params) {
        // console.log(params);
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {
          software_platform_id: params.software_platform_id,
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
      // console.log(this.params);
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
