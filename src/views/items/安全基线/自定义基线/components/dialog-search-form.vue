<template>
  <el-form ref="refForm" label-width="92px" class="default-search">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="名称:">
            <el-input
              v-model="searchParams.name"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="编码:">
            <el-input
              v-model="searchParams.code"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="">
          <el-button
            type="primary"
            size="small"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button
            type="default"
            size="small"
            @click="resetSearch"
          >
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import mixins from '../../components/mixins'

  export default {
    name: "searchForm",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    mixins: [
      mixins
    ],
    components: {
    },
    props: {},
    data() {
      return {
        searchParams: {
          name: '',
        },
        attributeVisible: false,
      }
    },
    methods: {

      onChangeTimer(timer) {
        // console.log(timer);
        if (timer.length) {
          this.searchParams.start_time = timer[0] + ' 00:00:00';
          this.searchParams.end_time = timer[1] + ' 23:59:59';
        }
      },
      resetSearch() { // 重置搜索
        this.searchParams = {
          name: '',
        };
        this.onSearch();
      },

      onSearch() {
        this.$emit('on-search', this.searchParams)
      },

      init() {

      }

    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
