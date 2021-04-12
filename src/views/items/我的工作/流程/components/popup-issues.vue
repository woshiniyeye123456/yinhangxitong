<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="95px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="问题描述" prop="problem_description">
        <el-input type="text" v-model="params.problem_description"
                  placeholder="问题描述"></el-input>
      </el-form-item>
      <el-form-item label="附件:">
        <text-upload
          :modal="false"
          :defaultFileList="fileDefaultFileList"
          @update:successFileList="val => fileFileList = val"
          :maxImg="20"
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
      textUpload,
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
        dialogVisible: false,
        rules: {
          problem_description: [{required: true, message: '请输入问题描述', trigger: 'blur'}],
        },
        // 附件
        fileDefaultFileList: [],
        fileFileList: [],
      }
    },
    methods: {

      closeDialog() {
        this.$refs.refForm.resetFields();
        this.fileFileList = [];
        this.fileDefaultFileList = [];
        this.$emit("update:visible", false);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            // console.log(params);
            params.file = this.$common.deepClone(this.fileFileList);
            this.$emit('on-submit', params);
            this.closeDialog();
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.params.file && this.params.file.length) {
          this.fileDefaultFileList = this.$common.deepClone(this.params.file);
          this.fileFileList = this.$common.deepClone(this.params.file);
        } else {
          this.fileDefaultFileList = [];
          this.fileFileList = [];
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
