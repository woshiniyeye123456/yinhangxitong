<template>
  <div class="default-tool">
    <el-button type="primary" size="small" @click="add" icon="el-icon-circle-plus-outline">
      新建
    </el-button>
    <div class="float-right">
      <el-button type="primary" size="small" @click="projectReport">
        项目报表
      </el-button>
    </div>
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
      },
      projectReport() {
        this.$emit('project-report')
      },
    }
  }
</script>

<style scoped>
</style>
