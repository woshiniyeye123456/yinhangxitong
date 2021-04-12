<template>
  <div>
    <detail-form
      v-if="isReady"
      :params="params"
      :readonly="true"
    ></detail-form>
  </div>
</template>

<script>
  import detailForm from './components/基线视图view';

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
        disabled: true,
        params: {},
        isReady: false,
        id: 0,
      }
    },
    computed: {},
    methods: {

      getData() {
        let vars = {};
        vars.key = 'baseline_view';
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
      this.getData();
    }
  }
</script>

<style scoped>

</style>
