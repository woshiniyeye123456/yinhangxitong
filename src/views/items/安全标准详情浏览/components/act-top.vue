<template>
  <div class="default-tool">
    <el-form ref="refForm" label-width="80px">
      <el-form-item label="安全类型:">
        <el-select
          v-model="params.category_id"
          placeholder="请选择:安全类型"
          style="width: 320px"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in softwarePlatList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="exportData" icon="el-icon-circle-plus-outline">
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "act-top",
    components: {
    },
    data() {
      return {
        params: {
          category_id: '',
        },
        softwarePlatList: [],
      }
    },
    methods: {
      exportData() {
        this.$emit('export-data')
      },
    }
  }
</script>

<style scoped>

</style>
