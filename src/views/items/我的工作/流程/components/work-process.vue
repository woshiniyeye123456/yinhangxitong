<template>
  <div>
    <svg-flow
      v-if="isReady"
      :disabled="true"
      :defaultNodes="defaultNodes"
      :workspace="workspace"
      ref="svg-flow"
    ></svg-flow>
  </div>
</template>

<script>
  import svgFlow from '../../../components/svg-flow'

  export default {
    name: "work-process",
    components: {
      svgFlow,
    },
    props: {
      work_flow: {
        type: Object,
        default() {
          return {}
        }
      },
      workspace: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        isReady: false,
        defaultNodes: [],
      }
    },
    methods: {

      onView(params) {
        console.log(params)
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        console.log(params)
      },
    },
    created() {
      // console.log(this.work_flow);
      // console.log(this.workspace);
      this.isReady = false;
      if (this.work_flow && this.work_flow.define) {
        this.defaultNodes = JSON.parse(this.work_flow.define).nodes;
      }
      this.isReady = true;
    },
    watch: {
      work_flow: {
        handler(val) {
          this.isReady = false;
          if (val.define) {
            this.defaultNodes = JSON.parse(val.define).nodes;
          }
          this.isReady = true;
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>

</style>
