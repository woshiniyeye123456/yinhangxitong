<template>
  <div class="default-tool text-right">
    <el-button
      class="btn-icon"
      plain
      type="primary"
      size="mini"
      :disabled="!department_id"
      @click="add">
      新建
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "act-top",
    props: {
      department_id: {
        type: [Number, String],
        default: '',
      }
    },
    data() {
      return {}
    },
    methods: {
      add() {
        this.$emit('add')
      }
    },
  }
</script>

<style scoped>
</style>
