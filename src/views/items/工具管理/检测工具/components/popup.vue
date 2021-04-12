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
      <el-form-item label="名称" prop="name">
        <el-input type="text" v-model="params.name"
                  placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input type="text" v-model="params.code"
                  placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="rule">
        <el-input
          v-model="params.rule"
          autosize
          type="textarea"
          resize="none"
          placeholder="描述"
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
      params: {
        type: Object,
        default() {
          return {}
        }
      }
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
      return {
        dialogVisible: false,
        rules: {
          phone: [{required: true, trigger: 'blur', validator: validatePhone}],
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
          name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          real_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          pwd: [{required: true, trigger: 'blur', validator: validatePass}],
        },
        codeText: '获取验证码',
        countDownNumber: 0,
        disabledGetCode: false,
        countDownTimer: null,
      }
    },
    methods: {

      countDown() {
        this.countDownNumber = 60;
        this.disabledGetCode = true;
        clearInterval(this.countDownTimer);
        this.countDownTimer = setInterval(() => {
          if (this.countDownNumber > 0) {
            this.codeText = this.countDownNumber-- + '秒';
          } else {
            this.codeText = '重新获取';
            this.disabledGetCode = false;
          }
        }, 1000)
      },

      closeDialog() {
        this.$emit("update:visible", false)
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
