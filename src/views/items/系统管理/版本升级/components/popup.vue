<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="82px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="描述:" prop="description">
        <el-input
          v-model="params.description"
          autosize
          type="textarea"
          resize="none"
          placeholder="描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="更新包:">
        <text-upload
          accept=""
          v-if="dialogVisible"
          :modal="false"
          :defaultFileList="versionDefaultFileList"
          @update:successFileList="val => versionFileList = val"
          :maxImg="1"
        ></text-upload>
      </el-form-item>
      <div class="margin-top-20 text-right">
        <el-button
          type="default"
          @click="closeDialog"
          size="small"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit"
          size="small"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import textUpload from '../../../components/text-upload'

  export default {
    name: "popup",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      textUpload
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {},
    data() {
      return {
        versionFileList: [],
        versionDefaultFileList: [],
        dialogVisible: false,
        rules: {
          description: [{required: true, message: '请输入描述', trigger: 'blur'}],
        },
      }
    },
    methods: {

      closeDialog() {
        this.$emit("update:visible", false);
      },
      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            // console.log(params);
            if (this.versionFileList && this.versionFileList.length) {
              params.path = this.versionFileList[0].path
            }
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
            this.$refs.refForm.resetFields();
            this.closeDialog();
          } else {
            return this.$message.error('操作失败');
          }
        });
      },


      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.versionDefaultFileList = [];
          this.versionFileList = [];
        }
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      visible: {
        handler() {
          this.init();
        },
      },
      dialogVisible: {
        handler(val) {
          this.$emit('update:visible', val)
        },
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
