<template>
  <detail-form
    @go-back="goback"
    :readonly="true"
    :params="params"
    :clearData="clearData"
    @clear-finish="clearData=false"
  ></detail-form>
</template>

<script>
  import detailForm from './components/外部form';

  export default {
    name: "接入系统",
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
          status: '已禁用',
        },
      }
    },
    computed: {},
    methods: {
      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'external_system';
        vars.params = params;
        this.$api.save(vars, this, data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: 'success',
            message: '新增成功'
          });
          this.goback(true);
        }, () => {
          loading.close();
        });
      },
      update(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'external_system';
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
