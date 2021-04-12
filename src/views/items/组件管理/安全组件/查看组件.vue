<template>
  <div>
    <detail-form
      v-if="isReady"
      @go-back="goback"
      @on-submit="submit"
      @on-update="update"
      :params="params"
      :readonly="readonly"
      :disabled="disabled"
      :clearData="clearData"
      @clear-finish="clearData=false"
    ></detail-form>
  </div>
</template>

<script>
  import detailForm from './components/组件form';

  export default {
    name: "查看基线",
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
        readonly: true,
        disabled: true,
        params: {},
        isReady: false,
        id: 0,
      }
    },
    computed: {},
    methods: {
      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'security_component';
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
        vars.key = 'security_component';
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
        this.getSecurityComponent();
      },

      getSecurityComponent() {
        let vars = {};
        vars.key = 'security_component';
        vars.params = {
          conds: [
            'id = ' + this.id
          ],
          dims: [],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.params = data.data[0];
            this.isReady = true;
          }
        });
      },
    },
    created() {
      if (this.$route.query && this.$route.query.id) {
        this.id = this.$route.query.id;
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
