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
      <el-form-item label="账号" prop="name">
        <el-input
          v-model="params.name"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input
          v-model="params.real_name"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="params.password"
          placeholder="密码"
        ></el-input>
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
    components: {},
    props: {
      title: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      hiddenPWD: false,
    },
    computed: {},
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      const validatePWD = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入密码'))
        } else if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else if (value !== this.params.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      };

      return {
        dialogVisible: false,
        rules: {
          phone: [{required: true, trigger: 'blur', validator: validatePhone}],
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
          name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          real_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          password1: [{required: true, trigger: 'blur', validator: validatePWD}],
        },
        departments: [],
        departmentList: [],
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
