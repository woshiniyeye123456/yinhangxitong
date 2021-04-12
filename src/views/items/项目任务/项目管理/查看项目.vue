<template>
  <div>
    <detail-view :disabled="true" v-if="isReady" :params="params"></detail-view>
  </div>
</template>

<script>
import detailView from "./components/项目view";

export default {
  name: "chakanxiangmu",
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
      vars.key = "projectData";
      vars.id = this.id;
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data) {
          this.params = data.data.data;
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
