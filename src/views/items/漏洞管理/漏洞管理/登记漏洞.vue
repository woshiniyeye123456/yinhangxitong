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
  import detailForm from './components/漏洞form';

  export default {
    name: "登记漏洞",
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
          status: '开发中',
          source: 2,
          customer: [
            {
              customer_id: this.user.id,
              source: 2,
            }
          ]
        },
      }
    },
    computed: {},
    methods: {
      submit(params) {
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'loophole';
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
        let loading = this.$loading({background: 'transparent'});
        let vars = {};
        vars.key = 'loophole';
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
        this.params.customer = [
          {
            customer_id: this.user.id,
            source: 2,
          }
        ]
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
