<template>
  <div class="default-tool">
    <el-button type="primary" size="small" @click="add" icon="el-icon-circle-plus-outline">
      新建
    </el-button>
    <!--<el-button-->
      <!--v-if="!hiddenPort"-->
      <!--type="primary" size="small" @click="visible = true" icon="el-icon-circle-plus-outline">-->
      <!--导入-->
    <!--</el-button>-->
    <!-- popup -->
    <popup
      title="基线导入"
      :params="params"
      :visible.sync="visible"
      @on-submit="submit"
    ></popup>
  </div>
</template>

<script>
  import popup from './importPopup'

  export default {
    name: "act-top",
    props: {
      hiddenPort: false,
    },
    components: {
      popup,
    },
    data() {
      return {
        visible: false,
        params: {},
      }
    },
    methods: {
      add() {
        this.$emit('add')
      },

      submit(params) {
        // console.log(params)
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        // vars.key = 'importBaseline';
        vars.key = 'dataUpgrade';
        vars.path = params.path;
        this.$api.ext(vars, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },

      goback() {
        this.$emit('go-back')
      },
    }
  }
</script>

<style scoped>

</style>
