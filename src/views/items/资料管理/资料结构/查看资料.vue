<template>
  <div>
    <detail-view v-if="isReady" :params="params"></detail-view>
  </div>
</template>

<script>
import detailView from "./components/资料view";

export default {
  name: "查看资料",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    detailView
  },
  data() {
    return {
      clearData: false,
      disabled: true,
      params: {},
      isReady: false,
      id: 0
    };
  },
  computed: {},
  methods: {
    getData() {
      let vars = {};
      vars.key = "data_library";
      vars.params = {
        conds: ["id = " + this.id],
        dims: []
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.params = data.data[0];
          this.isReady = true;
        }
      });
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>
