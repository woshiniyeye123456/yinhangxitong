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
  import detailForm from './components/基线form';

  export default {
    name: "派生基线",
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
          source: 2,
          status: '开发中',
        },
      }
    },
    computed: {},
    methods: {
      submit(params) {
        if (params.id) {
          delete params.id
        }
        if (params.group_id) {
          delete params.group_id
        }
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'baseline';
        vars.params = params;
        this.$api.save(vars, this, data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: 'success',
            message: '派生成功'
          });
          this.goback(true);
        }, () => {
          loading.close();
        });
      },
      update(params) {
        if (params.id) {
          delete params.id
        }
        if (params.group_id) {
          delete params.group_id
        }
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'baseline';
        vars.params = params;
        this.$api.update(vars, this, data => {
          // console.log(data);
          loading.close();
          this.$message({
            type: 'success',
            message: '派生成功'
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
        // this.$router.go(-1);
        this.$router.push({
          name: 'customizeBaseline',
          params: {
            pages: this.$route.params.pages,
            lines: this.$route.params.lines,
          },
        })
      },
      init() {

      }
    },
    created() {
      if (this.$route.params && this.$route.params.params) {
        this.params = this.$route.params.params;
        this.params.status = '开发中';
        this.params.creator_id = this.user.id;
        this.params.source = 2;
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
