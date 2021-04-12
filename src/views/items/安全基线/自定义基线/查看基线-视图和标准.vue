<template>
  <div class="full-page">
    <detail-view
      v-if="isReady"
      :params="params"
      @derived="derived"
      @goBack="goBack"
    ></detail-view>
  </div>
</template>

<script>
  import detailView from './components/基线view';

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
      detailView,
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

      goBack() {
        this.$router.go(-1);
        // this.$router.push({
        //   name: 'customizeBaseline',
        //   params: {
        //     pages: this.$route.params.pages,
        //     lines: this.$route.params.lines,
        //   },
        // })
      },

      derived() {
        this.$router.push({
          name: 'derivedBaseline',
          params: {
            params: this.params,
          }
        })
      },

      getData() {
        let vars = {};
        vars.key = 'baseline';
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
  .full-page {
    height: calc(100% - 46px);
    overflow-y: auto;
  }
</style>
