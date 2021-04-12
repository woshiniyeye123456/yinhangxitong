<template>
  <div class="default-tool">
    <el-button type="primary" size="small" @click="add" icon="el-icon-circle-plus-outline">
      新建账号
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "act-top",
    data() {
      return {}
    },
    methods: {
      add() {
        this.$emit('add')
      }
    }
  }
</script>

<style scoped>
</style>
