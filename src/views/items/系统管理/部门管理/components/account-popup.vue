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
      <el-form-item label="部门" prop="department">
        <el-select
          v-model="params.department_id"
          placeholder="请选择:部门"
          style="width: 100%"
          disabled
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in departmentList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="account">
        <el-select
          v-model="params.account_id"
          placeholder="请选择:用户"
          style="width: 100%"
          :disabled="disabled"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in accountList"
            :label="item.real_name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效时间:">
        <el-date-picker
          v-model="params.deadline"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd 23:59:59">
        </el-date-picker>
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
      }
    },
    computed: {
      pickerOptions() {
        return {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        }
      },
    },
    data() {
      return {
        dialogVisible: false,
        rules: {
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        },
        statusList: ['正式', '临时'],
        accountList: [],
        departmentList: [],
      }
    },
    methods: {

      closeDialog() {
        this.$emit("update:visible", false);
        this.accounts = [];
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            // console.log(params);
            if (params.status === '正式') {
              params.deadline = ''
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

      getDepartment() {
        let vars = {};
        vars.key = 'department';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.departmentList = data.data || [];
          }
        });
      },

      getAccount() {
        let vars = {};
        vars.key = 'account';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.accountList = data.data || [];
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getAccount();
          this.getDepartment();
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
